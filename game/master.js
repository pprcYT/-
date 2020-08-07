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

var Cluster = require("cluster");
var File = require('fs');
var WebSocket = require('ws');
var https = require('https');
var HTTPS_Server;
// var Heapdump = require("heapdump");
var KKuTu = require('./kkutu');
var GLOBAL = require("../sub/global.json");
var Const = require("../const");
var JLog = require('../sub/jjlog');
var Recaptcha = require('../sub/recaptcha');

var MainDB;

var Server;
var DIC = {};
var DNAME = {};
var ROOM = {};

var T_ROOM = {};
var T_USER = {};

var SID;
var WDIC = {};
var isLobby = true;

const DEVELOP = exports.DEVELOP = global.test || false;
const GUEST_PERMISSION = exports.GUEST_PERMISSION = {
	'create': true,
	'enter': true,
	'talk': true,
	'practice': true,
	'ready': true,
	'start': true,
	'invite': true,
	'inviteRes': true,
	'kick': true,
	'kickVote': true,
	'wp': true,
	'report': false
};

const ENABLE_ROUND_TIME = [];
for(var r=1; r<=300; r++) { ENABLE_ROUND_TIME.push(r) }
exports.ENABLE_ROUND_TIME = ENABLE_ROUND_TIME;

const ENABLE_FORM = exports.ENABLE_FORM = [ "S", "J" ];
const MODE_LENGTH = exports.MODE_LENGTH = Const.GAME_TYPE.length;
const PORT = process.env['KKUTU_PORT'];

const webHook = require('discord-webhook-node');
const hook = new webHook.Webhook(GLOBAL['SANCTION_WEBHOOK']);
const reason = [
	"[#900] 게임 내 명칭 정책 위반",
	"[#901] 다른 회원에게 불쾌감과 모욕감을 주는 행위",
	"[#902] 게임 이용 방해",
	"[#903] 운영자 사칭 및 업무 방해",
	"[#904] 현금거래 및 홍보",
	"[#905] 친목 행위",
	"[#906] 사기 및 사칭",
	"[#907] 시스템(버그) 악용",
	"[#908] 어뷰징",
	"[#909] 허위 신고",
	"[#910] 불법 프로그램 사용",
	"[#911] 계정 도용/해킹/개인정보 유출",
	"[#912] 기타 운영정책 위반 행위"
];


