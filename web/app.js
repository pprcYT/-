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
var express = require('express');
var vHost = require('vhost');
var gameServer = express();
var gitServer = express();
var redirectServer = express();
var app = express();

var Exession = require("express-session");
var Redission = require("connect-redis")(Exession);
var Redis = require("redis");
var GLOBAL = require("../sub/global.json");
var REDIS_SESSION = Exession({
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
require("./game")(gameServer, REDIS_SESSION, GLOBAL);
require("./git")(gitServer, REDIS_SESSION, GLOBAL);
require("./redirect")(redirectServer, REDIS_SESSION, GLOBAL);

app.use(vHost('kkutu.xyz', gameServer));
app.use(vHost('git.kkutu.xyz', gitServer));
app.use(vHost('www.kkutu.xyz', redirectServer));

app.get('*', function(req, res) {
	res.send('<h1>403 Forbidden</h1>');
});

app.listen(GLOBAL.WEB_PORT);