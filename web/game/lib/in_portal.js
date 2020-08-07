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
	var $stage;
	var LIMIT = 400;
	var LIST;
	var mobile = $("#mobile").html() == "true";
	$(document).ready(function(){
		$stage = {
			list: $("#server-list"),
			total: $("#server-total"),
			start: $("#game-start"),
			ref: $("#server-refresh"),
			refi: $("#server-refresh>i")
		};

		$("#Background").attr('src', "").addClass("jt-image").css({
			'background-image': "url(https://cdn.kkutu.xyz/img/kkutu/kkutudotnet.png)",
			'background-size': "200px 200px"
		});
		$stage.start.prop('disabled', true).on('click', function(e){
			var i, j;

			if($("#account-info").html() === L['LOGIN']){
				return $("#server-0").trigger('click');
			}
			for(i=0.9; i<1; i+=0.01){
				for(j in LIST){
					if(LIST[j] < i * LIMIT){
						$("#server-" + j).trigger('click');
						return;
					}
				}
			}
		});
		$stage.ref.on('click', function(e){
			if($stage.refi.hasClass("kd-spin")) return;
			$stage.refi.addClass("kd-spin");
			setTimeout(seekServers, 3000);
		});
		setInterval(function(){
			$stage.ref.trigger('click');
		}, 60000);
		seekServers();
	});
	function seekServers(){
		$.get("/servers", function(data){
			var sum = 0;

			$stage.list.empty();
			LIST = data.list;
			data.list.forEach(function(v, i){
				var status = (v === null) ? "x" : "g";
				var people = (status == "x") ? "0 / 400" : (v + " / " + LIMIT);
				var limp = v / LIMIT * 100;
				var $e;

				sum += v || 0;
				if(status == "g"){
					if(limp >= 80) status = "q";
					else if(limp >= 60) status = "p";
					else if(limp >= 40) status = "o";
				}
				$stage.list.append($e = $("<div>").addClass("server").attr('id', "server-" + i)
					.append($("<div>").addClass("server-status ss-" + status))
					.append($("<div>").addClass("server-name").html('<b>' + L['server_' + i] + '</b> 채널입장'))
					.append($("<div>").addClass("server-stats st-" + status).html('<b>' + people + '</b> ' + L['ss_' + status]))
				);
				if (status != "x") $e.on('click', function (e) {
					location.href = "/?server=" + i;
				}); else $e.children(".server-enter").html("-");
			});
			$stage.total.html("&nbsp;▼ " + sum + "명 접속 중");
			$stage.refi.removeClass("kd-spin");
			$stage.start.prop('disabled', false);
		});
	}
})();