process.on('uncaughtException', function(err){
	var text = `:${PORT} [${new Date().toLocaleString()}] ERROR: ${err.toString()}\n${err.stack}\n`;
	
	File.appendFile("/jjolol/KKUTU_ERROR.log", text, function(res){
		JLog.error(`ERROR OCCURRED ON THE MASTER!`);
		console.log(text);
	});
});
function processAdmin(id, value){
	var cmd, temp, i, j;
	
	value = value.replace(/^(#\w+\s+)?(.+)/, function(v, p1, p2){
		if(p1) cmd = p1.slice(1).trim();
		return p2;
	});
	switch(cmd){
		case "delroom":
			if (temp = ROOM[value]) {
				for(var i in ROOM[value].players){
					var $c = DIC[ROOM[value].players[i]];
					if($c) {
						$c.send('notice', {value: "관리자에 의하여 접속 중이시던 방이 해체되었습니다."});
						$c.send('roomStuck');
					}
				}
				delete ROOM[value];
			}
			return null;
		case "roomtitle":
			var q = value.trim().split(",");
			if (temp = ROOM[q[0]]) {
				temp.title = q[1];
				KKuTu.publish('room', { target: id, room:temp.getData(), modify: true }, temp.password);
			}
			return null;
		/*
		case "nick":
			MainDB.users.update([ '_id', value ]).set([ 'nick', '바른닉네임' + value.replace(/[^0-9]/g, "").substring(0,4) ]).on();
			MainDB.users.update([ '_id', value ]).set([ 'exordial', '바른닉네임' + value.replace(/[^0-9]/g, "").substring(0,4) ]).on();
			if(temp = DIC[value]){
				temp.socket.send('{"type":"error","code":410}');
				temp.socket.close();
			}
			return null;
		case "mute":
			MainDB.users.update([ '_id', value ]).set([ 'black', 'chat' ]).on();
			JLog.info(`[MUTE] #${value} muted`);
			if(temp = DIC[target]){
				temp.socket.send('{"type":"error","code":410}');
				temp.socket.close();
			}
			return null;
		case "tempmute":
			var target = value.split(",")[0];
			var date = Date.now() + parseInt(value.split(",")[1]) * 24 * 60 * 60 * 1000;

			if(!target) return null;
			else if(!date) return null;

			MainDB.users.update([ '_id', target ]).set([ 'black', 'chat' ]).on();
			MainDB.users.update([ '_id', target ]).set([ 'time', date ]).on();
			JLog.info(`[TEMPMUTE] #${value} temp muted (Duration: ${value.split(","[1])} days)`);
			if(temp = DIC[target]){
				temp.socket.send('{"type":"error","code":410}');
				temp.socket.close();
			}
			return null;
		*/
		case "sanction":
			try {
				const obj = value.split(" ");
				const code = parseInt(obj[1]);
				const blackReason = reason[code];

				MainDB.users.findOne([ '_id', obj[0] ]).on(function($user){
					const oldNick = $user.nick;

					let warn = $user.warnings;
					let blackDate = null;
					let blackNum = null;

					if(!warn) warn = {0:0,1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0};
					
					switch(code){
						case 0:
							const nick = '바른닉네임' + obj[0].replace(/[^0-9]/g, "").substring(0,4);
							
							MainDB.users.update([ '_id', obj[0] ]).set([ 'nick', nick ]).on();
							MainDB.users.update([ '_id', obj[0] ]).set([ 'exordial', nick ]).on();

							if(warn['0']) MainDB.users.update([ '_id', obj[0] ]).set([ 'nonickchange', true ]).on();
							warn['0'] += 1;

							blackNum = warn['0'];
							break;
						case 1:
							console.log(warn['1']);
							if(!warn['1']) {
								// 7일
								blackDate = addDate(7);
							} else {
								switch(warn['1']) {
									case 1:
										// 14일
										blackDate = addDate(14);
										break;
									case 2:
										// 30일
										blackDate = addDate(30);
										break;
									case 3:
									default:
										// 90일
										blackDate = addDate(90);
								}
							}
							warn['1'] += 1;

							blackNum = warn['1'];
							break;
						case 2:
							if(!warn['2']) {
								// 1일
								blackDate = addDate(1);
							} else {
								switch(warn['2']) {
									case 1:
										// 3일
										blackDate = addDate(3);
										break;
									case 2:
										// 7일
										blackDate = addDate(7);
										break;
									case 3:
									default:
										// 14일
										blackDate = addDate(14);
								}
							}
							warn['2'] += 1;

							blackNum = warn['2'];
							break;
						case 3:
							blackDate = addDate(365 * 40); // 40년 후
							warn['3'] += 1;

							blackNum = warn['3'];
							break;
						case 4:
							blackDate = addDate(365 * 40); // 40년 후
							warn['4'] += 1;

							blackNum = warn['4'];
							break;
						case 5:
							if(!warn['5']) {
								// 7일
								blackDate = addDate(7);
							} else {
								switch(warn['5']) {
									case 1:
										// 14일
										blackDate = addDate(14);
										break;
									case 2:
										// 30일
										blackDate = addDate(30);
										break;
									case 3:
									default:
										blackDate = addDate(365 * 40); // 40년 후
								}
							}
							warn['5'] += 1;

							blackNum = warn['5'];
							break;
						case 6:
							if(!warn['6']) {
								// 30일
								blackDate = addDate(30);
							} else {
								switch(warn['6']) {
									case 1:
										// 90일
										blackDate = addDate(90);
										break;
									case 2:
									default:
										blackDate = addDate(365 * 40); // 40년 후
								}
							}
							warn['6'] += 1;

							blackNum = warn['6'];
							break;
						case 7:
							blackDate = addDate(365 * 40); // 40년 후
							warn['7'] += 1;

							blackNum = warn['7'];
							break;
						case 8:
							let money = $user.money;
							let kkt = $user.kkutu;

							if(!warn['8']) {
								// 재화 10% 차감, 7일
								money = Math.floor(money * 0.9);
								kkt.score = Math.floor(kkt.score * 0.9);
								blackDate = addDate(7);
							} else {
								switch(warn['8']) {
									case 1:
										// 재화 25% 차감, 14일
										money = Math.floor(money * 0.75);
										kkt.score = Math.floor(kkt.score * 0.75);
										blackDate = addDate(14);
										break;
									case 2:
										// 재화 50% 차감, 30일
										money = Math.floor(money * 0.5);
										kkt.score = Math.floor(kkt.score * 0.5);
										blackDate = addDate(30);
										break;
									case 3:
									default:
										// 재화 75% 차감, 90일
										money = Math.floor(money * 0.25);
										kkt.score = Math.floor(kkt.score * 0.25);
										blackDate = addDate(90);
								}
							}
							MainDB.users.update([ '_id', obj[0] ]).set([ 'money', money ]).on();
							MainDB.users.update([ '_id', obj[0] ]).set([ 'kkutu', JSON.stringify(kkt) ]).on();
							warn['8'] += 1;

							blackNum = warn['8'];
							break;
						case 9:
							if(!warn['9']) {
								// 1일
								blackDate = addDate(1);
							} else {
								switch(warn['9']) {
									case 1:
										// 3일
										blackDate = addDate(3);
									case 2:
										// 7일
										blackDate = addDate(7);
									case 3:
									default:
										// 14일
										blackDate = addDate(14);
								}
							}
							warn['9'] += 1;

							blackNum = warn['9'];
							break;
						case 10:
							blackDate = addDate(365 * 40); // 40년 후
							warn['10'] += 1;

							blackNum = warn['10'];
							break;
						case 11:
							blackDate = addDate(365 * 40); // 40년 후
							warn['11'] += 1;

							blackNum = warn['11'];
							break;
						case 12:
							blackDate = addDate(parseInt(obj[2]) * 40);
							
							blackNum = 1;
					}

					if(code) {
						MainDB.users.update([ '_id', obj[0] ]).set([ 'black', blackReason ]).on();
						MainDB.users.update([ '_id', obj[0] ]).set([ 'time', blackDate ]).on();
					}

					hook.info(`**${oldNick}** (${obj[0]})`, `제재 사유: ${blackReason}`, `**처벌: **${blackNum}차`);
					MainDB.users.update([ '_id', obj[0] ]).set([ 'warnings', JSON.stringify(warn) ]).on();
					JLog.info(`[SANCTION] #${obj[0]} banned`);

					if(temp = DIC[obj[0]]){
						temp.socket.send('{"type":"error","code":410}');
						temp.socket.close();
					}
				});
			} catch (e) {
				JLog.warn("[SANCTION] Error: " + e);
			}
			return null;
		/*
		case "ban":
			var target = value.split(",")[0];
			var reason = value.split(",")[1];
			
			if(!target) return null;
			else if(!reason) return null;

			MainDB.users.update([ '_id', target ]).set([ 'black', reason ]).on();
			MainDB.users.update([ '_id', target ]).set([ 'time', null ]).on();
			JLog.info(`[BAN] #${value} banned`);
			if(temp = DIC[target]){
				temp.socket.send('{"type":"error","code":410}');
				temp.socket.close();
			}
			return null;
		case "tempban":
			var target = value.split(",")[0];
			var date = Date.now() + parseInt(value.split(",")[1]) * 24 * 60 * 60 * 1000;
			var reason = value.split(",")[2];
			
			if(!target) return null;
			else if(!reason) return null;
			else if(!date) return null;

			MainDB.users.update([ '_id', target ]).set([ 'black', reason ]).on();
			MainDB.users.update([ '_id', target ]).set([ 'time', date ]).on();
			JLog.info(`[TEMPBAN] #${value} temp banned (Duration: ${value.split(","[1])} days)`);
			if(temp = DIC[target]){
				temp.socket.send('{"type":"error","code":410}');
				temp.socket.close();
			}
			return null;
		*/
		case "unban":
			MainDB.users.update([ '_id', value ]).set([ 'black', null ]).on();
			MainDB.users.update([ '_id', value ]).set([ 'time', Number(null) ]).on();
			JLog.info(`[UNBAN] #${value} unbanned`);
			return null;
		case "broadcast":
			KKuTu.publish('yell', { value: value });
			return null;
		case "notice":
			KKuTu.publish('notice', { value: value });
			return null;
		case "kill":
			if(temp = DIC[value]){
				temp.socket.send('{"type":"error","code":410}');
				temp.socket.close();
			}
			return null;
		case "tailroom":
			if(temp = ROOM[value]){
				if(T_ROOM[value] == id){
					i = true;
					delete T_ROOM[value];
				}else T_ROOM[value] = id;
				if(DIC[id]) DIC[id].send('tail', { a: i ? "trX" : "tr", rid: temp.id, id: id, msg: { pw: temp.password, players: temp.players } });
			}
			return null;
		case "tailuser":
			if(temp = DIC[value]){
				if(T_USER[value] == id){
					i = true;
					delete T_USER[value];
				}else T_USER[value] = id;
				temp.send('test');
				if(DIC[id]) DIC[id].send('tail', { a: i ? "tuX" : "tu", rid: temp.id, id: id, msg: temp.getData() });
			}
			return null;
        case "ip":
            if (t = DIC[value]) {
				if(DIC[id]) try {
					DIC[id].send('tail', {
						a: "ip",
						rid: t.id,
						id: id,
						msg: t.remoteAddress
					});
				} catch (e) {
					DIC[id].send('tail', {
						a: "ip",
						msg: "시스템 오류가 발생하였습니다. 관리자에게 문의하세요."
					});
					JLog.error("[IP] ERROR: " + e);
				}
			}
			return null;
		case "dump":
			if(DIC[id]) DIC[id].send('yell', { value: "This feature is not supported..." });
			/*Heapdump.writeSnapshot("/home/kkutu_memdump_" + Date.now() + ".heapsnapshot", function(err){
				if(err){
					JLog.error("Error when dumping!");
					return JLog.error(err.toString());
				}
				if(DIC[id]) DIC[id].send('yell', { value: "DUMP OK" });
				JLog.success("Dumping success.");
			});*/
			return null;
		case "lobbychat":
			if (!isLobby) isLobby = true; 
			else if (isLobby) isLobby = false;
			JLog.log(`[DEBUG] isLobby changed to ${isLobby}`);
			return null;
	}
	return value;
}
function addDate(num){
	var date = parseInt(num);
	if(isNaN(date)) return;

	return Date.now() + date * 24 * 60 * 60 * 1000;
}
function checkTailUser(id, place, msg){
	var temp;
	
	if(temp = T_USER[id]){
		if(!DIC[temp]){
			delete T_USER[id];
			return;
		}
		DIC[temp].send('tail', { a: "user", rid: place, id: id, msg: msg });
	}
}
function narrateFriends(id, friends, stat){
	if(!friends) return;
	var fl = Object.keys(friends);
	
	if(!fl.length) return;
	
	MainDB.users.find([ '_id', { $in: fl } ], [ 'server', /^\w+$/ ]).limit([ 'server', true ]).on(function($fon){
		var i, sf = {}, s;
		
		for(i in $fon){
			if(!sf[s = $fon[i].server]) sf[s] = [];
			sf[s].push($fon[i]._id);
		}
		if(DIC[id]) DIC[id].send('friends', { list: sf });
		
		if(sf[SID]){
			KKuTu.narrate(sf[SID], 'friend', { id: id, s: SID, stat: stat });
			delete sf[SID];
		}
		for(i in WDIC){
			WDIC[i].send('narrate-friend', { id: id, s: SID, stat: stat, list: sf });
			break;
		}
	});
}
Cluster.on('message', function(worker, msg){
	var temp;
	
	switch(msg.type){
		case "admin":
			if(DIC[msg.id] && DIC[msg.id].admin) processAdmin(msg.id, msg.value);
			break;
		case "tail-report":
			if(temp = T_ROOM[msg.place]){
				if(!DIC[temp]) delete T_ROOM[msg.place];
				DIC[temp].send('tail', { a: "room", rid: msg.place, id: msg.id, msg: msg.msg });
			}
			checkTailUser(msg.id, msg.place, msg.msg);
			break;
		case "okg":
			if(DIC[msg.id]) DIC[msg.id].onOKG(msg.time);
			break;
		case "kick":
			if(DIC[msg.target]) DIC[msg.target].socket.close();
			break;
		case "invite":
			if(!DIC[msg.target]){
				worker.send({ type: "invite-error", target: msg.id, code: 417 });
				break;
			}
			if(DIC[msg.target].place != 0){
				worker.send({ type: "invite-error", target: msg.id, code: 417 });
				break;
			}
			if(!GUEST_PERMISSION.invite) if(DIC[msg.target].guest){
				worker.send({ type: "invite-error", target: msg.id, code: 422 });
				break;
			}
			if(DIC[msg.target]._invited){
				worker.send({ type: "invite-error", target: msg.id, code: 419 });
				break;
			}
			DIC[msg.target]._invited = msg.place;
			DIC[msg.target].send('invited', { from: msg.place });
			break;
		case "room-new":
			if(ROOM[msg.room.id] || !DIC[msg.target]){ // 이미 그런 ID의 방이 있다... 그 방은 없던 걸로 해라.
				worker.send({ type: "room-invalid", room: msg.room });
			}else{
				ROOM[msg.room.id] = new KKuTu.Room(msg.room, msg.room.channel);
			}
			break;
		case "room-come":
			if(ROOM[msg.id] && DIC[msg.target]){
				ROOM[msg.id].come(DIC[msg.target]);
			}else{
				JLog.warn(`Wrong room-come id=${msg.id}&target=${msg.target}`);
			}
			break;
		case "room-spectate":
			if(ROOM[msg.id] && DIC[msg.target]){
				ROOM[msg.id].spectate(DIC[msg.target], msg.pw);
			}else{
				JLog.warn(`Wrong room-spectate id=${msg.id}&target=${msg.target}`);
			}
			break;
		case "room-go":
			if(ROOM[msg.id] && DIC[msg.target]){
				ROOM[msg.id].go(DIC[msg.target]);
			}else{
				// 나가기 말고 연결 자체가 끊겼을 때 생기는 듯 하다.
				JLog.warn(`Wrong room-go id=${msg.id}&target=${msg.target}`);
				if(ROOM[msg.id] && ROOM[msg.id].players){
					// 이 때 수동으로 지워준다.
					var x = ROOM[msg.id].players.indexOf(msg.target);
					
					if(x != -1){
						ROOM[msg.id].players.splice(x, 1);
						JLog.warn(`^ OK`);
					}
				}
				if(msg.removed) delete ROOM[msg.id];
			}
			break;
		case "user-publish":
			if(temp = DIC[msg.data.id]){
				for(var i in msg.data){
					temp[i] = msg.data[i];
				}
			}
			break;
		case "room-publish":
			if(temp = ROOM[msg.data.room.id]){
				for(var i in msg.data.room){
					temp[i] = msg.data.room[i];
				}
				temp.password = msg.password;
			}
			KKuTu.publish('room', msg.data);
			break;
		case "room-expired":
			if(msg.create && ROOM[msg.id]){
				for(var i in ROOM[msg.id].players){
					var $c = DIC[ROOM[msg.id].players[i]];
					
					if($c) $c.send('roomStuck');
				}
				delete ROOM[msg.id];
			}
			break;
		case "room-invalid":
			delete ROOM[msg.room.id];
			break;
		default:
			JLog.warn(`Unhandled IPC message type: ${msg.type}`);
	}
});
exports.init = function(_SID, CHAN){
	SID = _SID;
	MainDB = require('../web/database');
	MainDB.ready = function(){
		JLog.success("Master DB is ready.");
		
		MainDB.users.update([ 'server', SID ]).set([ 'server', "" ]).on();
		Server = new WebSocket.Server({
			port: global.test ? (Const.TEST_PORT + 410) : process.env['KKUTU_PORT'], 
			perMessageDeflate: false
		});
		Server.on('connection', function(socket, info){
			var key = info.url.slice(1);
			var $c;
			
			socket.on('error', function(err){
				JLog.warn("Error on #" + key + " on ws: " + err.toString());
			});
			// 웹 서버
			if(info.headers.host.match(/^127\.0\.0\.2:/)){
				if(WDIC[key]) WDIC[key].socket.close();
				WDIC[key] = new KKuTu.WebServer(socket);
				JLog.info(`New web server #${key}`);
				WDIC[key].socket.on('close', function(){
					JLog.alert(`Exit web server #${key}`);
					WDIC[key].socket.removeAllListeners();
					delete WDIC[key];
				});
				return;
			}
			if(Object.keys(DIC).length >= Const.KKUTU_MAX){
				socket.send(`{ "type": "error", "code": "full" }`);
				return;
			}
			MainDB.session.findOne([ '_id', key ]).limit([ 'profile', true ]).on(function($body){
				$c = new KKuTu.Client(socket, $body ? $body.profile : null, key);
				$c.admin = GLOBAL.ADMIN.indexOf($c.id) != -1;
				$c.main = GLOBAL.MAIN.indexOf($c.id) != -1;
				$c.broadcaster = GLOBAL.BROADCASTER.indexOf($c.id) != -1;
				$c.remoteAddress = info.headers['x-forwarded-for'] || info.connection.remoteAddress;
				
				if(DIC[$c.id]){
					DIC[$c.id].sendError(408);
					setTimeout(() => $c.socket.close(), 50);
				}
				if(DEVELOP && !Const.TESTER.includes($c.id)){
					$c.sendError(500);
					$c.socket.close();
					return;
				}
				if($c.guest){
					if(SID != "0"&&SID != "1"){
						$c.sendError(402);
						setTimeout(() => $c.socket.close(), 50);
						return;
					}
					if(KKuTu.NIGHT){
						$c.sendError(440);
						$c.socket.close();
						return;
					}
				}
				if($c.isAjae === null){
					$c.sendError(441);
					$c.socket.close();
					return;
				}
				$c.refresh().then(function(ref){
					let isBlackRelease = false
					if (ref.time < Date.now()) {
						DIC[$c.id] = $c;
						MainDB.users.update([ '_id', $c.id]).set([ 'time', 0]).set([ 'black', null]).on();
						JLog.info(`[${$c.remoteAddress}] Black release #${$c.id}`);
						isBlackRelease = true
					}
					
					if (ref.result == 200 || isBlackRelease) {
						if(!$c.nick) $c.nick = "nonick";
						if($c.nick != "nonick") {
							MainDB.users.update([ '_id', $c.id ]).set([ 'server', SID ]).on();
							DIC[$c.id] = $c;
							DNAME[$c.nick.replace(/\s/g, "")] = $c.id;
						}
						// if($c.guest) {
							// $c.profile.title = "손님" + Math.floor(1000 + Math.random() * 9000);
						// }
						if (($c.guest && GLOBAL.GOOGLE_RECAPTCHA_TO_GUEST) || GLOBAL.GOOGLE_RECAPTCHA_TO_USER) {
							$c.socket.send(JSON.stringify({
								type: 'recaptcha',
								siteKey: GLOBAL.GOOGLE_RECAPTCHA_SITE_KEY
							}));
						} else {
							$c.passRecaptcha = true;

							joinNewUser($c);
						}
					} else {
						if (!ref.time) $c.send('error', { code: ref.result, message: ref.black });
						else $c.send('error', { code: ref.result, message: ref.black, time: ref.time });
						$c._error = ref.result;
						setTimeout(() => $c.socket.close(), 50);
						// JLog.info("Black user #" + $c.id);
					}
				});
			});
		});
		Server.on('error', function (err) {
			JLog.warn("Error on ws: " + err.toString());
		});
		KKuTu.init(MainDB, DIC, ROOM, GUEST_PERMISSION, CHAN);
	};
};

