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

		$("#db-en-theme").hide();
		$("#noinj-en-theme").hide();
	
		$("#db-lang").on('change', function(){
			if($("#db-lang").val() == 'ko') {
				$("#db-ko-theme").show();
				$("#noinj-ko-theme").show();
				$("#db-en-theme").hide();
				$("#noinj-en-theme").hide();
			}else{
				$("#db-en-theme").show();
				$("#noinj-en-theme").show();
				$("#db-ko-theme").hide();
				$("#noinj-ko-theme").hide();
			}
		});

	// 끄투 DB에 단어 추가하기
		$("#db-ok").on('click', function(e){
			var forView = $("#db-search").is(':checked');
			var dLang = $("#db-lang").val();
			var th = $("#db-" + dLang + "-theme").val() === undefined ? $("#db-ko-theme").val() : $("#db-" + dLang + "-theme").val();
			if(!th) return alert('올바르지 않은 요청입니다.');

			if(forView){
				$("#db-list").val("");
				$.get("/kpanel/kkututheme?theme=" + th + "&lang=" + dLang, function(res){
					$("#db-list").val(res.list.join('\n'));
				});
			}else{
				$.post("/kpanel/kkutudb", {
					pw: $("#db-password").val(),
					lang: dLang,
					theme: th,
					list: $("#db-list").val()
				}, function(res){
					alert(res);
				});
			}
		});
	// 비 어인정 단어 추가하기
		$("#noinj-ok").on('click', function(e){
			var forView = $("#noinj-search").is(':checked');
			var dLang = $("#db-lang").val();
			var th = $("#noinj-" + dLang + "-theme").val() === undefined ? $("#noinj-ko-theme").val() : $("#noinj-" + dLang + "-theme").val();
			var flag = $("#noinj-flag").val();
			var pum = $("#noinj-pum").val();
			if(!th || !flag || !pum) return alert('올바르지 않은 요청입니다.');

			if(forView){
				$("#noinj-list").val("");
				$.get("/kpanel/kkututheme?theme=" + th + "&lang=" + dLang, function(res){
					$("#noinj-list").val(res.list.join('\n'));
				});
			}else{
				$.post("/kpanel/noinj", {
					pw: $("#db-password").val(),
					lang: dLang,
					flag: flag,
					theme: th,
					list: $("#noinj-list").val(),
					pum: pum
				}, function(res){
					alert(res);
				});
			}
		});
	// 끄투 DB 다루기
		$("#db-go").on('click', function(e){
			$.get("/kpanel/kkutudb/" + $("#db-word").val() + "?lang=" + $("#db-lang").val(), function(res){
				var $table = $("#wd-data").empty();
				var types = res.type ? res.type.split(',') : [];
				var themes = res.theme ? res.theme.split(',') : [];
				var means = res.mean ? res.mean.split(/＂[0-9]+＂/).slice(1).map(function(m1){
					return (m1.indexOf("［") == -1) ? [[ m1 ]] : m1.split(/［[0-9]+］/).slice(1).map(function(m2){
						return m2.split(/（[0-9]+）/).slice(1);
					});
				}) : [[[]]];
				
				$("#wd-flag").val(res.flag);
				means.forEach(function(m1, x1){
					m1.forEach(function(m2, x2){
						var type = types.shift();
						var theme;
						
						m2.forEach(function(m3, x3){
							theme = themes.shift();
							$table.append($("<tr>").attr('id', ['wr', x1, x2, x3].join('-'))
								.append($("<td>").html([x1, x2, x3].join('-')))
								.append($("<td>").append(wrPutter(x1, x2, x3, 'y', type)))
								.append($("<td>").append(wrPutter(x1, x2, x3, 't', theme)))
								.append($("<td>").append(wrPutter(x1, x2, x3, 'm', m3)))
								.append(actionTd(x1, x2, x3))
							);
						});
					});
				});
			});
		});
		$("#word-add").on('click', function(e){
			var key = prompt('key (-로 구분)');
			
			if(!key) return;
			key = key.split('-');
			$("#wd-data").append($("<tr>").attr('id', ['wr', key[0], key[1], key[2]].join('-'))
				.append($("<td>").html([key[0], key[1], key[2]].join('-')))
				.append($("<td>").append(wrPutter(key[0], key[1], key[2], 'y', "")))
				.append($("<td>").append(wrPutter(key[0], key[1], key[2], 't', "")))
				.append($("<td>").append(wrPutter(key[0], key[1], key[2], 'm', "")))
				.append(actionTd(key[0], key[1], key[2]))
			);
		});
		$("#db-apply").on('click', function(e){
			var obj = {
				_id: $("#db-word").val(),
				flag: $("#wd-flag").val(),
				type: [], theme: [], mean: []
			};
			var pvt = false;
			
			$("#wd-data tr").each(function(i, o){
				var $o = $(o);
				var key = $o.children("td").first().html().split('-');
				var tk = key[0]+'-'+key[1];
				var data = {
					type: $("#word-"+[key[0],key[1],key[2],'y'].join('-')).val(),
					theme: $("#word-"+[key[0],key[1],key[2],'t'].join('-')).val(),
					mean: $("#word-"+[key[0],key[1],key[2],'m'].join('-')).val()
				};
				if(pvt != tk){
					obj.type.push(data.type);
					pvt = tk;
				}
				obj.theme.push(data.theme);
				if(!obj.mean[key[0]]) obj.mean[key[0]] = [];
				if(!obj.mean[key[0]][key[1]]) obj.mean[key[0]][key[1]] = [];
				obj.mean[key[0]][key[1]][key[2]] = data.mean;
			});
			obj.type = obj.type.join(',');
			obj.theme = obj.theme.join(',');
			obj.mean = obj.mean.map(function(m1, x1){
				if($("#db-lang").val() == "ko") return "＂" + (x1 + 1) + "＂" + m1.map(function(m2, x2){
					return "［" + (x2 + 1) + "］" + m2.map(function(m3, x3){
						return "（" + (x3 + 1) + "）" + m3;
					}).join('');
				}).join('');
				else return "＂" + (x1 + 1) + "＂" + m1;
			}).join('');
			
			$.post("/kpanel/kkutudb/" + $("#db-word").val(), {
				pw: $("#db-password").val(),
				lang: $("#db-lang").val(),
				data: JSON.stringify(obj)
			}, function(res){
				alert(res);
			});
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