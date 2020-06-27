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

let express = require('express');
let vHost = require('vhost');

let gameServer = express();
let gitServer = express();
let redirectServer = express();

let app = express();

let Exession = require("express-session");
let Redission = require("connect-redis")(Exession);
let Redis = require("redis");

const GLOBAL = require("../sub/global.json");
const { Connection } = require('pg');

var filter = new Array();
var ban = new Array();
try { var pBan = fs.readFileSync("./blacklist-ip.txt").split("\n") } catch(e) { var pBan = new Array(); }

const REDIS_SESSION = Exession({
	store: new Redission({
		client: Redis.createClient(),
		ttl: 3600 * 12
	}),
	secret: 'kkutu',
	resave: false,
	saveUninitialized: true,
	cookie: {
		path: '/',
		domain: '.kkutu.xyz',
		maxAge: 1000 * 60 * 60 * 24
	}
});

require("./game")(gameServer, REDIS_SESSION, GLOBAL, JLog);
require("./git")(gitServer, REDIS_SESSION, GLOBAL, JLog);
require("./redirect")(redirectServer, REDIS_SESSION, GLOBAL, JLog);

app.use(vHost('kkutu.xyz', gameServer));
app.use(vHost('git.kkutu.xyz', gitServer));
app.use(vHost('www.kkutu.xyz', redirectServer));

app.get('*', function(req, res) {
	res.send('<h1>403 Forbidden</h1>');
});

const ports = [
    2000, 2010, 2020, 2030, 2040, 2050, 2060,
    2410, 2411, 2412, 2413, 2414, 2415, 2416, 2417, 2418, 2419,
    2420, 2421, 2422, 2423, 2424, 2425, 2426, 2427, 2428, 2429,
    2430, 2431, 2432, 2433, 2434, 2435, 2436, 2437, 2438, 2439,
    2440, 2441, 2442, 2443, 2444, 2445, 2446, 2447, 2448, 2449,
    2450, 2451, 2452, 2453, 2454, 2455, 2456, 2457, 2458, 2459,
    2460, 2461, 2462, 2463, 2464, 2465, 2466, 2467, 2468, 2469,
    2470, 2471, 2472, 2473, 2474, 2475, 2476, 2477, 2478, 2479
];

const { RateLimiterMemory } = require('rate-limiter-flexible');
const rateLimiterKR = new RateLimiterMemory({ points: 6, duration: 3, blockDuration: 5 });
const rateLimiterGlobal = new RateLimiterMemory({ points: 2, duration: 3, blockDuration: 5 });
const rateLimiterBlocked = new RateLimiterMemory({ points: 4, duration: 6, blockDuration: 3600 });

server.on('request', app);
server.on('upgrade', (req, socket, head) => {
	var remoteIp = req.headers['x-hw-forwarded-for'] === undefined ? 'client' : req.headers['x-hw-forwarded-for'];
  var pathname = url.parse(req.url).pathname;
  if(!remoteIp || !pathname) {
    JLog.warn(`[WS] Invalid Response Received`);
    socket.destroy();
  } else if(pBan.includes(remoteIp)) {
    JLog.warn(`[WS] IP ${remoteIp} is banned. Blocking response.`);
    socket.destroy();
  } else if(ban.includes(remoteIp)) {
    rateLimiterBlocked.consume(remoteIp, 1)
      .then((rateLimiterRes) => {
        JLog.warn(`[WS] IP ${remoteIp} is temp-banned. Blocking response.`);
        socket.destroy();
      }).catch((rateLimiterRes) => {
        pBan.push(remoteIp);
        JLog.warn(`[WS] IP ${remoteIp} is banned. Blocking response.`);
        socket.destroy();
      });
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

JLog.success(`App server is ready.`);
server.listen(GLOBAL.WEB_PORT);

const cron = require('node-cron');
cron.schedule('*/30 * * * *', () => {
  filter = [];
  ban = [];
  JLog.info(`[WS] Cleared all Filter/Ban`);
  fs.writeFileSync('./blacklist-ip.txt', pBan.join('\n'), "utf8");
});