function joinNewUser($c) {
	$c.send('welcome', {
		id: $c.id,
		nick: $c.nick,
		guest: $c.guest,
		box: $c.box,
		playTime: $c.data.playTime,
		rankPoint: $c.data.rankPoint,
		okg: $c.okgCount,
		users: KKuTu.getUserList(),
		rooms: KKuTu.getRoomList(),
		friends: $c.friends,
		admin: $c.admin,
		test: global.test,
		caj: $c._checkAjae ? true : false
	});
	narrateFriends($c.id, $c.friends, "on");
	KKuTu.publish('conn', {user: $c.getData()});

	JLog.info("["+ $c.remoteAddress + "] New user #" + $c.id);
}

KKuTu.onClientMessage = function ($c, msg) {
	if (!msg) return;
	if($c.nick =="nonick"&&msg.type!="newNick") return;
	
	if ($c.passRecaptcha) {
		processClientRequest($c, msg);
	} else {
		if (msg.type === 'recaptcha') {
			Recaptcha.verifyRecaptcha(msg.token, $c.remoteAddress, function (success) {
				// console.log(success);
				if (success) {
					$c.passRecaptcha = true;

					joinNewUser($c);

					processClientRequest($c, msg);
				} else {
					JLog.warn(`Recaptcha failed from IP ${$c.remoteAddress}`);

					$c.sendError(447);
					$c.socket.close();
				}
			});
		}
	}
};

