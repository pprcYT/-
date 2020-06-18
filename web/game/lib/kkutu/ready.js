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
$(document).ready(function() {
	var i;
	$data.PUBLIC = $("#PUBLIC").html() == "true";
	$data.URL = $("#URL").html();
	$data.version = $("#version").html();
	$data.server = location.href.match(/\?.*server=(\d+)/)[1];
	$data.shop = {};
	$data._okg = 0;
	$data._playTime = 0;
	$data._kd = "";
	$data._timers = [];
	$data._obtain = [];
	$data._wblock = {};
	$data._shut = {};
	$data.usersR = {};
	EXP.push(getRequiredScore(1));
	for (i = 2; i < MAX_LEVEL; i++) {
		EXP.push(EXP[i - 2] + getRequiredScore(i));
	}
	EXP[MAX_LEVEL - 1] = Infinity;
	EXP.push(Infinity);
	$stage = {
		loading: $("#Loading"),
		lobby: {
			userListTitle: $(".UserListBox .product-title"),
			userList: $(".UserListBox .product-body"),
			roomListTitle: $(".RoomListBox .product-title"),
			// roomSortTitle: {
			// roomRefreshTitle: $(".RoomRefreshTitle .product-title"),
			// roomSortTitle: $(".RoomSortTitle .product-title"),
			// },
			roomList: $(".RoomListBox .product-body"),
			createBanner: $("<div>").addClass("rooms-item rooms-create").append($("<div>").html(L['newRoom']))
		},
		chat: $("#Chat"),
		chatLog: $("#chat-log-board"),
		talk: $("#Talk"),
		chatBtn: $("#ChatBtn"),
		menu: {
			refresh: $("#RefreshBtn"),
			help: $("#HelpBtn"),
			bulletin: $("#BulletinBtn"),
			setting: $("#SettingBtn"),
			community: $("#CommunityBtn"),
			newRoom: $("#NewRoomBtn"),
			setRoom: $("#SetRoomBtn"),
			quickRoom: $("#QuickRoomBtn"),
			spectate: $("#SpectateBtn"),
			shop: $("#ShopBtn"),
			dict: $("#DictionaryBtn"),
			wordPlus: $("#WordPlusBtn"),
			invite: $("#InviteBtn"),
			practice: $("#PracticeBtn"),
			ready: $("#ReadyBtn"),
			start: $("#StartBtn"),
			exit: $("#ExitBtn"),
			notice: $("#NoticeBtn"),
			replay: $("#ReplayBtn"),
			leaderboard: $("#LeaderboardBtn"),
			user: $("#UserBtn"),
			userList: $("#UserListBtn"),
		},
		dialog: {
			setting: $("#SettingDiag"),
			settingServer: $("#setting-server"),
			settingOK: $("#setting-ok"),
			community: $("#CommunityDiag"),
			commFriends: $("#comm-friends"),
			commFriendAdd: $("#comm-friend-add"),
			room: $("#RoomDiag"),
			roomOK: $("#room-ok"),
			quick: $("#QuickDiag"),
			quickOK: $("#quick-ok"),
			result: $("#ResultDiag"),
			resultOK: $("#result-ok"),
			resultSave: $("#result-save"),
			practice: $("#PracticeDiag"),
			practiceOK: $("#practice-ok"),
			dict: $("#DictionaryDiag"),
			dictInjeong: $("#dict-injeong"),
			dictSearch: $("#dict-search"),
			wordPlus: $("#WordPlusDiag"),
			wordPlusOK: $("#wp-ok"),
			invite: $("#InviteDiag"),
			inviteList: $(".invite-board"),
			inviteRobot: $("#invite-robot"),
			roomInfo: $("#RoomInfoDiag"),
			roomInfoJoin: $("#room-info-join"),
			profile: $("#ProfileDiag"),
			profileShut: $("#profile-shut"),
			profileHandover: $("#profile-handover"),
			profileKick: $("#profile-kick"),
			profileReport: $("#profile-report"),
			profileCopy: $("#profile-copy"),
			profileLevel: $("#profile-level"),
			profileDress: $("#profile-dress"),
			profileWhisper: $("#profile-whisper"),
			report: $("#ReportDialog"),
			reportOK: $("#report-ok"),
			newnick: $("#NewNickDialog"),
			newnickOK: $("#newnick-ok"),
			kickVote: $("#KickVoteDiag"),
			kickVoteY: $("#kick-vote-yes"),
			kickVoteN: $("#kick-vote-no"),
			purchase: $("#PurchaseDiag"),
			purchaseOK: $("#purchase-ok"),
			purchaseNO: $("#purchase-no"),
			replay: $("#ReplayDiag"),
			replayView: $("#replay-view"),
			leaderboard: $("#LeaderboardDiag"),
			lbTable: $("#ranking tbody"),
			lbPage: $("#lb-page"),
			lbNext: $("#lb-next"),
			lbMe: $("#lb-me"),
			lbPrev: $("#lb-prev"),
			dress: $("#DressDiag"),
			dressOK: $("#dress-ok"),
			charFactory: $("#CharFactoryDiag"),
			cfCompose: $("#cf-compose"),
			injPick: $("#InjPickDiag"),
			injPickAll: $("#injpick-all"),
			injPickNo: $("#injpick-no"),
			injPickOK: $("#injpick-ok"),
			chatLog: $("#ChatLogDiag"),
			obtain: $("#ObtainDiag"),
			obtainOK: $("#obtain-ok"),
			help: $("#HelpDiag"),
			bulletin: $("#BulletinDiag"),
			notice: $("#NoticeDiag"),
			noticeOK: $("notice-ok"),
			user: $("#UserDiag"),
			message: $("#MsgDiag"),
			messageOv: $("#MsgDiagOv"),
			ask: $("#AskDiag"),
			blocked: $("#BlockedDiag"),
			password: $("#PasswordDiag"),
			whichhand: $("#WhichHandDiag"),
			selectItem: $("#SelectItemDiag")
		},
		box: {
			chat: $(".ChatBox"),
			userList: $(".UserListBox"),
			roomList: $(".RoomListBox"),
			// roomSort: {
			// roomRefresh: $(".RoomRefreshBox"),
			// roomSort: $(".RoomSortBox"),
			// },
			shop: $(".ShopBox"),
			room: $(".RoomBox"),
			game: $(".GameBox"),
			me: $(".MeBox")
		},
		game: {
			display: $(".jjo-display"),
			hints: $(".GameBox .hints"),
			tools: $('.GameBox .tools'),
			drawingTitle: $('#drawing-title'),
			themeisTitle: $('#themeis-title'),
			cwcmd: $(".GameBox .cwcmd"),
			bb: $(".GameBox .bb"),
			items: $(".GameBox .items"),
			chain: $(".GameBox .chain"),
			round: $(".rounds"),
			here: $(".game-input").hide(),
			hereText: $("#game-input"),
			history: $(".history"),
			roundBar: $(".jjo-round-time .graph-bar"),
			turnBar: $(".jjo-turn-time .graph-bar")
		},
		yell: $("#Yell").hide(),
		balloons: $("#Balloons")
	};

	if (_WebSocket == undefined) {
		loading(L['websocketUnsupport']);
		akAlert(L['websocketUnsupport']);
		return;
	}
	$data.opts = $.cookie('kks');
	if ($data.opts) {
		applyOptions(JSON.parse($data.opts), true);
	} else {
		applyOptions([], true);
	}

	$data.opts.istheme = $data.opts.tm === undefined ? true : $data.opts.tm;
	if ($data.opts.istheme) {
		$("#Background").attr('src', "").addClass("jt-image").css({
			'background-image': "url(https://cdn.jsdelivr.net/npm/kkutudotnet@latest/img/kkutu/alphakkutu.png)",
			'background-size': "200px 200px"
		});
	}

	$data.selectedBGM = $data.opts.sb === undefined ? "start" : $data.opts.sb;
	$data.selectedLobbyBGM = $data.opts.so === undefined ? "start" : $data.opts.so;

	$data.loadedBGM = $data.selectedBGM;
	$data.loadedLobbyBGM = $data.selectedLobbyBGM;

	$data._soundList = function() {
		var res = [{
				key: "k",
				value: "https://cdn.jsdelivr.net/npm/kkutudotnet@latest/media/" + $data.selectedBGM + "/k.mp3?v=" + L['version']
			},
			{
				key: "lobby",
				value: "https://cdn.jsdelivr.net/npm/kkutudotnet@latest/media/" + $data.selectedLobbyBGM + "/LobbyBGM.mp3?v=" + L['version']
			},
			{
				key: "jaqwi",
				value: "https://cdn.jsdelivr.net/npm/kkutudotnet@latest/media/" + $data.selectedBGM + "/JaqwiBGM.mp3?v=" + L['version']
			},
			{
				key: "jaqwiF",
				value: "https://cdn.jsdelivr.net/npm/kkutudotnet@latest/media/" + $data.selectedBGM + "/JaqwiFastBGM.mp3?v=" + L['version']
			},
			{
				key: "game_start",
				value: "https://cdn.jsdelivr.net/npm/kkutudotnet@latest/media/" + $data.selectedBGM + "/game_start.mp3?v=" + L['version']
			},
			{
				key: "round_start",
				value: "https://cdn.jsdelivr.net/npm/kkutudotnet@latest/media/" + $data.selectedBGM + "/round_start.mp3?v=" + L['version']
			},
			{
				key: "fail",
				value: "https://cdn.jsdelivr.net/npm/kkutudotnet@latest/media/" + $data.selectedBGM + "/fail.mp3?v=" + L['version']
			},
			{
				key: "timeout",
				value: "https://cdn.jsdelivr.net/npm/kkutudotnet@latest/media/" + $data.selectedBGM + "/timeout.mp3?v=" + L['version']
			},
			{
				key: "lvup",
				value: "https://cdn.jsdelivr.net/npm/kkutudotnet@latest/media/" + $data.selectedBGM + "/lvup.mp3?v=" + L['version']
			},
			{
				key: "Al",
				value: "https://cdn.jsdelivr.net/npm/kkutudotnet@latest/media/" + $data.selectedBGM + "/Al.mp3?v=" + L['version']
			},
			{
				key: "success",
				value: "https://cdn.jsdelivr.net/npm/kkutudotnet@latest/media/" + $data.selectedBGM + "/success.mp3?v=" + L['version']
			},
			{
				key: "missing",
				value: "https://cdn.jsdelivr.net/npm/kkutudotnet@latest/media/" + $data.selectedBGM + "/missing.mp3?v=" + L['version']
			},
			{
				key: "mission",
				value: "https://cdn.jsdelivr.net/npm/kkutudotnet@latest/media/" + $data.selectedBGM + "/mission.mp3?v=" + L['version']
			},
			{
				key: "kung",
				value: "https://cdn.jsdelivr.net/npm/kkutudotnet@latest/media/" + $data.selectedBGM + "/kung.mp3?v=" + L['version']
			},
			{
				key: "horr",
				value: "https://cdn.jsdelivr.net/npm/kkutudotnet@latest/media/" + $data.selectedBGM + "/horr.mp3?v=" + L['version']
			},
		];
		for (i = 0; i <= 10; i++) res.push({
			key: "T" + i,
			value: "https://cdn.jsdelivr.net/npm/kkutudotnet@latest/media/" + $data.selectedBGM + "/T" + i + ".mp3?v=" + L['version']
		}, {
			key: "K" + i,
			value: "https://cdn.jsdelivr.net/npm/kkutudotnet@latest/media/" + $data.selectedBGM + "/K" + i + ".mp3?v=" + L['version']
		}, {
			key: "As" + i,
			value: "https://cdn.jsdelivr.net/npm/kkutudotnet@latest/media/" + $data.selectedBGM + "/As" + i + ".mp3?v=" + L['version']
		});
		return res;
	}
	loadSounds($data._soundList(), function() {
		processShop(connect);
	});
	akAlert = function(msg, isOv, timeout) {
		if(isOv) var o = $stage.dialog.messageOv;
		else var o = $stage.dialog.message;

		var ov = $('#msg-overlay');

		if (o.data('callback')) {
			o.data('callback')(false);
			o.data({});
		}
		o.find('#msg-ok').off('click').click(function(e) {
			o.hide();
			ov.hide();
		});
		o.find('#msg-no').off('click').click(function(e) {
			o.hide();
			ov.hide();
		});
		if (isOv) ov.show();
		o.find('#msg-no').hide();
		o.find('#msg-content').html(msg);
		showDialog(o);
		if (timeout) setTimeout(function() {
			o.hide();
		}, timeout);
	};
	akConfirm = function(msg2, call, isOv) {
		if(isOv) var o = $stage.dialog.messageOv;
		else var o = $stage.dialog.message;
		
		var ov = $('#msg-overlay');

		if (o.data('callback')) {
			o.data('callback')(false);
			o.data({});
		}
		o.data({
			callback: call
		});
		o.find('#msg-ok').off('click').click(function(e) {
			o.hide();
			ov.hide();
			if (o.data('callback')) {
				o.data('callback')(true);
				o.data({});
			}
		});
		o.find('#msg-no').off('click').click(function(e) {
			o.hide();
			ov.hide();
			if (o.data('callback')) {
				o.data('callback')(false);
				o.data({});
			}
		});
		if (isOv) ov.show();
		o.find('#msg-no').show();
		o.find('#msg-content').html(msg2);
		showDialog(o);
	};
	akPrompt = function(msg2, call) {
		var o = $stage.dialog.ask;
		if (o.data('callback')) {
			o.data('callback')(false);
			o.data({});
		}
		o.data({
			callback: call
		});
		o.find('#ask-ok').off('click').click(function(e) {
			o.hide();
			var text = $("#ask-input").val();
			$('#ask-input').val('');
			text = text !== undefined ? text.trim() : "";
			if (o.data('callback')) {
				o.data('callback')(text);
				o.data({});
			}
		});
		o.find('#ask-no').off('click').click(function(e) {
			o.hide();
			$('#ask-input').val('');
			if (o.data('callback')) {
				o.data('callback')(false);
				o.data({});
			}
		});
		o.find('#ask-no').show();
		o.find('#ask-content').html(msg2);
		showDialog(o);
	};
	akPrompt.whichHand = function(msg2, call) {
		var o = $stage.dialog.whichhand;
		if (o.data('callback')) {
			o.data('callback')(false);
			o.data({});
		}
		o.data({
			callback: call
		});
		o.find('#hand-left').off('click').click(function(e) {
			o.hide();
			if (o.data('callback')) {
				o.data('callback')('left');
				o.data({});
			}
		});
		o.find('#hand-right').off('click').click(function(e) {
			o.hide();
			if (o.data('callback')) {
				o.data('callback')('right');
				o.data({});
			}
		});
		o.find('#hand-no').off('click').click(function(e) {
			o.hide();
			if (o.data('callback')) {
				o.data('callback')(false);
				o.data({});
			}
		});
		o.find('#hand-no').show();
		o.find('#hand-content').html(msg2);
		showDialog(o);
	};
	akPrompt.password = function(msg2, call) {
		var o = $stage.dialog.password;
		if (o.data('callback')) {
			o.data('callback')(false);
			o.data({});
		}
		o.data({
			callback: call
		});
		o.find('#password-ok').off('click').click(function(e) {
			o.hide();
			var text = $("#password-input").val();
			$('#password-input').val('');
			text = text !== undefined ? text.trim() : "";
			if (o.data('callback')) {
				o.data('callback')(text);
				o.data({});
			}
		});
		o.find('#password-no').off('click').click(function(e) {
			o.hide();
			$('#password-input').val('');
			if (o.data('callback')) {
				o.data('callback')(false);
				o.data({});
			}
		});
		o.find('#password-no').show();
		o.find('#password-content').html(msg2);
		showDialog(o);
	};
	akPrompt.item = function(type) {
		var o = $stage.dialog.selectItem;
		var ov = $('#msg-overlay');
		o.find('#item-skip').off('click').click(function() {
			o.hide();
			ov.hide();
			send(type, { item: "skip" });
		});
		o.find('#item-reverse').off('click').click(function() {
			o.hide();
			ov.hide();
			send(type, { item: "reverse" });
		});
		o.find('#item-random').off('click').click(function() {
			o.hide();
			ov.hide();
			send(type, { item: "random" });
		});
		ov.show();
		showDialog(o);
	};
	$(window).bind("beforeunload", function(e) {
		return "정말로 게임을 중단하고 나가시겠습니까?";
	});
	MOREMI_PART = $("#MOREMI_PART").html().split(',');
	AVAIL_EQUIP = $("#AVAIL_EQUIP").html().split(',');
	RULE = JSON.parse($("#RULE").html());
	OPTIONS = JSON.parse($("#OPTIONS").html());
	MODE = Object.keys(RULE);
	mobile = $("#mobile").html() == "true";
	if (mobile) TICK = 200;
	$data._timePercent = false ? function() {
		return $data._turnTime / $data.turnTime * 100 + "%";
	} : function() {
		var pos = $data._turnSound.audio ? $data._turnSound.audio.currentTime : (audioContext.currentTime - $data._turnSound.startedAt);

		return (100 - pos / $data.turnTime * 100000) + "%";
	};
	$data.setRoom = function(id, data) {
		var isLobby = getOnly() == "for-lobby";

		if (data == null) {
			delete $data.rooms[id];
			if (isLobby) $("#room-" + id).remove();
		} else {
			// $data.rooms[id] = data;
			if (isLobby && !$data.rooms[id]) $stage.lobby.roomList.append($("<div>").attr('id', "room-" + id));
			$data.rooms[id] = data;
			if (isLobby) $("#room-" + id).replaceWith(roomListBar(data));
		}
		// updateRoomList();
	};
	$data.setUser = function(id, data) {
		var only = getOnly();
		var needed = only == "for-lobby" || only == "for-master";
		var $obj;

		if ($data._replay) {
			$rec.users[id] = data;
			return;
		}
		if (data == null) {
			delete $data.users[id];
			if (needed) $("#users-item-" + id + ",#invite-item-" + id).remove();
		} else {
			if (needed && !$data.users[id]) {
				$obj = userListBar(data, only == "for-master");

				if (only == "for-master") $stage.dialog.inviteList.append($obj);
				else $stage.lobby.userList.append($obj);
			}
			$data.users[id] = data;
			if (needed) {
				if ($obj) $("#" + $obj.attr('id')).replaceWith($obj);
				else $("#" + ((only == "for-lobby") ? "users-item-" : "invite-item") + id).replaceWith(userListBar(data, only == "for-master"));
			}
		}
	};
	// 객체 설정
	/*addTimeout(function(){
		$("#intro-start").hide();
		$("#intro").show();
	}, 1400);*/
	$("#Talk").emojionePicker({
		pickerTop: 12,
		pickerRight: -21,
		type: "unicode",
	});
	$(document).on('paste', function(e) {
		if ($data.room)
			if ($data.room.gaming) {
				e.preventDefault();
				return false;
			}
	});
	$stage.talk.on('drop', function(e) {
		if ($data.room)
			if ($data.room.gaming) {
				e.preventDefault();
				return false;
			}
	});
	$(".dialog-head .dialog-title").on('mousedown', function(e) {
		var $pd = $(e.currentTarget).parents(".dialog");

		$(".dialog-front").removeClass("dialog-front");
		$pd.addClass("dialog-front");
		startDrag($pd, e.pageX, e.pageY);
	}).on('mouseup', function(e) {
		stopDrag();
	});
	// addInterval(checkInput, 1);
	$stage.chatBtn.on('click', function(e) {
		checkInput();

		var value = (mobile && $stage.game.here.is(':visible')) ?
			$stage.game.hereText.val() :
			$stage.talk.val();
		var o = {
			value: value
		};
		if (!value) return;
		if (o.value[0] == "/") {
			o.cmd = o.value.split(" ");
			runCommand(o.cmd);
		} else {
			if ($stage.game.here.is(":visible") || $data._relay) {
				o.relay = true;
			}
			send('talk', o);
		}
		if ($data._whisper) {
			$stage.talk.val("/e " + $data._whisper + " ");
			delete $data._whisper;
		} else {
			$stage.talk.val("");
		}
		$stage.game.hereText.val("");
	}).hotkey($stage.talk, 13).hotkey($stage.game.hereText, 13);
	$("#cw-q-input").on('keydown', function(e) {
		if (e.keyCode == 13) {
			var $target = $(e.currentTarget);
			var value = $target.val();
			var o = {
				relay: true,
				data: $data._sel,
				value: value
			};

			if (!value) return;
			send('talk', o);
			$target.val("");
		}
	}).on('focusout', function(e) {
		$(".cw-q-body").empty();
		$stage.game.cwcmd.css('opacity', 0);
	});
	$("#room-limit").on('change', function(e) {
		var $target = $(e.currentTarget);
		var value = $target.val();

		if (value < 2 || value > 8) {
			$target.css('color', "#FF4444");
		} else {
			$target.css('color', "");
		}
	});
	$("#room-time").on('change', function(e) {
		var $target = $(e.currentTarget);
		var value = $target.val();

		if (value < 1 || value > 300) {
			$target.css('color', "#FF4444");
		} else {
			$target.css('color', "");
		}
	});
	$("#room-round").on('change', function(e) {
		var $target = $(e.currentTarget);
		var value = $target.val();

		if (value < 1 || value > 10) {
			$target.css('color', "#FF4444");
		} else {
			$target.css('color', "");
		}
	});
	$stage.game.here.on('click', function(e) {
		mobile || $stage.talk.focus();
	});
	$stage.talk.on('keyup', function(e) {
		$stage.game.hereText.val($stage.talk.val());
	});
	$(window).on('beforeunload', function(e) {
		if ($data.room) return L['sureExit'];
	});

	function startDrag($diag, sx, sy) {
		var pos = $diag.position();
		$(window).on('mousemove', function(e) {
			var dx = e.pageX - sx,
				dy = e.pageY - sy;

			$diag.css('left', pos.left + dx);
			$diag.css('top', pos.top + dy);
		});
	}

	function stopDrag($diag) {
		$(window).off('mousemove');
	}
	$(".result-me-gauge .graph-bar").addClass("result-me-before-bar");
	$(".result-me-gauge")
		.append($("<div>").addClass("graph-bar result-me-current-bar"))
		.append($("<div>").addClass("graph-bar result-me-bonus-bar"));
	// 메뉴 버튼
	for (i in $stage.dialog) {
		if ($stage.dialog[i].children(".dialog-head").hasClass("no-close")) continue;

		$stage.dialog[i].children(".dialog-head").append($("<div>").addClass("closeBtn").on('click', function(e) {
			$(e.currentTarget).parent().parent().hide(); $("#msg-overlay").hide();
		}).hotkey(false, 27));
	}
	$stage.menu.refresh.on('click', function(e) {
		$stage.menu.refresh.addClass("toggled");
		// akAlert("<i class='fas fa-sync-alt'></i> 접속자, 게임방 목록을 새로고침 하였습니다.<br>", true);
		send('refresh');
		updateUI(undefined, true);
		$stage.menu.refresh.removeClass("toggled");
	});
	$stage.menu.help.on('click', function(e) {
		$("#help-board").attr('src', "/help");
		showDialog($stage.dialog.help);
	});
	$stage.menu.user.on('click', function(e) {
		$("#user-board").attr('src', "/user");
		showDialog($stage.dialog.user);
	});
	$stage.menu.bulletin.on('click', function(e) {
		$("#bulletin-board").attr('src', "/bulletin");
		showDialog($stage.dialog.bulletin);
	});
	$stage.menu.setting.on('click', function(e) {
		showDialog($stage.dialog.setting);
	});
	$stage.menu.community.on('click', function(e) {
		if ($data.guest) return fail(451);
		showDialog($stage.dialog.community);
	});
	$stage.dialog.commFriendAdd.on('click', function(e) {
		akPrompt(L['friendAddNotice'], function(c) {
			if (!c) return;
			if (!$data.users[c]) return fail(450);
			send('friendAdd', {
				target: c
			}, true);
		});
	});
	$stage.menu.newRoom.on('click', function(e) {
		var $d;

		$stage.dialog.quick.hide();

		$data.typeRoom = 'enter';
		showDialog($d = $stage.dialog.room);
		$d.find(".dialog-title").html(L['newRoom']);
	});
	$stage.menu.setRoom.on('click', function(e) {
		var $d;
		var rule = RULE[MODE[$data.room.mode]];
		var i, k;

		$data.typeRoom = 'setRoom';
		$("#room-title").val($data.room.title);
		$("#room-limit").val($data.room.limit);
		$("#room-mode").val($data.room.mode).trigger('change');
		$("#room-round").val($data.room.round);
		$("#room-time").val($data.room.time / rule.time);
		for (i in OPTIONS) {
			k = OPTIONS[i].name.toLowerCase();
			$("#room-" + k).attr('checked', $data.room.opts[k]);
		}
		$data._injpick = $data.room.opts.injpick;
		showDialog($d = $stage.dialog.room);
		$d.find(".dialog-title").html(L['setRoom']);
	});

	function updateGameOptions(opts, prefix) {
		var i, k;

		for (i in OPTIONS) {
			k = OPTIONS[i].name.toLowerCase();
			if (opts.indexOf(i) == -1) $("#" + prefix + "-" + k + "-panel").hide();
			else $("#" + prefix + "-" + k + "-panel").show();
		}
	}

	function getGameOptions(prefix) {
		var i, name, opts = {};

		for (i in OPTIONS) {
			name = OPTIONS[i].name.toLowerCase();

			if ($("#" + prefix + "-" + name).is(':checked')) opts[name] = true;
		}
		return opts;
	}

	function isRoomMatched(room, mode, opts, all) {
		var i;

		if (!all) {
			if (room.gaming) return false;
			if (room.password) return false;
			if (room.players.length >= room.limit) return false;
		}
		if (room.mode != mode) return false;
		for (i in opts)
			if (!room.opts[i]) return false;
		return true;
	}
	$("#quick-mode, #QuickDiag .game-option").on('change', function(e) {
		var val = $("#quick-mode").val();
		var ct = 0;
		var i, opts;

		if (e.currentTarget.id == "quick-mode") {
			$("#QuickDiag .game-option").prop('checked', false);
		}
		opts = getGameOptions('quick');
		updateGameOptions(RULE[MODE[val]].opts, 'quick');
		for (i in $data.rooms) {
			if (isRoomMatched($data.rooms[i], val, opts, true)) ct++;
		}
		$("#quick-status").html(L['quickStatus'] + " " + ct);
	});
	$stage.menu.quickRoom.on('click', function(e) {
		$stage.dialog.room.hide();
		showDialog($stage.dialog.quick);
		if ($stage.dialog.quick.is(':visible')) {
			$("#QuickDiag>.dialog-body").find("*").prop('disabled', false);
			$("#quick-mode").trigger('change');
			$("#quick-queue").html("");
			$stage.dialog.quickOK.removeClass("searching").html(L['OK']);
		}
	});
	$stage.dialog.quickOK.on('click', function(e) {
		var mode = $("#quick-mode").val();
		var opts = getGameOptions('quick');

		if (getOnly() != "for-lobby") return;
		if ($stage.dialog.quickOK.hasClass("searching")) {
			$stage.dialog.quick.hide();
			quickTick();
			$stage.menu.quickRoom.trigger('click');
			return;
		}
		$("#QuickDiag>.dialog-body").find("*").prop('disabled', true);
		$stage.dialog.quickOK.addClass("searching").html("<i class='fa fa-spinner fa-spin'></i> " + L['NO']).prop('disabled', false);
		$data._quickn = 0;
		$data._quickT = addInterval(quickTick, 1000);

		function quickTick() {
			var i, arr = [];

			if (!$stage.dialog.quick.is(':visible')) {
				clearTimeout($data._quickT);
				return;
			}
			$("#quick-queue").html(L['quickQueue'] + " " + prettyTime($data._quickn++ * 1000));
			for (i in $data.rooms) {
				if (isRoomMatched($data.rooms[i], mode, opts)) arr.push(i);
			}
			if (arr.length) {
				i = arr[Math.floor(Math.random() * arr.length)];
				$data._preQuick = true;
				$("#room-" + i).trigger('click');
			}
		}
	});
	$("#room-mode").on('change', function(e) {
		var v = $("#room-mode").val();
		var rule = RULE[MODE[v]];
		$("#game-mode-expl").html(L['modex' + v]);

		updateGameOptions(rule.opts, 'room');

		$data._injpick = [];
		if (rule.opts.indexOf("ijp") != -1) $("#room-injpick-panel").show();
		else $("#room-injpick-panel").hide();
		if (rule.rule == "Typing") $("#room-round").val(3);
		$("#room-time").children("option").each(function(i, o) {
			$(o).html(Number($(o).val()) * rule.time + L['SECOND']);
		});
	}).trigger('change');
	$stage.menu.spectate.on('click', function(e) {
		var mode = $stage.menu.spectate.hasClass("toggled");

		if (mode) {
			send('form', {
				mode: "J"
			});
			$stage.menu.spectate.removeClass("toggled");
		} else {
			send('form', {
				mode: "S"
			});
			$stage.menu.spectate.addClass("toggled");
		}
	});
	$stage.menu.shop.on('click', function(e) {
		if ($data._shop = !$data._shop) {
			loadShop();
			$stage.menu.shop.addClass("toggled");
		} else {
			$stage.menu.shop.removeClass("toggled");
		}
		updateUI();
	});
	$(".shop-type").on('click', function(e) {
		var $target = $(e.currentTarget);
		var type = $target.attr('id').slice(10);

		$(".shop-type.selected").removeClass("selected");
		$target.addClass("selected");

		filterShop(type == 'all' || $target.attr('value'));
	});
	$stage.menu.dict.on('click', function(e) {
		showDialog($stage.dialog.dict);
	});
	$stage.menu.wordPlus.on('click', function(e) {
		showDialog($stage.dialog.wordPlus);
	});
	$stage.menu.invite.on('click', function(e) {
		showDialog($stage.dialog.invite);
		updateUserList(true);
	});
	$stage.menu.practice.on('click', function(e) {
		if (RULE[MODE[$data.room.mode]].ai) {
			$("#PracticeDiag .dialog-title").html(L['practice']);
			$("#ai-team").val(0).prop('disabled', true);
			if($data.room.opts.item) {
				akConfirm("아이템전 특수 규칙이 활성화되어 사기 끄투 봇으로만 연습이 가능합니다. 계속 진행하시겠습니까?", function(resp) {
					if(resp) send('practice', {
						level: 4
					});
				}, true);
			} else showDialog($stage.dialog.practice);
		} else {
			send('practice', {
				level: -1
			});
		}
	});
	$stage.menu.ready.on('click', function(e) {
		if($data.room.opts.item && !$stage.menu.ready.hasClass("toggled")) {
			akPrompt.item('ready');
		} else send('ready');
	});
	$stage.menu.start.on('click', function(e) {
		if($data.room.opts.item) akPrompt.item('start');
		else send('start');
	});
	$stage.menu.exit.on('click', function(e) {
		if ($data.room.gaming) {
			if ($data._spectate || $data.practicing || !$data.room.opts.noleave) {
				akConfirm(L['sureExit'], function(resp) {
					if (!resp) return;
					else {
						clearGame();
						send('leave');
					}
				}, true);
			} else {
				if (!$data.pexit) {
					akAlert("중도 퇴장이 불가능한 방입니다. 게임이 끝나면 나가지도록 예약되었습니다.", true);
					$("#ExitBtn").addClass("toggled");
					$data.pexit = true;
				} else {
					$data.pexit = false;
					$("#ExitBtn").removeClass("toggled");
				}
			}
		} else {
			send('leave');
		}
	});
	$stage.menu.replay.on('click', function(e) {
		if ($data._replay) {
			replayStop();
		}
		showDialog($stage.dialog.replay);
		initReplayDialog();
		if ($stage.dialog.replay.is(':visible')) {
			$("#replay-file").trigger('change');
		}
	});
	$stage.menu.leaderboard.on('click', function(e) {
		$data._lbpage = 0;
		if ($stage.dialog.leaderboard.is(":visible")) {
			$stage.dialog.leaderboard.hide();
		} else $.get("/ranking", function(res) {
			drawLeaderboard(res);
			showDialog($stage.dialog.leaderboard);
		});
	});
	$stage.menu.userList.on('click', function(e) {
		if($stage.box.userList.is(":visible")) {
			$stage.menu.userList.removeClass("toggled");
			$stage.box.userList.hide();
		} else {
			$stage.menu.userList.addClass("toggled");
			$stage.box.userList.show();
		}
	});
	$stage.dialog.selectItem.on('click', function(e) {

	});
	$stage.dialog.lbPrev.on('click', function(e) {
		$(e.currentTarget).attr('disabled', true);
		$.get("/ranking?p=" + ($data._lbpage - 1), function(res) {
			drawLeaderboard(res);
		});
	});
	$stage.dialog.lbMe.on('click', function(e) {
		$(e.currentTarget).attr('disabled', true);
		$.get("/ranking?id=" + $data.id, function(res) {
			drawLeaderboard(res);
		});
	});
	$stage.dialog.lbNext.on('click', function(e) {
		$(e.currentTarget).attr('disabled', true);
		$.get("/ranking?p=" + ($data._lbpage + 1), function(res) {
			drawLeaderboard(res);
		});
	});
	$stage.dialog.settingServer.on('click', function(e) {
		location.href = "/";
	});
	$stage.dialog.settingOK.on('click', function(e) {
		applyOptions({
			vb: $("#volume-bgm").val(),
			ve: $("#volume-effect").val(),
			bd: $("#badwords").is(":checked"),
			ba: $("#strict-badwords").is(":checked"),
			tm: $("#alphakkutu-theme").is(":checked"),
			di: $("#deny-invite").is(":checked"),
			dw: $("#deny-whisper").is(":checked"),
			df: $("#deny-friend").is(":checked"),
			ar: $("#auto-ready").is(":checked"),
			su: $("#sort-user").is(":checked"),
			sb: $("#select-bgm").val(),
			so: $("#select-lobby-bgm").val(),
			ow: $("#only-waiting").is(":checked"),
			ou: $("#only-unlock").is(":checked")
		});
		$.cookie('kks', JSON.stringify($data.opts));
		send('refresh');
		updateUI(undefined, true);
		$stage.dialog.setting.hide();
	});
	$stage.dialog.profileLevel.on('click', function(e) {
		$("#PracticeDiag .dialog-title").html(L['robot']);
		$("#ai-team").prop('disabled', false);
		showDialog($stage.dialog.practice);
	});
	$stage.dialog.practiceOK.on('click', function(e) {
		var level = $("#practice-level").val();
		var team = $("#ai-team").val();

		$stage.dialog.practice.hide();
		if ($("#PracticeDiag .dialog-title").html() == L['robot']) {
			send('setAI', {
				target: $data._profiled,
				level: level,
				team: team
			});
		} else {
			send('practice', {
				level: level
			});
		}
	});
	$stage.dialog.roomOK.on('click', function(e) {
		var i, k, opts = {
			injpick: $data._injpick
		};
		for (i in OPTIONS) {
			k = OPTIONS[i].name.toLowerCase();
			opts[k] = $("#room-" + k).is(':checked');
		}
		send($data.typeRoom, {
			title: $("#room-title").val().trim() || $("#room-title").attr('placeholder').trim(),
			password: $("#room-pw").val(),
			limit: $("#room-limit").val(),
			mode: $("#room-mode").val(),
			round: $("#room-round").val(),
			time: $("#room-time").val(),
			opts: opts,
		});
		$stage.dialog.room.hide();
	});
	$stage.dialog.resultOK.on('click', function(e) {
		if ($data._resultPage == 1 && $data._resultRank) {
			drawRanking($data._resultRank[$data.id]);
			return;
		}
		if ($data.practicing) {
			$data.room.gaming = true;
			send('leave');
		}
		if ($data.pexit) {
			clearGame();
			$data.pexit = false;
			send('leave');
		}
		$data.resulting = false;
		$stage.dialog.result.hide();
		delete $data._replay;
		delete $data._resultRank;
		$stage.box.room.height(360);
		playBGM('lobby');
		forkChat();
		updateUI();
	});
	$stage.dialog.resultSave.on('click', function(e) {
		var date = new Date($rec.time);
		var blob = new Blob([JSON.stringify($rec)], {
			type: "text/plain"
		});
		var url = URL.createObjectURL(blob);
		var fileName = "KKuTuDotNet-" + (
			date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
			date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds()
		) + ".net";
		var $a = $("<a>").attr({
			'download': fileName,
			'href': url
		}).on('click', function(e) {
			$a.remove();
		});
		$("#Jungle").append($a);
		$a[0].click();
	});
	$stage.dialog.dictInjeong.on('click', function(e) {
		var $target = $(e.currentTarget);

		if ($target.is(':disabled')) return;
		if (!$("#dict-theme").val()) return;
		$target.prop('disabled', true);
		$("#dict-output").html(L['searching']);
		$.get("/injeong/" + $("#dict-input").val() + "?theme=" + $("#dict-theme").val(), function(res) {
			addTimeout(function() {
				$target.prop('disabled', false);
			}, 2000);
			if (res.error) return $("#dict-output").html(res.error + ": " + L['wpFail_' + res.error]);

			$("#dict-output").html(L['wpSuccess'] + "(" + res.message + ")");
		});
	});
	$stage.dialog.dictSearch.on('click', function(e) {
		var $target = $(e.currentTarget);

		if ($target.is(':disabled')) return;
		$target.prop('disabled', true);
		$("#dict-output").html(L['searching']);
		tryDict($("#dict-input").val(), function(res) {
			addTimeout(function() {
				$target.prop('disabled', false);
			}, 500);
			if (res.error) return $("#dict-output").html(res.error + ": " + L['wpFail_' + res.error]);

			$("#dict-output").html(processWord(res.word, res.mean, res.theme, res.type.split(',')));
		});
	}).hotkey($("#dict-input"), 13);
	$stage.dialog.wordPlusOK.on('click', function(e) {
		var t;
		if ($stage.dialog.wordPlusOK.hasClass("searching")) return;
		if (!(t = $("#wp-input").val())) return;
		t = t.replace(/[^a-z가-힣]/g, "");
		if (t.length < 2) return;

		$("#wp-input").val("");
		$(e.currentTarget).addClass("searching").html("<i class='fa fa-spin fa-spinner'></i>");
		send('wp', {
			value: t
		});
	}).hotkey($("#wp-input"), 13);
	$stage.dialog.inviteRobot.on('click', function(e) {
		requestInvite("AI");
	});
	$stage.box.me.on('click', function(e) {
		requestProfile($data.id);
	});
	$stage.dialog.roomInfoJoin.on('click', function(e) {
		$stage.dialog.roomInfo.hide();
		tryJoin($data._roominfo);
	});
	$stage.dialog.profileHandover.on('click', function(e) {
		akConfirm(L['sureHandover'], function(resp) {
			if (!resp) return;
			send('handover', {
				target: $data._profiled
			});
		});
	});
	$stage.dialog.profileKick.on('click', function(e) {
		send('kick', {
			robot: $data.robots.hasOwnProperty($data._profiled),
			target: $data._profiled
		});
	});
	$stage.dialog.profileReport.on('click', function(e) {
		if ($data.guest) {
			akAlert("손님 계정은 인 게임 신고 기능을 이용하실 수 없습니다. 우측 상단 로그인 버튼을 클릭하여 로그인해 주세요.", true);
			return;
		}
		var user = $data.users[$data._profiled];
		var jsonObj = {
			id: user.id,
			reason: ""
		};
		if (showDialog($stage.dialog.report)) {
			$data._report = jsonObj;
		}
	});
	$stage.dialog.profileCopy.on('click', function(e) {
		$("#ask-input").val($data.users[$data._profiled].id);
		$("#ask-input").select();
		document.execCommand("copy");
		akPrompt(`해당 플레이어의 식별 번호가 클립보드에 복사되었습니다.<br>복사된 식별 번호는 다음과 같습니다.`, undefined);
	});
	$stage.dialog.reportOK.on('click', function(e) {
		var rsl = [$("#rsl option:selected").text()];
		rsl.push($("#rst").val());
		if (rsl.length > 0) {
			send('report', {
				id: $data._report.id,
				reason: rsl.join()
			});
			akAlert("신고가 접수되었습니다. 신고해 주셔서 감사합니다.", true);
		}
		delete $data._report;
		$stage.dialog.report.hide();
	});
	$stage.dialog.profileShut.on('click', function(e) {
		var o = $data.users[$data._profiled];

		if (!o) return;
		toggleShutBlock(o.nick);
	});
	$stage.dialog.profileWhisper.on('click', function(e) {
		var o = $data.users[$data._profiled];

		$stage.talk.val("/e " + o.nick.replace(/\s/g, "") + " ").focus();
	});
	$stage.dialog.profileDress.on('click', function(e) {
		// akAlert(L['error_555']);
		if ($data.guest) return fail(421);
		if ($data._gaming) return fail(438);
		if (showDialog($stage.dialog.dress)) $.get("/box", function(res) {
			if (res.error) return fail(res.error);

			$data.box = res;
			drawMyDress();
		});
	});
	$stage.dialog.dressOK.on('click', function(e) {
		$(e.currentTarget).attr('disabled', true);
		var curnick = $data.users[$data.id].nick;
		var newnick = $("#dress-nick").val();
		newnick = newnick !== undefined ? newnick.trim() : "";
		if (newnick.length < 2) {
			akAlert("닉네임은 두 글자 이상으로 해 주세요!");
			$(e.currentTarget).attr('disabled', false);
			return;
		} else if (newnick.length > 15) {
			akAlert("닉네임은 15 글자 이하로 해 주세요!");
			$(e.currentTarget).attr('disabled', false);
			return;
		} else if (newnick.length > 0 && !/^[가-힣a-zA-Z0-9][가-힣a-zA-Z0-9 ]*[가-힣a-zA-Z0-9]$/.exec(newnick)) {
			akAlert("닉네임에는 한글/영문/숫자 및 공백만 사용 가능합니다!");
			$(e.currentTarget).attr('disabled', false);
			return;
		}
		var obj = {
			data: $("#dress-exordial").val(),
			nick: newnick
		};
		if (!obj.nick || obj.nick.length == 0) delete obj.nick;
		if (curnick != newnick) {
			akConfirm('닉네임이 변경되었습니다. 정말로 바꾸시겠습니까?', function(resp) {
				$stage.dialog.dressOK.attr('disabled', false);

				if (!resp) return;
				$.post("/dressnick", obj, function(res) {
					if (res.error) return fail(res.error);

					var b = $data.users[$data.id];
					b.nick = newnick;
					b.exordial = badWords($("#dress-exordial").val() || "");
					updateMe();
					requestProfile($data.id);
					$("#account-info").text(newnick);
					$("#users-item-" + $data.id + " .users-name").text(newnick);
					send('nickChange', {
						id: $data.id,
						nick: newnick
					}, true);
					akAlert("변경이 완료되었습니다.", true);
					$stage.dialog.dress.hide();
					$stage.box.me.hide();
					updateUserList(true);
					$stage.box.me.show();
				});
			}, true);
		} else {
			$(e.currentTarget).attr('disabled', true);
			$.post("/exordial", obj, function(res) {
				$stage.dialog.dressOK.attr('disabled', false);
				if (res.error) return fail(res.error);
				updateMe();
				$stage.dialog.dress.hide();
			});
		}
	});
	$("#DressDiag .dress-type").on('click', function(e) {
		var $target = $(e.currentTarget);
		var type = $target.attr('id').slice(11);

		$(".dress-type.selected").removeClass("selected");
		$target.addClass("selected");

		drawMyGoods(type == 'all' || $target.attr('value'));
	});
	$("#dress-cf").on('click', function(e) {
		if ($data._gaming) return fail(438);
		if (showDialog($stage.dialog.charFactory)) drawCharFactory();
	});
	$stage.dialog.cfCompose.on('click', function(e) {
		if (!$stage.dialog.cfCompose.hasClass("cf-composable")) return fail(436);
		akConfirm(L['cfSureCompose'], function(resp) {
			if (!resp) return;
			$.post("/cf", {
				tray: $data._tray.join('|')
			}, function(res) {
				var i;

				if (res.error) return fail(res.error);
				send('refresh');
				//akAlert(L['cfComposed']);
				$data.users[$data.id].money = res.money;
				$data.box = res.box;
				for (i in res.gain) queueObtain(res.gain[i]);

				drawMyDress($data._avGroup);
				updateMe();
				drawCharFactory();
			});
		});
	});
	$("#room-injeong-pick").on('click', function(e) {
		var rule = RULE[MODE[$("#room-mode").val()]];
		var i;

		$("#injpick-list>div").hide();
		if (rule.lang == "ko") {
			$data._ijkey = "#ko-pick-";
			$("#ko-pick-list").show();
		} else if (rule.lang == "en") {
			$data._ijkey = "#en-pick-";
			$("#en-pick-list").show();
		}
		$stage.dialog.injPickNo.trigger('click');
		for (i in $data._injpick) {
			$($data._ijkey + $data._injpick[i]).prop('checked', true);
		}
		showDialog($stage.dialog.injPick);
	});
	$stage.dialog.injPickAll.on('click', function(e) {
		$("#injpick-list input").prop('checked', true);
	});
	$stage.dialog.injPickNo.on('click', function(e) {
		$("#injpick-list input").prop('checked', false);
	});
	$stage.dialog.injPickOK.on('click', function(e) {
		var $target = $($data._ijkey + "list");
		var list = [];

		$data._injpick = $target.find("input").each(function(i, o) {
			var $o = $(o);
			var id = $o.attr('id').slice(8);

			if ($o.is(':checked')) list.push(id);
		});
		$data._injpick = list;
		$stage.dialog.injPick.hide();
	});
	$stage.dialog.kickVoteY.on('click', function(e) {
		send('kickVote', {
			agree: true
		});
		clearTimeout($data._kickTimer);
		$stage.dialog.kickVote.hide();
	});
	$stage.dialog.kickVoteN.on('click', function(e) {
		send('kickVote', {
			agree: false
		});
		clearTimeout($data._kickTimer);
		$stage.dialog.kickVote.hide();
	});
	$stage.dialog.purchaseOK.on('click', function(e) {
		$.post("/buy/" + $data._sgood, function(res) {
			var my = $data.users[$data.id];

			if (res.error) return fail(res.error);
			akAlert(L['purchased']);
			my.money = res.money;
			my.box = res.box;
			updateMe();
		});
		$stage.dialog.purchase.hide();
	});
	$stage.dialog.purchaseNO.on('click', function(e) {
		$stage.dialog.purchase.hide();
	});
	$stage.dialog.obtainOK.on('click', function(e) {
		var obj = $data._obtain.shift();

		if (obj) drawObtain(obj);
		else $stage.dialog.obtain.hide();
	});
	for (i = 0; i < 5; i++) $("#team-" + i).on('click', onTeam);

	function onTeam(e) {
		if ($(".team-selector").hasClass("team-unable")) return;

		send('team', {
			value: $(e.currentTarget).attr('id').slice(5)
		});
	}
	// 리플레이
	function initReplayDialog() {
		$stage.dialog.replayView.attr('disabled', true);
	}
	$("#replay-file").on('change', function(e) {
		var file = e.target.files[0];
		var reader = new FileReader();
		var $date = $("#replay-date").html("-");
		var $version = $("#replay-version").html("-");
		var $players = $("#replay-players").html("-");

		$rec = false;
		$stage.dialog.replayView.attr('disabled', true);
		if (!file) return;
		reader.readAsText(file);
		reader.onload = function(e) {
			var i, data;

			try {
				data = JSON.parse(e.target.result);
				$date.html((new Date(data.time)).toLocaleString());
				$version.html(data.version);
				$players.empty();
				for (i in data.players) {
					var u = data.players[i];
					var $p;

					$players.append($p = $("<div>").addClass("replay-player-bar ellipse")
						.html(u.title)
						.prepend(getLevelImage(u.data.score).addClass("users-level"))
					);
					if (u.id == data.me) $p.css('font-weight', "bold");
				}
				$rec = data;
				$stage.dialog.replayView.attr('disabled', false);
			} catch (ex) {
				console.warn(ex);
				return akAlert(L['replayError'], true);
			}
		};
	});
	$stage.dialog.replayView.on('click', function(e) {
		replayReady();
	});

	// 스팸
	addInterval(function() {
		if (spamCount > 0) spamCount = 0;
		else if (spamWarning > 0) spamWarning -= 0.03;
	}, 1000);

	// 웹소켓 연결
	function connect() {
		ws = new _WebSocket($data.URL);
		ws.onopen = function(e) {
			loading();
			if($data.PUBLIC && mobile) $("#ad").append($("<ins>").addClass("kakao_ad_area")
				.css({ 'display': "none", 'width': "100%" })
				.attr({
					'data-ad-unit': "DAN-qy4y6lsg0jzm",
					'data-ad-width': "320",
					'data-ad-height': "100"
				})
			).append($("<script>")
				.attr({
					'type': "text/javascript",
					'src': "https://t1.daumcdn.net/adfit/static/ad.min.js"
				})
			);
		};
		ws.onmessage = _onMessage = function(e) {
			onMessage(JSON.parse(e.data));
		};
		ws.onclose = function(e) {
			var ct = L['closed'] + " (#" + e.code + ")";

			if (rws) rws.close();
			stopAllSounds();
			loading(ct);
		};
		ws.onerror = function(e) {
			console.warn(L['error'], e);
		};
	}
	var sendMsgItvl = window.setInterval(send('stayconnected'), 40000);
});