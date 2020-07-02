/**
 * Rule the words! KKuTu Online
 * Copyright (C) 2017 JJoriping(op@jjo.kr)
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
const JLog = require("../sub/jjlog");
const fs = require('fs');

const server = require('http').createServer();
const url = require('url');
const proxy = require('http2-proxy');

var geoip = require('geoip-country');
const defaultWSHandler = (err, req, socket, head) => {
    if (err) {
      JLog.info('Client disconnected: ', err);
      socket.destroy();
    }
}

const GLOBAL = require("../sub/global.json");

var filter = new Array();
var ban = new Array();

const ports = [
    // Your port here
];

const { RateLimiterMemory } = require('rate-limiter-flexible');
const rateLimiterKR = new RateLimiterMemory({ points: 6, duration: 3, blockDuration: 5 });
const rateLimiterGlobal = new RateLimiterMemory({ points: 2, duration: 3, blockDuration: 5 });

JLog.info("<< KKuTuDotNet Handler >>");

server.on('upgrade', (req, socket, head) => {
	var remoteIp = req.headers['x-hw-forwarded-for'] === undefined ? 'client' : req.headers['x-hw-forwarded-for'];
  var pathname = url.parse(req.url).pathname;
  if(!remoteIp || !pathname) {
    JLog.warn(`[WS] Invalid Response Received`);
    socket.destroy();
  } else if(remoteIp == 'client') {
    passWS(req, socket, head, pathname, remoteIp);
  } else if(ban.includes(remoteIp)) {
    JLog.warn(`[WS] IP ${remoteIp} is temp-banned. Blocking response.`);
    socket.destroy();
  } else if(!geoip.lookup(remoteIp) || geoip.lookup(remoteIp) != 'KR') {
    rateLimiterGlobal.consume(remoteIp, 1)
      .then((rateLimiterRes) => {
        passWS(req, socket, head, pathname, remoteIp);
      })
      .catch((rateLimiterRes) => {
        blocked(remoteIp, socket);
      });
  } else {
    rateLimiterKR.consume(remoteIp, 1)
      .then((rateLimiterRes) => {
        passWS(req, socket, head, pathname, remoteIp);
      })
      .catch((rateLimiterRes) => {
        blocked(remoteIp, socket);
      });
  }
});

function blocked(remoteIp, socket) {
  var count = filter.filter(x => x == remoteIp).length;
  if(count > 9) {
    ban.push(remoteIp);
    JLog.success(`[WS] IP ${remoteIp} is blocked temporarily`);
    socket.destroy();
  } else {
    filter.push(remoteIp);
    JLog.warn(`[WS] DoS from IP ${remoteIp}`);
    socket.destroy();
  }
}

function passWS(req, socket, head, pathname, remoteIp) {
  const remotePort = pathname.substring(2,6);
  if (ports.includes(parseInt(remotePort)) && req.method == 'GET') {	  
    JLog.log(`[WS] [${remoteIp}]: ${remotePort} ${pathname} GET`);
    proxy.ws(req, socket, head, {
      hostname: '127.0.0.1',
      port: remotePort,
      path: pathname.substring(6,),
      proxyTimeout: 8000,
      onReq: (req, { headers }) => {
        headers['x-forwarded-for'] = remoteIp
      }
    }, defaultWSHandler);
  } else {
    JLog.warn(`[WS] [${remoteIp}]: ${remotePort} ${pathname} GET: Invalid Response Received`);
    socket.destroy();
  }
}

JLog.success(`Handler server is ready.`);
server.listen(GLOBAL.HANDLER_PORT);

const cron = require('node-cron');
cron.schedule('*/30 * * * *', () => {
  filter = [];
  ban = [];
  JLog.info(`[WS] Cleared all Filter/Ban`);
});