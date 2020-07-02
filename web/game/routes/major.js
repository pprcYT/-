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

var MainDB	 = require("../../database");
var JLog	 = require("../../../sub/jjlog");
var Const	 = require("../../../const");

let bad = new RegExp([
	"(시|싀|쉬|슈|씨|쒸|씌|쓔|쑤|시이|싀이|쉬이|씨이|쒸이|씌이|찌이|스|쓰|쯔|스으|쓰으|쯔으|수우|쑤우|십|싑|쉽|슙|씹|쓉|씝|쓥|씁|싶|싚|슆|슾|앂|씦|쓒|씊|쑾|ㅅ|ㅆ|ㅅㅣ|ㅅ이|ㅆ이|c|c이|Ⓒ|Ⓒ이|씨이이|시이이|쓰으으|스으으)[^가-힣]*(바|파|발|팔|빠|빨|불|벌|벨|밸|빠|ㅂ|ㅃ|ㅍ)","(병|뱡|뱅|뱡|빙|븅|븽|뷰웅|비잉|볭|뱽|뼝|뺑|쁑|삥|삉|뺭|뼈엉|쀼웅|ㅂ)[^가-힣]*(신|싄|슨|씬|씐|진|즨|ㅅ|딱|시인|시나)","(새|섀|세|셰|쌔|쎄|썌|쎼)[^가-힣]*(끼|끠|애끼|에끼)","(저새|저색|저섀|저세|저셰|저쌔|저쎄|저썌|저쎼)[^가-힣]*(기|애기|에기)","(개|게|계|걔|깨|께|꼐|꺠)[^가-힣]*(새|세|섀|셰)",
	"(니|닝|느|노|늬|너|쟤|유|걔|ㄴ)[^가-힣]*(ㄱㅁ|ㄱㅃ|ㅇㅁ|ㅇㅂ|엄마|검마|검|금|미|앰|앱|아빠|엄빠|의미|의비|븨|믜)","(ㄱㅁ|ㄱㅃ|ㅇㅁ|ㅇㅂ|엄마|검마|앰|아빠|엄빠)[^가-힣]*(죽|뒤|사|돌|없)","(앰|엠|얨|옘)[^가-힣]*(창|챵|촹|생|섕|셍|솅|쉥)",
	"(세|섹|색|쉑|쇡|세크|새크|셍|셱|섁|세그|세엑|세액)[^가-힣]*(ㅅ|스|슥|슨|슫|슷|승|로스)",
	"(ㅈ|젓|젔|젇|젖|좟|좠|좓|좢)[^가-힣]*(됟|됫|됬|됏|됐|됃|같|갇|까|가|까|카)",
	"(잠|좌|잗|잣|쟈|보|볻|봇|뵤)[^가-힣]*(지|짓|짇|징|즤|즫|즷|즹|빨)",
	"(질|입|안|밖)[^가-힣]*(싸)",
	"(후|훚|훗|훋)[^가-힣]*(장|쟝|좡)",
	"(꼬|보|딸|똘|빡)[^가-힣]*(추)",
	"(미친|잡|쓰레기|거지|그지|똥|ㅣ발)[^가-힣]*(녀석|놈|충|자식|냐|냔|세|네|것)",
	"(버|벅|뻐|뻑|퍽)[^가-힣]*(큐|뀨)","(호)[^가-힣]*(로|모|구)",
	"(스|수|슈|쓰|쑤|쓔|스으|수우|슈우|쓰우|쑤으|쓔으)[^가-힣]*(레|래|럐|례|랙|렉|럑|롁|랚|렊|럒|롂)",
	"(지|즤|디|G|ㅣ|치|찌|지이|즤이|G이)[^가-힣]*(랄|라알)","(딸)[^가-힣]*(딸|치|쳐|쳤|침)",
	"발[^가-힣]*기","풀[^가-힣]*발","딸[^가-힣]*딸","강[^가-힣]*간","자[^가-힣]*위","부[^가-힣]*랄","불[^가-힣]*알","오[^가-힣]*르[^가-힣]*가[^가-힣]*즘",
	"처[^가-힣]*녀[^가-힣]*막","질[^가-힣]*내","질[^가-힣]*외","정[^가-힣]*액","자[^가-힣]*궁","생[^가-힣]*리","월[^가-힣]*경","페[^가-힣]*도","또[^가-힣]*라[^가-힣]*이","장[^가-힣]*애",
	"종[^가-힣]*간","쓰[^가-힣]*레[^가-힣]*기","무[^가-힣]*뇌","학[^가-힣]*식[^가-힣]*충","급[^가-힣]*식[^가-힣]*충","버[^가-힣]*러[^가-힣]*지","찌[^가-힣]*꺼[^가-힣]*기","삐[^가-힣]*꾸",
	"닥[^가-힣]*쳐","꺼[^가-힣]*져","애[^가-힣]*자","찌[^가-힣]*그[^가-힣]*레[^가-힣]*기","대[^가-힣]*가[^가-힣]*리","면[^가-힣]*상","와[^가-힣]*꾸","시[^가-힣]*빠[^가-힣]*빠","파[^가-힣]*오[^가-힣]*후",
	"사[^가-힣]*까[^가-힣]*시","씹[^가-힣]*덕","애[^가-힣]*미","엿[^가-힣]*먹","애[^가-힣]*비","새[^가-힣]*끼","줬[^가-힣]*까","(뒤)[^가-힣]*(져|진|졌|질|짐)","살[^가-힣]*지[^가-힣]*마",
	"자[^가-힣]*살[^가-힣]*(해|하|헤)","(좆|좃|좄|졷|줫|줮|줟|죶|죳|죴|죧)","씹|씹","봊|봊","잦|잦","(섹|섻)","썅|썅","ㅗ|ㅗ","ㅄ|ㅄ","ㄲㅈ|ㄲㅈ","(ㅈ)[^가-힣]*(ㅂㅅ|ㄲ|ㄹ|ㄴ)",
	"(f|F)[^A-Za-z]*(u|U)[^A-Za-z]*(c|C)[^A-Za-z]*(k|K)","(s|S)[^A-Za-z]*(h|H)[^A-Za-z]*(i|I)[^A-Za-z]*(t|T)",
	"(d|D)[^A-Za-z]*(a|A)[^A-Za-z]*(d|D)","(m|M)[^A-Za-z]*(o|O)[^A-Za-z]*(m|M)","(m|M)[^A-Za-z]*(o|O)[^A-Za-z]*(t|T)[^A-Za-z]*(h|H)[^A-Za-z]*(e|E)[^A-Za-z]*(r|R)",
	"(f|F)[^A-Za-z]*(a|A)[^A-Za-z]*(t|T)[^A-Za-z]*(h|H)[^A-Za-z]*(e|E)[^A-Za-z]*(r|R)","(d|D)[^A-Za-z]*(a|A)[^A-Za-z]*(m|M)[^A-Za-z]*(n|N)",
	"(s|S)[^A-Za-z]*(h|H)[^A-Za-z]*(u|U)[^A-Za-z]*(t|T)","(b|B)[^A-Za-z]*(i|I)[^A-Za-z]*(t|T)[^A-Za-z]*(c|C)[^A-Za-z]*(h|H)","(d|D)[^A-Za-z]*(i|I)[^A-Za-z]*(c|C)[^A-Za-z]*(k|K)",
	"(s|S)[^A-Za-z]*(e|E)[^A-Za-z]*x","(b|B)[^A-Za-z]*(a|A)[^A-Za-z]*(s|S)[^A-Za-z]*(t|T)[^A-Za-z]*(a|A)[^A-Za-z]*(r|R)[^A-Za-z]*(d|D)","(c|C)[^A-Za-z]*(u|U)[^A-Za-z]*(n|N)[^A-Za-z]*(t|T)",
	"(p|P)[^A-Za-z]*(u|U)[^A-Za-z]*(s|S)[^A-Za-z]*(s|S)[^A-Za-z]*(y|Y)","(f|F)[^A-Za-z]*(a|A)[^A-Za-z]*(g|G)",
	"(n|N)[^A-Za-z]*(i|I)[^A-Za-z]*(g|G)[^A-Za-z]*(g|G)[^A-Za-z]*(e|E)[^A-Za-z]*(r|R)","(n|N)[^A-Za-z]*(i|I)[^A-Za-z]*(g|G)[^A-Za-z]*(g|G)[^A-Za-z]*(a|A)",
	"(n|N)[^A-Za-z]*(i|I)[^A-Za-z]*(g|G)[^A-Za-z]*(r|R)[^A-Za-z]*(o|O)","(j|J)[^A-Za-z]*(u|U)[^A-Za-z]*(n|N)[^A-Za-z]*(k|K)","(m|M)[^A-Za-z]*(u|U)[^A-Za-z]*(f|F)[^A-Za-z]*(f|F)",
	"(p|P)[^A-Za-z]*(i|I)[^A-Za-z]*(s|S)[^A-Za-z]*(s|S)","(r|R)[^A-Za-z]*(e|E)[^A-Za-z]*(t|T)[^A-Za-z]*(a|A)[^A-Za-z]*(r|R)[^A-Za-z]*(d|D)","(s|S)[^A-Za-z]*(l|L)[^A-Za-z]*(u|U)[^A-Za-z]*(t|T)","(t|T)[^A-Za-z]*(i|I)[^A-Za-z]*(t|T)[^A-Za-z]*(s|S)",
	"(t|T)[^A-Za-z]*(r|R)[^A-Za-z]*(a|A)[^A-Za-z]*(s|S)[^A-Za-z]*(h|H)","(t|T)[^A-Za-z]*(w|W)[^A-Za-z]*(a|A)[^A-Za-z]*(t|T)","(w|W)[^A-Za-z]*(a|A)[^A-Za-z]*(n|N)[^A-Za-z]*(k|K)",
	"(w|W)[^A-Za-z]*(h|H)[^A-Za-z]*(o|O)[^A-Za-z]*(r|R)[^A-Za-z]*(e|E)","(s|S)[^A-Za-z]*(i|I)[^A-Za-z]*(b|B)[^A-Za-z]*(a|A)[^A-Za-z]*(l|L)","(g|G)[^A-Za-z]*(a|A)[^A-Za-z]*(s|S)[^A-Za-z]*(a|A)[^A-Za-z]*(k|K)[^A-Za-z]*(i|I)",
	"(a|A)[^A-Za-z]*(s|S)[^A-Za-z]*(s|S)[^A-Za-z]*(h|H)[^A-Za-z]*(o|O)[^A-Za-z]*(l|L)[^A-Za-z]*(e|E)","(t|T)[^A-Za-z]*(l|L)[^A-Za-z]*q[^A-Za-z]*(k|K)[^A-Za-z]*(f|F)",
	"(t|T)[^A-Za-z]*(p|P)[^A-Za-z]*(r|R)[^A-Za-z]*(t|T)[^A-Za-z]*(m|M)","(s|S)[^A-Za-z]*(e|E)[^A-Za-z]*(e|E)[^A-Za-z]*(b|B)[^A-Za-z]*(a|A)[^A-Za-z]*(l|L)",
	"わ[^ぁ-んァ-ン]*る[^ぁ-んァ-ン]*く[^ぁ-んァ-ン]*ち","ぶ[^ぁ-んァ-ン]*べ[^ぁ-んァ-ン]*つ[^ぁ-んァ-ン]*","ゴ[^ぁ-んァ-ン]*ミ","ク[^ぁ-んァ-ン]*ズ","カ[^ぁ-んァ-ン]*ス",
	"外[^ぁ-んァ-ン]*道","ゲ[^ぁ-んァ-ン]*ロ","ダ[^ぁ-んァ-ン]*メ[^ぁ-んァ-ン]*人[^ぁ-んァ-ン]*間","木[^ぁ-んァ-ン]*偶",
	"ろ[^ぁ-んァ-ン]*く[^ぁ-んァ-ン]*で[^ぁ-んァ-ン]*な[^ぁ-んァ-ン]*し","ま[^ぁ-んァ-ン]*ぬ[^ぁ-んァ-ン]*け","ご[^ぁ-んァ-ン]*ろ[^ぁ-んァ-ン]*つ[^ぁ-んァ-ン]*き",
	"バ[^ぁ-んァ-ン]*カ","ブ[^ぁ-んァ-ン]*ス","ビ[^ぁ-んァ-ン]*ッ[^ぁ-んァ-ン]*チ","さ[^ぁ-んァ-ン]*ん[^ぁ-んァ-ン]*し[^ぁ-んァ-ン]*た",
	"死[^ぁ-んァ-ン]*に[^ぁ-んァ-ン]*損[^ぁ-んァ-ン]*な[^ぁ-んァ-ン]*い"].join("|"));

