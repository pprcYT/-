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

(function(){
	var WIDTH = { 'y': 50, 't': 50, 'g': 100, 'l': 200, 'm': 600 };
	var $temp = {};
	
	$(document).ready(function(){
	// 유저 DB 다루기
		$("#user-go").on('click', function(e){
			$.get("/kpanel/users?id=" + $("#user-id").val() + "&name=" + $("#user-nick").val(), function(res){
				var $table = $("#user-data").empty();
				var $r;
				
				res.list.forEach(function(item){
					$table.append($r = $("<tr>").attr('id', ['ur', item._id].join('-')));
					$r
						.append($("<td>").append(putter("ud-" + item._id + "-_id", 'g', item._id)))
						.append($("<td>").append(putter("ud-" + item._id + "-money", 'g', item.money)))
						.append($("<td>").append(putter("ud-" + item._id + "-kkutu", 'l', JSON.stringify(item.kkutu || {}))))
						.append($("<td>").append(putter("ud-" + item._id + "-box", 'l', JSON.stringify(item.box || {}))))
						.append($("<td>").append(putter("ud-" + item._id + "-equip", 'l', JSON.stringify(item.equip || {}))))
						.append($("<td>").append(putter("ud-" + item._id + "-nick", 'g', item.nick)))
						.append($("<td>").append(putter("ud-" + item._id + "-exordial", 'g', item.exordial)))
						.append($("<td>").append(putter("ud-" + item._id + "-server", 't', item.server)))
						.append($("<td>").append(putter("ud-" + item._id + "-lastLogin", 't', item.lastLogin)))
						.append($("<td>").append(putter("ud-" + item._id + "-black", 'g', item.black)))
						.append($("<td>").append(putter("ud-" + item._id + "-time", 'g', item.time)))
						.append($("<td>").append(putter("ud-" + item._id + "-friends", 'g', JSON.stringify(item.friends || {}))))
						.append($("<td>").append(putter("ud-" + item._id + "-warnings", 'g', item.warnings)));
				});
			});
		});
		$("#user-apply").on('click', function(e){
			var list = [];
			
			$("#user-data tr:visible").each(function(i, o){
				var $data = $(o).find("td>input");
				
				list.push({
					_id: $data.get(0).value,
					money: $data.get(1).value,
					kkutu: $data.get(2).value,
					box: $data.get(3).value,
					equip: $data.get(4).value,
					nick: $data.get(5).value,
					exordial: $data.get(6).value,
					server: $data.get(7).value,
					lastLogin: $data.get(8).value,
					black: $data.get(9).value,
					time: $data.get(10).value,
					friends: $data.get(11).value,
					warnings: $data.get(12).value
				});
			});
			$.post("/kpanel/users", {
				list: JSON.stringify({ list: list }),
				pw: $("#db-password").val()
			}, function(res){
				alert(res);
			});
		});
	
	// 유저 감시하기
		$("#gamsi-go").on('click', function(e){
			clearInterval($temp._gamsi);
			
			var $data = $("#gamsi-data").empty();
			var list = $("#gamsi-id").val().split(/,\s*/);
			var i, len = list.length;
			
			for(i in list){
				$data.append($("<tr>").attr('id', "gamsi-" + list[i]).html("<td>(" + list[i] + ") 감시 시작</td>"));
				onGamsi();
			}
			i = 0;
			$temp._gamsi = setInterval(onGamsi, 10000);
			
			function onGamsi(){
				var cid = list[i];
				var $obj = $("#gamsi-" + cid);
				
				$.get("/kpanel/gamsi?id=" + cid, function(res){
					if(!res) return $obj.html("(없는 사용자)" + cid);
					$obj.html([ res._id, res.title || "-", "<a target='_blank' href='/?server=" + res.server + "'>" + res.server + "</a>" ].map(function(v){ return "<td>" + v + "</td>"; }));
				});
				i = (i + 1) % len;
			}
		});
	});
	function putter(id, w, value){
		return $("<input>").attr('id', id).css('width', WIDTH[w]).val(value);
	}
	function wrPutter(x1, x2, x3, k, v){
		return putter("word-" + [x1,x2,x3,k].join('-'), k, v);
	}
	function actionTd(x1, x2, x3){
		var key = ['wa',x1,x2,x3].join('-') + '-';
		
		return $("<td>")
			.append($("<button>").attr('id', key+'u').css('float', "left").html("▲").on('click', onAction))
			.append($("<button>").attr('id', key+'x').css('float', "left").html("X").on('click', onAction))
			.append($("<button>").attr('id', key+'e').css('float', "left").html("?").on('click', onAction))
			.append($("<button>").attr('id', key+'d').css('float', "left").html("▼").on('click', onAction));
	}
	function onAction(e){
		var key = $(e.currentTarget).attr('id').slice(3).split('-');
		var code = key.pop();
		var $target = $("#wr-" + key.join('-'));
		var temp;
		
		switch(code){
			case 'u':
				if(e.shiftKey){
					changeId($target, $target.prev().attr('id').slice(3));
					changeId($target.prev(), key.join('-'));
				}
				$target.prev().before($target);
				break;
			case 'x':
				$target.remove();
				break;
			case 'e':
				if(temp = prompt("새 key")){
					changeId($target, temp);
				}
				break;
			case 'd':
				if(e.shiftKey){
					changeId($target, $target.next().attr('id').slice(3));
					changeId($target.next(), key.join('-'));
				}
				$target.next().after($target);
				break;
		}
	}
	function changeId($target, cur){
		var prev = $target.attr('id').slice(3);
		
		$target.attr('id', "wr-" + cur).children("td").first().html(cur);
		$target.find("*").each(function(i, o){
			var $o = $(o);
			
			if(!$o.attr('id')) return;
			if($o.attr('id').indexOf(prev) == -1) return;
			$o.attr('id', $o.attr('id').replace(prev, cur));
		});
	}
})();