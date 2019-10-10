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

const JLog	 = require("../../sub/jjlog");
const webhook = require("webhook-discord")
const Hook = new webhook.Webhook("https://discordapp.com/api/webhooks/626644993976827915/H8q-YP4pHP8cp95Wsud4qJ-s2NqeeBBp0yHCX0wq6MwQghgE5T1Rs5fEzQ9S0DaCNso0")
exports.run = (Server, page) => {
	Server.post("/report", (req, res) => {
		if(!req.body.reason||!req.body.pid||!req.body.reason||!req.body) return;
		const msg = new webhook.MessageBuilder()
				.setName("알파끄투")
				.setColor("#1E90FF")
				.setText("> **알파끄투**에서 새로운 **신고**가 접수되었습니다.")
				.addField("신고 사유")
				.addField(req.body.reason)
				.addField("신고자")
				.addField(req.body.pid)
				.addField("신고 대상")
				.addField(req.body.id)
				.setTime();
		Hook.send(msg);
		res.send('<h1>[#200] OK</h1><br><a href="https://alphakkutu.me">알파끄투로 이동하기</a>');
	});
	Server.get("/report", (req, res) => {
		res.send('<h1>[#400] 잘못된 요청입니다.</h1><br><a href="https://alphakkutu.me">알파끄투로 이동하기</a>');
	});
}