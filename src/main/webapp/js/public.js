/*! ECELLPUB public.js
 * ─────────神兽出没─────────
 *         ┌┐     ┌┐
 *       ┌┘┴────┘┴┐
 *       │           │
 *       │    ─     │
 *       │  ┬┘ └┬ │
 *       │           │
 *       │    ┴     │
 *       │           │
 *       └┐     ┌┘ Code is far away from bug with the animal protecting
 *         │     │
 *         │     │
 *         │     └─┐
 *         │          ├┐
 *         │          ┌┘
 *         └┐┐┌─┐┐┌┘
 *          │┤┤ │┤┤
 *          └┴┘ └┴┘
 *
 * ────────感觉萌萌哒────────
 * ================
 * Main JS application file for ECELLPUB v1. This file
 * should be included in the main page. It controls some layout
 * options and data exchange with server.
 *
 * @Author  ilbcj Studio
 * @Support <http://www.ilbcj.com>
 * @Email   <22833638@qq.com>
 * @version 1.0.0
 * @license MIT <http://opensource.org/licenses/MIT>
 */

//Make sure jQuery has been loaded before main.js
if (typeof jQuery === 'undefined') {
	throw new Error('ECELLPUB requires jQuery');
	
}


/*
 * ECELLPUB
 * 
 * @type Object @description $.ECELLPUB is the main object for the app. It's used for
 * implementing functions and options related to the ECELLPUB. Keeping everything
 * wrapped in an object prevents conflict with other plugins and is a better way
 * to organize our code.
 */
$.ECELLPUB = {};

/*
 * -------------------- - ECELLPUB Options - -------------------- Modify these
 * options to suit your implementation
 */
$.ECELLPUB.options = {
	basePath: 'ECELLPUBdemo',
};

/*
 * ------------------ - Implementation - ------------------ The next block of
 * code implements ECELLPUB's functions and plugins as specified by the options
 * above.
 */
$(function () {
	'use strict';
	
	//document.getElementById('contextWrap').addEventListener('touchmove',  function (e) { e.preventDefault(); }, { passive: false });


	
	// , headers: { 'x-requested-with': 'XMLHttpRequest' }
    $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
    

	// Extend options if external options exist
	if (typeof ECELLPUBOptions !== 'undefined') {
		$.extend(true, $.ECELLPUB.options, ECELLPUBOptions);
	}

	// Easy access to options
	var o = $.ECELLPUB.options;
	console.log(o.basePath);
	// Set up the object
	_initECELLPUB(o);

	// update $.post, contentType --> application/json
	$.extend({
		'postjson': function( url, data, success, dataType ) {
			$.ajax({
				type: 'POST',
				contentType: 'application/json;charset=UTF-8',
				url: url,
				data: data,
				crossDomain: true, 
				xhrFields: {withCredentials: true},
				success: success,
				dataType: dataType
			});
		}
	});
	
	// Update table style
	
	// pace optinos
	Pace.options.ajax.trackMethods.push("POST");
	
	Pace.on('start', function(){
		$('#mask_modal').modal({
			closable: false,
	        inverted: true,
	        blurring: false
	    }).modal("show");
	});
	Pace.on('done', function(){
		$('#mask_modal').modal("hide");
	});
	
	// update date.toLocaleString
	Date.prototype.toLocaleString = function() {
        return this.getFullYear() + "年" + (this.getMonth() + 1) + "月" + this.getDate() + "日 " + this.getHours() + "点" + this.getMinutes() + "分" + this.getSeconds() + "秒";
	};
	Date.prototype.toLocaleString = function() {
        return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate() + " " + this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds();
	};
	
	// Active the main menu and custom menu
	//$.ECELLPUB.menu.activate();
	
	$.ECELLPUB.indexPage.activate();
});

/*
 * ---------------------------------- - Initialize the ECELLPUB Object -
 * ---------------------------------- All ECELLPUB functions are implemented below.
 */