function processClientRequest($c, msg) {
	var stable = true;
	var temp;
	var now = (new Date()).getTime();
	
	switch (msg.type) {
		case 'yell':
			if (!msg.value) return;
			if (!$c.admin) return;
			if (!$c.main) return;

			$c.publish('yell', {value: msg.value});
			break;
		case 'notice':
			if (!msg.value) return;
			if (!$c.admin) return;
			if (!$c.main) return;

			$c.publish('notice', {value: msg.value});
			break;
		case 'refresh':
			$c.refresh();
			break;
		case 'talk':
			if (!msg.value) return;
			if (!msg.value.substr) return;
			
			msg.value = msg.value.substr(0, 200);
			if ($c.admin) {
				if (!processAdmin($c.id, msg.value)) break;
			}
			checkTailUser($c.id, $c.place, msg);
			if (msg.whisper) {
				msg.whisper.split(',').forEach(v => {
					if (temp = DIC[DNAME[v]]) {
						temp.send('chat', {
							whisper: $c.profile.nick || $c.profile.title,
							profile: $c.profile,
							value: msg.value
						});
					} else {
						$c.sendError(424, v);
					}
				});
			} else {
				if(!isLobby && $c.place == 0) $c.send('notice', { value: "관리자에 의하여 로비 채팅이 일시적으로 비활성화 되었습니다." });
				else $c.chat(msg.value);
			}
			break;
		case 'friendAdd':
			if (!msg.target) return;
			if ($c.guest) return;
			if ($c.id == msg.target) return;
			if (Object.keys($c.friends).length >= 100) return $c.sendError(452);
			if (temp = DIC[msg.target]) {
				if (temp.guest) return $c.sendError(453);
				if ($c._friend) return $c.sendError(454);
				$c._friend = temp.id;
				temp.send('friendAdd', {from: $c.id});
			} else {
				$c.sendError(450);
			}
			break;
		case 'friendAddRes':
			if (!(temp = DIC[msg.from])) return;
			if (temp._friend != $c.id) return;
			if (msg.res) {
				// $c와 temp가 친구가 되었다.
				$c.addFriend(temp.id);
				temp.addFriend($c.id);
			}
			temp.send('friendAddRes', {target: $c.id, res: msg.res});
			delete temp._friend;
			break;
		case 'friendEdit':
			if (!$c.friends) return;
			if (!$c.friends[msg.id]) return;
			$c.friends[msg.id] = (msg.memo || "").slice(0, 50);
			$c.flush(false, false, true);
			$c.send('friendEdit', {friends: $c.friends});
			break;
		case 'friendRemove':
			if (!$c.friends) return;
			if (!$c.friends[msg.id]) return;
			$c.removeFriend(msg.id);
			break;
		case 'newNick':
			if (!msg.id || !msg.nick) return;
			MainDB.users.findOne([ '_id', msg.id ]).on(function($body){
				if ($body.nick != msg.nick) {
					return;
				}
				else if(!!$body.nonickchange) {
					$c.sendError(490);
					return;
				}
				$c.refresh().then(function(ref){
					if(ref.result == 200){
						MainDB.users.update([ '_id', $c.id ]).set([ 'server', SID ]).on();
						DIC[$c.id] = $c;
						DNAME[$c.nick.replace(/\s/g, "")] = $c.id;
						KKuTu.publish('conn', { user: $c.getData() });
						narrateFriends($c.id, $c.friends, "on");
					}
				});
			});
			break;
		case 'nickChange':
			if (!msg.id || !msg.nick) return;
			MainDB.users.findOne([ '_id', msg.id ]).on(function($body){
				if ($body.nick != msg.nick) {
					return;
				}
				else if(!!$body.nonickchange) {
					$c.sendError(490);
					return;
				}
				console.log($body.nonickchange);
				$c.refresh().then(function(ref){
					if(ref.result == 409){
						JLog.info("Nickchange "+msg.id+" "+msg.nick);
						$c.publish('nickChange', $c.getData());
					}
				});
			});
			break;
		/*AK IR*/ case 'report':
			// JLog.info("[AK-DEBUG] Got Response: REPORT");
			if(!msg.id || !msg.reason) return;
			if(!GUEST_PERMISSION.report) if($c.guest) return;
			File.appendFile('./report.log', `[${new Date().toLocaleString()}] User #${$c.id} reported ${msg.id} for ${msg.reason}\n`, function(){JLog.alert(`[${$c.remoteAddress}] User #${$c.id} reported ${msg.id} for ${msg.reason}`)});			
			break;
		case 'enter':
		case 'setRoom':
			if($c.broadcaster) msg.roomType = 'broadcast';
			if($c.admin) msg.roomType = 'admin';

			if(SID == '6') if (!$c.admin && !msg.id) {
				$c.sendError(462);
				return;
			};

			if (!msg.title) stable = false;
			if (!msg.limit) stable = false;
			if (!msg.round) stable = false;
			if (!msg.time) stable = false;
			if (!msg.opts) stable = false;

			msg.code = false;
			msg.limit = Number(msg.limit);
			msg.mode = Number(msg.mode);
			msg.round = Number(msg.round);
			msg.time = Number(msg.time);

			if (isNaN(msg.limit)) stable = false;
			if (isNaN(msg.mode)) stable = false;
			if (isNaN(msg.round)) stable = false;
			if (isNaN(msg.time)) stable = false;

			if (stable) {
				if (msg.title.length > 20) stable = false;
				if (msg.password.length > 20) stable = false;
				if($c.admin || $c.broadcaster) {
					if(msg.limit < 2 || msg.limit > 24) {
						msg.code = 461;
						stable = false;
					}
				} else if (msg.limit < 2 || msg.limit > 8) {
					msg.code = 432;
					stable = false;
				}
				if (msg.mode < 0 || msg.mode >= MODE_LENGTH) stable = false;
				if (msg.round < 1 || msg.round > 10) {
					msg.code = 433;
					stable = false;
				}
				if (ENABLE_ROUND_TIME.indexOf(msg.time) == -1) stable = false;
			}
			if (msg.type == 'enter') {
				if (msg.id || stable) $c.enter(msg, msg.spectate);
				else $c.sendError(msg.code || 431);
			} else if (msg.type == 'setRoom') {
				if (stable) $c.setRoom(msg);
				else $c.sendError(msg.code || 431);
			}
			break;
		case 'inviteRes':
			if (!(temp = ROOM[msg.from])) return;
			if (!GUEST_PERMISSION.inviteRes) if ($c.guest) return;
			if ($c._invited != msg.from) return;
			if (msg.res) {
				$c.enter({id: $c._invited}, false, true);
			} else {
				if (DIC[temp.master]) DIC[temp.master].send('inviteNo', {target: $c.id});
			}
			delete $c._invited;
			break;
		/* 망할 셧다운제
		case 'caj':
			if(!$c._checkAjae) return;
			clearTimeout($c._checkAjae);
			if(msg.answer == "yes") $c.confirmAjae(msg.input);
			else if(KKuTu.NIGHT){
				$c.sendError(440);
				$c.socket.close();
			}
			break;
		*/
		case 'test':
			checkTailUser($c.id, $c.place, msg);
			break;
		default:
			break;
	}
}

KKuTu.onClientClosed = function($c, code){
	if(!DIC[$c.id]) return;

	delete DIC[$c.id];
	if($c._error != 409) MainDB.users.update([ '_id', $c.id ]).set([ 'server', "" ]).on();
	if($c.profile) delete DNAME[$c.profile.nick];
	if($c.socket) $c.socket.removeAllListeners();
	if($c.friends) narrateFriends($c.id, $c.friends, "off");
	KKuTu.publish('disconn', { id: $c.id });

	JLog.alert("["+ $c.remoteAddress + "] Exit #" + $c.id);
};