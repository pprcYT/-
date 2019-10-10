/*
	내 작은 글자 놀이터, 알파끄투.
	(C) 2018-2019 해티. 모든 권리 보유.
	제작일 : 2018 - 11 - 16
*/
/*
const PostgresPool = require('pg').Pool;
const Pg = new PostgresPool({
	user: GLOBAL.PG_USER,
	password: GLOBAL.PG_PASS,
	port: GLOBAL.PG_PORT,
	database: GLOBAL.PG_LOG
});

Pg.connect(function(err, cli) {
	if(err) return;
	const main = new Collection.Agent("Postgres", cli);
	
	let DB = exports;
	
	DB.akreport = new main.Table("report");
	// 등록 칼럼 time, pid, reporter, reason, reported, rid, gameserver, placeroom
	DB.akblack = new main.Table("black");
	// 등록 칼럼 time, date, rid, ip
});

const GLOBAL = require('./global.json');
const JLog = require('./jjlog');
const Collection = require('./collection');
*/
const MAX_LEVEL = 720;
let Lizard	= require('./lizard.js');
let EXP = [];

function getRequiredScore(lv){
	return Math.round(
		(!(lv%5)*0.3 + 1) * (!(lv%15)*0.4 + 1) * (!(lv%45)*0.5 + 1) * (
			120 + Math.floor(lv/5)*60 + Math.floor(lv*lv/225)*120 + Math.floor(lv*lv/2025)*180
		)
	);
}
EXP.push(getRequiredScore(1));
for(let i=2; i<MAX_LEVEL; i++)
	EXP.push(EXP[i-2] + getRequiredScore(i));
EXP[MAX_LEVEL - 1] = Infinity;
EXP.push(Infinity);

exports.getLevel = _score => {
	let score = typeof _score == 'object' ? _score.data.score : _score;
	let l = EXP.length, level = 1;
	for ( ; level<=l ; level++) if (score < EXP[level-1]) break;
	return level;
};