function _initECELLPUB(o) {
	'use strict';
	
	$.ECELLPUB.indexPage = {
		activate: function () {
			
			var urlTarget = o.basePath + '/player/basic/list';
            $.postjson(urlTarget + '?rand=' + Math.random(), {}, function(data,textStatus, jqXHR) {
	    		if( data.code == 0 ) {
					var playersBasic = data.list;
					//$('#schedule_content').data('players_basic', playersBasic);
					
					$('#profile_select_player1, #profile_select_player2').append('<option value="' + 0 + '"></option>');
					playersBasic.forEach(function(player){
						$('#profile_select_player1, #profile_select_player2').append('<option value="' + player.nick + '">' + player.nick + '</option>');
					});
					
					$('#profile_select_player1, #profile_select_player2').dropdown({
				        onHide: function(){
				        	var index = $(this).data('index');
				        	$('#profile_select_wrap_player' + index).addClass('displaynone');
				            $('#profile_select_wrap_avatar' + index).css('margin-top','20px');
				            var nick = $('#profile_select_player' + index).dropdown('get value');
				            $.ECELLPUB.match.loadPlayerProfile(nick, index);
				        }
				    });
					
					$('.profileSelectPlayer').on('click.ECELLPUB.profile.select', function(){
						var index = $(this).data('index');
						$('#profile_select_wrap_player' + index).removeClass('displaynone');
						$('#profile_select_wrap_avatar' + index).css('margin-top','-13px');
						$('#profile_select_player' + index).dropdown('show');						
					});
					
					
				} else {
					var message = '获取选手列表信息失败![' + data.msg + ', ' + data.code + ']，请联系管理员！';
					$.ECELL.tipMessage(message, false);
				}
			}, 'json');
			
			$('div.mainWrap').load('match.html?random=' + Math.random() + ' .mainWrapInner',
			    				function(response,status,xhr){$.ECELLPUB.CheckLoad(response);$.ECELLPUB.PageActivate('match.html');});
		}
	};// end of $.ECELLPUB.indexPage
	
	
	/*
	 * match ====== match infomation page
	 * 
	 * @type 
	 * Object
	 * @usage 
	 * $.ECELLPUB.match.activate()
	 * $.ECELLPUB.match.loadCalendar(month), month:月份
	 */
	$.ECELLPUB.match = {
		activate: function () {
			
			var now = new Date();
			var year = now.getFullYear();    //获取完整的年份(4位,1970-????)
			var month = now.getMonth()+1;       //获取当前月份(0-11,0代表1月)
			$.ECELLPUB.match.loadCalendar(year + '-' + month);
			
			$('#matchCalendarLeft').on('click.ECELLPUB.match.loadCalendar', function(){
				var d = new Date($('#matchCalendar0').html());
				if( typeof d.getMonth() === 'number' && !window.isNaN(d.getMonth()) ) {
					d.setMonth(d.getMonth() - 1);
					var year = d.getFullYear();
					var month = d.getMonth()+1;
					$.ECELLPUB.match.loadCalendar(year + '-' + month);
				}
				
			});
			$('#matchCalendarRight').on('click.ECELLPUB.matchh.loadCalendar', function(){
				var d = new Date($('#matchCalendar0').html());
				if( typeof d.getMonth() === 'number' && !window.isNaN(d.getMonth()) ) {
					d.setMonth(d.getMonth() + 1);
					var year = d.getFullYear();
					var month = d.getMonth()+1;
					$.ECELLPUB.match.loadCalendar(year + '-' + month);
				}
			});
			
			$('.playerProfile').on('click.ECELLPUB.player.profile', function(){
				var nick = $(this).html();
				$.ECELLPUB.match.loadPlayerProfile(nick, 1);
			});
		},
		loadPlayerProfile: function( nick, playId ) {
			
			$('#profile_player' + playId + '_nick').html('');
			$('#profile_player' + playId + '_avatar').attr('src', o.basePath + '/img/public/who.jpg');
			$('#profile_player' + playId + ' .last10').addClass('displaynone')
			$('#profile_player' + playId + '_race').attr('src', o.basePath + '/img/public/player_race_empty.png');
			$('#profile_player' + playId + '_country').attr('src', o.basePath + '/img/public/player_country_empty.png');
			$('#profile_player' + playId + '_name').html('');
			$('#profile_player' + playId + '_race_text').html('');
			$('#profile_player' + playId + '_age').html('');
			$('#profile_player' + playId + '_team').html('');
			$('#profile_player' + playId + '_winning').html('');
			$('#profile_player' + playId + '_winning_vt').html('');
			$('#profile_player' + playId + '_winning_vp').html('');
			$('#profile_player' + playId + '_winning_vz').html('');
			$('#profile_player' + playId + '_apm').html('');
			$('#profile_player' + playId + '_duration').html('');
			$('#profile_player' + playId + '_resource').html('');
			$('#profile_player' + playId + '_difference').html('');
					
			var postData = {};
			postData.players = [];
			postData.players.push(nick);
			var urlTarget = o.basePath + '/public/profile';
			$.postjson(urlTarget + '?rand=' + Math.random(), JSON.stringify(postData), function(data,textStatus, jqXHR) {
	    		if( data.code == 0 ) {
					console.log(data.players);
					var player = data.players[0];
					if(player ==undefined) {
						$.ECELLPUB.tipMessage('没有找到选手[' + nick + ']的比赛数据.');
						return;
					}
					$('#profile_player' + playId + '_nick').html(nick);
					if( player.avatar != null && player.avatar.length > 0) {
						$('#profile_player' + playId + '_avatar').attr('src', o.basePath + '/' + player.avatar);	
					}
					$('#profile_player' + playId + '_race').attr('src', o.basePath + '/img/public/player_race_' + player.race.toLowerCase() + '.png');
					$('#profile_player' + playId + '_country').attr('src', o.basePath + '/img/public/player_country_' + player.country.toLowerCase() + '.png');
					$('#profile_player' + playId + '_name').html(player.name);
					var raceText = '';
					if( player.race.toLowerCase() === 't' ) {
						raceText = 'TERREN';
					}
					else if( player.race.toLowerCase() === 'p' ) {
						raceText = 'PROTOSS';
					}
					else if( player.race.toLowerCase() === 'z' ) {
						raceText = 'ZERG';
					}
					$('#profile_player' + playId + '_race_text').html(raceText);
					$('#profile_player' + playId + '_age').html(player.age);
					$('#profile_player' + playId + '_team').html(player.team);
					$('#profile_player' + playId + '_winning').html(player.winningVA);
					$('#profile_player' + playId + '_winning_vt').html(player.winningVT);
					$('#profile_player' + playId + '_winning_vp').html(player.winningVP);
					$('#profile_player' + playId + '_winning_vz').html(player.winningVZ);
					$('#profile_player' + playId + '_apm').html(player.apm);
					$('#profile_player' + playId + '_duration').html(player.duration);
					$('#profile_player' + playId + '_resource').html(player.resource);
					$('#profile_player' + playId + '_difference').html(player.difference);
					
					//[常规赛] 2020-6-1 <span style="color:red">WIN</span> Kukuboy on 断路器
					player.last10.forEach(function(game, index, arr){
						var color = game.result === 'WIN' ? 'red' : 'white';
						var htmlText = '[' + game.type + '] ' + game.date + ' <span style="color:' + color + '">' + game.result + '</span> ' + game.adversary + ' on ' + game.map;
						$('#profile_player' + playId + '_last_' + (index+1)).html(htmlText);
						$('#profile_player' + playId + '_last_' + (index+1)).removeClass('displaynone');
					});
					
					$("#player_profile_modal").modal({
						closable: true
					}).modal('show');
				} else {
					var message = '获取选手战绩信息失败![' + data.msg + ', ' + data.code + ']';
					$.ECELLPUB.tipMessage(message, false);
				}
			}, 'json');
		},
		loadCalendar: function( month ) {
			var postData = {};
			postData.month = month;
			var urlTarget = o.basePath + '/public/calendar';
			$.postjson(urlTarget + '?rand=' + Math.random(), JSON.stringify(postData), function(data,textStatus, jqXHR) {
	    		if( data.code == 0 ) {
					var calendar = data.calendar;
					$('.matchCalendar').removeData();
					$('.matchCalendar').html('');
					$('.matchCalendar').removeClass('daymatchEnter');
					$('.matchCalendar').css('color', 'white');
					$('#matchCalendar0').html(calendar.year + '-' + calendar.month);
					for(var i=0; i<calendar.days.length; i++) {
						if( calendar.days[i].dayOfMonth > 0) {
							$('#matchCalendar' + (i+1)).html(calendar.days[i].dayOfMonth);
							$('#matchCalendar' + (i+1)).data('day', calendar.days[i]);
							if(calendar.days[i].type == 1) {
								$('#matchCalendar' + (i+1)).css('color', '#fff558');	
							}
							else if(calendar.days[i].type == 1) {
								$('#matchCalendar' + (i+1)).css('color', '#ff9914');	
							}
							if(calendar.days[i].sets > 0) {
								$('#matchCalendar' + (i+1)).addClass('daymatchEnter');	
							}
						}
					}
					
					$('.daymatchEnter').on('click.ECELLPUB.matchh.loaddaymatch', function(){
						var calendarDayInfo = $(this).data('day');
						$('#contextWrap').data('calendarDay', calendarDayInfo);
						$('div.mainWrap').load('daymatch.html?random=' + Math.random() + ' .mainWrapInner',
					    	function(response,status,xhr){$.ECELLPUB.CheckLoad(response);$.ECELLPUB.PageActivate('daymatch.html');});
					});
				} else {
					var message = '获取赛程日历信息失败![' + data.msg + ', ' + data.code + ']';
					$.ECELLPUB.tipMessage(message, false);
				}
			}, 'json');
		}
	};// end of $.ECELLPUB.match
	
	$.ECELLPUB.daymatch = {
		activate: function() {
			var calendarDayInfo = $('#contextWrap').data('calendarDay');
			//if(calendarDayInfo.schedule < 5) {
			if( (calendarDayInfo.schedule > 0 && calendarDayInfo.schedule < 5) ||
					(calendarDayInfo.schedule > 12 && calendarDayInfo.schedule < 17) ) {
				o.basePath + '/player/picture/upload'
				$('.mainWrapInner').css('background-image', 'url(' + o.basePath + '/img/public/daymatch_1.jpg)');
			}
			else {
				$('.mainWrapInner').css('background-image', 'url(' + o.basePath + '/img/public/daymatch_2.jpg)');
			}
			var postData = {};
			postData.day = calendarDayInfo.raceDay;
			var urlTarget = o.basePath + '/public/daymatch';
			$.postjson(urlTarget + '?rand=' + Math.random(), JSON.stringify(postData), function(data,textStatus, jqXHR) {
	    		if( data.code == 0 ) {
					var daymatches = data.daymatches;
					var daymatch = daymatches[0];
					
					$('#daymath_top_date').html(daymatch.day);
					$('#daymath_top_title').html(daymatch.title);
					var playersHtml = '';
					daymatch.players.forEach(function(player){
						playersHtml += '<span>' + player + '</span>';
					});
					$('#daymath_top_players').html(playersHtml);
					
					$('#daymath_set1_vs, #daymath_set1_p1_win, #daymath_set1_p2_win, ' 
						+ '#daymath_set2_vs, #daymath_set2_p1_win, #daymath_set2_p2_win, '
						+ '#daymath_set3_vs, #daymath_set3_p1_win, #daymath_set3_p2_win, '
						+ '#daymath_set4_vs, #daymath_set4_p1_win, #daymath_set4_p2_win, '
						+ '#daymath_set5_vs, #daymath_set5_p1_win, #daymath_set5_p2_win').addClass('displaynone');
					daymatch.sets.forEach(function(set){
						$('#daymath_set' + set.setId).html(set.title);
						$('#daymath_set' + set.setId + '_p1_race').attr('src', '../img/public/daymatch_race_' + set.p1Race.toLowerCase() + '.png');
						$('#daymath_set' + set.setId + '_p1_name').html(set.p1Nick);
						$('#daymath_set' + set.setId + '_p1_country').attr('src', '../img/public/daymatch_country_' + set.p1Country.toLowerCase() + '.png');
						$('#daymath_set' + set.setId + '_p2_race').attr('src', '../img/public/daymatch_race_' + set.p2Race.toLowerCase() + '.png');
						$('#daymath_set' + set.setId + '_p2_name').html(set.p2Nick);
						$('#daymath_set' + set.setId + '_p2_country').attr('src', '../img/public/daymatch_country_' + set.p2Country.toLowerCase() + '.png');
						$('#daymath_set' + set.setId + '_vs').removeClass('displaynone');
						$('#daymath_set' + set.setId + '_p' + set.winner + '_win').removeClass('displaynone');
					});
				} else {
					var message = '获取比赛日信息失败![' + data.msg + ', ' + data.code + ']';
					$.ECELLPUB.tipMessage(message, false);
				}
			}, 'json');
			
		},        
		fillDetailData: function(playerId) {
			var rowData = $('#player_main_table').DataTable().row( '#' + playerId ).data();
			$('#player_content_nick').val(rowData.nick);
			$('#player_content_race').dropdown('set selected', rowData.race);
			$('#player_content_name').val(rowData.name);
			$("#player_content_gender").dropdown('set selected', rowData.gender);
			$("#player_content_country").dropdown('set selected', rowData.country);
			$("#player_content_birth").val(rowData.birth);
			$('#player_content_team').val(rowData.teamName);
			$('#player_content_tel').val(rowData.tel);
			$('#player_content_qq').val(rowData.qq);
			$('#player_content_wechat').val(rowData.wechat);
			$('#player_content_status').dropdown('set selected', rowData.status);
			$('#player_content_pic').attr('src', o.basePath + '/' + rowData.picture);
			$('#player_content_pic').data('picture', rowData.picture);
		},
		uploadPicture: function() {
			var formData = new FormData();
            formData.append("playerPic", document.getElementById("player_content_pic_input").files[0]);
            var urlTarget = o.basePath + '/player/picture/upload';
            $.ajax({
                url: urlTarget,
                type: "POST",
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.code == 0) {
                        //$.ECELLPUB.tipMessage(data.picName);
                        $('#player_content_pic').attr('src', o.basePath + '/' + data.picName);
                        $('#player_content_pic').data('picture', data.picName);
                    }
                    else {
                    	$.ECELLPUB.tipMessage('头像上传失败！', false);
                    }
                },
                error: function () {
                    $.ECELLPUB.tipMessage('头像上传失败！', false);
                }
            });
		},
		regist: function() {
			var postData = {};
			postData.id = $('#player_content').data('player_id');
			postData.nick = $('#player_content_nick').val();
			postData.race = $('#player_content_race').dropdown('get value');
			postData.name = $('#player_content_name').val();
			postData.gender = $("#player_content_gender").dropdown('get value');
			postData.country = $("#player_content_country").dropdown('get value');
			postData.birth = $("#player_content_birth").val();
			postData.teamName = $('#player_content_team').val();
			postData.picture = $('#player_content_pic').data('picture');
			postData.tel = $('#player_content_tel').val();
			postData.qq = $('#player_content_qq').val();
			postData.wechat = $('#player_content_wechat').val();
			postData.status = $('#player_content_status').dropdown('get value');
			
			var urlTarget = o.basePath + '/player/';
			if( postData.id == 0 ) {
				urlTarget += 'regist';
			}
			else {
				urlTarget += 'modfiy';
			}
			$.postjson(urlTarget + '?rand=' + Math.random(), JSON.stringify(postData), function(data,textStatus, jqXHR) {
	    		if( data.code == 0 ) {
					$.ECELLPUB.player.contentToggle();
					
					$('#player_main_table').DataTable().ajax.reload();
					var message = '保存选手信息成功!';
					$.ECELLPUB.tipMessage(message);
				} else {
					var message = '保存选手信息失败![' + data.msg + ', ' + data.code + ']';
					$.ECELLPUB.tipMessage(message, false);
				}
			}, 'json');
		},
		delConfirm: function() {
			var playerId = $(this).data('id');
			$('#player_delconfirm_modal').data('del_player_id', playerId);
			var rowData = $('#player_main_table').DataTable().row( '#' + playerId ).data();
			var message = '是否删除 <span class="ui red label huge">' + rowData.nick + '</span> 选手？';
			$('#player_confirm_modal_message').html(message);
			$("#player_delconfirm_modal").modal({
				closable: false
			}).modal('show');
		},
		delConfirmYes: function() {
			var postData = {};
			postData.id = $('#player_delconfirm_modal').data('del_player_id');
			var urlTarget = o.basePath + '/player/delete';
			$.postjson(urlTarget + '?rand=' + Math.random(), JSON.stringify(postData),
				function(data, textStatus, jqXHR) {
					if(data.code == 0) {
						$.ECELLPUB.tipMessageSuccess("选手删除成功。");
						$('#player_main_table').DataTable().ajax.reload();
						$("#player_delconfirm_modal").modal({
							closable: false
						}).modal('hide');
					} else {
						var msg = data.msg;
						$.ECELLPUB.tipMessage(msg, false);
					}
				}, 'json');
		}
	}; // daymatch管理结束
	
	$.ECELLPUB.season = {
		activate: function() {
			$(".ui.dropdown").dropdown({
				allowCategorySelection: true,
				transition: "fade up"
			});
			
			jeDate("#season_search_start",{
		        theme:{ bgcolor:"#00A1CB",color:"#ffffff", pnColor:"#00CCFF"},
		        onClose: false,
		        format: "YYYY-MM-DD"
		    });
		    jeDate("#season_search_end",{
		        theme:{ bgcolor:"#00A1CB",color:"#ffffff", pnColor:"#00CCFF"},
		        onClose: false,
		        format: "YYYY-MM-DD"
		    });
		    jeDate("#season_content_start",{
		        theme:{ bgcolor:"#00A1CB",color:"#ffffff", pnColor:"#00CCFF"},
		        onClose: false,
		        format: "YYYY-MM-DD"
		    });
			
			var dtable = $('#season_main_table').DataTable({
				ajax:{
					url: o.basePath + '/season/list',
					type: 'POST',
					data: function ( d ) {
				        d.name = $('#season_search_name').val();
				        d.begin = $('#season_search_start').val();
				        d.end = $('#season_search_end').val();
					},
					dataSrc: $.ECELLPUB.ParseDataTableResult
				},
				processing: true,
				serverSide: true,
				columns: [
					{ data: 'name' },
					{ data: 'startTime' },
					{ data: 'status' },
					{ data: null }
				],
				rowId: 'id',
		        columnDefs: [
		        	{
						render: function ( data, type, row ) {
							var html = '';
							if( data == '0' ) {
								html = '<span class="ui basic black button">新建</span>';
							}
							else if( data == '1' ) {
								html = '<span class="ui basic black button">活动</span>';
							}
							else if( data == '2' ) {
								html = '<span class="ui basic black button">结束</span>';
							}
							return html;
						},
						targets: 2
					},
					{
						render: function ( data, type, row ) {
							var html = '';
								html = '<div class="btn-group">';
								html += '<div class="ui yellow horizontal label season_schedule" data-id="' + row.id + '"><i class="large edit icon"></i>赛程</div>';
								html += '<div class="ui green horizontal label season_update" data-id="' + row.id + '"><i class="large edit icon"></i>修改</div>';
								html += '<a class="ui red horizontal label season_delete" data-id="' + row.id + '"><i class="large trash outline icon"></i>删除</a>';
								html += '</div>';
							return html;							
						},
						targets: 3
					}
				],
		        //order: [1, 'desc'],
				responsive: true
		    });
			
			// listen page items' event
			$('#season_search').on('click.ECELLPUB.season.query', $.ECELLPUB.season.query);
			$('#season_main_table').on( 'draw.dt', function () {
				$('.season_schedule').on('click.ECELLPUB.season.update', $.ECELLPUB.season.schedule);
				$('.season_update').on('click.ECELLPUB.season.update', $.ECELLPUB.season.contentToggle);
				$('.season_delete').on('click.ECELLPUB.season.delete', $.ECELLPUB.season.delConfirm);
			});
            $('#add_season').on('click.ECELLPUB.season.content', $.ECELLPUB.season.contentToggle);
            $('#season_content_save').on('click.ECELLPUB.season.save', $.ECELLPUB.season.regist);
            $('#season_content_return').on('click.ECELLPUB.season.return', $.ECELLPUB.season.contentToggle);
            $('#del_season_yes').on('click.ECELLPUB.season.del.yes', $.ECELLPUB.season.delConfirmYes);
		},
		query: function () {
			var star = $('#season_search_start').val();
			var end = $('#season_search_end').val();
			if(end != '' && star > end) {
				$.ECELLPUB.tipMessage('开始时间不能大于结束时间', false);
				return false;
			}
			$('#season_main_table').DataTable().ajax.reload();
			return;
		},
		emptyVal: function() {
			$('#season_content_name').val('');
			$('#season_content_start').val('');
			$("#season_content_status").dropdown('clear');
		},
		contentToggle: function() {
			$.ECELLPUB.season.emptyVal();
			$('#season_list,#season_content').toggleClass('displaynone');
			
			var seasonId = $(this).data('id');
			if( undefined != seasonId ) {
				$.ECELLPUB.season.fillDetailData(seasonId);
			}
			else{
				$('#season_content_status').dropdown('set selected', '0');
				seasonId = 0;
			}
			$('#season_content').data('season_id', seasonId);
		},
		fillDetailData: function(seasonId) {
			var rowData = $('#season_main_table').DataTable().row( '#' + seasonId ).data();
			$('#season_content_name').val(rowData.name);
			$("#season_content_start").val(rowData.startTime);
			$('#season_content_status').dropdown('set selected', rowData.status.toString());
		},
		regist: function() {
			var postData = {};
			postData.id = $('#season_content').data('season_id');
			postData.name = $('#season_content_name').val();
			postData.startTime = $("#season_content_start").val();
			postData.status = $('#season_content_status').dropdown('get value');
			
			var urlTarget = o.basePath + '/season/';
			if( postData.id == 0 ) {
				urlTarget += 'regist';
			}
			else {
				urlTarget += 'modfiy';
			}
			$.postjson(urlTarget + '?rand=' + Math.random(), JSON.stringify(postData), function(data,textStatus, jqXHR) {
	    		if( data.code == 0 ) {
					$.ECELLPUB.season.contentToggle();
					
					$('#season_main_table').DataTable().ajax.reload();
					var message = '保存赛季信息成功!';
					$.ECELLPUB.tipMessage(message);
				} else {
					var message = '保存赛季信息失败![' + data.msg + ', ' + data.code + ']';
					$.ECELLPUB.tipMessage(message, false);
				}
			}, 'json');
		},
		schedule: function() {
			$.ECELLPUB.tipMessage("coming soon...", false);
			return false;
		},
		delConfirm: function() {
			var seasonId = $(this).data('id');
			$('#season_delconfirm_modal').data('del_season_id', seasonId);
			var rowData = $('#season_main_table').DataTable().row( '#' + seasonId ).data();
			var message = '是否删除 <span class="ui red label huge">' + rowData.name + '</span> 赛季？';
			$('#season_confirm_modal_message').html(message);
			$("#season_delconfirm_modal").modal({
				closable: false
			}).modal('show');
		},
		delConfirmYes: function() {
			$.ECELLPUB.tipMessage("系统瓦特了。。。", false);
			return false;
			var postData = {};
			postData.id = $('#season_delconfirm_modal').data('del_season_id');
			var urlTarget = o.basePath + '/season/delete';
			$.postjson(urlTarget + '?rand=' + Math.random(), JSON.stringify(postData),
				function(data, textStatus, jqXHR) {
					if(data.code == 0) {
						$.ECELLPUB.tipMessageSuccess("赛季删除成功。");
						$('#season_main_table').DataTable().ajax.reload();
						$("#season_delconfirm_modal").modal({
							closable: false
						}).modal('hide');
					} else {
						var msg = data.msg;
						$.ECELLPUB.tipMessage(msg, false);
					}
				}, 'json');
		}
	}; // season管理结束
	
	$.ECELLPUB.schedule = {
		activate: function() {
			$(".ui.dropdown").dropdown({
				allowCategorySelection: true,
				transition: "fade up"
			});
			
			$(".menu .item").tab();
			
			jeDate("#schedule_content_set1_date",{
		        theme:{ bgcolor:"#00A1CB",color:"#ffffff", pnColor:"#00CCFF"},
		        onClose: false,
		        format: "YYYY-MM-DD"
		    });
		    jeDate("#schedule_content_set2_date",{
		        theme:{ bgcolor:"#00A1CB",color:"#ffffff", pnColor:"#00CCFF"},
		        onClose: false,
		        format: "YYYY-MM-DD"
		    });
		    jeDate("#schedule_content_set3_date",{
		        theme:{ bgcolor:"#00A1CB",color:"#ffffff", pnColor:"#00CCFF"},
		        onClose: false,
		        format: "YYYY-MM-DD"
		    });
		    jeDate("#schedule_content_set4_date",{
		        theme:{ bgcolor:"#00A1CB",color:"#ffffff", pnColor:"#00CCFF"},
		        onClose: false,
		        format: "YYYY-MM-DD"
		    });
		    jeDate("#schedule_content_set5_date",{
		        theme:{ bgcolor:"#00A1CB",color:"#ffffff", pnColor:"#00CCFF"},
		        onClose: false,
		        format: "YYYY-MM-DD"
		    });
			
		    var dtable = $('#schedule_main_table').DataTable({
				ajax:{
					url: o.basePath + '/schedule/list',
					type: 'POST',
					data: function ( d ) {
				        d.name = $('#schedule_search_season').val();
					},
					dataSrc: $.ECELLPUB.ParseDataTableResult
				},
				processing: true,
				serverSide: true,
				columns: [
					{ data: 'seasonName' },
					{ data: 'round' },
					{ data: 'sets' },
					{ data: 'type' },
					{ data: 'status' },
					{ data: null }
				],
				rowId: 'id',
		        columnDefs: [
		        	{
						render: function ( data, type, row ) {
							var html = '' + row.sets + '场bo' + row.format;
							return html;
						},
						targets: 2
					},
					{
						render: function ( data, type, row ) {
							var html = '';
							if( data == '0' ) {
								html = '<span class="ui basic black button">选拔赛</span>';
							}
							else if( data == '1' ) {
								html = '<span class="ui basic black button">常规赛</span>';
							}
							else if( data == '2' ) {
								html = '<span class="ui basic black button">季后赛</span>';
							}
							return html;
						},
						targets: 3
					},
		        	{
						render: function ( data, type, row ) {
							var html = '';
							if( data == '0' ) {
								html = '<span class="ui basic black button">新建</span>';
							}
							else if( data == '1' ) {
								html = '<span class="ui basic black button">活动</span>';
							}
							else if( data == '2' ) {
								html = '<span class="ui basic black button">结束</span>';
							}
							return html;
						},
						targets: 4
					},
					{
						render: function ( data, type, row ) {
							var html = '';
								html = '<div class="btn-group">';
								html += '<div class="ui olive horizontal label schedule_edit" data-id="' + row.id + '"><i class="large edit icon"></i>编辑</div>';
								html += '</div>';
							return html;							
						},
						targets: 5
					}
				],
		        //order: [1, 'desc'],
				responsive: true
		    });
			
			// listen page items' event
			$('#schedule_search').on('click.ECELLPUB.schedule.query', $.ECELLPUB.schedule.query);
			$('#schedule_main_table').on( 'draw.dt', function () {
				$('.schedule_edit').on('click.ECELLPUB.schedule.edit', $.ECELLPUB.schedule.openDetail);
			});
            $('#schedule_record_content_save').on('click.ECELLPUB.schedule.save', $.ECELLPUB.schedule.saveMatch);
            $('#schedule_record_content_return').on('click.ECELLPUB.schedule.return', $.ECELLPUB.schedule.contentToggle);
            
            //get playlist and fill player dropdown
            var urlTarget = o.basePath + '/player/basic/list';
            $.postjson(urlTarget + '?rand=' + Math.random(), {}, function(data,textStatus, jqXHR) {
	    		if( data.code == 0 ) {
					var playersBasic = data.list;
					$('#schedule_content').data('players_basic', playersBasic);
					
					$('#schedule_content_set1_player1, #schedule_content_set1_player2'
						+ ', #schedule_content_set2_player1, #schedule_content_set2_player2'
						+ ', #schedule_content_set3_player1, #schedule_content_set3_player2'
						+ ', #schedule_content_set4_player1, #schedule_content_set4_player2'
						+ ', #schedule_content_set5_player1, #schedule_content_set5_player2').append('<option value="' + 0 + '"></option>');
					playersBasic.forEach(function(player){
						$('#schedule_content_set1_player1, #schedule_content_set1_player2'
							+ ', #schedule_content_set2_player1, #schedule_content_set2_player2'
							+ ', #schedule_content_set3_player1, #schedule_content_set3_player2'
							+ ', #schedule_content_set4_player1, #schedule_content_set4_player2'
							+ ', #schedule_content_set5_player1, #schedule_content_set5_player2').append('<option value="' + player.id + '">' + player.nick + '</option>');
					});
				} else {
					var message = '获取选手列表信息失败![' + data.msg + ', ' + data.code + ']，请联系管理员！';
					$.ECELLPUB.tipMessage(message, false);
				}
			}, 'json');
			
			$('#schedule_content_set1_player1').change(function(){
			    //$.ECELLPUB.tipMessage($(this).dropdown('get value') + ":" + $(this).dropdown('get text'));
				$('#schedule_content_set1_game1_player1, #schedule_content_set1_game2_player1,'
					+ '#schedule_content_set1_game3_player1, #schedule_content_set1_game4_player1,'
					+ '#schedule_content_set1_game5_player1, #schedule_content_set1_game6_player1,'
					+ '#schedule_content_set1_game7_player1, #schedule_content_set1_game8_player1,' 
					+ '#schedule_content_set1_game9_player1').val($(this).dropdown('get text'));
				
				var id = $(this).dropdown('get value');
				var playersBasic = $('#schedule_content').data('players_basic');
				playersBasic.forEach(function(player){
					if(player.id == id) {
						$('#schedule_content_set1_game1_player1_race,#schedule_content_set1_game2_player1_race,'
							+ '#schedule_content_set1_game3_player1_race,#schedule_content_set1_game4_player1_race,'
							+ '#schedule_content_set1_game5_player1_race,#schedule_content_set1_game6_player1_race,'
							+ '#schedule_content_set1_game7_player1_race,#schedule_content_set1_game8_player1_race,'
							+ '#schedule_content_set1_game9_player1_race').dropdown('set selected', player.race);
					}
				});
  			});
  			$('#schedule_content_set1_player2').change(function(){
			    //$.ECELLPUB.tipMessage($(this).dropdown('get value') + ":" + $(this).dropdown('get text'));
				$('#schedule_content_set1_game1_player2, #schedule_content_set1_game2_player2,'
					+ '#schedule_content_set1_game3_player2, #schedule_content_set1_game4_player2,'
					+ '#schedule_content_set1_game5_player2, #schedule_content_set1_game6_player2,'
					+ '#schedule_content_set1_game7_player2, #schedule_content_set1_game8_player2,'
					+ '#schedule_content_set1_game9_player2').val($(this).dropdown('get text'));
				
				var id = $(this).dropdown('get value');
				var playersBasic = $('#schedule_content').data('players_basic');
				playersBasic.forEach(function(player){
					if(player.id == id) {
						$('#schedule_content_set1_game1_player2_race,#schedule_content_set1_game2_player2_race,'
							+ '#schedule_content_set1_game3_player2_race,#schedule_content_set1_game4_player2_race,'
							+ '#schedule_content_set1_game5_player2_race,#schedule_content_set1_game6_player2_race,'
							+ '#schedule_content_set1_game7_player2_race,#schedule_content_set1_game8_player2_race,'
							+ '#schedule_content_set1_game9_player2_race').dropdown('set selected', player.race);
					}
				});
  			});
  			
  			$('#schedule_content_set2_player1').change(function(){
			    //$.ECELLPUB.tipMessage($(this).dropdown('get value') + ":" + $(this).dropdown('get text'));
				$('#schedule_content_set2_game1_player1, #schedule_content_set2_game2_player1,'
					+ '#schedule_content_set2_game3_player1').val($(this).dropdown('get text'));
				
				var id = $(this).dropdown('get value');
				var playersBasic = $('#schedule_content').data('players_basic');
				playersBasic.forEach(function(player){
					if(player.id == id) {
						$('#schedule_content_set2_game1_player1_race,#schedule_content_set2_game2_player1_race,'
							+ '#schedule_content_set2_game3_player1_race').dropdown('set selected', player.race);
					}
				});
  			});
  			$('#schedule_content_set2_player2').change(function(){
			    //$.ECELLPUB.tipMessage($(this).dropdown('get value') + ":" + $(this).dropdown('get text'));
				$('#schedule_content_set2_game1_player2, #schedule_content_set2_game2_player2,'
					+ '#schedule_content_set2_game3_player2').val($(this).dropdown('get text'));
				
				var id = $(this).dropdown('get value');
				var playersBasic = $('#schedule_content').data('players_basic');
				playersBasic.forEach(function(player){
					if(player.id == id) {
						$('#schedule_content_set2_game1_player2_race,#schedule_content_set2_game2_player2_race,'
							+ '#schedule_content_set2_game3_player2_race').dropdown('set selected', player.race);
					}
				});
  			});
  			
  			$('#schedule_content_set3_player1').change(function(){
			    //$.ECELLPUB.tipMessage($(this).dropdown('get value') + ":" + $(this).dropdown('get text'));
				$('#schedule_content_set3_game1_player1, #schedule_content_set3_game2_player1,'
					+ '#schedule_content_set3_game3_player1').val($(this).dropdown('get text'));
				
				var id = $(this).dropdown('get value');
				var playersBasic = $('#schedule_content').data('players_basic');
				playersBasic.forEach(function(player){
					if(player.id == id) {
						$('#schedule_content_set3_game1_player1_race,#schedule_content_set3_game2_player1_race,'
							+ '#schedule_content_set3_game3_player1_race').dropdown('set selected', player.race);
					}
				});
  			});
  			$('#schedule_content_set3_player2').change(function(){
			    //$.ECELLPUB.tipMessage($(this).dropdown('get value') + ":" + $(this).dropdown('get text'));
				$('#schedule_content_set3_game1_player2, #schedule_content_set3_game2_player2,'
					+ '#schedule_content_set3_game3_player2').val($(this).dropdown('get text'));
				
				var id = $(this).dropdown('get value');
				var playersBasic = $('#schedule_content').data('players_basic');
				playersBasic.forEach(function(player){
					if(player.id == id) {
						$('#schedule_content_set3_game1_player2_race,#schedule_content_set3_game2_player2_race,'
							+ '#schedule_content_set3_game3_player2_race').dropdown('set selected', player.race);
					}
				});
  			});
  			
  			$('#schedule_content_set4_player1').change(function(){
			    //$.ECELLPUB.tipMessage($(this).dropdown('get value') + ":" + $(this).dropdown('get text'));
				$('#schedule_content_set4_game1_player1, #schedule_content_set4_game2_player1,'
					+ '#schedule_content_set4_game3_player1').val($(this).dropdown('get text'));
				
				var id = $(this).dropdown('get value');
				var playersBasic = $('#schedule_content').data('players_basic');
				playersBasic.forEach(function(player){
					if(player.id == id) {
						$('#schedule_content_set4_game1_player1_race,#schedule_content_set4_game2_player1_race,'
							+ '#schedule_content_set4_game3_player1_race').dropdown('set selected', player.race);
					}
				});
  			});
  			$('#schedule_content_set4_player2').change(function(){
			    //$.ECELLPUB.tipMessage($(this).dropdown('get value') + ":" + $(this).dropdown('get text'));
				$('#schedule_content_set4_game1_player2, #schedule_content_set4_game2_player2,'
					+ '#schedule_content_set4_game3_player2').val($(this).dropdown('get text'));
				
				var id = $(this).dropdown('get value');
				var playersBasic = $('#schedule_content').data('players_basic');
				playersBasic.forEach(function(player){
					if(player.id == id) {
						$('#schedule_content_set4_game1_player2_race,#schedule_content_set4_game2_player2_race,'
							+ '#schedule_content_set4_game3_player2_race').dropdown('set selected', player.race);
					}
				});
  			});
  			
  			$('#schedule_content_set5_player1').change(function(){
			    //$.ECELLPUB.tipMessage($(this).dropdown('get value') + ":" + $(this).dropdown('get text'));
				$('#schedule_content_set5_game1_player1, #schedule_content_set5_game2_player1,'
					+ '#schedule_content_set5_game3_player1').val($(this).dropdown('get text'));
				
				var id = $(this).dropdown('get value');
				var playersBasic = $('#schedule_content').data('players_basic');
				playersBasic.forEach(function(player){
					if(player.id == id) {
						$('#schedule_content_set5_game1_player1_race,#schedule_content_set5_game2_player1_race,'
							+ '#schedule_content_set5_game3_player1_race').dropdown('set selected', player.race);
					}
				});
  			});
  			$('#schedule_content_set5_player2').change(function(){
			    //$.ECELLPUB.tipMessage($(this).dropdown('get value') + ":" + $(this).dropdown('get text'));
				$('#schedule_content_set5_game1_player2, #schedule_content_set5_game2_player2,'
					+ '#schedule_content_set5_game3_player2').val($(this).dropdown('get text'));
				
				var id = $(this).dropdown('get value');
				var playersBasic = $('#schedule_content').data('players_basic');
				playersBasic.forEach(function(player){
					if(player.id == id) {
						$('#schedule_content_set5_game1_player2_race,#schedule_content_set5_game2_player2_race,'
							+ '#schedule_content_set5_game3_player2_race').dropdown('set selected', player.race);
					}
				});
  			});
  			
  			//get map list and file map dropdown
  			var maps = $.ECELLPUB.staticMap();
		    maps.forEach(function(map){
				$('#schedule_content_set1_game1_map,#schedule_content_set1_game2_map,#schedule_content_set1_game3_map,'
					+ '#schedule_content_set1_game4_map,#schedule_content_set1_game5_map,#schedule_content_set1_game6_map,'
					+ '#schedule_content_set1_game7_map,#schedule_content_set1_game8_map,#schedule_content_set1_game9_map,'
					+ '#schedule_content_set2_game1_map,#schedule_content_set2_game2_map,#schedule_content_set2_game3_map,'
					+ '#schedule_content_set3_game1_map,#schedule_content_set3_game2_map,#schedule_content_set3_game3_map,'
					+ '#schedule_content_set4_game1_map,#schedule_content_set4_game2_map,#schedule_content_set4_game3_map,'
					+ '#schedule_content_set5_game1_map,#schedule_content_set5_game2_map,#schedule_content_set5_game3_map'
				).append('<option value="' + map.value + '">' + map.name + '</option>');
			});
			//hotfix dropdown css for click event
			$('.schedule.hotfix input.search').css('width', '100%');
			
			//reg choose win player button function
			$('.ECELLPUBwin').on('click.ECELLPUB.schedule.selectwin', $.ECELLPUB.schedule.selectWinner);
            
		},
		selectWinner: function() {
			var match = $(this).data('match');
			var player = $(this).data('player');
			if(player == 'p1') {
				$('#' + match + '_win_p1_flag').removeClass('displaynone checkmark remove').addClass('checkmark');
				$('#' + match + '_win_p2_flag').removeClass('displaynone checkmark remove').addClass('remove');
			}
			else if(player == 'p2') {
				$('#' + match + '_win_p1_flag').removeClass('displaynone checkmark remove').addClass('remove');
				$('#' + match + '_win_p2_flag').removeClass('displaynone checkmark remove').addClass('checkmark');
			}
			else if(player == 'refresh') {
				$('#' + match + '_win_p1_flag, #' + match + '_win_p2_flag').removeClass('checkmark remove').addClass('displaynone');
			}
			else {
				$.ECELLPUB.tipMessage('脚本错误，请联系维护人员！', false);
			}
		},
		query: function() {
			$('#schedule_main_table').DataTable().ajax.reload();
			return;
		},
		emptyVal: function() {
			$('#schedule_content_title').html('赛程信息');
			$('.cleanDrop').dropdown('clear');
			$('.cleanVal').val('');
			$('.cleanDisplay').addClass('displaynone');
			
			//$('#schedule_content_set1_player1').dropdown('clear');
			//$('#schedule_content_set1_player2').dropdown('clear');
			//$('#schedule_content_set1_date').val('');
			
			//$('#schedule_content_set1_game1_map').dropdown('clear');
			//$('#schedule_content_set1_game1_hour').val('');
			//$('#schedule_content_set1_game1_minute').val('');
			//$('#schedule_content_set1_game1_second').val('');
			//$('#schedule_content_set1_game1_win_p1_flag').addClass('displaynone');
			//$('#schedule_content_set1_game1_win_p2_flag').addClass('displaynone');
			//$('#schedule_content_set1_game1_player1').val('');
			//$('#schedule_content_set1_game1_player1_race').dropdown('clear');
			//$('#schedule_content_set1_game1_player1_apm').val('');
			//$('#schedule_content_set1_game1_player1_oil').val('');
			//$('#schedule_content_set1_game1_player1_crystal').val('');
			//$('#schedule_content_set1_game1_player2').val('');
			//$('#schedule_content_set1_game1_player2_race').dropdown('clear');
			//$('#schedule_content_set1_game1_player2_apm').val('');
			//$('#schedule_content_set1_game1_player2_oil').val('');
			//$('#schedule_content_set1_game1_player2_crystal').val('');
			
			$('#schedule_content_set_0').click();
			document.body.scrollTop = 0;
		},
		openDetail: function() {
			var scheduleId = $(this).data('id');
			$('#schedule_content').data('schedule_id', scheduleId);
			var rowData = $('#schedule_main_table').DataTable().row( '#' + scheduleId ).data();
			
			var postData = {};
			postData.id = rowData.seasonId;
			
			var urlTarget = o.basePath + '/season/detail';
			
			$.postjson(urlTarget + '?rand=' + Math.random(), JSON.stringify(postData), function(data,textStatus, jqXHR) {
	    		if( data.code == 0 ) {
					var season = data.season;
					if(season.status != 1) {//active season
						var message = '当前赛季不在活动状态，不能修改对应比赛信息!';
						$.ECELLPUB.tipMessage(message);
						return false;	
					}
					
					$.ECELLPUB.schedule.contentToggle();
					var scheduleId = $('#schedule_content').data('schedule_id');
					$.ECELLPUB.schedule.fillDetailData(scheduleId);
					
				} else {
					var message = '查看赛季信息失败![' + data.msg + ', ' + data.code + ']，请联系管理员！';
					$.ECELLPUB.tipMessage(message, false);
				}
			}, 'json');
		},
		contentToggle: function() {
			$.ECELLPUB.schedule.emptyVal();
			$('#schedule_list,#schedule_content').toggleClass('displaynone');
			window.scrollTo(0,0);
		},
		setMatchValue: function(match) {
			var setId = match.setId;
			var gameId = match.gameId;
			$('#schedule_content_set' + setId + '_player1').dropdown('set selected', match.player1Id);
			$('#schedule_content_set' + setId + '_player2').dropdown('set selected', match.player2Id);
			$('#schedule_content_set' + setId + '_date').val(match.raceDay);
			$('#schedule_content_set' + setId + '_game' + gameId + '_map').dropdown('set selected', match.mapId);
			var hhmmss = match.duration.split(':');
			$('#schedule_content_set' + setId + '_game' + gameId + '_hour').val(hhmmss[0]); 
			$('#schedule_content_set' + setId + '_game' + gameId + '_minute').val(hhmmss[1]);
			$('#schedule_content_set' + setId + '_game' + gameId + '_second').val(hhmmss[2]);
			if( match.winner == 1 ) {
				$('#schedule_content_set' + setId + '_game' + gameId + '_win_p1_flag').addClass('checkmark').removeClass('displaynone');
				$('#schedule_content_set' + setId + '_game' + gameId + '_win_p2_flag').addClass('remove').removeClass('displaynone');
			}
			else if( match.winner == 2 ) {
				$('#schedule_content_set' + setId + '_game' + gameId + '_win_p1_flag').addClass('remove').removeClass('displaynone');
				$('#schedule_content_set' + setId + '_game' + gameId + '_win_p2_flag').addClass('checkmark').removeClass('displaynone');
			}
			$('#schedule_content_set' + setId + '_game' + gameId + '_player1_race').dropdown('set selected', match.player1Race);
			$('#schedule_content_set' + setId + '_game' + gameId + '_player2_race').dropdown('set selected', match.player2Race);
			$('#schedule_content_set' + setId + '_game' + gameId + '_player1_apm').val(match.player1Apm);
			$('#schedule_content_set' + setId + '_game' + gameId + '_player2_apm').val(match.player2Apm);
			$('#schedule_content_set' + setId + '_game' + gameId + '_player1_oil').val(match.player1Oil);
			$('#schedule_content_set' + setId + '_game' + gameId + '_player2_oil').val(match.player2Oil);
			$('#schedule_content_set' + setId + '_game' + gameId + '_player1_crystal').val(match.player1Crystal);
			$('#schedule_content_set' + setId + '_game' + gameId + '_player2_crystal').val(match.player2Crystal);
			return;
		},
		fillDetailData: function(scheduleId) {
			var rowData = $('#schedule_main_table').DataTable().row( '#' + scheduleId ).data();
			var htmlData = rowData.seasonName + ' - ' + rowData.round;
			$('#schedule_content_title').html(htmlData);
			
			$('.ui.menu .schedule.item').addClass('displaynone');
			for (var i=0;i<rowData.sets;i++) { 
			    $('#schedule_content_set_'+i).removeClass('displaynone');
			}
			
			// deal how many detail element need to be displayed 
			$('#schedule_content_set1_game1,#schedule_content_set1_game2,#schedule_content_set1_game3,'
				+ '#schedule_content_set1_game4,#schedule_content_set1_game5,#schedule_content_set1_game6,'
				+ '#schedule_content_set1_game7,#schedule_content_set1_game8,#schedule_content_set1_game9').addClass('displaynone');
			
			var gameIds = '#schedule_content_set1_game1';
			for( var i = 1; i < rowData.format; i++ ) {
				gameIds += ', #schedule_content_set1_game' + (Number(i) + 1);
			}
			$(gameIds).removeClass('displaynone');
			
			
			//fill history data
			var postData = {};
			postData.seasonId = rowData.seasonId;
			postData.scheduleId = scheduleId;
			var urlTarget = o.basePath + '/schedule/detail';
			$.postjson(urlTarget + '?rand=' + Math.random(), JSON.stringify(postData), function(data,textStatus, jqXHR) {
	    		if( data.code == 0 ) {
					var matches = data.matches;
					for(var i=0; i<matches.sets; i++) {
						for(var j=0; j<matches.format; j++) {
							var match = matches.setList[i][j];
							if( undefined != match ) {
								$.ECELLPUB.schedule.setMatchValue(match);	
							}
						}
					} 
				} else {
					var message = '获取比赛息失败![' + data.msg + ', ' + data.code + ']，请联系管理员！';
					$.ECELLPUB.tipMessage(message, false);
				}
			}, 'json');
			
			return;
		},
		getMatchValue: function(setId, gameId) {
			var match = {};
			match.setId = setId;
			match.gameId = gameId;
			match.player1Id = $('#schedule_content_set' + setId + '_player1').dropdown('get value');
			match.player2Id = $('#schedule_content_set' + setId + '_player2').dropdown('get value');
			match.raceDay = $('#schedule_content_set' + setId + '_date').val();
			match.mapId = $('#schedule_content_set' + setId + '_game' + gameId + '_map').dropdown('get value');
			match.duration = $('#schedule_content_set' + setId + '_game' + gameId + '_hour').val() + ':' 
				+ $('#schedule_content_set' + setId + '_game' + gameId + '_minute').val() + ':' + $('#schedule_content_set' + setId + '_game' + gameId + '_second').val();
			match.winner = 0;
			if( $('#schedule_content_set' + setId + '_game' + gameId + '_win_p1_flag').hasClass('checkmark') ) {
				match.winner = 1;
			}
			else if( $('#schedule_content_set' + setId + '_game' + gameId + '_win_p2_flag').hasClass('checkmark') ) {
				match.winner = 2;
			}
			match.player1Race = $('#schedule_content_set' + setId + '_game' + gameId + '_player1_race').dropdown('get value');
			match.player2Race = $('#schedule_content_set' + setId + '_game' + gameId + '_player2_race').dropdown('get value');
			match.player1Apm = $('#schedule_content_set' + setId + '_game' + gameId + '_player1_apm').val();
			match.player2Apm = $('#schedule_content_set' + setId + '_game' + gameId + '_player2_apm').val();
			match.player1Oil = $('#schedule_content_set' + setId + '_game' + gameId + '_player1_oil').val();
			match.player2Oil = $('#schedule_content_set' + setId + '_game' + gameId + '_player2_oil').val();
			match.player1Crystal = $('#schedule_content_set' + setId + '_game' + gameId + '_player1_crystal').val();
			match.player2Crystal = $('#schedule_content_set' + setId + '_game' + gameId + '_player2_crystal').val();
			return match;
		},
		saveMatch: function() {
			var scheduleId = $('#schedule_content').data('schedule_id');
			var rowData = $('#schedule_main_table').DataTable().row( '#' + scheduleId ).data();
			var postData = {};
			postData.scheduleName = rowData.round;
			postData.seasonId = rowData.seasonId;
			postData.scheduleId = scheduleId;
			postData.sets = rowData.sets;
			postData.format = rowData.format;
			
			//set1
			/*var set1 = [];
			match11.setId = 1;
			match11.matchId = 1;
			match11.player1Id = $('#schedule_content_set1_player1').dropdown('get value');
			match11.player2Id = $('#schedule_content_set1_player2').dropdown('get value');
			match11.raceDay = $('#schedule_content_set1_date').val();
			match11.mapId = $('#schedule_content_set1_game1_map').dropdown('get value');
			match11.duration = $('#schedule_content_set1_game1_hour').val() + ':' + $('#schedule_content_set1_game1_minute').val() + ':' + $('#schedule_content_set1_game1_second').val();
			match11.winner = 0;
			if( $('#schedule_content_set1_game1_win_p1_flag').hasClass('checkmark') ) {
				match11.winner = 1;
			}
			else if( $('#schedule_content_set1_game1_win_p2_flag').hasClass('checkmark') ) {
				match11.winner = 2;
			}
			match11.player1Race = $('#schedule_content_set1_game1_player1_race').dropdown('get value');
			match11.player2Race = $('#schedule_content_set1_game1_player2_race').dropdown('get value');
			match11.player1Apm = $('#schedule_content_set1_game1_player1_apm').val();
			match11.player2Apm = $('#schedule_content_set1_game1_player2_apm').val();
			match11.player1Oil = $('#schedule_content_set1_game1_player1_oil').val();
			match11.player2Oil = $('#schedule_content_set1_game1_player2_oil').val();
			match11.player1Crystal = $('#schedule_content_set1_game1_player1_crystal').val();
			match11.player2Crystal = $('#schedule_content_set1_game1_player2_crystal').val();*/
			postData.setList = [];
			for(var i=1; i<=postData.sets; i++) {
				var seti = [];
				for(var j=1; j<=postData.format; j++) {
					var matchij = $.ECELLPUB.schedule.getMatchValue(i, j);
					seti.push(matchij);
				}
				postData.setList.push(seti); 
			}
			
			var urlTarget = o.basePath + '/schedule/save/matches';
			$.postjson(urlTarget + '?rand=' + Math.random(), JSON.stringify(postData), function(data,textStatus, jqXHR) {
	    		if( data.code == 0 ) {
					$.ECELLPUB.schedule.contentToggle();
					
					$('#schedule_main_table').DataTable().ajax.reload();
					var message = '保存比赛信息成功!';
					$.ECELLPUB.tipMessage(message);
				} else {
					var message = '保存比赛信息失败![' + data.msg + ', ' + data.code + ']';
					$.ECELLPUB.tipMessage(message, false);
				}
			}, 'json');
		}
	}; // schedule管理结束

	/*
	 * TipMessage(message) ========== Showing the info or warn message.
	 * 
	 * @type Function @usage: $.ECELLPUB.tipMessage(message)
	 */
	$.ECELLPUB.tipMessage = function(message, isAutoClose) {
		// isAutoClose = arguments[1]===undefined ? true : arguments[1];
		var autoClose = arguments[1];
		var type = 'error';
		if( autoClose === undefined ) {
			type = 'info';
		}
		Lobibox.notify(type, {
            size: 'normal',
            rounded: false,
            delayIndicator: true,
            msg: message,
            icon: 'warning icon',
            title: '提示信息',
            showClass: undefined,
            hideClass: undefined,
            sound: undefined,
            img: undefined,
            delay: autoClose
		});
	};// end of $.ECELLPUB.tipMessage
	$.ECELLPUB.tipMessageSuccess = function(message, isAutoClose) {
		// isAutoClose = arguments[1]===undefined ? true : arguments[1];
		var autoClose = arguments[1];
		var type = 'error';
		if( autoClose === undefined ) {
			type = 'success';
		}
		Lobibox.notify(type, {
            size: 'normal',
            rounded: false,
            delayIndicator: true,
            msg: message,
            icon: 'checkmark icon',
            title: '成功信息',
            showClass: undefined,
            hideClass: undefined,
            sound: undefined,
            img: undefined,
            delay: autoClose
		});
	};// end of $.ECELLPUB.tipMessage
  
	/*
	 * CheckLoad() ========== check load response.
	 * 
	 * @type Function @usage: $.ECELLPUB.CheckLoad(response)
	 */
	$.ECELLPUB.CheckLoad = function(response) {
		if(! new RegExp('mainWrapInner').test(response) ){
			window.location.href = '404.html';
		}
			
	};// end of $.ECELLPUB.checkLoad

	/*
	 * ErrOccurred() ========== deal with error message, jump to error page
	 * 
	 * @type Function @usage: $.ECELLPUB.ErrOccurred(response)
	 */
	$.ECELLPUB.ErrOccurred = function(msg, code) {
		sessionStorage.errTip = msg + '[' + code + ']';
		location.href='error.html';
	}// end of $.ECELLPUB.errOccurred
	
	/*
	 * PageActivate() ========== do page initialize
	 * 
	 * @type Function @usage: $.ECELLPUB.PageActivate(response)
	 */
	$.ECELLPUB.PageActivate = function(url) {
		// if( url == 'modules/sys/menu.html' ) {
		if( url == 'match.html' ) {
			$.ECELLPUB.match.activate();
		}
		else if( url == 'daymatch.html' ) {
			$.ECELLPUB.daymatch.activate();
		}
		else if( url == 'pages/season/season.html' ) {
			$.ECELLPUB.season.activate();
		}
		else if( url == 'pages/season/schedule.html' ) {
			$.ECELLPUB.schedule.activate();
		}
		else if( url == 'pages/match/match.html' ) {
			$.ECELLPUB.match.activate();
		}
	}// end of $.ECELLPUB.PageActivate
	
	/*
	 * ParseDataTableResult() ========== parse response data of datatable ajax
	 * request
	 * 
	 * @type Function @usage: $.ECELLPUB.ParseDataTableResult(json)
	 */
	$.ECELLPUB.ParseDataTableResult = function(json) {
		if(json.code != 0) {
			json.list = [];
			var message = '获取数据失败![' + json.message + ', ' + json.code + ']';
			$.ECELLPUB.tipMessage(message, false);
		}
		return json.list;
	}// end of $.ECELLPUB.ParseDataTableResult
	

}









