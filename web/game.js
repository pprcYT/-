/**
 * Rule the words! KKuTu Online
 * Copyright (C) 2017 JJoriping(op@jjo.kr)
 * Copyright (C) 2017-2020 AlphaKKuTu(admin@kkutu.xyz)
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

module.exports = function(gameServer, REDIS_SESSION, GLOBAL) {
	var WS = require("ws");
	var Express = require("express");
	var expressStaticGzip = require("express-static-gzip");
	var Exession = require("express-session");
	var gameServer = Express();
	var DB = require("./database");
	var JLog = require("../sub/jjlog");
	var WebInit = require("../sub/webinit");
	var passport = require('passport');
	var Const = require("../const");
	var fs = require('fs');

	var Language = {
		'ko_KR': require("./lang/ko_KR.json"),
		'en_US': require("./lang/en_US.json")
	};
	var ROUTES = [
		"major", "consume", "admin", "login"
	];
	var page = WebInit.page;
	var gameServers = [];

	WebInit.MOBILE_AVAILABLE = [
		"portal", "main", "kkutu", "login"
	];

	require("../sub/checkpub");

	JLog.info("<< AlphaKKuTu Web >>");
	gameServer.set('views', __dirname + "/game/views");
	gameServer.set('view engine', "pug");
	gameServer.use(Express.static(__dirname + "/game/public"));
	gameServer.use(Express.urlencoded({ extended: true }));
	gameServer.use(REDIS_SESSION);
	gameServer.use(passport.initialize());
	gameServer.use(passport.session());
	gameServer.use((req, res, next) => {
		if (req.session.passport) {
			delete req.session.passport;
		}
		next();
	});
	gameServer.disable('x-powered-by');
	
	WebInit.init(gameServer, true);
	DB.ready = function() {
		setInterval(function() {
			var q = ['createdAt', {
				$lte: Date.now() - 3600000 * 12
			}];

			DB.session.remove(q).on();
		}, 600000);
		setInterval(function() {
			gameServers.forEach(function(v) {
				if (v.socket) v.socket.send(`{"type":"seek"}`);
				else v.seek = undefined;
			});
		}, 4000);
		JLog.success("DB is ready.");

		DB.kkutu_shop_desc.find().on(function($docs) {
			var i, j;

			for (i in Language) flush(i);

			function flush(lang) {
				var db;

				Language[lang].SHOP = db = {};
				for (j in $docs) {
					db[$docs[j]._id] = [$docs[j][`name_${lang}`], $docs[j][`desc_${lang}`]];
				}
			}
		});
	};
	Const.MAIN_PORTS.forEach(function(v, i) {
		var KEY = process.env['WS_KEY'];
		gameServers[i] = new GameClient(KEY, `ws://127.0.0.2:${v}/${KEY}`);
	});

	function GameClient(id, url) {
		var my = this;

		my.id = id;
		my.socket = new WS(url, {
			perMessageDeflate: false,
			rejectUnauthorized: false
		});

		my.send = function(type, data) {
			if (!data) data = {};
			data.type = type;

			my.socket.send(JSON.stringify(data));
		};
		my.socket.on('open', function() {
			JLog.info(`Game server #${my.id} connected`);
		});
		my.socket.on('error', function(err) {
			JLog.warn(`Game server #${my.id} has an error: ${err.toString()}`);
		});
		my.socket.on('close', function(code) {
			JLog.error(`Game server #${my.id} closed: ${code}`);
			my.socket.removeAllListeners();
			delete my.socket;
		});
		my.socket.on('message', function(data) {
			var _data = data;
			var i;

			data = JSON.parse(data);

			switch (data.type) {
				case "seek":
					my.seek = data.value;
					break;
				case "narrate-friend":
					for (i in data.list) {
						gameServers[i].send('narrate-friend', {
							id: data.id,
							s: data.s,
							stat: data.stat,
							list: data.list[i]
						});
					}
					break;
				default:
			}
		});
	}
	ROUTES.forEach(function(v) {
		require(`./game/routes/${v}`).run(gameServer, WebInit.page);
	});
	gameServer.get("/", function(req, res) {
		var server = req.query.server;
		DB.session.findOne(['_id', req.session.id]).on(function($ses) {
			// var sid = (($ses || {}).profile || {}).sid || "NULL";
			if (global.isPublic) {
				onFinish($ses);
				// DB.jjo_session.findOne([ '_id', sid ]).limit([ 'profile', true ]).on(onFinish);
			} else {
				if ($ses) $ses.profile.sid = $ses._id;
				onFinish($ses);
			}
		});

		function onFinish($doc) {
			var id = req.session.id;

			if ($doc) {
				req.session.profile = $doc.profile;
				id = $doc.profile.sid;
			} else {
				delete req.session.profile;
			}
			page(req, res, Const.MAIN_PORTS[server] ? "kkutu" : "portal", {
				'_page': "kkutu",
				'_id': id,
				'PORT': Const.MAIN_PORTS[server],
				'HOST': req.hostname,
				'PROTOCOL': 'ws',
				'TEST': req.query.test,
				'MOREMI_PART': Const.MOREMI_PART,
				'AVAIL_EQUIP': Const.AVAIL_EQUIP,
				'CATEGORIES': Const.CATEGORIES,
				'GROUPS': Const.GROUPS,
				'MODE': Const.GAME_TYPE,
				'RULE': Const.RULE,
				'OPTIONS': Const.OPTIONS,
				'KO_INJEONG': Const.KO_INJEONG,
				'EN_INJEONG': Const.EN_INJEONG,
				'KO_THEME': Const.KO_THEME,
				'EN_THEME': Const.EN_THEME,
				'IJP_EXCEPT': Const.IJP_EXCEPT,
				'ogImage': "https://cdn.kkutu.xyz/img/kkutu/logo.png",
				'ogURL': "https://kkutu.xyz/",
				'ogTitle': "끄투닷넷",
				'ogDescription': "내 작은 글자 놀이터, 끄투닷넷! / 끄투 온라인, 끝말잇기, 쿵쿵따, 초성퀴즈, 자음퀴즈, 타자대결, 단어대결, 십자말풀이, 그림퀴즈"
			});
		}
	});

	gameServer.get("/servers", function(req, res) {
		var list = [];

		gameServers.forEach(function(v, i) {
			list[i] = v.seek;
		});
		res.send({
			list: list,
			max: Const.KKUTU_MAX
		});
	});

	gameServer.get("/policy/:page", function(req, res) {
		page(req, res, "policy/" + req.params.page);
	});

	gameServer.get("/kkutu/:page", function(req, res) {
		page(req, res, "kkutu/" + req.params.page);
	});

	gameServer.get("/browserunsupport", function(req, res) {
		page(req, res, "browserunsupport");
	});
	
	gameServer.get("*", function(req, res) {
		page(req, res, "404");
	});
	
	gameServer.use("/", expressStaticGzip('./cache'));
	
	gameServer.listen(GLOBAL.WEB_PORT);
}