function obtain($user, key, value, term, addValue){
	var now = (new Date()).getTime();
	
	if(term){
		if($user.box[key]){
			if(addValue) $user.box[key].value += value;
			else $user.box[key].expire += term;
		}else $user.box[key] = { value: value, expire: Math.round(now * 0.001 + term) }
	}else{
		$user.box[key] = ($user.box[key] || 0) + value;
	}
}
function consume($user, key, value, force){
	var bd = $user.box[key];
	
	if(bd.value){
		// 기한이 끝날 때까지 box 자체에서 사라지지는 않는다. 기한 만료 여부 확인 시점: 1. 로그인 2. box 조회 3. 게임 결과 반영 직전 4. 해당 항목 사용 직전
		if((bd.value -= value) <= 0){
			if(force || !bd.expire) delete $user.box[key];
		}
	}else{
		if(($user.box[key] -= value) <= 0) delete $user.box[key];
	}
}

exports.run = function(Server, page){

Server.get("/box", function(req, res){
	if(req.session.profile){
		/*if(Const.ADMIN.indexOf(req.session.profile.id) == -1){
			return res.send({ error: 555 });
		}*/
	}else{
		return res.send({ error: 400 });
	}
	MainDB.users.findOne([ '_id', req.session.profile.id ]).limit([ 'box', true ]).on(function($body){
		if(!$body){
			res.send({ error: 400 });
		}else{
			res.send($body.box);
		}
	});
});
Server.get("/help", function(req, res){
	page(req, res, "help", {
		'KO_INJEONG': Const.KO_INJEONG
	});
});
Server.get("/bulletin", function(req, res){
	page(req, res, "bulletin", {
		'KO_INJEONG': Const.KO_INJEONG
	});
});
Server.get("/user", function(req, res){
	page(req, res, "user", {
		'KO_INJEONG': Const.KO_INJEONG
	});
});
Server.get("/ranking", function(req, res){
	var pg = Number(req.query.p);
	var id = req.query.id;
	
	if(id){
		MainDB.redis.getSurround(id, 15).then(function($body){
			res.send($body);
		});
	}else{
		if(isNaN(pg)) pg = 0;
		MainDB.redis.getPage(pg, 15).then(function($body){
			res.send($body);
		});
	}
});
Server.get("/moremi", function(req, res){
	var data;
	var id = req.query.id;
	if(id){
		MainDB.users.findOne([ '_id', req.query.id ]).on(function($u){
			if($u) {
				data = $u.equip
				return res.send(data);
			}
			else res.send({});
		});
	}

	function onSession(list){
		var board = {};

		Lizard.all(list.map(function(v){
			if(board[v.profile.id]) return null;
			else{
				board[v.profile.id] = true;
				return getProfile(v.profile.id);
			}
		})).then(function(data){
			res.send({ list: data });
		});
	}
	function getProfile(id){
		var R = new Lizard.Tail();

		if(id) MainDB.users.findOne([ '_id', id ]).on(function($u){
			R.go($u);
		}); else R.go(null);
		return R;
	}
});
Server.get("/cf/:word", function(req, res){
	res.send(getCFRewards(req.params.word, Number(req.query.l || 0), req.query.b == "1"));
});
Server.get("/shop", function(req, res){
	MainDB.kkutu_shop.find().limit([ 'cost', true ], [ 'term', true ], [ 'group', true ], [ 'options', true ], [ 'updatedAt', true ]).on(function($goods){
		res.json({ goods: $goods });
	});
	// res.json({ error: 555 });
});

// POST
Server.post("/dressnick", function (req, res) {
	let text = req.body.data || "";
	let nick = req.body.nick || "";
	let pattern = /^[ㄱ-ㅎㅏ-ㅣ가-힣A-Za-z0-9-_\s]{1,15}$/;

	if (req.session.profile) {
		if (nick.length < 2 || nick.length > 15 || !pattern.test(nick) || text.match(bad) || nick.match(bad) || nick.length == 0) {
			res.send({ error: 400 });
			return;
		}
		MainDB.users.findOne([ 'nick', nick ]).on(function($res){
			text = text.slice(0, 100).trim();
			nick = nick.trim();
			MainDB.users.update(['_id', req.session.profile.id]).set({
				'exordial': text,
				'nick': nick
			}).on(function ($res) {
				MainDB.session.findOne(['_id', req.session.id]).limit(['profile', true]).on(function ($ses) {
					$ses.profile.title = nick;
					MainDB.session.update(['_id', req.session.id]).set(['profile', $ses.profile]).on(function ($body) {
						res.send({text: text});
					});
				});
			});
		});
	} else res.send({error: 400});
});
Server.post("/exordial", function(req, res){
	let text = req.body.data || "";
	
	if(req.session.profile && !text.match(bad)) {
		text = text.slice(0, 100);
		MainDB.users.update([ '_id', req.session.profile.id ]).set([ 'exordial', text ]).on(function($res){
			res.send({ text: text });
		});
	} else res.send({ error: 400 });
});
Server.post("/newnick", (req, res) => {
	let nick = req.body.nick || "";
	let pattern = /^[ㄱ-ㅎㅏ-ㅣ가-힣A-Za-z0-9-_\s]{1,15}$/;

	if(req.session.profile){
		if (nick.length < 2 || nick.length > 15 || !pattern.test(nick) || nick.match(bad) || nick.length == 0) {
			res.send({error: 400});
			return;
		}
		MainDB.users.findOne([ 'nick', nick ]).on(function($res){
			if(!$res) {
				MainDB.users.findOne(['_id', req.session.profile.id]).on($body => {
					if($body.nick!="nonick"&&$body.nick) {
						res.send({ error: 400 });
						return;
					}
					MainDB.session.update(['_id', req.session.id]).set(['nick', nick]).on();
					req.session.nick = nick;
					MainDB.users.update(['_id', req.session.profile.id]).set(['kkutu',$body.kkutu], ['nick', nick ]).on($res => res.send());
				});
			} else res.send({ error: 460 });
		});
	} else res.send({ error: 400 });
});
Server.post("/buy/:id", function(req, res){
	if(req.session.profile){
		var uid = req.session.profile.id;
		var gid = req.params.id;
		
		MainDB.kkutu_shop.findOne([ '_id', gid ]).on(function($item){
			if(!$item) return res.json({ error: 400 });
			if($item.cost < 0) return res.json({ error: 400 });
			MainDB.users.findOne([ '_id', uid ]).limit([ 'money', true ], [ 'box', true ]).on(function($user){
				if(!$user) return res.json({ error: 400 });
				if(!$user.box) $user.box = {};
				var postM = $user.money - $item.cost;
				
				if(postM < 0) return res.send({ result: 400 });
				
				obtain($user, gid, 1, $item.term);
				MainDB.users.update([ '_id', uid ]).set(
					[ 'money', postM ],
					[ 'box', $user.box ]
				).on(function($fin){
					res.send({ result: 200, money: postM, box: $user.box });
					JLog.log("[PURCHASED] " + gid + " by " + uid);
				});
				// HIT를 올리는 데에 동시성 문제가 발생한다. 조심하자.
				MainDB.kkutu_shop.update([ '_id', gid ]).set([ 'hit', $item.hit + 1 ]).on();
			});
		});
	}else res.json({ error: 423 });
});
Server.post("/equip/:id", function(req, res){
	if(!req.session.profile) return res.json({ error: 400 });
	var uid = req.session.profile.id;
	var gid = req.params.id;
	var isLeft = req.body.isLeft == "true";
	var now = Date.now() * 0.001;
	
	MainDB.users.findOne([ '_id', uid ]).limit([ 'box', true ], [ 'equip', true ]).on(function($user){
		if(!$user) return res.json({ error: 400 });
		if(!$user.box) $user.box = {};
		if(!$user.equip) $user.equip = {};
		var q = $user.box[gid], r;
		
		MainDB.kkutu_shop.findOne([ '_id', gid ]).limit([ 'group', true ]).on(function($item){
			if(!$item) return res.json({ error: 430 });
			if(!Const.AVAIL_EQUIP.includes($item.group)) return res.json({ error: 400 });
			
			var part = $item.group;
			if(part.substr(0, 3) == "BDG") part = "BDG";
			if(part == "Mhand") part = isLeft ? "Mlhand" : "Mrhand";
			var qid = $user.equip[part];
			
			if(qid){
				r = $user.box[qid];
				if(r && r.expire){
					obtain($user, qid, 1, r.expire, true);
				}else{
					obtain($user, qid, 1, now + $item.term, true);
				}
			}
			if(qid == $item._id){
				delete $user.equip[part];
			}else{
				if(!q) return res.json({ error: 430 });
				consume($user, gid, 1);
				$user.equip[part] = $item._id;
			}
			MainDB.users.update([ '_id', uid ]).set([ 'box', $user.box ], [ 'equip', $user.equip ]).on(function($res){
				res.send({ result: 200, box: $user.box, equip: $user.equip });
			});
		});
	});
});
Server.post("/payback/:id", function(req, res){
	if(!req.session.profile) return res.json({ error: 400 });
	var uid = req.session.profile.id;
	var gid = req.params.id;
	var isDyn = gid.charAt() == '$';
	
	MainDB.users.findOne([ '_id', uid ]).limit([ 'money', true ], [ 'box', true ]).on(function($user){
		if(!$user) return res.json({ error: 400 });
		if(!$user.box) $user.box = {};
		var q = $user.box[gid];
		
		if(!q) return res.json({ error: 430 });
		MainDB.kkutu_shop.findOne([ '_id', isDyn ? gid.slice(0, 4) : gid ]).limit([ 'cost', true ]).on(function($item){
			if(!$item) return res.json({ error: 430 });
			
			consume($user, gid, 1, true);
			$user.money = Number($user.money) + Math.round(0.2 * Number($item.cost));
			MainDB.users.update([ '_id', uid ]).set([ 'money', $user.money ], [ 'box', $user.box ]).on(function($res){
				res.send({ result: 200, box: $user.box, money: $user.money });
			});
		});
	});
});
Server.post("/searchnick/:nick", function(req, res) {
	if(!req.params.nick) return res.json({ error: 400 });
	if(!req.session.profile) return res.json({ error: 400 });

	MainDB.users.findOne([ 'nick', req.params.nick ]).on(function($user){
		if(!$user) return res.json({ error: 405 });
		JLog.info(`[${req.session.profile.id}] searchNick ${req.params.nick} => #${$user._id}`);
		res.send({ result: 200, id: $user._id });
	});
});
function blendWord(word){
	var lang = parseLanguage(word);
	var i, kl = [];
	var kr = [];
	
	if(lang == "en") return String.fromCharCode(97 + Math.floor(Math.random() * 26));
	if(lang == "ko"){
		for(i=word.length-1; i>=0; i--){
			var k = word.charCodeAt(i) - 0xAC00;
			
			kl.push([ Math.floor(k/28/21), Math.floor(k/28)%21, k%28 ]);
		}
		[0,1,2].sort((a, b) => (Math.random() < 0.5)).forEach((v, i) => {
			kr.push(kl[v][i]);
		});
		return String.fromCharCode(((kr[0] * 21) + kr[1]) * 28 + kr[2] + 0xAC00);
	}
}
function parseLanguage(word){
	return word.match(/[a-zA-Z]/) ? "en" : "ko";
}
Server.post("/cf", function(req, res){
	if(!req.session.profile) return res.json({ error: 400 });
	var uid = req.session.profile.id;
	var tray = (req.body.tray || "").split('|');
	var i, o;
	
	if(tray.length < 1 || tray.length > 6) return res.json({ error: 400 });
	MainDB.users.findOne([ '_id', uid ]).limit([ 'money', true ], [ 'box', true ]).on(function($user){
		if(!$user) return res.json({ error: 400 });
		if(!$user.box) $user.box = {};
		var req = {}, word = "", level = 0;
		var cfr, gain = [];
		var blend;
		
		for(i in tray){
			word += tray[i].slice(4);
			level += 68 - tray[i].charCodeAt(3);
			req[tray[i]] = (req[tray[i]] || 0) + 1;
			if(($user.box[tray[i]] || 0) < req[tray[i]]) return res.json({ error: 434 });
		}
		MainDB.kkutu[parseLanguage(word)].findOne([ '_id', word ]).on(function($dic){
			if(!$dic){
				if(word.length == 3){
					blend = true;
				}else return res.json({ error: 404 });
			}
			cfr = getCFRewards(word, level, blend);
			if($user.money < cfr.cost) return res.json({ error: 407 });
			for(i in req) consume($user, i, req[i]);
			for(i in cfr.data){
				o = cfr.data[i];
				
				if(Math.random() >= o.rate) continue;
				if(o.key.charAt(4) == "?"){
					o.key = o.key.slice(0, 4) + (blend ? blendWord(word) : word.charAt(Math.floor(Math.random() * word.length)));
				}
				obtain($user, o.key, o.value, o.term);
				gain.push(o);
			}
			$user.money -= cfr.cost;
			MainDB.users.update([ '_id', uid ]).set([ 'money', $user.money ], [ 'box', $user.box ]).on(function($res){
				res.send({ result: 200, box: $user.box, money: $user.money, gain: gain });
			});
		});
	});
	// res.send(getCFRewards(req.params.word, Number(req.query.l || 0)));
});
Server.get("/dict/:word", function(req, res){
    var word = req.params.word;
    var lang = req.query.lang;
    var DB = MainDB.kkutu[lang];
    
    if(!DB) return res.send({ error: 400 });
    if(!DB.findOne) return res.send({ error: 400 });
    DB.findOne([ '_id', word ]).on(function($word){
        if(!$word) return res.send({ error: 404 });
        res.send({
            word: $word._id,
            mean: $word.mean,
            theme: $word.theme,
            type: $word.type
        });
    });
});

};
function getCFRewards(word, level, blend){
	var R = [];
	var f = {
		len: word.length, // 최대 6
		lev: level // 최대 18
	};
	var cost = 20 * f.lev;
	var wur = f.len / 36; // 최대 2.867
	
	if(blend){
		if(wur >= 0.5){
			R.push({ key: "$WPA?", value: 1, rate: 1 });
		}else if(wur >= 0.35){
			R.push({ key: "$WPB?", value: 1, rate: 1 });
		}else if(wur >= 0.05){
			R.push({ key: "$WPC?", value: 1, rate: 1 });
		}
		cost = Math.round(cost * 0.2);
	}else{
		R.push({ key: "dictPage", value: Math.round(f.len * 0.6), rate: 1 });
		R.push({ key: "boxB4", value: 1, rate: Math.min(1, f.lev / 7) });
		if(f.lev >= 5){
			R.push({ key: "boxB3", value: 1, rate: Math.min(1, f.lev / 15) });
			cost += 10 * f.lev;
			wur += f.lev / 20;
		}
		if(f.lev >= 10){
			R.push({ key: "boxB2", value: 1, rate: Math.min(1, f.lev / 30) });
			cost += 20 * f.lev;
			wur += f.lev / 10;
		}
		if(wur >= 0.05){
			if(wur > 1) R.push({ key: "$WPC?", value: Math.floor(wur), rate: 1 });
			R.push({ key: "$WPC?", value: 1, rate: wur % 1 });
		}
		if(wur >= 0.35){
			if(wur > 2) R.push({ key: "$WPB?", value: Math.floor(wur / 2), rate: 1 });
			R.push({ key: "$WPB?", value: 1, rate: (wur / 2) % 1 });
		}
		if(wur >= 0.5){
			R.push({ key: "$WPA?", value: 1, rate: wur / 3 });
		}
	}
	return { data: R, cost: cost };
}