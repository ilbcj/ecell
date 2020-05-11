/*! SFP main.js
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
 * Main JS application file for SFP v1. This file
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
	throw new Error('SFP requires jQuery');
	
}


/*
 * SFP
 * 
 * @type Object @description $.SFP is the main object for the app. It's used for
 * implementing functions and options related to the SFP. Keeping everything
 * wrapped in an object prevents conflict with other plugins and is a better way
 * to organize our code.
 */
$.SFP = {};

/*
 * -------------------- - SFP Options - -------------------- Modify these
 * options to suit your implementation
 */
$.SFP.options = {
	basePath: 'SFPdemo',
};

/*
 * ------------------ - Implementation - ------------------ The next block of
 * code implements SFP's functions and plugins as specified by the options
 * above.
 */
$(function () {
	'use strict';
	
	// , headers: { 'x-requested-with': 'XMLHttpRequest' }
    $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
    

	// Extend options if external options exist
	if (typeof SFPOptions !== 'undefined') {
		$.extend(true, $.SFP.options, SFPOptions);
	}

	// Easy access to options
	var o = $.SFP.options;
	console.log(o.basePath);
	// Set up the object
	_initSFP(o);

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
	$.SFP.menu.activate();
	
	$.SFP.indexPage.activate();
	setInterval(getLoc, 60000);
});

function getLoc() {
	$.SFP.springTree.activate();
};

/*
 * ---------------------------------- - Initialize the SFP Object -
 * ---------------------------------- All SFP functions are implemented below.
 */
function _initSFP(o) {
	'use strict';
	/*
	 * Menu ====== Create main menu and custom menu
	 * 
	 * @type Object @usage $.SFP.menu.activate() @usage
	 * $.SFP.menu.generateMenu()
	 */
	$.SFP.menu = {
		activate: function () {
			$.post( o.basePath + '/sys/menu/nav?rand=' + Math.random(), function(data){
				if( data.code == 0 ) {
					// sessionStorage.permissions = data.permissions;
					$.SFP.menu.generateMenu(data.menuList);
				}
				else {
					$.SFP.ErrOccurred(data.message, data.code);
				}
			},'json');
			
			/*
			 * //get admin info $.post(o.basePath + '/sys/user/info',
			 * function(data){ if( data.code == 0 ) {
			 * $('#title_admin').html(data.admin.name); } });
			 */
			
			// add logoff event
			$('#logout').on('click.SFP.admin.off', function(e){
				$.post(o.basePath + '/login/logout', function(data){
					window.location = o.basePath + '/login.html';
				});
			});
			
			// add changepwd event
			$('#change_pwd').on('click.SFP.changepwd.data-api',function(e){
    			$('#oldPwd').val('');
    			$('#newPwd').val('');
    			$('#rePwd').val('');
    			$("#change_pwd_modal").modal("setting", "transition", "horizontal flip").modal({
    				closable: false,
			        onApprove: function () {
			        	var oldPwd = $('#oldPwd').val();
		    			var newPwd = $('#newPwd').val();
		    			var rePwd = $('#rePwd').val();
		    			if( newPwd == null || newPwd == '' || newPwd != rePwd ) {
		    				var message = "新口令为空或两次输入的新口令内容不一致！";
							$.SFP.tipMessage(message, false);
							return;
		    			}
		    			
						var postData = '';
						postData = "password=" + oldPwd;
						postData += "&newPassword=" + newPwd;
						$.post(o.basePath + '/login/user/password', postData, function(data, textStatus, jqXHR) {
							if( data.code == 0 ) {
								var message = '修改口令操作成功!';
								$.SFP.tipMessage(message);
							} else {
								var message = '修改口令操作失败![' + data.msg + ', ' + data.code + ']';
								$.SFP.tipMessage(message, false);
							}
						}, 'json');
			        }
    			}).modal("show");
    		});
		},
		generateMenu: function(menuList) {
			
			$('.ui.sidebar.left > div.ui.leftmenu').remove();
			
			var bigmenu = '<div class="ui accordion inverted leftmenu">';
			var smallmenu = '';
			$.each(menuList, function(indexOne, levelOne){
				if( levelOne.orderNum > 100000 ) {
					bigmenu += '<div class="title item displaynone">';
				}
				else {
					bigmenu += '<div class="title item">';	
				}
                bigmenu += '	<i class="' + levelOne.icon + ' titleIcon icon"></i> ' + levelOne.name + ' <i class="dropdown icon"></i>';
                bigmenu += '</div>';
				
				if( levelOne.orderNum > 100000 ) {
					smallmenu += '<div class="ui dropdown item displaynone scrolling leftmenu" style="display:none !important;">';
				}
				else {
					smallmenu += '<div class="ui dropdown item displaynone scrolling leftmenu">';
				}
				smallmenu += '<span>' + levelOne.name + '</span>';
				smallmenu += '<i class="' + levelOne.icon + ' icon"></i>';
				
				if(levelOne.list) {
					bigmenu += '<div class="content">';
					smallmenu += '<div class="menu">';
					smallmenu += '<div class="header">';
					smallmenu += levelOne.name;
					smallmenu += '</div>';
					smallmenu += '<div class="ui divider"></div>';
					$.each(levelOne.list, function(indexTwo, levelTwo){
						if( levelTwo.orderNum < 100000 ) {
							bigmenu += '<a class="item menuentry_' + levelTwo.menuId + '" href="javascript:void(0)">';
			                bigmenu += levelTwo.name;
		                	bigmenu += '</a>';
		                	
		                	smallmenu += '<a class="item menuentry_' + levelTwo.menuId + '" href="javascript:void(0)">';
					        smallmenu += levelTwo.name;
					        smallmenu += '</a>';
				       }
					});
					bigmenu += '</div>';
					smallmenu += '</div>';
				}
				smallmenu += '</div>';
			});
			bigmenu += '</div>';
			$('.item.logo').after(bigmenu).after(smallmenu);
			
			$(".ui.dropdown").dropdown({
			    allowCategorySelection: true,
			    transition: "fade up"
			});
			$('.ui.accordion').accordion({
			    selector: {}
			});
			
			$(".sidebar").getNiceScroll().remove();
			$(".sidebar").niceScroll({
		        cursorcolor: "#3d3b3b",
		        cursorwidth: 2,
		        cursorborderradius: 0,
		        cursorborder: 0,
		        scrollspeed: 50,
		        autohidemode: true,
		        zindex: 9999999
		    });
		
		    $(".displaynone .menu").niceScroll({
		        cursorcolor: "#3d3b3b",
		        cursorwidth: 5,
		        cursorborderradius: 0,
		        cursorborder: 0,
		        scrollspeed: 50,
		        autohidemode: true,
		        zindex: 9999999
		    });
		    
		    $.each(menuList, function(indexOne, levelOne){
		    	if(levelOne.list) {
					$.each(levelOne.list, function(indexTwo, levelTwo){
						$('.menuentry_' + levelTwo.menuId).on('click.SFP.menu.data-api', function(e){
							$('.modal').remove();
			    			$('div.mainWrap').load(levelTwo.url + '?random=' + Math.random() + ' .mainWrapInner',
			    				function(response,status,xhr){$.SFP.CheckLoad(response);$.SFP.PageActivate(levelTwo.url);});
			    		});
					});
				}
		    });
		}
	};// end of $.SFP.menu
	
	$.SFP.indexPage = {
		activate: function () {
			$.post(o.basePath + '/stat/devquantity?rand=' + Math.random(), {}, function(data,textStatus, jqXHR) {
				if( data.code == 0 ) {
					var devQuantity = document.getElementById("dev_quantity").getContext("2d");
					
					$.each(data.list, function(index, item, array){
						if( item.status == 1 ) {
							item.label = '未激活设备';
							item.color = '#F7464A';
							item.highlight = '#FF5A5E';
						}
						else if( item.status == 2 ) {
							item.label = '已激活设备';
							item.color = '#FDB45C';
							item.highlight = '#FFC870';
						}
						item.value = item.num;
					});
				    var myPieChart = new Chart(devQuantity).Pie(data.list, {
				        responsive: true,
				    });
				} else {
					var message = '加载统计信息失败![' + data.msg + ', ' + data.code + ']';
					$.SFP.tipMessage(message, false);
				}
			}, 'json');
			
			
			$.post(o.basePath + '/stat/plateform?rand=' + Math.random(), {}, function(data,textStatus, jqXHR) {
				if( data.code == 0 ) {
					var items = [];
					var tmp = {};
					tmp.label = 'linux';
					tmp.color = '#FDB45C';
					tmp.highlight = '#FFC870';
					tmp.value = 0;
					items.push(tmp);
					tmp.label = 'windows';
					tmp.color = '#F7464A';
					tmp.highlight = '#FF5A5E';
					tmp.value = 0;
					items.push(tmp);
					tmp.label = 'ios';
					tmp.color = '#949FB1';
					tmp.highlight = '#A8B3C5';
					tmp.value = 0;
					items.push(tmp);
					tmp.label = 'android';
					tmp.color = '#46BFBD';
					tmp.highlight = '#5AD3D1';
					tmp.value = 0;
					items.push(tmp);
					tmp.label = 'embeded';
					tmp.color = '#EE82EE';
					tmp.highlight = '#EE00EE';
					tmp.value = 0;
					items.push(tmp);
					$.each(data.list, function(index, item, array){
						if( item.source == 'linux' ) {
							item.label = 'linux';
							item.color = '#FDB45C';
							item.highlight = '#FFC870';
						}
						else if( item.source == 'windows' ) {
							item.label = 'windows';
							item.color = '#F7464A';
							item.highlight = '#FF5A5E';
						}
						else if( item.source == 'ios' ) {
							item.label = 'ios';
							item.color = '#949FB1';
							item.highlight = '#A8B3C5';
						}
						else if( item.source == 'android' ) {
							item.label = 'android';
							item.color = '#46BFBD';
							item.highlight = '#5AD3D1';
						}
						else if( item.source == 'embeded' ) {
							item.label = 'embeded';
							item.color = '#EE82EE';
							item.highlight = '#EE00EE';
						}
						item.value = item.count;
					});
					
					var platformCount = document.getElementById("platform_count").getContext("2d");
					if( data.list.length == 0 ) {
						data.list = items;
					}
				    var myPaloChart = new Chart(platformCount).PolarArea(data.list, {
				        responsive: true,
				    });
				} else {
					var message = '加载统计信息失败![' + data.msg + ', ' + data.code + ']';
					$.SFP.tipMessage(message, false);
				}
			}, 'json');
			
			$.post(o.basePath + '/stat/signin?rand=' + Math.random(), {}, function(data,textStatus, jqXHR) {
				if( data.code == 0 ) {
					
					var radarChartData = {
					    labels: ["Windows", "Android", "Linux", "IOS","EMBEDED"],
					    datasets: [
					        {
					            label: "签到情况",
					            fillColor: "rgba(220,220,220,0.2)",
					            strokeColor: "rgba(220,220,220,1)",
					            pointColor: "rgba(220,220,220,1)",
					            pointStrokeColor: "#fff",
					            pointHighlightFill: "#fff",
					            pointHighlightStroke: "rgba(220,220,220,1)",
					            data: [data.list.windows, data.list.android, data.list.linux, data.list.ios,data.list.embeded]
					        }
					    ]
					};
					var signinCount = document.getElementById("signin_count").getContext("2d");
					var myRadar = new Chart(signinCount).Radar(radarChartData, {
				        responsive: true,
				   });
				} else {
					var message = '加载统计信息失败![' + data.msg + ', ' + data.code + ']';
					$.SFP.tipMessage(message, false);
				}
			}, 'json');
			
			$.post(o.basePath + '/stat/operate?rand=' + Math.random(), {}, function(data,textStatus, jqXHR) {
				if( data.code == 0 ) {
					var monthes = [];
					$.each(data.list, function(index, item, array){
						if( monthes.indexOf( item.handletime ) == -1 ) {
							monthes.push( item.handletime );
						}
					});
					
					var registData = {};
					var signinData = {};
					var cmdData = {};
					var dataData = {};
					$.each(monthes, function(index, item, array){
						registData[item] = {};
						signinData[item] = {};
						cmdData[item] = {};
						dataData[item] = {};
					});
					
					$.each(data.list, function(index, item, array){
						if( item.optflag == 1 ) {
							registData[item.handletime] = item.num;
						}
						else if( item.optflag == 5 ) {
							signinData[item.handletime] = item.num;
						}
						else if( item.optflag == 8 ) {
							cmdData[item.handletime] = item.num;
						}
						else if( item.optflag == 7 ) {
							dataData[item.handletime] = item.num;
						}
					});
					
					var registDataArray = [];
					var signinDataArray = [];
					var cmdDataArray = [];
					var dataDataArray = [];
					for(var idx in registData){
						registDataArray.push(registData[idx]);
					}
					for(var idx in signinData){
						signinDataArray.push(signinData[idx]);
					}
					for(var idx in cmdData){
						cmdDataArray.push(cmdData[idx]);
					}
					for(var idx in dataData){
						dataDataArray.push(dataData[idx]);
					}
					
					var barChartdata = {
					    labels: monthes,
					    datasets: [
					        {
					            label: "激活数量",
					            fillColor: "rgba(247,70,74,0.5)",
					            strokeColor: "rgba(247,70,74,0.8)",
					            highlightFill: "rgba(247,70,74,0.75)",
					            highlightStroke: "rgba(247,70,74,1)",
					            data: registDataArray
					        },
					        {
					            label: "签到数量",
					            fillColor: "rgba(70,191,189,0.5)",
					            strokeColor: "rgba(70,191,189,0.8)",
					            highlightFill: "rgba(70,191,189,0.75)",
					            highlightStroke: "rgba(70,191,189,1)",
					            data: signinDataArray
					        },
					        {
					            label: "指令数量",
					            fillColor: "rgba(253,180,92,0.5)",
					            strokeColor: "rgba(253,180,92,0.8)",
					            highlightFill: "rgba(253,180,92,0.75)",
					            highlightStroke: "rgba(253,180,92,1)",
					            data: cmdDataArray
					        },
					        {
					            label: "数据数量",
					            fillColor: "rgba(148,159,177,0.5)",
					            strokeColor: "rgba(148,159,177,0.8)",
					            highlightFill: "rgba(148,159,177,0.75)",
					            highlightStroke: "rgba(148,159,177,1)",
					            data: dataDataArray
					        }
					    ]
					};
					var operateCount = document.getElementById("operate_count").getContext("2d");
				    var myLineChart = new Chart(operateCount).Bar(barChartdata, {
				        responsive: true,
				        maintainAspectRatio: true
				    });
				} else {
					var message = '加载统计信息失败![' + data.msg + ', ' + data.code + ']';
					$.SFP.tipMessage(message, false);
				}
			}, 'json');			
		}
	};// end of $.SFP.indexPage
	
	/*
	 * admin ====== admin infomation maintain page
	 * 
	 * @type Object @usage $.SFP.admin.activate() @usage
	 * $.SFP.admin.queryAdmin() @usage $.SFP.admin.addAdminWindow() @usage
	 * $.SFP.admin.adminDetailReturn() @usage $.SFP.admin.saveAdminConfirm()
	 * @usage $.SFP.admin.delAdmin() @usage $.SFP.admin.delAdminConfirm()
	 */
	$.SFP.admin = {
		activate: function () {
			$(".ui.dropdown").dropdown({
			    allowCategorySelection: true,
			    transition: "fade up"
			});
			
			var dtable = $('#admin_main_table').DataTable({
				ajax:{
					url: o.basePath + '/sys/user/list',
					type: 'POST',
					data: function ( d ) {
				        d.username = $('#admin_search_name').val();
				        d.status = 1;
					},
					dataSrc: $.SFP.ParseDataTableResult
				},
				processing: true,
				serverSide: true,
				columns: [
					{ data: 'loginId' },
					{ data: 'roleId' },
					{ data: 'status' },
				],
				rowId: 'loginId',
		        // pagingType: "full_numbers_icon",
		        columnDefs: [
		        	{
						render: function ( data, type, row ) {
							var html = '';
							if( data == 0 ) {
								html = '<span class="ui basic red button">禁用</span>';
							}
							else if( data == 1 ) {
								html = '<span class="ui basic green button">使用中</span>';
							}
							else if( data == 2 ) {
								html = '<span class="ui basic black button">已删除</span>';
							}
							return html;
						},
						targets: 2
					},
					{
						render: function ( data, type, row ) {
							var html = '';
							if(row.status == 1) {
								html = '<div class="btn-group">';
								html += '<div class="ui green horizontal label admin_info" data-id="' + row.loginId + '"><i class="large edit icon"></i>修改</div>';
								html += '<div class="ui red horizontal label admin_del" data-id="' + row.loginId + '"><i class="large trash outline icon"></i>删除</div>';
								html += '<div class="ui green horizontal label admin_info" data-id="' + row.loginId + '"><i class="large edit icon"></i>启用</div>';
								html += '<div class="ui red horizontal label admin_del" data-id="' + row.loginId + '"><i class="large trash outline icon"></i>停用</div>';
								html += '</div>';
							}
							return html;							
						},
						targets: 3
					}
				],
		        order: [1, 'desc'],
				responsive: true
		    });
			
			// listen page items' event
			$('#admin_search').on('click.SFP.admin.query', $.SFP.admin.queryAdmin);
			$('#add_admin').on('click.SFP.admin.add', $.SFP.admin.addAdminWindow);
			$('#admin_detail_save').on('click.SFP.admin.detailsave', $.SFP.admin.saveAdminConfirm);
			$('#admin_detail_return').on('click.SFP.admin.detailreturn', $.SFP.admin.adminDetailReturn);
			$('#admin_main_table').on( 'draw.dt', function () {
				$('.admin_info').on('click.SFP.admin.detail', $.SFP.admin.addAdminWindow);
				$('.admin_del').on('click.SFP.admin.delete.single', $.SFP.admin.delAdmin);
			});
			$('#admin_confirm_modal_confirm').on('click.SFP.admin.delconfirm', $.SFP.admin.delAdminConfirm);
			
		},
		queryAdmin: function () {
			$('#admin_main_table').DataTable().ajax.reload();
			return;
		},
		addAdminWindow: function () {
			var adminId = $(this).data('id');
			if( undefined == adminId ) {
				adminId = 0;
			}
			
			$.post(o.basePath + '/sys/user/info/' + adminId + '?rand=' + Math.random(), {}, function(data,textStatus, jqXHR) {
				if( data.code == 0 ) {
					var htmlData = '';
					
					if( adminId != 0 ) {
						$('#admin_name').val(data.user.username);
						$('#admin_email').val(data.user.email);
						$('#admin_mobile').val(data.user.mobile);
					}
					
					$('#admin_detail_save').data('admin_id', adminId);
					$('#admin_list_page, #admin_detail_page').toggleClass('displaynone');
					$('body').getNiceScroll().resize();
				}
				else {
					var message = '获取管理员权限信息失败![' + data.msg + ', ' + data.code + ']';
					$.SFP.tipMessage(message, false);
				}
			}, 'json');
		},
		adminDetailReturn: function () {
			$('#admin_name').val('');
			$('#admin_email').val('');
			$('#admin_mobile').val('');
			$('#admin_pwd').val('');
			$('#admin_repwd').val('');
			$('#admin_list_page, #admin_detail_page').toggleClass('displaynone');
		},
		saveAdminConfirm: function () {
			var adminId = $('#admin_detail_save').data('admin_id');
			var name = $('#admin_name').val();
		    var email = $('#admin_email').val();
		    var mobile = $('#admin_mobile').val();
		    var pwd = $('#admin_pwd').val().trim();
		    var repwd = $('#admin_repwd').val().trim();
		    if( adminId == 0 && pwd.length == 0 ) {
		    	var message = '保存管理员信息失败![添加管理员时，口令不能为空]';
				$.SFP.tipMessage(message, false);
				return;
		    }
		    if( pwd != repwd ) {
		    	var message = '保存管理员信息失败![口令与重复口令不匹配，请重新输入!]';
		    	$('#admin_pwd').val('');
		    	$('#admin_repwd').val('');
				$.SFP.tipMessage(message, false);
				return;
		    }
			var postData = {};
			postData.userId = adminId;
			postData.username = name;
			postData.email = email;
			postData.mobile = mobile;
			postData.roleIdList = [];
			if( pwd.length > 0 ) {
				postData.password = pwd;
			}
			$('#admin_role_list input:checkbox:checked').each(function(index, item, arr){
				postData.roleIdList.push($(item).val());
			});
			
			var urlTarget = o.basePath + '/sys/user/';
			if( adminId == 0 ) {
				urlTarget += 'save';
			}
			else {
				urlTarget += 'update';
			}
			$.post(urlTarget + '?rand=' + Math.random(), postData, function(data, textStatus, jqXHR) {
	    		if( data.code == 0 ) {
					$.SFP.admin.adminDetailReturn();
					
					$('#admin_main_table').DataTable().ajax.reload();
					var message = '保存管理员信息成功!';
					$.SFP.tipMessage(message);
				} else {
					var message = '保存管理员信息失败![' + data.msg + ', ' + data.code + ']';
					$.SFP.tipMessage(message, false);
				}
			}, 'json');
		},
		delAdmin: function () {
			var rowId = $(this).data('id');
			var delIds = ''+rowId;
			
			var rowData = $('#admin_main_table').DataTable().row('#'+rowId).data();
			var message = '是否要删除此管理员 [ ' + rowData.username + ' ] ？';
			
			$('#admin_confirm_modal_message').empty().append(message);
			$('#admin_confirm_modal_confirm').data('delIds', delIds);
			$("#admin_confirm_modal").modal({closable:false}).modal('show');
		},
		delAdminConfirm: function (postData) {
			var delIds = $('#admin_confirm_modal_confirm').data('delIds');
			var postData = {userIds:delIds};
			
			$.post(o.basePath + '/sys/user/delete', postData, function(data, textStatus, jqXHR) {
				if( data.code == 0 ) {
					var message = '管理员信息已删除!';
					$.SFP.tipMessage(message);
					$('#admin_main_table').DataTable().ajax.reload();
				} else {
					var message = '删除管理员信息失败![' + data.msg + ', ' + data.code + ']';
					$.SFP.tipMessage(message, false);
				}
			}, 'json');
		}
	};// end of $.SFP.admin
	//密钥下载记录
	$.SFP.keyDownload={
			activate: function() {
				var dtable = $('#keyDownloadList_main_table').DataTable({
					ajax: {
						url: o.basePath + '/key/list',
						type: 'POST',
						data: function(d) {
							var devID=$('#keyDownloadList_devid').val().trim();
							var appID=$('#keyDownloadList_appid').val().trim();
							d.devId = devID;
							d.appId = appID;
						},
						dataSrc: $.SFP.ParseDataTableResult
					},
					processing: true,
					serverSide: true,
					columns: [{
						data: 'devId',
						className : 'my_table_full'}, {
						data: 'appId',
						className : 'my_table_full'
					}, {
						data: 'protectKCV'
					}, {
						data: 'signinKCV'
					}, {
						data: 'halfKCV'
					}, {
						data: 'commandKCV'
					}, {
						data: 'dataKCV'
					}, {
						data: 'cpkKCV'
					}, {
						data: 'sm9KCV'
					},{
						data: 'status'
					}],
					columnDefs: [
						{
							render: function(data, type, row) {
								var html = '';
								if(data == 1) {
									html = '<span class="ui basic red button">未下载</span>';
								} else if(data == 2||data==3||data==4) {
									html = '<span class="ui basic green button">已下载</span>';
								} 
								return html;
							},
							targets: 9
						}
				],
		        pagingType: "full_numbers_icon",
					rowId: 'id',
					order: [1, 'desc'],
					responsive: true
				});

				// listen page items' event
				$('#keyDownloadList_search').on('click.SFP.keyDownload.query',
					$.SFP.keyDownload.queryKeyList);
			},
			queryKeyList: function() {
				$('#keyDownloadList_main_table').DataTable().ajax.reload();
				return;
			}
	};//密钥下载记录结束
	//密钥注销记录
	$.SFP.keyExit={
			activate: function() {
				var dtable = $('#keyExitList_main_table').DataTable({
					ajax: {
						url: o.basePath + '/key/list',
						type: 'POST',
						data: function(d) {
							var devID=$('#keyExitList_devid').val().trim();
							var appID=$('#keyExitList_appid').val().trim();
							d.devId = devID;
							d.appId = appID;
						},
						dataSrc: $.SFP.ParseDataTableResult
					},
					processing: true,
					serverSide: true,
					columns: [{
						data: 'devId',
						className : 'my_table_full'
					}, {
						data: 'appId',
						className : 'my_table_full'
					}, {
						data: 'protectKCV'
					}, {
						data: 'signinKCV'
					}, {
						data: 'halfKCV'
					}, {
						data: 'commandKCV'
					}, {
						data: 'dataKCV'
					}, {
						data: 'cpkKCV'
					}, {
						data: 'sm9KCV'
					},{
						data: 'status'
					}],
					columnDefs: [
						{
							render: function(data, type, row) {
								var html = '';
								if(data == 4) {
									html = '<span class="ui basic red button">已注销</span>';
								} else  {
									html = '<span class="ui basic green button">未注销</span>';
								} 
								return html;
							},
							targets: 9
						}
				],
					rowId: 'id',
					order: [1, 'desc'],
					responsive: true
				});

				// listen page items' event
				$('#keyExitList_search').on('click.SFP.keyDownload.query',
					$.SFP.keyExit.queryKeyList);
			},
			queryKeyList: function() {
				$('#keyExitList_main_table').DataTable().ajax.reload();
				return;
			}
	};//密钥注销记录结束
	//密钥更新
	$.SFP.keyUpdate={
			activate: function() {
				var dtable = $('#keyUpdateList_main_table').DataTable({
					ajax: {
						url: o.basePath + '/key/updateList',
						type: 'POST',
						data: function(d) {
							var devID=$('#keyUpdateList_devid').val().trim();
							var appID=$('#keyUpdateList_appid').val().trim();
							d.devId = devID;
							d.appId = appID;
						},
						dataSrc: $.SFP.ParseDataTableResult
					},
					processing: true,
					serverSide: true,
					
					columns: [{
						data: 'devId',
						className : 'my_table_full'
					}, {
						data: 'appId',
						className : 'my_table_full'
					}, {
						data: 'version'
					}, {
						data: 'nextVersion'
					}, {
						data: null
					},],
					columnDefs: [
						{
							render: function(data, type, row) {
								var str=row.nextVersion.trim();
								var html = '';
								if(str == ''&&row.status!="1") {
									html = '<span class="ui basic red button updateKey" data-id="' + row.id + '">更新</span>';
								} else  {
									html = '<span class="ui basic red button disabled">更新</span>';
								} 
								return html;
							},
							targets: 4
						}
				],
					rowId: 'id',
					order: [1, 'desc'],
					responsive: true
				});
				$('#keyUpdateList_main_table').on( 'draw.dt', function () {
					$('.updateKey').on('click.SFP.keyUpdate.updateKey', $.SFP.keyUpdate.updateKey);
				});
				// listen page items' event
				$('#keyUpdateList_search').on('click.SFP.keyUpdate.query',
					$.SFP.keyUpdate.queryKeyList);
			},
			updateKey:function(){
				var id=$(this).data('id');
				var rowData = $('#keyUpdateList_main_table').DataTable().row('#'+id).data();
				var postData = {};
				postData.devId = rowData.devId;
				postData.appId = rowData.appId;
				var urlTarget = o.basePath + '/key/updateKey/';
				$.postjson(urlTarget + '?rand=' + Math.random(), JSON
						.stringify(postData),
						function(data, textStatus, jqXHR) {
							if(data.code ==0) {
								$('#keyUpdateList_main_table').DataTable().ajax.reload(null, false);
								$.SFP.tipMessageSuccess("密钥更新成功。");
							} else {
								var msg = data.msg;
								$.SFP.tipMessage(msg, false);
							}
						}, 'json');
			},
			queryKeyList: function() {
				$('#keyUpdateList_main_table').DataTable().ajax.reload();
				return;
			}
	};//密钥结束
	// 策略角色管理
	var rowID = '';
	var delRoleId = '';
	$.SFP.strategy = {
		'flag': 0,
		activate: function() {
			$(".ui.modal.small").modal("attach events", ".modalfour", "show");

			$(".ui.dropdown").dropdown({
				allowCategorySelection: true,
				transition: "fade up"
			});
			var flag = true;
			if(flag) {
				$.post(o.basePath + '/algorithm/allAlgorithm?devid=', {},
					function(data, textStatus, jqXHR) {
						if(data.code == 0) {
							var list = data.list;
							for(var i = 0; i < list.length; i++) {
								if(list[i].algoType == 1) {
									if(list[i].algoName == 'sm4') {
										$(".encryptionAlgorithm").prepend(
											"<div class='item' data-value=" +
											list[i].algoId +
											">" +
											list[i].algoName +
											"</div>");
									}

								} else if(list[i].algoType == 2) {
									$(".signatureAlgorithm").prepend(
										"<div class='item' data-value=" +
										list[i].algoId + ">" +
										list[i].algoName +
										"</div>");
								}
							}
							$(".encryptionAlgorithm").prepend(
								"<div class='item' data-value=" + 0 +
								">" + "</div>");
						} else {
							$.SFP.tipMessage("算法列表加载失败！", false);
						}
					}, 'json');
				flag = false;
			}
			var dtable = $('#role_main_table')
				.DataTable({
					ajax: {
						url: o.basePath + '/strategy/RoleList',
						type: 'POST',
						data: function(d) {
							d.roleName = $('#role_search_name')
								.val();
						},
						dataSrc: $.SFP.ParseDataTableResult
					},
					processing: true,
					serverSide: true,
					columns: [{
						data: 'roleName'
					}, {
						data: 'des'
					}, {
						data: null
					}],
					rowId: 'roleId',
					// pagingType: "full_numbers_icon",
					columnDefs: [{
						render: function(data, type, row) {
							var html = '';
							html = '<div class="btn-group">';
							html += '<a class="ui red horizontal label del_role" data-id="' +
								row.roleId +
								'"><i class="large remove user icon"></i>删除</a>';
							html += '<a class="ui blue horizontal label mod_role" data-id="' +
								row.roleId +
								'"><i class="large edit icon"></i>详情</a>';
							html += '</div>';
							return html;
						},
						targets: 2
					}],
					order: [1, 'desc'],
					responsive: true
				});
			$('#role_search').on('click.SFP.strategy.queryRoleList',
				$.SFP.strategy.queryRoleList);
			$('#add_Role').on('click.SFP.strategy.add_Role',
				$.SFP.strategy.add_Role);
			$('#delete_false').on('click.SFP.strategy.delete_false',
				$.SFP.strategy.delete_false);
			$('#delete_true').on('click.SFP.strategy.add_Role',
				$.SFP.strategy.delete_true);
			$('#back_buttonS').on('click.SFP.strategy.back_buttonS',
				$.SFP.strategy.back_buttonS);
			$('#back_buttonM').on('click.SFP.strategy.back_buttonM',
				$.SFP.strategy.back_buttonM);

			// $('#add_role').on('click.SFP.strategy.save_Role',
			// $.SFP.strategy.save_Role);
			$.SFP.strategy.save_Role(true);
			$('#role_main_table').on(
				'draw.dt',
				function() {
					$('.del_role').on('click.SFP.strategy.deletea',
						$.SFP.strategy.deletea);
					$('.mod_role').on('click.SFP.strategy.modifyRole',
						$.SFP.strategy.modifyRole);
				});
		},

        sumberCheck:function(value){
        	var r = /^\+?[1-9][0-9]*$/;//正整数
        	if(value==""){
        		return true;
        	}
            if(!r.test(value)){
            	return false;
            }
            if(value>10080){
            	return false;
            }
            if(value<1){
            	return false;	
            }
            return true;
        },
		back_buttonS: function() {
			$.SFP.strategy.emptyVal();
			$('#Role_list_page,#Role_regist_page').toggleClass('displaynone');
		},
		back_buttonM: function() {
			$.SFP.strategy.emptyVal();
			$('#Role_list_page,#Role_regist_page').toggleClass('displaynone');

		},
		delete_true: function() {
			var postData = {};
			postData.roleId = delRoleId;
			var urlTarget = o.basePath + '/Role/delRole';
			$.postjson(urlTarget + '?rand=' + Math.random(), JSON
				.stringify(postData),
				function(data, textStatus, jqXHR) {
					if(data.code == 0) {
						$.SFP.tipMessageSuccess("角色删除成功。");
						$('#role_main_table').DataTable().ajax.reload();
						$("#delete_role_model").modal({
							closable: false
						}).modal('hidden');
					} else {
						var msg = data.msg;
						$.SFP.tipMessage(msg, false);
					}
				}, 'json');
		},
		modifyRole: function() {
			$('#modifyRoleDiv').removeClass("displaynone");
			$('#saveRoleDiv').toggleClass("displaynone", true);
/*			$("#timeIntervalType").attr("checked", true);
			$('#timeIntervalType').attr('onClick', "javascript:return false");*/
			var roleId = $(this).data('id');
			rowID = roleId + '';
			var postData = {};
			postData.roleId = rowID;
			var urlTarget = o.basePath + '/Role/detailRole';
			$.postjson(urlTarget + '?rand=' + Math.random(), JSON
				.stringify(postData),
				function(data, textStatus, jqXHR) {
					if(data.code == 0) {
						var list = data.mapk.algo;
						for(var i = 0; i < list.length; i++) {
							/*$("#algorithmType").attr("checked", true);
							$('#algorithmType').attr('onClick',
								"javascript:return false");*/
							$('#role_name').val(list[i].roleName);
							$('#role_Des').val(list[i].des);
							if(list[i].strategyName == '签到') {
								$("#signBox").prop("checked", 'checked');
								$('#signEnyAlgo').dropdown('set selected',
									parseInt(list[i].encryAlgoId));
								$('#signSigAlgo').dropdown('set selected',
									parseInt(list[i].signAlgoId));
							} else if(list[i].strategyName == '数据') {
								$("#dataBox").prop("checked", 'checked');
								$('#dataEnyAlgo').dropdown('set selected',
									parseInt(list[i].encryAlgoId));
								$('#dataSignAlgo').dropdown('set selected',
									parseInt(list[i].signAlgoId));
							} else if(list[i].strategyName == '指令') {
								$("#cmdBox").prop("checked", 'checked');
								$('#cmdEnyAlgo').dropdown('set selected',
									parseInt(list[i].encryAlgoId));
								$('#cmdSignAlgo').dropdown('set selected',
									parseInt(list[i].signAlgoId));
							}
						}
						var list1 = data.mapk.time;
						for(var i = 0; i < list1.length; i++) {
			                if(list1[i].strategyName=='心跳时间间隔'){
			                	$('#role_input_heartbeat').val(list1[i].timeInterval);
			                }else if(list1[i].strategyName=='数据采集时间间隔'){
			                	$('#role_input_datagather').val(list1[i].timeInterval);
			                }
						}

						$('#Role_list_page,#Role_regist_page').toggleClass(
							'displaynone');
					} else {
						var msg = data.msg;
						$.SFP.tipMessage(msg, false);
					}
				}, 'json');
			$("#modify_role")
				.click(
					function(e) {
						if(!e.isPropagationStopped()) { // 确定stopPropagation是否被调用过
							var roleName = $('#role_name').val().trim();
							if(roleName == "") {
								$.SFP.tipMessage("请输入角色名称！", false);
								return false;
							}
							var roleDes = $('#role_Des').val().trim();
							if(roleDes == "") {
								$.SFP.tipMessage("请输入角色备注！", false);
								return false;
							}
							var postData = {};
							postData.roleId = rowID + '';
							postData.roleName = roleName;
							postData.roleDes = roleDes;
								// 封装签到类型参数
								if($('#signBox').is(':checked')) {
									postData.signType = 1;
									var statusE = $('#signEnyAlgo')
										.dropdown('get value');
									if(statusE == "") {
										$.SFP.tipMessage("请选择加密算法类型！",
											false);
										return false;
									}
									postData.signEnPar = statusE;
									var statusS = $('#signSigAlgo')
										.dropdown('get value');
									if(statusS == "") {
										$.SFP.tipMessage("请选择签名算法类型！",
											false);
										return false;
									}
									postData.signSiPar = statusS;
								} else {
									postData.signType = 0;
								}
								// 封装数据类型参数
								if($('#dataBox').is(':checked')) {
									postData.dataType = 1;
									var statusE = $('#dataEnyAlgo')
										.dropdown('get value');
									if(statusE == "") {
										$.SFP.tipMessage("请选择加密算法类型！",
											false);
										return false;
									}
									postData.dataEnPar = statusE;
									var statusS = $('#dataSignAlgo')
										.dropdown('get value');
									if(statusS == "") {
										$.SFP.tipMessage("请选择签到算法类型！",
											false);
										return false;
									}
									postData.dataSiPar = statusS;
								} else {
									postData.dataType = 0;
								}
								// 封装指令类型参数
								if($('#cmdBox').is(':checked')) {
									postData.cmdType = 1;
									var statusE = $('#cmdEnyAlgo')
										.dropdown('get value');
									if(statusE == "") {
										$.SFP.tipMessage("请选择加密算法类型！",
											false);
										return false;
									}
									postData.cmdEnPar = statusE;
									var statusS = $('#cmdSignAlgo')
										.dropdown('get value');
									if(statusS == "") {
										$.SFP.tipMessage("请选择签名算法类型！",
											false);
										return false;
									}
									postData.cmdSiPar = statusS;
								} else {
									postData.cmdType = 0;
								}
								if(!($('#cmdBox').is(':checked') ||
										$('#dataBox').is(':checked') || $(
											'#signBox').is(':checked'))) {
									$.SFP.tipMessage("请勾选策略参数！", false);
									return false;;
								}
							
							
							
								var heartbeatTime = $('#role_input_heartbeat').val().trim();
								var dataGatherTime = $('#role_input_datagather').val().trim();
								if(heartbeatTime == "") {
									postData.heartbeatType=0;
							    }else{
							    	postData.heartbeatType=1;
							    }
							    postData.heartbeatTime = heartbeatTime;
							    if(dataGatherTime == "") {
									postData.dataGatherType=0;
							    }else{
							    	postData.dataGatherType=1;
							    }
							    postData.dataGatherTime = dataGatherTime;
							    /*if(heartbeatTime == "" && dataGatherTime == ""){
							    	$.SFP.tipMessage("请输入时间间隔策略！", false);
								    return false;
							    }*/
							    if(!$.SFP.strategy.sumberCheck(heartbeatTime)){
							    	$.SFP.tipMessage("输入的时间格式不对", false);
							    	return false;
							    }
							    if(!$.SFP.strategy.sumberCheck(dataGatherTime)){
							    	$.SFP.tipMessage("输入的时间格式不对", false);
							    	return false;
							    }
							    
							
							var urlTarget = o.basePath +
								'/Role/modifyRole';
							$
								.postjson(
									urlTarget + '?rand=' +
									Math.random(),
									JSON.stringify(postData),
									function(data, textStatus,
										jqXHR) {
										if(data.code == 0) {
											$.SFP
												.tipMessageSuccess("角色修改成功。");
											$(
													'#role_main_table')
												.DataTable().ajax
												.reload();
											$(
													'#Role_list_page,#Role_regist_page')
												.toggleClass(
													'displaynone');
											$.SFP.strategy
												.emptyVal();
											$(this)
												.parents(
													'.anElement')
												.remove();
											return false;
										} else {
											var msg = data.msg;
											$.SFP.tipMessage(
												msg, false);
											$.SFP.strategy
												.emptyVal();
											return false;
										}
									}, 'json');
						}
						e.stopPropagation(); // 必须要，不然e.isPropagationStopped()无法判断stopPropagation是否调用过
					});
		},
		queryRoleList: function() {
			$('#role_main_table').DataTable().ajax.reload();
			return;
		},
		deletea: function() {
			var roleId = $(this).data('id');
			delRoleId = roleId + '';
			$("#delete_role_model").modal({
				closable: false
			}).modal('show');

		},
		emptyVal: function() {
			$('#role_name').val('');
			$('#role_Des').val('');
			$("#signBox").attr("checked", false);
			$("#dataBox").attr("checked", false);
			$("#cmdBox").attr("checked", false);
			$('#signEnyAlgo').dropdown('clear');
			$('#signSigAlgo').dropdown('clear');
			$('#dataEnyAlgo').dropdown('clear');
			$('#dataSignAlgo').dropdown('clear');
			$('#cmdEnyAlgo').dropdown('clear');
			$('#cmdSignAlgo').dropdown('clear');
			$('#role_input_heartbeat').val('');
			$('#role_input_datagather').val('');
		},
		save_Role: function(a) {

		},
		add_Role: function() {
			$('#Role_list_page,#Role_regist_page').toggleClass('displaynone');
			$('#saveRoleDiv').removeClass("displaynone");
			$('#modifyRoleDiv').toggleClass("displaynone", true);
			$("#add_role")
				.on(
					"click",
					function(e) {
						if(!e.isPropagationStopped()) { // 确定stopPropagation是否被调用过
							var roleName = $('#role_name').val().trim();
							if(roleName == "") {
								$.SFP.tipMessage("请输入角色名称！", false);
								return false;
							}
							var roleDes = $('#role_Des').val().trim();
							if(roleDes == "") {
								$.SFP.tipMessage("请输入角色备注！", false);
								return false;
							}
							
							var postData = {};
							postData.roleName = roleName;
							postData.roleDes = roleDes;
								// 封装签到类型参数
								if($('#signBox').is(':checked')) {
									postData.signType = 1;
									var statusE = $('#signEnyAlgo')
										.dropdown('get value');
									if(statusE == "") {
										$.SFP.tipMessage("请选择加密算法类型！",
											false);
										return false;
									}
									postData.signEnPar = statusE;
									var statusS = $('#signSigAlgo')
										.dropdown('get value');
									if(statusS == "") {
										$.SFP.tipMessage("请选择签名算法类型！",
											false);
										return false;
									}
									postData.signSiPar = statusS;
								} else {
									postData.signType = 0;
								}
								// 封装数据类型参数
								if($('#dataBox').is(':checked')) {
									postData.dataType = 1;
									var statusE = $('#dataEnyAlgo')
										.dropdown('get value');
									if(statusE == "") {
										$.SFP.tipMessage("请选择加密算法类型！",
											false);
										return false;
									}
									postData.dataEnPar = statusE;
									var statusS = $('#dataSignAlgo')
										.dropdown('get value');
									if(statusS == "") {
										$.SFP.tipMessage("请选择签到算法类型！",
											false);
										return false;
									}
									postData.dataSiPar = statusS;
								} else {
									postData.dataType = 0;
								}
								// 封装指令类型参数
								if($('#cmdBox').is(':checked')) {
									postData.cmdType = 1;
									var statusE = $('#cmdEnyAlgo')
										.dropdown('get value');
									if(statusE == "") {
										$.SFP.tipMessage("请选择加密算法类型！",
											false);
										return false;
									}
									postData.cmdEnPar = statusE;
									var statusS = $('#cmdSignAlgo')
										.dropdown('get value');
									if(statusS == "") {
										$.SFP.tipMessage("请选择签名算法类型！",
											false);
										return false;
									}
									postData.cmdSiPar = statusS;
								} else {
									postData.cmdType = 0;
								}
								if(!($('#cmdBox').is(':checked') ||
										$('#dataBox').is(':checked') || $(
											'#signBox').is(':checked'))) {
									$.SFP.tipMessage("请勾选策略参数！", false);
									return false;;
								}
							
								var heartbeatTime = $('#role_input_heartbeat').val().trim();
								var dataGatherTime = $('#role_input_datagather').val().trim();
								if(heartbeatTime == "") {
									postData.heartbeatType=0;
							    }else{
							    	postData.heartbeatType=1;
							    }
							    postData.heartbeatTime = heartbeatTime;
							    if(dataGatherTime == "") {
									postData.dataGatherType=0;
							    }else{
							    	postData.dataGatherType=1;
							    }
							    postData.dataGatherTime = dataGatherTime;
							    /*if(heartbeatTime == "" && dataGatherTime == ""){
							    	$.SFP.tipMessage("请输入策略间隔时间！", false);
								    return false;
							    }*/
							    if(!$.SFP.strategy.sumberCheck(heartbeatTime)){
							    	$.SFP.tipMessage("输入的时间格式不对", false);
							    	return false;
							    }
							    if(!$.SFP.strategy.sumberCheck(dataGatherTime)){
							    	$.SFP.tipMessage("输入的时间格式不对！", false);
							    	return false;
							    }
								
							
							var urlTarget = o.basePath +
								'/Role/addRole';
							$
								.postjson(
									urlTarget + '?rand=' +
									Math.random(),
									JSON.stringify(postData),
									function(data, textStatus,
										jqXHR) {
										if(data.code == 0) {
											$.SFP
												.tipMessageSuccess("角色添加成功。");
											$(
													'#role_main_table')
												.DataTable().ajax
												.reload();
											$(
													'#Role_list_page,#Role_regist_page')
												.toggleClass(
													'displaynone');
											$.SFP.strategy
												.emptyVal();
											$(this)
												.parents(
													'.anElement')
												.remove();
											return false;
										} else {
											var msg = data.msg;
											$.SFP.tipMessage(
												msg, false);
											return false;
										}
									}, 'json');
						}
						e.stopPropagation(); // 必须要，不然e.isPropagationStopped()无法判断stopPropagation是否调用过
					});
			/*	
			 */
/*			$("#algorithmType").attr("checked", true);
			$('#algorithmType').attr('onClick', "javascript:return false");
			$("#timeIntervalType").attr("checked", true);
			$('#timeIntervalType').attr('onClick', "javascript:return false");*/
		}
	}; // 策略角色管理结束
	// 应用注册开始
	$.SFP.appRegist = {
		activate: function() {
			$('#app_regist').on('click.SFP.appRegist.app_regist',
				$.SFP.appRegist.app_regist);
			$('#app_regist_empty').on('click.SFP.appRegist.app_regist_empty',
				$.SFP.appRegist.app_regist_empty);

		},
		emptyVal: function() {
			$('#appId').val('');
			$('#appName').val('');
			$('#appType').val('');
		},
		app_regist_empty: function() {
			$.SFP.appRegist.emptyVal();
		},
		app_regist: function() {
			var appName = $('#appName').val().trim();
			if(appName == "") {
			}
			var appId = $('#appId').val().trim();
			if(appId == "") {
				appId = 'null';
			}
			var appType = $('#appType').val().trim();
			if(appType == "") {
				appType = '';
				
			}
			var postData = {};
			postData.appName = appName;
			postData.appId = appId;
			postData.appType = appType;
			var urlTarget = o.basePath + '/app/regist';
			$.postjson(urlTarget + '?rand=' + Math.random(), JSON
				.stringify(postData),
				function(data, textStatus, jqXHR) {
					if(data.code == 0) {
						var msg='应用ID：'+data.app.appId+"<br>"+'应用名称：'+data.app.appName+
						'<br>'+'应用类别：'+data.app.appType;
						//swal('应用注册成功',msg,'success');
						 swal({
					            type: 'success',
					            title: '应用注册成功',
					            html: msg,
					           allowOutsideClick: false
					        })
						$.SFP.appRegist.emptyVal();
					} else {

						var msg = data.msg;
						$.SFP.tipMessage(msg, false);
					}
				}, 'json');

		}

	}; // 应用注册结束
	// 应用查询开始
	$.SFP.appQuery = {
		activate: function() {
            $('#app_detail_tab .item').tab();
			var dtable = $('#app_main_table').DataTable({
				ajax: {
					url: o.basePath + '/app/list',
					type: 'POST',
					data: function(d) {
						d.appName = $('#appName').val();
						d.appId = $('#appId').val();
					},
					dataSrc: $.SFP.ParseDataTableResult
				},
				processing: true,
				serverSide: true,
				columns: [{
					data: 'appId'
				}, {
					data: 'appName'
				}, {
					data: 'appType'
				}, {
					data: null
				}],
				columnDefs: [{
					render: function(data, type, row) {
						var html = '';
						html = '<span class="ui basic green button appDetail" data-id="' +
							row.appId + '">详情</span>';
						return html;
					},
					targets: 3
				}],
				rowId: 'appId',
				// pagingType: "full_numbers_icon",
				order: [1, 'desc'],
				responsive: true
			});
			$('#app_main_table').on('draw.dt',
				function() {
					$('.appDetail').on('click.SFP.appQuery.appDetail', $.SFP.appQuery.appDetail);
				});
			$('#app_search').on('click.SFP.appQuery.queryAppList', $.SFP.appQuery.queryAppList);
			$('#app_detail_back').on('click.SFP.appQuery.app_detail_back', $.SFP.appQuery.app_detail_back);
			$("#genkey").on('click.SFP.appQuery.genkey', $.SFP.appQuery.genkey)
		},
		app_detail_back: function() {
			$('#app_detail_page,#app_list_page').toggleClass('displaynone');
		},
		appDetail: function() {
			var appId = $(this).data('id') + '';
			var postData = {};
			postData.appId = appId;
			var urlTarget = o.basePath + '/app/detail';
			$.postjson(urlTarget + '?rand=' + Math.random(), JSON.stringify(postData),
				function(data, textStatus, jqXHR) {
					if(data.code == 0) {
						$('#appId_detail').val(data.app.appId);
						$('#appName_detail').val(data.app.appName);
						$('#appType_detail').val(data.app.appType);
						$('#appId_detail2').val(data.app.appId);
						$('#appName_detail2').val(data.app.appName);
						//查询根密钥列表
                        $('#app_key_table').DataTable({
                            ajax: {
                                url: o.basePath + '/app/listkey',
                                type: 'POST',
                                data: function(d) {
                                    d.appId = data.app.appId;
                                },
                                dataSrc: function(json) {
                                    if(json.code != 0) {
                                        json.list = [];
                                        var message = '获取数据失败![' + json.msg + ', ' + json.code + ']';
                                        $.SFP.tipMessage(message, false);
                                    }
                                    return json.list;
                                }
                            },
                            processing: true,
                            serverSide: true,
                            columns: [
                            	{data: 'ID'},
								{data: 'KEY_VALUE'},
								{data: 'KEY_KCV'},
								{data: "VER"},
								{data: "STATUS",
                                    render: function(data, type, row) {
                                        if (data == 1){
                                        	return "历史";
										}else if (data == 2){
                                        	return "使用中";
										}
                                    }
								},
                                {data: 'CTIME'}
							],
                            rowId: 'ID',
                            order: [1, 'desc'],
                            responsive: true,
							destroy: true
                        });
					} else {
						var msg = data.msg;
						$.SFP.tipMessage(msg, false);
					}
				}, 'json');
			$('#app_detail_page,#app_list_page').toggleClass('displaynone');

		},
		genkey: function () {
            var postData = {};
            var appId = $("#appId_detail2").val().trim();
            postData.APP_ID = appId;
            $.ajax({
                url: o.basePath + '/app/genkey?rand=' + Math.random(),
                type: "post",
                data: postData,
                dataType: "json",
                success:function(result){
                    if(result.code == 0) {
                        $('#app_key_table').DataTable().ajax.reload();
                        swal({
                            type: 'success',
                            title: '生成根密钥',
                            html: '成功',
                            allowOutsideClick: false
                        });
                    }else{
                        var msg = result.msg;
                        $.SFP.tipMessage(msg, false);
                    }
                },
                error:function(){
                    alert("请求失败！");
                }
            });
        },
		queryAppList: function() {
			$('#app_main_table').DataTable().ajax.reload();
			return;
		}
	}; // 应用查询结束
	// 应用修改开始
	$.SFP.appUpdate = {
		activate: function() {
			var dtable = $('#app_main_table')
				.DataTable({
					ajax: {
						url: o.basePath + '/app/list',
						type: 'POST',
						data: function(d) {
							d.appName = $('#appName').val();
							d.appId = $('#appId').val();
						},
						dataSrc: $.SFP.ParseDataTableResult
					},
					processing: true,
					serverSide: true,
					columns: [{
						data: 'appId'
					}, {
						data: 'appName'
					}, {
						data: 'appType'
					}, {
						data: null
					}],
					columnDefs: [{
						render: function(data, type, row) {
							var html = '';
							html = '<span class="ui basic blue button appUpdate"  data-id="' +
								row.appId + '">修改</span>';
							return html;
						},
						targets: 3
					}],
					rowId: 'appId',
					// pagingType: "full_numbers_icon",
					order: [1, 'desc'],
					responsive: true
				});
			$('#app_main_table').on(
				'draw.dt',
				function() {
					$('.appUpdate').on('click.SFP.appUpdate.appUpdate',
						$.SFP.appUpdate.appUpdate);
				});
			$('#app_search').on('click.SFP.appUpdate.queryAppList',
				$.SFP.appUpdate.queryAppList);
			$('#app_update').on('click.SFP.appUpdate.app_update',
				$.SFP.appUpdate.app_update);
			$('#app_update_back').on('click.SFP.appUpdate.app_update_back',
				$.SFP.appUpdate.app_update_back);
		},
		emptyVal: function() {
			$('#appId_update').val('');
			$('#appName_update').val('');
			$('#appType_update').val('');
		},
		app_update_back: function() {

			$('#app_update_page,#app_list_page').toggleClass('displaynone');
			$.SFP.appUpdate.emptyVal();
		},
		app_update: function() {
			var appName = $('#appName_update').val().trim();
			if(appName == "") {
			}
			var appId = $('#appId_update').val().trim();
			var appType = $('#appType_update').val().trim();
			if(appType == "") {
			}
			var postData = {};
			postData.appName = appName;
			postData.appId = appId;
			postData.appType = appType;
			var urlTarget = o.basePath + '/app/update';
			$.postjson(urlTarget + '?rand=' + Math.random(), JSON
				.stringify(postData),
				function(data, textStatus, jqXHR) {
					if(data.code == 0) {
						$('#app_main_table').DataTable().ajax.reload();
						$.SFP.tipMessageSuccess("应用修改成功。");
					} else {
						var msg = data.msg;
						$.SFP.tipMessage(msg, false);
					}
				}, 'json');

			$('#app_update_page,#app_list_page').toggleClass('displaynone');
		},
		appUpdate: function() {
			var appId = $(this).data('id') + '';
			var postData = {};
			postData.appId = appId;
			var urlTarget = o.basePath + '/app/detail';
			$.postjson(urlTarget + '?rand=' + Math.random(), JSON
				.stringify(postData),
				function(data, textStatus, jqXHR) {
					if(data.code == 0) {
						$('#appId_update').val(data.app.appId);
						$('#appName_update').val(data.app.appName);
						$('#appType_update').val(data.app.appType);
					} else {
						var msg = data.msg;
						$.SFP.tipMessage(msg, false);
					}
				}, 'json');
			$('#app_update_page,#app_list_page').toggleClass('displaynone');

		},
		queryAppList: function() {
			$('#app_main_table').DataTable().ajax.reload();
			return;
		}
	}; // 应用修改结束
	// 应用注销开始
	$.SFP.appLogout = {
		activate: function() {
			var dtable = $('#app_main_table')
				.DataTable({
					ajax: {
						url: o.basePath + '/app/list',
						type: 'POST',
						data: function(d) {
							d.appName = $('#appName').val();
							d.appId = $('#appId').val();
						},
						dataSrc: $.SFP.ParseDataTableResult
					},
					processing: true,
					serverSide: true,
					columns: [{
						data: 'appId'
					}, {
						data: 'appName'
					}, {
						data: 'appType'
					}, {
						data: null
					}],
					columnDefs: [{
						render: function(data, type, row) {
							var html = '';
							html = '<span class="ui basic red button appLogout"  data-id="' +
								row.appId + '">注销</span>';
							return html;
						},
						targets: 3
					}],
					rowId: 'appId',
					// pagingType: "full_numbers_icon",
					order: [1, 'desc'],
					responsive: true
				});
			$('#app_main_table').on(
				'draw.dt',
				function() {
					$('.appLogout').on('click.SFP.appLogout.appLogout',
						$.SFP.appLogout.appLogout);
				});
			$('#app_search').on('click.SFP.appLogout.queryAppList',
				$.SFP.appLogout.queryAppList);
		},
		appLogout: function() {
			var appId = $(this).data('id') + '';
			var postData = {};
			postData.appId = appId;
			var urlTarget = o.basePath + '/app/logout';
			$.postjson(urlTarget + '?rand=' + Math.random(), JSON
				.stringify(postData),
				function(data, textStatus, jqXHR) {
					if(data.code == 0) {
						$('#app_main_table').DataTable().ajax.reload();
						$.SFP.tipMessageSuccess("应用注销成功。");

					} else {
						var msg = data.msg;
						$.SFP.tipMessage(msg, false);
					}
				}, 'json');
		},
		queryAppList: function() {
			$('#app_main_table').DataTable().ajax.reload();
			return;
		}
	}; // 应用结束
	// 管理员添加开始
	$.SFP.adminInsert = {
		activate: function() {
			$('#admin_regist').on('click.SFP.adminInsert.admin_regist',
				$.SFP.adminInsert.admin_regist);
			$('#admin_regist_empty').on('click.SFP.adminInsert.emptyVal',
				$.SFP.adminInsert.emptyVal);
		},
		emptyVal: function() {
			$('#admin_Id').val('');
			$('#admin_Name').val('');
			$('#admin_pwd1').val('');
			$('#admin_pwd2').val('');
		},
		admin_regist: function() {
			var adminId = $('#admin_Id').val().trim();
			if(adminId == "") {
				$.SFP.tipMessage("请输入管理员账号！", false);
				return false;
			}
			var name = $('#admin_Name').val().trim();
			if(name == "") {
				$.SFP.tipMessage("请输入管理员姓名！", false);
				return false;
			}
			var pwd = $('#admin_pwd1').val().trim();
			if(pwd == "") {
				$.SFP.tipMessage("请输入密码！", false);
				return false;
			}
			var pwd2 = $('#admin_pwd2').val().trim();
			if(pwd2 == "") {
				$.SFP.tipMessage("请输入确认密码！", false);
				return false;
			}
			if(!(pwd2 == pwd)) {
				$.SFP.tipMessage("两次输入密码不一致！", false);
				return false;
			}
			var postData = {};
			postData.adminId = adminId;
			postData.pwd = pwd;
			postData.name = name;
			var urlTarget = o.basePath + '/admin/regist';
			$.postjson(urlTarget + '?rand=' + Math.random(), JSON
				.stringify(postData),
				function(data, textStatus, jqXHR) {
					if(data.code == 0) {
						$.SFP.tipMessageSuccess("管理员添加成功。");
						$.SFP.adminInsert.emptyVal();
					} else {

						var msg = data.msg;
						$.SFP.tipMessage(msg, false);
					}
				}, 'json');

		}
	}; // 管理员添加结束
	// 管理员查询开始
	$.SFP.adminQuery = {
		activate: function() {
			var dtable = $('#admin_main_table')
				.DataTable({
					ajax: {
						url: o.basePath + '/admin/list',
						type: 'POST',
						data: function(d) {
							d.adminId = $('#admin_Id').val();
							d.name = $('#admin_Name').val();
						},
						dataSrc: $.SFP.ParseDataTableResult
					},
					processing: true,
					serverSide: true,
					columns: [{
						data: 'adminId'
					}, {
						data: 'name'
					}, {
						data: 'status'
					}, {
						data: null
					}],
				
					rowId: 'adminId',
					columnDefs: [{
						render: function(data, type, row) {
							var html = '';
							if(data == 1) {
								html = '<span class="ui basic green button">使用中</span>';
							} else if(data == 2) {
								html = '<span class="ui basic red button">已注销</span>';
							}
							return html;
						},
						targets: 2
					},
					{
						render: function(data, type, row) {
							var html = '';
							if(row.status == 1) {
								html = '<div class="btn-group">';
								html += '<a class="ui red horizontal label del_admin" data-id="' +
									row.adminId +
									'"><i class="large remove user icon"></i>注销</a>';
								html += '<a class="ui blue horizontal label mod_admin" data-id="' +
									row.adminId +
									'"><i class="large edit icon"></i>修改</a>';
								html += '</div>';

							} else if(row.status == 2) {
								html = '<div class="btn-group">';
								html += '<a class="ui green horizontal label start_admin" data-id="' +
									row.adminId +
									'"><i class="large add user icon"></i>启用</a>';
								html += '<a class="ui blue horizontal label mod_admin" data-id="' +
									row.adminId +
									'"><i class="large edit icon"></i>修改</a>';
								html += '</div>';
							}

							return html;

						},
						targets: 3
					}
				],
					// pagingType: "full_numbers_icon",
					responsive: true
				});
			$('#admin_main_table').on(
				'draw.dt',
				function() {
					$('.start_admin').on('click.SFP.adminQuery.start_admin',
						$.SFP.adminQuery.start_admin);
					$('.del_admin').on('click.SFP.adminQuery.del_admin',
							$.SFP.adminQuery.del_admin);
					$('.mod_admin').on('click.SFP.adminQuery.mod_admin',
							$.SFP.adminQuery.mod_admin);
				});

			$('#admin_search').on('click.SFP.adminQuery.admin_search',
					$.SFP.adminQuery.admin_search);
			$('#admin_mod_back').on('click.SFP.adminQuery.admin_mod_back',
					$.SFP.adminQuery.admin_mod_back);
			$('#admin_regist_mod').on('click.SFP.adminQuery.admin_regist_mod',
					$.SFP.adminQuery.admin_regist_mod);
		},
		admin_regist_mod:function(){
			var adminId = $('#admin_Id_mod').val().trim();
			if(adminId == "") {
				$.SFP.tipMessage("请输入管理员账号！", false);
				return false;
			}
			var name = $('#admin_Name_mod').val().trim();
			if(name == "") {
				$.SFP.tipMessage("请输入管理员姓名！", false);
				return false;
			}
			var pwd = $('#admin_pwd1_mod').val().trim();
			if(pwd == "") {
				
			}
			var pwd2 = $('#admin_pwd2_mod').val().trim();
			if(pwd2 == "") {
				
			}
			if(!(pwd2 == pwd)) {
				$.SFP.tipMessage("两次输入密码不一致！", false);
				return false;
			}
			var postData = {};
			postData.adminId = adminId;
			postData.pwd = pwd;
			postData.name = name;
			var urlTarget = o.basePath + '/admin/modfiyAdmin';
			$.postjson(urlTarget + '?rand=' + Math.random(), JSON
				.stringify(postData),
				function(data, textStatus, jqXHR) {
					if(data.code == 0) {
						$.SFP.tipMessageSuccess("管理员修改成功。");
						$('#admin_main_table').DataTable().ajax.reload();
			            $('#admin_list_page_mod,#admin_list_page').toggleClass('displaynone');
			        	$.SFP.adminQuery.emptyVal();
					} else {
						$.SFP.tipMessage(data.msg, false);
					}
				}, 'json');
		},
		emptyVal: function() {
			$('#admin_Id_mod').val('');
			$('#admin_Name_mod').val('');
			$('#admin_pwd1_mod').val('');
			$('#admin_pwd2_mod').val('');
		},
		admin_mod_back:function(){
			$.SFP.adminQuery.emptyVal();
            $('#admin_list_page_mod,#admin_list_page').toggleClass('displaynone');
		},
		start_admin:function(){
			var adminId = $(this).data('id') + '';
			var postData = {};
			postData.adminId = adminId;
			postData.status = 1;

			var urlTarget = o.basePath + '/admin/updateStatus';
			$.postjson(urlTarget + '?rand=' + Math.random(), JSON
				.stringify(postData),
				function(data, textStatus, jqXHR) {
					if(data.code == 0) {
						$('#admin_main_table').DataTable().ajax.reload(null, false);
					} else {
						$.SFP.tipMessage(data.msg, false);
					}
				}, 'json');
		},
		del_admin:function(){
			var adminId = $(this).data('id') + '';
			if(adminId=='admin'){
				$.SFP.tipMessage("超级管理员不允许注销！", false);
				return ;
				
			}
			var postData = {};
			postData.adminId = adminId;
			postData.status = 2;

			var urlTarget = o.basePath + '/admin/updateStatus';
			$.postjson(urlTarget + '?rand=' + Math.random(), JSON
				.stringify(postData),
				function(data, textStatus, jqXHR) {
					if(data.code == 0) {
						$('#admin_main_table').DataTable().ajax.reload(null, false);
					} else {
						$.SFP.tipMessage(data.msg, false);
					}
				}, 'json');
		},
		mod_admin:function(){
			var adminId = $(this).data('id') + '';
			var postData = {};
			postData.adminId = adminId;
			var urlTarget = o.basePath + '/admin/detail';
			$.postjson(urlTarget + '?rand=' + Math.random(), JSON
					.stringify(postData),
					function(data, textStatus, jqXHR) {
						if (data.code == 0) {
							$('#admin_Id_mod').val(data.admin.adminId);
							$('#admin_Name_mod').val(data.admin.name);
						} else {
							var msg=data.msg;
							$.SFP.tipMessage(msg, false);
						}
					}, 'json');
            $('#admin_list_page_mod,#admin_list_page').toggleClass('displaynone');

		},
		app_detail_back: function() {
			$('#app_detail_page,#app_list_page').toggleClass('displaynone');
		},
		admin_search: function() {
			$('#admin_main_table').DataTable().ajax.reload();
			return;
		}
	}; // 管理员查询结束
	//设备组管理开始
	var appidVL =[];
	$.SFP.groupRole = {
			activate:function (){
				$(".ui.dropdown").dropdown({
				    allowCategorySelection: true,
				    transition: "fade up"
				});
				var dtable = $('#group_role_table').DataTable({
					ajax:{
						url: o.basePath + '/group/dev/list',
						type: 'POST',
						data: function ( d ) {
					        d.deviceGroupName = $('#dev_group_ser').val();
					        d.roleName = $('#dev_role_ser').val();
						},
						dataSrc: $.SFP.ParseDataTableResult
					},
					processing: true,
					serverSide: true,
					columns: [
						{ data: 'groupName' },
						{ data: 'roleName' },
					],
					rowId: 'groupId',
			        //pagingType: "full_numbers_icon",
			        columnDefs: [
						{
							render: function ( data, type, row ) {
								var html = '';
									html = '<div class="btn-group">';
									html += '<div class="ui red horizontal label group_del" data-id="' + row.groupId + '"><i class="large trash outline icon"></i>删除</div>';
									html += '<div class="ui green horizontal label group_info" data-id="' + row.groupId + '"><i class="large edit icon"></i>详情</div>';
									html += '</div>';
								return html;							
							},
							targets: 2
						}
					],
			        order: [1, 'desc'],
					responsive: true
			    });
			$.postjson(o.basePath + '/group/dev/roleNameList?rand='
					+ Math.random(), {}, function(data, textStatus, jqXHR) {
				if (data.code == 0) {
					var rolist = data.roleList;
                        for(var i = 0; i < rolist.length; i++){
							$('#role_list_name').prepend("<div class='item' data-value=" + rolist[i].roleId + ">" + rolist[i].roleName + "</div>");
                        }
				} else {
					var message = '获取角色信息失败![' + data.msg + ']';
					$.SFP.tipMessage(message, false);
				}
			}, 'json');


			    $('#dev_role_group_b').on('click.SFP.group.querygroup', $.SFP.groupRole.querygroup);
			    $('#add_device_group').on('click.SFP.group.add', $.SFP.groupRole.GroupWindow);
			    
			    $('#add_appId_List').on('click.SFP.group.addAppList', $.SFP.groupRole.addappidList);
			    $('#appId_List_button').on('click.SFP.group.queryAppList', $.SFP.groupRole.queryappidList);
			    
			    $('#appid_submit_b').on('click.SFP.group.appidSubmit', $.SFP.groupRole.appidSumbit);
			    $('#sumbit_group_info').on('click.SFP.group.groupinfoSubmit', $.SFP.groupRole.groupinfoSubmit);
			    $('#sumbit_group_back').on('click.SFP.group.groupinfoBack', $.SFP.groupRole.groupinfoSubmitBack);
			    
			    $('#del_group_button').on('click.SFP.group.deleteGroupButton', $.SFP.groupRole.deleteGroup);
			    
			    $('#group_role_table').on( 'draw.dt', function () {
				    $('.group_info').on('click.SFP.group.detail', $.SFP.groupRole.GroupWindow);
				    $('.group_del').on('click.SFP.group.delete.single', $.SFP.groupRole.delGroup);
			    });
			},
			addappidList:function(){
				var atable = $('#appid_list_table').DataTable({
					ajax:{
						url: o.basePath + '/device/list',
						type: 'POST',
						data: function ( d ) {
					        d.appId = $('#appid_list_Search').val();
						},
						dataSrc: $.SFP.ParseDataTableResult
					},
					processing: true,
					serverSide: true,
					columns: [
					    { data: '' ,
					      className : 'center aligned'},
						{ data: 'appId'},
						{ data: 'appName'},
					],
					rowId: 'id',
			        //pagingType: "full_numbers_icon",
			        columnDefs: [
						{
							render: function ( data, type, row ) {
								var html ='';
								    html +='<div class="ui checkbox">';
								var flag = true;
								if(appidVL.length==0){
									flag = false;
									html += '<input type="checkbox" name="example" id="'+row.appId+'" onclick="$.SFP.groupRole.checkoutdecide(this)">';
								}
								for (var i = 0; i < appidVL.length; i++) {
									if(row.appId==appidVL[i].appid){
										flag = false;
									html += '<input type="checkbox" checked="checked" name="example" id="'+row.appId+'" onclick="$.SFP.groupRole.checkoutdecide(this)">';
								}
						      }
								if(flag){
									html += '<input type="checkbox" name="example" id="'+row.appId+'" onclick="$.SFP.groupRole.checkoutdecide(this)">';
								}
								    html +='<label class="coloring black"></label></div>';
								return html;							
							},
							targets: 0
						}
					],
			        order: [1, 'desc'],
					responsive: true,
					destroy: true
			  }); 
				$('#appid_list, #dev_group_context').toggleClass('displaynone'); 
			},
			queryappidList:function(){
				$('#appid_list_table').DataTable().ajax.reload();
			    return;
				
			},
			querygroup: function () {
			    $('#group_role_table').DataTable().ajax.reload();
			    return;
		    },
		    GroupWindow : function() {
		    	$('#appid_list_Search').val("");
		    //全局变量标记
		    appidVL =[];
			var GroupId = $(this).data('id');
			if (undefined == GroupId) {
				GroupId = "0";
			}
			$.postjson(o.basePath + '/group/dev/info?GroupId=' + GroupId + '&rand='
					+ Math.random(), {}, function(data, textStatus, jqXHR) {
				if (data.code == 0) {
					var htmlData = '';
					
					$('#group_name').val("");
					$('#group_remark').val("");
					$('#appid_list_input').val("");
				    $('#rolename_dropdown').dropdown('clear');

					if (GroupId != "0") {
						var GroupList = data.DeviceGroup;
						for (var i = 0; i < GroupList.length; i++) {
							$('#group_name').val(GroupList[i].groupName);
					        $('#group_remark').val(GroupList[i].groupRemark);
						}
						var ProGrList = data.PropertyGroupList;
						var str1 = "";
						for (var i = 0; i < ProGrList.length; i++) {
							//全局变量
							var obj = {};
							obj.appid = ProGrList[i].propertyValue;
							appidVL.push(obj);
							//end
							str1=str1+ProGrList[i].propertyValue+",";
						}
						str1=str1.substring(0,str1.length-1)
                        $('#appid_list_input').val(str1);
                        var idB = data.idByRole;
                        for(var i = 0; i < idB.length; i++){
                        	$('#rolename_dropdown').dropdown('set selected', idB[i].roleId);
                        }
					}

					$('#sumbit_group_info').data('group_id', GroupId);
					//$('#admin_detailid_save').data('admin_ids', Id);
					$('#dev_group_list, #dev_group_context').toggleClass(
							'displaynone');
					$('body').getNiceScroll().resize();
				} else {
					var message = '获取设备组信息失败![' + data.msg + ']';
					$.SFP.tipMessage(message, false);
				}
			}, 'json');

		},
		    checkoutdecide : function(obj){
		    	if($('#'+obj.id).is(':checked')){
		    		var ob = {};
		    		ob.appid = obj.id;
		    		appidVL.push(ob);
		    	}else{
		    		var indexv =0;
				    for(var i = 0; i<appidVL.length;i++){
					    if(appidVL[i].appid==obj.id){
						    indexv=i;
						    break;
					    }
				    }
				    appidVL.splice(indexv, 1);
		    	}
		    	
		    },
		    appidSumbit : function(){
		    	$('#appid_list, #dev_group_context').toggleClass('displaynone');
		    	var str1 = "";
		    	for (var i = 0; i < appidVL.length; i++) {
					str1=str1+appidVL[i].appid+",";
				}
		    	str1=str1.substring(0,str1.length-1);
		    	$('#appid_list_input').val(str1);
		    },
		    groupinfoSubmit : function(){
    	    $('#dev_group_list, #dev_group_context').toggleClass('displaynone');
			$.ajax({
				url:o.basePath + '/group/dev/addgroupInfo',
				type:"post",
				data:{
					"groupName":$('#group_name').val(),
					"groupMes":$('#group_remark').val(),
					"appIdList":$('#appid_list_input').val(),
					"RoleId":$('#rolename_dropdown').dropdown('get value'),
					"groupId":$('#sumbit_group_info').data('group_id')
					},
				dataType:"json",
				success:function(result){
					if (result.code==0) {
						var message = result.msg;
						message = '信息保存成功';
					    $.SFP.tipMessage(message);
					    $('#group_role_table').DataTable().ajax.reload();
					}else {
						var message = '保存设备组信息失败![' + result.msg + ']';
					    $.SFP.tipMessage(message, false);
					}
				},
				error:function(){
					alert("请求失败！");
				}
			});
		   },
		    delGroup : function(){
		    	var GroupId = $(this).data('id');
		    	var rowData = $('#group_role_table').DataTable().row('#' + GroupId).data();
		    	var message = '是否要删除组[ ' + rowData.groupName + ' ] ？'; 
		    	$('#group_confirm_modal_message').empty().append(message);
		    	$('#del_group_button_save').data('groupId_s', GroupId);
		    	$("#group_delconfirm_modal").modal({
				    closable : false
			        }).modal('show');
		    },
		    deleteGroup : function(){
		    	var GroupId = $('#del_group_button_save').data('groupId_s');
		    	var postData = {};
		    	postData.groupId = GroupId;
		    	$.post(o.basePath + '/group/dev/deleteGroup', postData, function(data,
					textStatus, jqXHR) {
				if (data.code == 0) {
					var message = data.msg;
					$.SFP.tipMessage("删除成功");
					$('#group_role_table').DataTable().ajax.reload();
				} else {
					var message = '删除组失败![' + data.msg + ']';
					$.SFP.tipMessage(message, false);
				}
			}, 'json');
		   },
		   groupinfoSubmitBack : function(){
		   	$('#dev_group_list, #dev_group_context').toggleClass('displaynone');
		   }
		};
	//设备组管理结束
	
	//设备版本管理
	$.SFP.deviceversion = {
			activate: function () {
				var dtable = $('#device_version_main_table').DataTable({
					ajax:{
						url: o.basePath + '/deviceVersion/list',
						type: 'POST',
						data: function ( d ) {
					        d.devId = $('#device_version_search_devid').val();
					        d.appId = $('#device_version_search_appid').val();
						},
						dataSrc: $.SFP.ParseDataTableResult
					},
					processing: true,
					serverSide: true,
					columns: [
						{ data: 'deviceId' },
						{ data: 'appId' },
						{ data: 'versionX' },
						{ data: 'versionY' },
						{ data: 'versionZ' }
					],
					rowId: 'id',
			        // pagingType: "full_numbers_icon",
			        order: [1, 'desc'],
					responsive: true
			    });
				
				$('#device_version_search_button').on('click.SFP.deviceversion.query', $.SFP.deviceversion.queryDeviceVersionList);
			},
			queryDeviceVersionList : function () {
				$('#device_version_main_table').DataTable().ajax.reload();
				return;
			}
		};
	//设备版本管理结束
	
	
	/*
	 * device white list ====== device white list infomation maintain page
	 * 
	 * @type Object @usage $.SFP.whiteList.activate() @usage
	 * $.SFP.whiteList.queryWhiteList()
	 */
	$.SFP.whiteList = {
		activate: function () {
			var dtable = $('#dwl_main_table').DataTable({
				ajax:{
					url: o.basePath + '/dev/wl/list',
					type: 'POST',
					data: function ( d ) {
				        d.devId = $('#dwl_search_devid').val();
				        d.appId = $('#dwl_search_appid').val();
					},
					dataSrc: $.SFP.ParseDataTableResult
				},
				processing: true,
				serverSide: true,
				columns: [
					{ data: 'devId' },
					{ data: 'appId' },
					{ data: 'status' },
					{ data: 'policyStatus' },
					{ data: null }
				],
				rowId: 'id',
		        // pagingType: "full_numbers_icon",
		        columnDefs: [
		        	{
						render: function ( data, type, row ) {
							var html = '';
							if( data == 1 ) {
								html = '<span class="ui basic red button">初始化</span>';
							}
							else if( data == 2 ) {
								html = '<span class="ui basic green button">已激活</span>';
							}
							else if( data == 3 ) {
								html = '<span class="ui basic black button">注销</span>';
							}
							return html;
						},
						targets: 2
					},
					{
						render: function ( data, type, row ) {
							var html = '';
							if(row.status != 3) {
								if( data == 1 ) {
									html = '<span class="ui basic green button">启用</span>';
								}
								else if( data == 2 ) {
									html = '<span class="ui basic red button">停用</span>';
								}
							}
							return html;
						},
						targets: 3
					},
					{
						render: function ( data, type, row ) {
							var html = '';
							if(row.status != 3) {
								if(row.policyStatus == 1) {
									html = '<div class="btn-group">';
									html += '<div class="ui green horizontal label dwl_policy_up disabled" data-id="' + row.id + '"><i class="large edit icon"></i>启用</div>';
									html += '<a class="ui red horizontal label dwl_policy_down" data-id="' + row.id + '"><i class="large trash outline icon"></i>停用</a>';
									html += '</div>';
								}
								else if(row.policyStatus == 2) {
									html = '<div class="btn-group">';
									html += '<a class="ui green horizontal label dwl_policy_up " data-id="' + row.id + '"><i class="large edit icon"></i>启用</a>';
									html += '<div class="ui red horizontal label dwl_policy_down disabled" data-id="' + row.id + '"><i class="large trash outline icon"></i>停用</div>';
									html += '</div>';
								}
							}
							return html;							
						},
						targets: 4
					}
				],
		        order: [1, 'desc'],
				responsive: true
		    });
			
			// listen page items' event
			$('#dwl_search').on('click.SFP.whiteList.query', $.SFP.whiteList.queryWhiteList);
			$('#dwl_main_table').on( 'draw.dt', function () {
				$('.dwl_policy_up').on('click.SFP.whiteList.policyup', $.SFP.whiteList.policyUp);
				$('.dwl_policy_down').on('click.SFP.whiteList.policydown', $.SFP.whiteList.policyDown);
			});
            $('#add_white_list').on('click.SFP.whiteList.add', $.SFP.whiteList.addWhiteListModal);
            $('#device_detail_save').on('click.SFP.whiteList.save', $.SFP.whiteList.deviceRegister);
            $('#device_detail_return').on('click.SFP.whiteList.return', $.SFP.whiteList.returnModal);
		},
		queryWhiteList: function () {
			$('#dwl_main_table').DataTable().ajax.reload();
			return;
		},
		policyUp: function () {
			var wlId = $(this).data('id');
			if( undefined == wlId ) {
				$.SFP.tipMessage("白名单数据异常，请重新打开页面再次尝试或联系管理员", false);
				return;
			}
			
			$.SFP.whiteList.policyUpdate(wlId, 1);
		},
		policyDown: function () {
			var wlId = $(this).data('id');
			if( undefined == wlId ) {
				$.SFP.tipMessage("白名单数据异常，请重新打开页面再次尝试或联系管理员", false);
				return;
			}
			
			$.SFP.whiteList.policyUpdate(wlId, 2);
		},
		policyUpdate: function (wlId, upDownFlag) {
			var rowData = $('#dwl_main_table').DataTable().row('#'+wlId).data();
			
			var postData = {};
			postData.devId = rowData.devId;
			postData.appId = rowData.appId;
			
			var urlTarget = o.basePath + '/dev/wl/';
			if( upDownFlag == 1 ) {
				urlTarget += 'policyup';
			}
			else if( upDownFlag == 2 ){
				urlTarget += 'policydown';
			}
			
			$.post(urlTarget + '?rand=' + Math.random(), postData, function(data, textStatus, jqXHR) {
				if( data.code == 0 ) {
					$('#dwl_main_table').DataTable().ajax.reload(null, false);
				}
				else {
					var message = '修改白名单策略失败![' + data.msg + ', ' + data.code + ']';
					$.SFP.tipMessage(message, false);
				}
			}, 'json');
			return;
		},
        addWhiteListModal: function () {
		    $("#device_detail_page").modal({closable:true}).modal('show');
        },

        returnModal: function () {
            $("#device_detail_page").modal('hide');
            $('#devid').val("");
            $('#appid').val("");
        },

        deviceRegister: function (){

		    var devid = $('#devid').val();
            var appid = $('#appid').val();
            if( undefined == devid || devid == '') {
                var message = 'devid is "" or not be undefined!';
                $.SFP.tipMessage(message, false);
                return;
            }
            if( undefined == appid || appid == '') {
                var message = 'appid is "" or not be undefined!';
                $.SFP.tipMessage(message, false);
                return;
            }

            $.post(o.basePath + '/dev/addDevice?devid=' + devid + '&appid=' + appid, {}, function(data,textStatus, jqXHR) {
                if( data.code == 0 ) {
                    $.SFP.whiteList.returnModal();
                    // 重新装载数据信息
                    $('#dwl_main_table').DataTable().ajax.reload();
                    var message = 'devid:' + devid + ',appid:' + appid + '注册成功！';
                    $.SFP.tipMessage(message, true);
                }
                else {
                    $.SFP.whiteList.returnModal();
                    var message = 'devid:' + devid + ',appid:' + appid + '注册失败！[' + data.code+ ' : ' + data.msg + ']';
                    $.SFP.tipMessage(message, false);
                }
            }, 'json');
         }
	};// end of $.SFP.whiteList
	
	/*
	 * device black list ====== device black list infomation maintain page
	 * 
	 * @type Object @usage $.SFP.blackList.activate() @usage
	 * $.SFP.blackList.queryBlackList()
	 */
	$.SFP.blackList = {
		activate: function () {
			var dtable = $('#dbl_main_table').DataTable({
				ajax:{
					url: o.basePath + '/dev/bl/list',
					type: 'POST',
					data: function ( d ) {
				        d.devId = $('#dbl_search_devid').val();
				        d.appId = $('#dbl_search_appid').val();
					},
					dataSrc: $.SFP.ParseDataTableResult
				},
				processing: true,
				serverSide: true,
				columns: [
					{ data: 'devId' },
					{ data: 'appId' },
					{ data: 'insertTime' }
				],
				rowId: 'id',
		        // pagingType: "full_numbers_icon",
		        order: [1, 'desc'],
				responsive: true
		    });
			
			// listen page items' event
			$('#dbl_search').on('click.SFP.blackList.query', $.SFP.blackList.queryBlackList);
		},
		queryBlackList: function () {
			$('#dbl_main_table').DataTable().ajax.reload();
			return;
		}
	};// end of $.SFP.blackList
	
	/*
	 * key list ====== key list infomation maintain page
	 * 
	 * @type Object @usage $.SFP.keyList.activate() @usage
	 * $.SFP.keyList.queryKeyList()
	 */
	$.SFP.keyList = {
		activate: function () {
			var dtable = $('#keylist_main_table').DataTable({
				ajax:{
					url: o.basePath + '/key/list',
					type: 'POST',
					data: function ( d ) {
				        d.devId = $('#keylist_search_devid').val();
				        d.appId = $('#keylist_search_appid').val();
					},
					dataSrc: $.SFP.ParseDataTableResult
				},
				processing: true,
				serverSide: true,
				columns: [
					{ data: 'devId' 
						,className : 'my_table_full'},
					{ data: 'appId' 
						,className : 'my_table_full'},
					{ data: 'protectKCV' },
					{ data: 'signinKCV' },
					{ data: 'halfKCV' },
					{ data: 'commandKCV' },
					{ data: 'dataKCV' },
					{ data: 'cpkKCV' },
					{ data: 'sm9KCV' }
				],
				rowId: 'id',
		        // pagingType: "full_numbers_icon",
		        /*
				 * columnDefs: [ { render: function ( data, type, row ) { var
				 * html = ''; if(row.status != 3) { if(row.policyStatus == 1) {
				 * html = '<div class="btn-group">'; html += '<div class="ui
				 * green horizontal label dwl_policy_up disabled" data-id="' +
				 * row.id + '"><i class="large edit icon"></i>启用</div>'; html += '<a
				 * class="ui red horizontal label dwl_policy_down" data-id="' +
				 * row.id + '"><i class="large trash outline icon"></i>停用</a>';
				 * html += '</div>'; } else if(row.policyStatus == 2) { html = '<div
				 * class="btn-group">'; html += '<a class="ui green horizontal
				 * label dwl_policy_up " data-id="' + row.id + '"><i
				 * class="large edit icon"></i>启用</a>'; html += '<div
				 * class="ui red horizontal label dwl_policy_down disabled"
				 * data-id="' + row.id + '"><i class="large trash outline
				 * icon"></i>停用</div>'; html += '</div>'; } } return html; },
				 * targets: 4 } ],
				 */
		        order: [1, 'desc'],
				responsive: true
		    });
			
			// listen page items' event
			$('#keylist_search').on('click.SFP.keyList.query', $.SFP.keyList.queryKeyList);
		},
		queryKeyList: function () {
			$('#keylist_main_table').DataTable().ajax.reload();
			return;
		}
	};// end of $.SFP.keyList
	
	/*
	 * key source ====== key source infomation maintain page
	 * 
	 * @type Object @usage $.SFP.keySource.activate() @usage
	 * $.SFP.keySource.queryKeyList()
	 */
	$.SFP.keySource = {
		activate: function () {
			var dtable = $('#keysource_main_table').DataTable({
				ajax:{
					url: o.basePath + '/key/source',
					type: 'POST',
					data: function ( d ) {
				        d.devId = $('#keysource_search_devid').val();
				        d.appId = $('#keysource_search_appid').val();
					},
					dataSrc: $.SFP.ParseDataTableResult
				},
				processing: true,
				serverSide: true,
				columns: [
					{ data: 'devId' },
					{ data: 'appId' },
					{ data: 'cpkKCV' },
					{ data: 'sm9KCV' }
				],
				rowId: 'id',
		        // pagingType: "full_numbers_icon",
		        /*
				 * columnDefs: [ { render: function ( data, type, row ) { var
				 * html = ''; if(row.status != 3) { if(row.policyStatus == 1) {
				 * html = '<div class="btn-group">'; html += '<div class="ui
				 * green horizontal label dwl_policy_up disabled" data-id="' +
				 * row.id + '"><i class="large edit icon"></i>启用</div>'; html += '<a
				 * class="ui red horizontal label dwl_policy_down" data-id="' +
				 * row.id + '"><i class="large trash outline icon"></i>停用</a>';
				 * html += '</div>'; } else if(row.policyStatus == 2) { html = '<div
				 * class="btn-group">'; html += '<a class="ui green horizontal
				 * label dwl_policy_up " data-id="' + row.id + '"><i
				 * class="large edit icon"></i>启用</a>'; html += '<div
				 * class="ui red horizontal label dwl_policy_down disabled"
				 * data-id="' + row.id + '"><i class="large trash outline
				 * icon"></i>停用</div>'; html += '</div>'; } } return html; },
				 * targets: 4 } ],
				 */
		        order: [1, 'desc'],
				responsive: true
		    });
			
			// listen page items' event
			$('#keysource_search').on('click.SFP.keySource.query', $.SFP.keySource.queryKeySource);
		},
		queryKeySource: function () {
			$('#keysource_main_table').DataTable().ajax.reload();
			return;
		}
	};// end of $.SFP.keySource
	
	/*
	 * hsm list ====== hsm list infomation maintain page
	 * 
	 * @type Object @usage $.SFP.hsmList.activate() @usage
	 * $.SFP.hsmList.queryHsmList()
	 */
	$.SFP.hsmList = {
		activate: function () {
			$(".ui.dropdown").dropdown({
			    allowCategorySelection: true,
			    transition: "fade up"
			});
			
			var dtable = $('#hsmlist_main_table').DataTable({
				ajax:{
					url: o.basePath + '/hsm/list',
					type: 'POST',
					data: function ( d ) {
				        /*
						 * d.hsmname = $('#hsmlist_search_name').val(); d.hsmip =
						 * $('#hsmlist_search_ip').val(); d.hsmsport =
						 * $('#hsmlist_search_port').val(); d.hsmtype =
						 * $('#hsmlist_search_type').dropdown('get value');
						 * d.isused = $('#hsmlist_search_use').dropdown('get
						 * value');
						 */
					},
					dataSrc: $.SFP.ParseDataTableResult
				},
				processing: true,
				serverSide: true,
				columns: [
					{ data: 'hsmname' },
					{ data: 'hsmip' },
					{ data: 'hsmsport' },
					{ data: 'hsmtype' },
					{ data: 'isused' }
				],
				rowId: 'hsmid',
		        // pagingType: "full_numbers_icon",
		        columnDefs: [
		        	{
						render: function ( data, type, row ) {
							var html = '';
							if(data == 1) {
								html = '<div class="btn-group">';
								html += '<div class="ui green horizontal label dwl_policy_up disabled" data-id="' + row.id + '"><i class="large checkmark icon"></i>启用</div>';
								html += '</div>';
							}
							else {
								html = '<div class="btn-group">';
								html += '<div class="ui red horizontal label dwl_policy_down disabled" data-id="' + row.id + '"><i class="large remove icon"></i>停用</div>';
								html += '</div>';
							}
							return html;							
						},
						targets: 4
					}
				],
		        order: [1, 'desc'],
				responsive: true
		    });
			
			// listen page items' event
			$('#hsmlist_search').on('click.SFP.logList.query', $.SFP.hsmList.queryHsmList);
		},
		queryHsmList: function () {
			$('#hsmlist_main_table').DataTable().ajax.reload();
			return;
		}
	};// end of $.SFP.hsmList
	
	/*
	 * log list ====== log list infomation maintain page
	 * 
	 * @type Object @usage $.SFP.logList.activate() @usage
	 * $.SFP.logList.queryLogList()
	 */
	$.SFP.logList = {
		activate: function () {
			$(".ui.dropdown").dropdown({
			    allowCategorySelection: true,
			    transition: "fade up"
			});
			
			var dtable = $('#loglist_main_table').DataTable({
				ajax:{
					url: o.basePath + '/log/list',
					type: 'POST',
					data: function ( d ) {
				        d.devId = $('#loglist_search_devid').val();
				        d.appId = $('#loglist_search_appid').val();
				        d.traceId = $('#loglist_search_traceid').val();
				        d.optFlag = $('#loglist_search_opt').dropdown('get value');
				        d.status = $('#loglist_search_result').dropdown('get value');
					},
					dataSrc: $.SFP.ParseDataTableResult
				},
				processing: true,
				serverSide: true,
				columns: [
					{ data: 'traceId' },
					{ data: 'devId' },
					{ data: 'appId' },
					{ data: 'sourcePlatform' },
					{ data: 'optFlag' },
					{ data: 'status' },
					{ data: 'handleTime' },
					{ data: 'takeUpTime' },
					{ data: 'errMsg' }
				],
				rowId: 'id',
		        pagingType: "full_numbers_icon",
		        columnDefs: [
		        	{
						render: function ( data, type, row ) {
							var html = '';
							if(data == 1) {
								html = '设备激活';
							}
							else if(data == 2) {
								html = '激活验证';
							}
							else if(data == 3) {
								html = '状态查询';
							}
							else if(data == 4) {
								html = '设备预签到';
							}
							else if(data == 5) {
								html = '设备签到';
							}
							else if(data == 6) {
								html = '退出签到';
							}
							else if(data == 7) {
								html = '数据解析';
							}
							else if(data == 8) {
								html = '指令保护';
							}
							else if(data == 9) {
								html = '设备注册';
							}
							else if(data == 10) {
								html = '数据保护';
							}
							else if(data == 11) {
								html = '指令解析';
							}
							else if(data == 12) {
								html = '设备注销';
							}
							else if(data == 13) {
								html = '批量数据解析';
							}
							else if(data == 14) {
								html = '批量数据加密';
							}
							else if(data == 15) {
								html = '心跳';
							}
							else if(data == 16) {
								html = '心跳确认';
							}
							else if(data == 17) {
								html = '数据签名';
							}
							else if(data == 18) {
								html = '数据验签';
							}
							else if(data == 19) {
								html = '数据采集';
							}
							else if(data == 20) {
								html = '文件数据保护';
							}
							else if(data == 21) {
								html = '文件数据解析';
							}
                            else if(data == 22) {
                                html = '通用远程服务';
                            }
                            else if(data == 23) {
                                html = 'RFID获取工作密钥';
                            }
                            else if(data == 26) {
                                html = 'RFID计算安全域';
                            }
							return html;							
						},
						targets: 4
					},
					{
						render: function ( data, type, row ) {
							var html = '';
							if(data == 1) {
								html = '<div class="btn-group">';
								html += '<div class="ui green horizontal label dwl_policy_up disabled" data-id="' + row.id + '"><i class="large checkmark icon"></i>成功</div>';
								html += '</div>';
							}
							else if(data == 2) {
								html = '<div class="btn-group">';
								html += '<div class="ui red horizontal label dwl_policy_down disabled" data-id="' + row.id + '"><i class="large remove icon"></i>失败</div>';
								html += '</div>';
							}
							return html;							
						},
						targets: 5
					}
				],
		        order: [1, 'desc'],
				responsive: true
		    });
			
			// listen page items' event
			$('#loglist_search').on('click.SFP.logList.query', $.SFP.logList.queryLogList);
		},
		queryLogList: function () {
			$('#loglist_main_table').DataTable().ajax.reload();
			return;
		}
	};// end of $.SFP.logList
	
	/*
	 * role ====== role infomation maintain page
	 * 
	 * @type Object @usage $.SFP.role.activate() @usage $.SFP.role.queryRole()
	 */
	$.SFP.role = {
		activate: function () {
			$(".ui.dropdown").dropdown({
			    allowCategorySelection: true,
			    transition: "fade up"
			});
			
			var dtable = $('#role_main_table').DataTable({
				ajax:{
					url: o.basePath + '/sys/role/list',
					type: 'POST',
					data: function ( d ) {
				        d.rolename = $('#role_search_name').val();
					},
					dataSrc: $.SFP.ParseDataTableResult
				},
				processing: true,
				serverSide: true,
				columns: [
					{ data: 'roleId' },
					{ data: 'name' },
					{ data: 'privileges' },
					{ data: 'memo' }
				],
				rowId: 'roleId',
		        // pagingType: "full_numbers_icon",
		        /*
				 * columnDefs: [ { render: function ( data, type, row ) { var
				 * html = ''; if( data == 0 ) { html = '<span class="ui basic
				 * red button">禁用</span>'; } else if( data == 1 ) { html = '<span
				 * class="ui basic green button">使用中</span>'; } else if( data ==
				 * 2 ) { html = '<span class="ui basic black button">已删除</span>'; }
				 * return html; }, targets: 2 } ],
				 */
		        order: [1, 'desc'],
				responsive: true
		    });
			
			// listen page items' event
			$('#role_search').on('click.SFP.role.query', $.SFP.role.queryRole);			
		},
		queryRole: function () {
			$('#role_main_table').DataTable().ajax.reload();
			return;
		}
	};// end of $.SFP.role
	
	/*
	 * config ====== config infomation maintain page
	 * 
	 * @type Object @usage $.SFP.config.activate() @usage $.SFP.config.save()
	 * @usage $.SFP.config.reset()
	 */
	$.SFP.config = {
		activate: function () {
			$('.tabular .item').tab();
			
			$.SFP.config.reset();
			
			// listen page items' event
			$('.config_reset').on('click.SFP.config.reset', $.SFP.config.reset);
			$('.config_save').on('click.SFP.config.save', $.SFP.config.save);
			
		},
		reset: function () {
			$.post(o.basePath + '/sys/config/list?rand=' + Math.random(), {}, function(data, textStatus, jqXHR) {
				if( data.code == 0 ) {
					$.each(data.confList, function(index, conf, arr) {
						if(conf.confKey == 'hsm_name') {
							$('#config_hsm_name').val(conf.confStrValue);
							$('#config_hsm_name').data('id', conf.id);
						}
						else if(conf.confKey == 'hsm_type') {
							$('#config_hsm_type').val(conf.confStrValue);
							$('#config_hsm_type').data('id', conf.id);
						}
						else if(conf.confKey == 'hsm_sn') {
							$('#config_hsm_sn').val(conf.confStrValue);
							$('#config_hsm_sn').data('id', conf.id);
						}
						else if(conf.confKey == 'hsm_address') {
							$('#config_hsm_address').val(conf.confStrValue);
							$('#config_hsm_address').data('id', conf.id);
						}
						else if(conf.confKey == 'hsm_port') {
							$('#config_hsm_port').val(conf.confIntValue);
							$('#config_hsm_port').data('id', conf.id);
						}
						/*
						 * else if(conf.confKey == 'redisSwitch') {
						 * if(conf.confValue == false) {
						 * $('#config_use_redis').prop('checked', true); } else {
						 * $('#config_use_redis').prop('checked', null); } }
						 */
						else if(conf.confKey == 'rootkey_backpath_base') {
							$('#config_rootkey_backpath_base').val(conf.confStrValue);
							$('#config_rootkey_backpath_base').data('id', conf.id);
						}
						else if(conf.confKey == 'rootkey_backpath_symmetric') {
							$('#config_rootkey_backpath_symmetric').val(conf.confStrValue);
							$('#config_rootkey_backpath_symmetric').data('id', conf.id);
						}
						else if(conf.confKey == 'rootkey_backpath_asymmetric') {
							$('#config_rootkey_backpath_asymmetric').val(conf.confStrValue);
							$('#config_rootkey_backpath_asymmetric').data('id', conf.id);
						}
						else if(conf.confKey == 'asymmetric_index_encrypt') {
							$('#config_asymmetric_index_encrypt').val(conf.confStrValue);
							$('#config_asymmetric_index_encrypt').data('id', conf.id);
						}
						else if(conf.confKey == 'asymmetric_index_signature') {
							$('#config_asymmetric_index_signature').val(conf.confStrValue);
							$('#config_asymmetric_index_signature').data('id', conf.id);
						}
						else if(conf.confKey == 'asymmetric_index_exchange') {
							$('#config_asymmetric_index_exchange').val(conf.confStrValue);
							$('#config_asymmetric_index_exchange').data('id', conf.id);
						}
					});
					
					
				}
				else {
					var message = '获取配置信息失败![' + data.msg + ', ' + data.code + ']';
					$.SFP.tipMessage(message, false);
				}
			}, 'json');
		},
		save: function () {
			var orgSN = $('#config_org_sn').val();
			var key128 = $('#key_count').val();
		    
		    var postData = [];
			var conf = {};
			conf.id = $('#config_regional_code').data('id');
			conf.confKey = 'regionalCode';
			conf.confValue = $('#config_regional_code').val();
			postData.push(conf);
			
			var conf = {};
			conf.id = $('#config_keyt_number').data('id');
			conf.confKey = 'keytNumber';
			conf.confValue = $('#config_keyt_number').val();
			postData.push(conf);
			
			var conf = {};
			conf.id = $('#config_sync_cycle').data('id');
			conf.confKey = 'syncCycle';
			conf.confValue = $('#config_sync_cycle').val();
			postData.push(conf);
			
			var conf = {};
			conf.id = $('#config_keyt_timeout').data('id');
			conf.confKey = 'keytTimeOut';
			conf.confValue = $('#config_keyt_timeout').val();
			postData.push(conf);
			
			var urlTarget = o.basePath + '/sys/config/update';
			$.postjson(urlTarget + '?rand=' + Math.random(), JSON.stringify(postData), function(data,textStatus, jqXHR) {
	    		if( data.code == 0 ) {
					$.SFP.config.reset();
					
					$('#role_main_table').DataTable().ajax.reload();
					var message = '保存配置信息成功!';
					$.SFP.tipMessage(message);
				} else {
					var message = '保存配置信息失败![' + data.msg + ', ' + data.code + ']';
					$.SFP.tipMessage(message, false);
				}
			}, 'json');
		}
	};// end of $.SFP.config
	
	/*
	 * syslog ====== syslog infomation maintain page
	 * 
	 * @type Object @usage $.SFP.syslog.activate() @usage
	 * $.SFP.syslog.queryLog()
	 */
	$.SFP.syslog = {
		activate: function () {
			$(".ui.dropdown").dropdown({
			    allowCategorySelection: true,
			    transition: "fade up"
			});
			
			$('#syslog_search_type').dropdown('set selected', '-1');
			
			var dtable = $('#syslog_main_table').DataTable({
				ajax:{
					url: o.basePath + '/sys/log/list',
					type: 'POST',
					data: function ( d ) {
				        d.username = $('#syslog_search_name').val();
				        d.operation = $('#syslog_search_type').dropdown('get value');
					},
					dataSrc: $.SFP.ParseDataTableResult
				},
				processing: true,
				serverSide: true,
				columns: [
					{ data: 'id' },
					{ data: 'username' },
					{ data: 'operation' },
					{ data: 'params' },
					{ data: 'ip' },
					{ data: 'createDate' },
				],
				rowId: 'id',
		        // pagingType: "full_numbers_icon",
		        columnDefs: [
					{
						render: function ( data, type, row ) {
							var html = '';
							html = '<span style="word-break:break-all;">' + data + '</span>';
							return html;
						},
						targets: 3
					}
					],
		        order: [1, 'desc'],
				responsive: true
		    });
			
			// listen page items' event
			$('#syslog_search').on('click.SFP.syslog.query', $.SFP.syslog.querySyslog);
		},
		querySyslog: function () {
			$('#syslog_main_table').DataTable().ajax.reload();
			return;
		}
	};// end of $.SFP.syslog
	
	/*
	 * symmetricRoot ====== symmetric root key infomation maintain page
	 * 
	 * @type Object @usage $.SFP.symmetricRoot.activate() @usage
	 * $.SFP.symmetricRoot.save() @usage $.SFP.symmetricRoot.reset()
	 */
	$.SFP.symmetricRoot = {
		activate: function () {
			$(".ui.dropdown").dropdown({
			    allowCategorySelection: true,
			    transition: "fade up"
			});
			
			if( undefined == $('#input_steps_slider').html() ) {
				$('#input_steps').slider({ 
					id: 'input_steps_slider', 
					ticks: [1, 2, 3, 4, 5, 6],
					ticks_labels: ['开始', '接入设备', '输入PIN', '读取密文', '导入系统', '完成'],
					min: 1, 
					max: 6, 
					value: 1
				});
			}
			
			if( undefined == $('#distribution_steps_slider').html() ) {
				$('#distribution_steps').slider({ 
					id: 'distribution_steps_slider', 
					ticks: [1, 2, 3, 4, 5, 6],
					ticks_labels: ['开始', '接入设备', '写传输介质', '更换设备', '写数据介质', '完成'],
					min: 1, 
					max: 6, 
					value: 1
				});
			}
			
			var dtable = $('#symmetric_root_main_table').DataTable({
				ajax:{
					url: o.basePath + '/key/symmetric/root/list',
					type: 'POST',
					data: function ( d ) {
				        d.username = $('#symmetric_root_search_name').val();
					},
					dataSrc: $.SFP.ParseDataTableResult
				},
				processing: true,
				serverSide: true,
				columns: [
					{ data: 'name' },
					{ data: 'sn' },
					{ data: 'app' },
					{ data: 'type' },
					{ data: 'valid' },
					{ data: 'ver' },
					{ data: 'status' },
				],
				rowId: 'keyId',
		        // pagingType: "full_numbers_icon",
		        columnDefs: [
		        	{
						render: function ( data, type, row ) {
							var html = '';
							html = '<span class="ui basic green button symmetric_root_info">查看</span>';
							if( data == 1 ) {
								html += '<span class="ui basic black button symmetric_root_distribution">分发</span>';
							}
							else if( data == 2 ) {
								
							}
							return html;
						},
						targets: 6
					},
					{
						render: function ( data, type, row ) {
							var html = '';
							if(data == 1) {
								html = "管理密钥";
							}
							else if(data == 2) {
								html = "业务密钥";
							}
							return html;							
						},
						targets: 3
					}
				],
		        order: [1, 'desc'],
				responsive: true
		    });
			
			// listen page items' event
			$('#symmetric_root_search').on('click.SFP.symmetricroot.query', $.SFP.symmetricRoot.querySymmetricRoot);
			$('#add_symmetric_root').on('click.SFP.symmetricroot.add', $.SFP.symmetricRoot.addSymmetricRootWindow);
			$('#symmetric_root_detail_save').on('click.SFP.symmetricroot.detailsave', $.SFP.symmetricRoot.saveAdminConfirm);
			$('#symmetric_root_detail_return').on('click.SFP.symmetricroot.detailreturn', $.SFP.symmetricRoot.adminDetailReturn);
			$('#revoke_symmetric_root').on('click.SFP.symmetricroot.revoke', $.SFP.symmetricRoot.revokeSymmetricRootWindow);
			$('#backup_symmetric_root').on('click.SFP.symmetricroot.backup', $.SFP.symmetricRoot.backupSymmetricRootWindow);
			$('#recover_symmetric_root').on('click.SFP.symmetricroot.recover', $.SFP.symmetricRoot.recoverSymmetricRootWindow);
			$('#symmetric_root_main_table').on( 'draw.dt', function () {
				$('.symmetric_root_info').on('click.SFP.symmetricroot.detail', $.SFP.symmetricRoot.addSymmetricRootWindow);
				$('.symmetric_root_distribution').on('click.SFP.symmetricroot.distribution', $.SFP.symmetricRoot.distributionSymmetricRoot);
			});
			$('#symmetric_root_genkey_random').on('click.SFP.symmetricroot.delconfirm', $.SFP.symmetricRoot.genkeyRandom);
			$('#symmetric_root_genkey_cipher').on('click.SFP.symmetricroot.delconfirm', $.SFP.symmetricRoot.genkeyCipher);
			$('#symmetric_root_genkey_input').on('click.SFP.symmetricroot.delconfirm', $.SFP.symmetricRoot.genkeyInput);
			
			
		},
		querySymmetricRoot: function () {
			$('#symmetric_root_main_table').DataTable().ajax.reload();
			return;
		},
		addSymmetricRootWindow: function () {
			var adminId = $(this).data('id');
			if( undefined == adminId ) {
				adminId = 0;
			}
			
			$.post(o.basePath + '/sys/user/info/' + adminId + '?rand=' + Math.random(), {}, function(data,textStatus, jqXHR) {
				if( data.code == 0 ) {
					var htmlData = '';
					
					if( adminId != 0 ) {
						$('#admin_name').val(data.user.username);
						$('#admin_email').val(data.user.email);
						$('#admin_mobile').val(data.user.mobile);
					}
					
					$('#admin_detail_save').data('admin_id', adminId);
					$('#symmetric_root_list_page, #symmetric_root_detail_page').toggleClass('displaynone');
					$('body').getNiceScroll().resize();
				}
				else {
					var message = '获取管理员权限信息失败![' + data.msg + ', ' + data.code + ']';
					$.SFP.tipMessage(message, false);
				}
			}, 'json');
		},
		distributionSymmetricRoot: function () {
			$("#symmetric_root_distribution_modal").modal({closable:false}).modal('show');
			
			$('#distribution_steps').slider('relayout');
		},
		adminDetailReturn: function () {
			$('#admin_name').val('');
			$('#admin_email').val('');
			$('#admin_mobile').val('');
			$('#admin_pwd').val('');
			$('#admin_repwd').val('');
			
			$('#admin_list_page, #admin_detail_page').toggleClass('displaynone');
		},
		saveAdminConfirm: function () {
			var adminId = $('#admin_detail_save').data('admin_id');

			var name = $('#admin_name').val();
		    var email = $('#admin_email').val();
		    var mobile = $('#admin_mobile').val();
		    var pwd = $('#admin_pwd').val().trim();
		    var repwd = $('#admin_repwd').val().trim();
		    
		    if( adminId == 0 && pwd.length == 0 ) {
		    	var message = '保存管理员信息失败![添加管理员时，口令不能为空]';
				$.SFP.tipMessage(message, false);
				return;
		    }
		    
		    if( pwd != repwd ) {
		    	var message = '保存管理员信息失败![口令与重复口令不匹配，请重新输入!]';
		    	$('#admin_pwd').val('');
		    	$('#admin_repwd').val('');
				$.SFP.tipMessage(message, false);
				return;
		    }
		    
			var postData = {};
			postData.userId = adminId;
			postData.username = name;
			postData.email = email;
			postData.mobile = mobile;
			postData.roleIdList = [];
			if( pwd.length > 0 ) {
				postData.password = pwd;
			}
			$('#admin_role_list input:checkbox:checked').each(function(index, item, arr){
				postData.roleIdList.push($(item).val());
			});
			
			var urlTarget = o.basePath + '/sys/user/';
			if( adminId == 0 ) {
				urlTarget += 'save';
			}
			else {
				urlTarget += 'update';
			}
			
			$.post(urlTarget + '?rand=' + Math.random(), postData, function(data, textStatus, jqXHR) {
	    		if( data.code == 0 ) {
					$.SFP.admin.adminDetailReturn();
					
					$('#admin_main_table').DataTable().ajax.reload();
					var message = '保存管理员信息成功!';
					$.SFP.tipMessage(message);
				} else {
					var message = '保存管理员信息失败![' + data.msg + ', ' + data.code + ']';
					$.SFP.tipMessage(message, false);
				}
			}, 'json');
		},
		revokeSymmetricRootWindow: function() {
			var message = "已选定2个密钥，注销后密钥将无法生成子密钥，是否继续？";
			$('#symmetric_root_revoke_message').html(message);
			$("#symmetric_root_revoke_modal").modal({closable:false}).modal('show');
		},
		backupSymmetricRootWindow: function() {
			var message = "已选定2个密钥，备份后会下载密钥文件，是否继续？";
			$('#symmetric_root_backup_message').html(message);
			$("#symmetric_root_backup_modal").modal({closable:false}).modal('show');
		},
		recoverSymmetricRootWindow: function() {
			$("#symmetric_root_recover_modal").modal({closable:false}).modal('show');
		},
		genkeyRandom: function() {
			var returnBtn1 = '<i class="wait icon"></i>等待';
			$('#symmetric_root_genkey_random_modal_confirm').html(returnBtn1);
			$('#symmetric_root_genkey_random_modal_confirm').addClass('disabled');
			$("#symmetric_root_genkey_random_modal").modal({closable:false}).modal('show');
			
			var t1=window.setTimeout(function(){
				$('#genkey_random_progress').removeClass('yellow active').addClass('green')
				var returnBtn2 = '<i class="checkmark icon"></i>完成';
				$('#symmetric_root_genkey_random_modal_confirm').html(returnBtn2);
				$('#symmetric_root_genkey_random_modal_confirm').removeClass('disabled');
				// window.clearTimeout(t1);
			}, 1000 * 2);
		},
		genkeyCipher: function() {
			$("#symmetric_root_genkey_cipher_modal").modal({closable:false}).modal('show');
		},
		genkeyInput: function() {
			$("#symmetric_root_genkey_input_modal").modal({closable:false}).modal('show');
			
			$('#input_steps').slider('relayout');
			
		},
		delAdmin: function () {
			var rowId = $(this).data('id');
			var delIds = ''+rowId;
			
			var rowData = $('#admin_main_table').DataTable().row('#'+rowId).data();
			var message = '是否要删除此管理员 [ ' + rowData.username + ' ] ？';
			
			$('#admin_confirm_modal_message').empty().append(message);
			$('#admin_confirm_modal_confirm').data('delIds', delIds);
			$("#admin_confirm_modal").modal({closable:false}).modal('show');
		},
		delAdminConfirm: function (postData) {
			var delIds = $('#admin_confirm_modal_confirm').data('delIds');
			var postData = {userIds:delIds};
			
			$.post(o.basePath + '/sys/user/delete', postData, function(data, textStatus, jqXHR) {
				if( data.code == 0 ) {
					var message = '管理员信息已删除!';
					$.SFP.tipMessage(message);
					$('#admin_main_table').DataTable().ajax.reload();
				} else {
					var message = '删除管理员信息失败![' + data.msg + ', ' + data.code + ']';
					$.SFP.tipMessage(message, false);
				}
			}, 'json');
		}
	};// end of $.SFP.symmetricRoot

	/*
	 * symmetricSub ====== symmetric sub key infomation maintain page
	 * 
	 * @type Object @usage $.SFP.symmetricSub.activate() @usage
	 * $.SFP.symmetricSub.save() @usage $.SFP.symmetricSub.reset()
	 */
	$.SFP.symmetricSub = {
		activate: function () {
			$(".ui.dropdown").dropdown({
			    allowCategorySelection: true,
			    transition: "fade up"
			});
			
			if( undefined == $('#input_steps_slider').html() ) {
				$('#input_steps').slider({ 
					id: 'input_steps_slider', 
					ticks: [1, 2, 3, 4, 5, 6],
					ticks_labels: ['开始', '接入设备', '输入PIN', '读取密文', '导入系统', '完成'],
					min: 1, 
					max: 6, 
					value: 1
				});
			}
			
			if( undefined == $('#distribution_steps_slider').html() ) {
				$('#distribution_steps').slider({ 
					id: 'distribution_steps_slider', 
					ticks: [1, 2, 3, 4, 5, 6],
					ticks_labels: ['开始', '接入设备', '写传输介质', '更换设备', '写数据介质', '完成'],
					min: 1, 
					max: 6, 
					value: 1
				});
			}
			
			$("#treeTable").treetable({
			 	theme : "vsStyle",
		        expandable : true,
		        initialState:"collapsed",
		        onNodeExpand: function() {// 分支展开后的回调函数
					var node = this;
					// 判断当前节点是否已经拥有子节点
					var childSize = $("#treeTable").find("[data-tt-parent-id='" + node.id + "']").length;
					if (childSize > 0) { 
						 return; 
					}
					var data = "pageId=" + node.id;
					// Render loader/spinner while loading 加载时渲染
					$.ajax({
						loading : false,
						sync: false,// Must be false, otherwise loadBranch
									// happens after showChildren?
						url : o.basePath + '/key/symmetric/sub/children',
						data: data,
						success:function(result) {
							/*
							 * if(0 == result.code ){
							 * if(!com.isNull(result.body)){ if(0 ==
							 * eval(result.body['chilPages']).length){//不存在子节点
							 * var $tr = $("#treetable").find("[data-tt-id='" +
							 * node.id + "']");
							 * $tr.attr("data-tt-branch","false");//
							 * data-tt-branch 标记当前节点是否是分支节点，在树被初始化的时候生效
							 * $tr.find("span.indenter").html("");// 移除展开图标
							 * return; }
							 * 
							 * var rows =
							 * this.getnereateHtml(result.body['chilPages']);
							 * $("#treetable").treetable("loadBranch", node,
							 * rows);// 插入子节点
							 * $("#treetable").treetable("expandNode",
							 * node.id);// 展开子节点 } }else{ alert(result.tip); }
							 */
							var html = '<tr data-tt-id="8" data-tt-parent-id="' + node.id + '"><td>5.1</td><td>可以是ajax请求来的内容</td></tr>'
                             + '<tr data-tt-id="9" data-tt-parent-id="' + node.id + '"><td>5.2</td><td>动态的内容</td></tr>';

							html = '<tr id="8" role="row" class="even" data-tt-id="8" data-tt-parent-id="' + node.id + '"><td>郑州地铁子密钥2</td><td>AA00000000002</td><td>亿雅捷发卡系统</td><td>管理密钥</td><td>2020-12-30</td><td>1</td><td><span class="ui basic green button symmetric_sub_info">查看</span></td></tr>'
                             + '<tr id="9" role="row" class="even" data-tt-id="9" data-tt-parent-id="' + node.id + '"><td>郑州地铁子密钥2</td><td>AA00000000002</td><td>亿雅捷发卡系统</td><td>管理密钥</td><td>2020-12-30</td><td>1</td><td><span class="ui basic green button symmetric_sub_info">查看</span></td></tr>';
                    		// var rows = $(html).filter("tr");
							$("#treeTable").treetable("loadBranch", node, html);// 插入子节点
							$("#treeTable").treetable("expandNode", node.id);// 展开子节点
						}
					});
				 },
		        // expandable : true
		        clickableNodeNames:true,// 点击节点名称也打开子节点.
		        indent : 30// 每个分支缩进的像素数。
		    });
			
			var dtable = $('#symmetric_sub_main_table').DataTable({
				ajax:{
					url: o.basePath + '/key/symmetric/sub/list',
					type: 'POST',
					data: function ( d ) {
				        d.username = $('#symmetric_sub_search_name').val();
					},
					dataSrc: $.SFP.ParseDataTableResult
				},
				processing: true,
				serverSide: true,
				columns: [
					{ data: 'name' },
					{ data: 'sn' },
					{ data: 'app' },
					{ data: 'type' },
					{ data: 'valid' },
					{ data: 'ver' },
					{ data: 'status' },
				],
				rowId: 'keyId',
		        // pagingType: "full_numbers_icon",
		        columnDefs: [
		        	{
						render: function ( data, type, row ) {
							var html = '';
							html = '<span class="ui basic green button symmetric_sub_info">查看</span>';
							if( data == 1 ) {
								html += '<span class="ui basic black button symmetric_sub_distribution">分发</span>';
							}
							else if( data == 2 ) {
								
							}
							return html;
						},
						targets: 6
					},
					{
						render: function ( data, type, row ) {
							var html = '';
							if(data == 1) {
								html = "管理密钥";
							}
							else if(data == 2) {
								html = "业务密钥";
							}
							return html;							
						},
						targets: 3
					}
				],
				createdRow: function( row, data, dataIndex ) {
				    $(row).attr('data-tt-id', data.keyId).attr('data-tt-branch',true);
				    
				},
		        order: [1, 'desc'],
				responsive: true
		    });
			
			// listen page items' event
			$('#symmetric_sub_search').on('click.SFP.symmetricsub.query', $.SFP.symmetricSub.querySymmetricSub);
			$('#add_symmetric_sub').on('click.SFP.symmetricsub.add', $.SFP.symmetricSub.addSymmetricSubWindow);
			$('#symmetric_sub_detail_save').on('click.SFP.symmetricsub.detailsave', $.SFP.symmetricSub.saveAdminConfirm);
			$('#symmetric_sub_detail_return').on('click.SFP.symmetricsub.detailreturn', $.SFP.symmetricSub.adminDetailReturn);
			$('#revoke_symmetric_sub').on('click.SFP.symmetricsub.revoke', $.SFP.symmetricSub.revokeSymmetricSubWindow);
			$('#symmetric_sub_main_table').on( 'draw.dt', function () {
				$('.symmetric_sub_info').on('click.SFP.symmetricsub.detail', $.SFP.symmetricSub.addSymmetricSubWindow);
				$('.symmetric_sub_distribution').on('click.SFP.symmetricsub.distribution', $.SFP.symmetricSub.distributionSymmetricSub);
				
				$("#symmetric_sub_main_table").treetable({
					theme : "vsStyle",
					expandable : true,
					initialState:"collapsed",
					onNodeExpand: function() {// 分支展开后的回调函数
							var node = this;
							var childSize = $("#symmetric_sub_main_table").find("[data-tt-parent-id='" + node.id + "']").length;
							if (childSize > 0) { 
								 return; 
							}
							var data = "pageId=" + node.id;
							$.ajax({
								loading : false,
								sync: false,
								url : 'http://127.0.0.1:80/tkms/key/symmetric/sub/children',
								data: data,
								success:function(result) {
									var html = '<tr id="8" role="row" class="even" data-tt-id="9" data-tt-parent-id="' + node.id + '"><td>郑州地铁子密钥2</td><td>AA00000000002</td><td>亿雅捷发卡系统</td><td>管理密钥</td><td>2020-12-30</td><td>1</td><td><span class="ui basic green button symmetric_sub_info">查看</span></td></tr>'
				                             + '<tr id="9" role="row" class="even" data-tt-id="9" data-tt-parent-id="' + node.id + '"><td>郑州地铁子密钥2</td><td>AA00000000002</td><td>亿雅捷发卡系统</td><td>管理密钥</td><td>2020-12-30</td><td>1</td><td><span class="ui basic green button symmetric_sub_info">查看</span></td></tr>';
				
									$("#symmetric_sub_main_table").treetable("loadBranch", node, html);// 插入子节点
									$("#symmetric_sub_main_table").treetable("collapseNode", node.id);// 展开子节点
									$("#symmetric_sub_main_table").treetable("expandNode", node.id);// 展开子节点
								}
							});
						 },
					clickableNodeNames:true,
					indent : 30
				});
			});
			/*
			 * $('#symmetric_sub_genkey_random').on('click.SFP.symmetricsub.delconfirm',
			 * $.SFP.symmetricSub.genkeyRandom);
			 * $('#symmetric_sub_genkey_cipher').on('click.SFP.symmetricsub.delconfirm',
			 * $.SFP.symmetricSub.genkeyCipher);
			 * $('#symmetric_sub_genkey_input').on('click.SFP.symmetricsub.delconfirm',
			 * $.SFP.symmetricSub.genkeyInput);
			 */
			
			
			
			    
		},
		querySymmetricSub: function () {
			$('#symmetric_sub_main_table').DataTable().ajax.reload();
			return;
		},
		addSymmetricSubWindow: function () {
			var adminId = $(this).data('id');
			if( undefined == adminId ) {
				adminId = 0;
			}
			
			$.post(o.basePath + '/sys/user/info/' + adminId + '?rand=' + Math.random(), {}, function(data,textStatus, jqXHR) {
				if( data.code == 0 ) {
					var htmlData = '';
					
					if( adminId != 0 ) {
						$('#admin_name').val(data.user.username);
						$('#admin_email').val(data.user.email);
						$('#admin_mobile').val(data.user.mobile);
					}
					
					$('#admin_detail_save').data('admin_id', adminId);
					$('#symmetric_root_list_page, #symmetric_root_detail_page').toggleClass('displaynone');
					$('body').getNiceScroll().resize();
				}
				else {
					var message = '获取管理员权限信息失败![' + data.msg + ', ' + data.code + ']';
					$.SFP.tipMessage(message, false);
				}
			}, 'json');
		},
		distributionSymmetricSub: function () {
			$("#symmetric_root_distribution_modal").modal({closable:false}).modal('show');
			
			$('#distribution_steps').slider('relayout');
		},
		adminDetailReturn: function () {
			$('#admin_name').val('');
			$('#admin_email').val('');
			$('#admin_mobile').val('');
			$('#admin_pwd').val('');
			$('#admin_repwd').val('');
			
			$('#admin_list_page, #admin_detail_page').toggleClass('displaynone');
		},
		saveAdminConfirm: function () {
			var adminId = $('#admin_detail_save').data('admin_id');

			var name = $('#admin_name').val();
		    var email = $('#admin_email').val();
		    var mobile = $('#admin_mobile').val();
		    var pwd = $('#admin_pwd').val().trim();
		    var repwd = $('#admin_repwd').val().trim();
		    
		    if( adminId == 0 && pwd.length == 0 ) {
		    	var message = '保存管理员信息失败![添加管理员时，口令不能为空]';
				$.SFP.tipMessage(message, false);
				return;
		    }
		    
		    if( pwd != repwd ) {
		    	var message = '保存管理员信息失败![口令与重复口令不匹配，请重新输入!]';
		    	$('#admin_pwd').val('');
		    	$('#admin_repwd').val('');
				$.SFP.tipMessage(message, false);
				return;
		    }
		    
			var postData = {};
			postData.userId = adminId;
			postData.username = name;
			postData.email = email;
			postData.mobile = mobile;
			postData.roleIdList = [];
			if( pwd.length > 0 ) {
				postData.password = pwd;
			}
			$('#admin_role_list input:checkbox:checked').each(function(index, item, arr){
				postData.roleIdList.push($(item).val());
			});
			
			var urlTarget = o.basePath + '/sys/user/';
			if( adminId == 0 ) {
				urlTarget += 'save';
			}
			else {
				urlTarget += 'update';
			}
			
			$.post(urlTarget + '?rand=' + Math.random(), postData, function(data, textStatus, jqXHR) {
	    		if( data.code == 0 ) {
					$.SFP.admin.adminDetailReturn();
					
					$('#admin_main_table').DataTable().ajax.reload();
					var message = '保存管理员信息成功!';
					$.SFP.tipMessage(message);
				} else {
					var message = '保存管理员信息失败![' + data.msg + ', ' + data.code + ']';
					$.SFP.tipMessage(message, false);
				}
			}, 'json');
		},
		revokeSymmetricSubWindow: function() {
			var message = "已选定2个密钥，注销后密钥将无法生成子密钥，是否继续？";
			$('#symmetric_root_revoke_message').html(message);
			$("#symmetric_root_revoke_modal").modal({closable:false}).modal('show');
		},
		genkeyRandom: function() {
			var returnBtn1 = '<i class="wait icon"></i>等待';
			$('#symmetric_root_genkey_random_modal_confirm').html(returnBtn1);
			$('#symmetric_root_genkey_random_modal_confirm').addClass('disabled');
			$("#symmetric_root_genkey_random_modal").modal({closable:false}).modal('show');
			
			var t1=window.setTimeout(function(){
				$('#genkey_random_progress').removeClass('yellow active').addClass('green')
				var returnBtn2 = '<i class="checkmark icon"></i>完成';
				$('#symmetric_root_genkey_random_modal_confirm').html(returnBtn2);
				$('#symmetric_root_genkey_random_modal_confirm').removeClass('disabled');
				// window.clearTimeout(t1);
			}, 1000 * 2);
		},
		genkeyCipher: function() {
			$("#symmetric_root_genkey_cipher_modal").modal({closable:false}).modal('show');
		},
		genkeyInput: function() {
			$("#symmetric_root_genkey_input_modal").modal({closable:false}).modal('show');
			
			$('#input_steps').slider('relayout');
			
		},
		delAdmin: function () {
			var rowId = $(this).data('id');
			var delIds = ''+rowId;
			
			var rowData = $('#admin_main_table').DataTable().row('#'+rowId).data();
			var message = '是否要删除此管理员 [ ' + rowData.username + ' ] ？';
			
			$('#admin_confirm_modal_message').empty().append(message);
			$('#admin_confirm_modal_confirm').data('delIds', delIds);
			$("#admin_confirm_modal").modal({closable:false}).modal('show');
		},
		delAdminConfirm: function (postData) {
			var delIds = $('#admin_confirm_modal_confirm').data('delIds');
			var postData = {userIds:delIds};
			
			$.post(o.basePath + '/sys/user/delete', postData, function(data, textStatus, jqXHR) {
				if( data.code == 0 ) {
					var message = '管理员信息已删除!';
					$.SFP.tipMessage(message);
					$('#admin_main_table').DataTable().ajax.reload();
				} else {
					var message = '删除管理员信息失败![' + data.msg + ', ' + data.code + ']';
					$.SFP.tipMessage(message, false);
				}
			}, 'json');
		}
	};// end of $.SFP.symmetricSub
	
	/*
	 * worksconfig ====== worksconfig infomation maintain page
	 * 
	 * @type Object @usage $.SFP.worksconfig.activate() @usage
	 * $.SFP.worksconfig.save() @usage $.SFP.worksconfig.reset()
	 */
	$.SFP.worksconfig = {
		activate: function () {
			$('.tabular .item').tab();
			
			$.SFP.worksconfig.reset();
			
			// listen page items' event
			$('.config_reset').on('click.SFP.worksconfig.reset', $.SFP.worksconfig.reset);
			$('.config_save').on('click.SFP.worksconfig.save', $.SFP.worksconfig.save);
			
		},
		reset: function () {
			$('#worksconfig_min').val('');
			$('#worksconfig_max').val('');
			$('#worksconfig_minidle').val('');
			$('#worksconfig_maxidle').val('');
			
			$.post(o.basePath + '/run/init?rand=' + Math.random(), {}, function(data, textStatus, jqXHR) {
				if( data.code == 0 ) {
					var runConfig = data.runConfig;
					if(runConfig.minRunNum != undefined) {
						$('#worksconfig_min').val(runConfig.minRunNum);
					}
					
					if(runConfig.maxRunNum != undefined) {
						$('#worksconfig_max').val(runConfig.maxRunNum);
					}
					
					if(runConfig.minFreeNum != undefined) {
						$('#worksconfig_minidle').val(runConfig.minFreeNum);
					}
					
					if(runConfig.maxFreeNum != undefined) {
						$('#worksconfig_maxidle').val(runConfig.maxFreeNum);
					}
				}
				else {
					var message = '获取配置信息失败![' + data.msg + ', ' + data.code + ']';
					$.SFP.tipMessage(message, false);
				}
			}, 'json');
		},
		save: function () {
			var min = $('#worksconfig_min').val();
			var max = $('#worksconfig_max').val();
			var minidle = $('#worksconfig_minidle').val();
			var maxidle = $('#worksconfig_maxidle').val();
		    
			
			var postData = {};
			postData.minRunNum = min;
			postData.maxRunNum = max;
			postData.minFreeNum = minidle;
			postData.maxFreeNum = maxidle;
			
			var urlTarget = o.basePath + '/run/saveOrUpdate';
			$.post(urlTarget + '?rand=' + Math.random(), postData, function(data,textStatus, jqXHR) {
	    		if( data.code == 0 ) {
					$.SFP.worksconfig.reset();
					
					var message = '保存配置信息成功!';
					$.SFP.tipMessage(message);
				} else {
					var message = '保存配置信息失败![' + data.msg + ', ' + data.code + ']';
					$.SFP.tipMessage(message, false);
				}
			}, 'json');
		}
	};// end of $.SFP.worksconfig

	/*
	 * batchcompress ====== batchcompress infomation maintain page
	 * 
	 * @type Object @usage $.SFP.batchcompress.activate() @usage
	 * $.SFP.batchcompress.refreshTask() @usage $.SFP.batchcompress.start()
	 */
	$.SFP.batchcompress = {
		activate: function () {
			$('.tabular .item').tab();
			
			$.SFP.batchcompress.refreshTask();
			
			// listen page items' event
			$('.batch_starter').on('click.SFP.batchcompress.save', $.SFP.batchcompress.start);
			$('.batch_refresh').on('click.SFP.batchcompress.refreshTask', $.SFP.batchcompress.refreshTask);
			$('#datacompress_progress_modal_confirm').on('click.SFP.batchcompress.refreshTask', $.SFP.batchcompress.refreshTask);
		},
		refreshTask: function () {
			$('#compress_source').val('');
			$('#precompress_num').val('');
			$('#compress_dest').val('');
			$('#compressed_num').val('');
			$('#algorithmic_list :radio').prop('checked',false);
			$("#clean_list :radio[value='0']").prop('checked',true);
			$('#compress_progresser').progress('set.percent',1);
			$('#compress_progresser').progress('set.percent',0);
			
			$.post(o.basePath + '/data/init?rand=' + Math.random(), {}, function(data, textStatus, jqXHR) {
				if( data.code == 0 ) {
					
					if(data.srcPath != undefined) {
						$('#compress_source').val(data.srcPath);
					}
					if(data.srcFiles != undefined) {
						$('#precompress_num').val(data.srcFiles);
					}
					if(data.destPath != undefined) {
						$('#compress_dest').val(data.destPath);
					}
					if(data.destFiles != undefined) {
						$('#compressed_num').val(data.destFiles);
					}
					if(data.arithmetic != undefined) {
						$("#algorithmic_list :radio[value='" + data.arithmetic + "']").prop('checked',true);
					}
					var message = '读取任务信息成功!';
					$.SFP.tipMessage(message);
				}
				else {
					var message = '获取配置信息失败![' + data.msg + ', ' + data.code + ']';
					$.SFP.tipMessage(message, false);
				}
			}, 'json');
		},
		start: function () {
			var total = $('#precompress_num').val();
			var returnBtn = '';
			if( total == 0 ) {
				$('#datacompress_progress_message').empty().append('当前没有可压缩数据!');
				returnBtn = '<i class="checkmark icon"></i>完成';
				$('#datacompress_progress_modal_confirm').html(returnBtn);
				$('#datacompress_progress_modal_confirm').removeClass('disabled');
				$("#datacompress_progress_modal").modal({closable:false}).modal('show');
				return;
			}
			
			$('#datacompress_progress_message').empty().append('本次预计压缩文件数量：' + total + '');
			returnBtn = '<i class="wait icon"></i>等待';
			$('#datacompress_progress_modal_confirm').html(returnBtn);
			$('#datacompress_progress_modal_confirm').addClass('disabled');
			$("#datacompress_progress_modal").modal({closable:false}).modal('show');
			
			var cleanFlag = $("#clean_list :radio:checked").val();
			var postData = {};
			postData.flag = cleanFlag;
			var urlTarget = o.basePath + '/data/reduceData';
			$.post(urlTarget + '?rand=' + Math.random(), postData, function(data, textStatus, jqXHR) {
	    		if( data.code == 0 ) {
	    			$('#compress_progresser').progress('set.total', total);
					$.SFP.batchcompress.updateProgress();
				} else {
					var message = '启动批量数据压缩失败![' + data.msg + ', ' + data.code + ']';
					$('#datacompress_progress_message').append(message);
					returnBtn = '<i class="remove icon"></i>取消';
					$('#datacompress_progress_modal_confirm').html(returnBtn);
					$('#datacompress_progress_modal_confirm').removeClass('disabled');
				}
			}, 'json');
		},
		updateProgress: function () {
			var urlTarget = o.basePath + '/data/rate';
			$.post(urlTarget + '?rand=' + Math.random(), {}, function(data,textStatus, jqXHR) {
	    		if( data.code == 0 ) {
	    			var total = $('#compress_progresser').progress('get.total');
	    			var remain = data.fileSize;
	    			var compressed = total - remain;
	    			$('#compress_progresser').progress('set.progress', compressed);
	    			
	    			var isComplete = $('#compress_progresser').progress('is.complete');
					if(isComplete) {
						var message = '本次压缩操作已完成！';
						$('#datacompress_progress_message').append(message);
						var finishBtn = '<i class="checkmark icon"></i>完成';
						$('#datacompress_progress_modal_confirm').html(finishBtn);
						$('#datacompress_progress_modal_confirm').removeClass('disabled');
					}
					else {
						$.SFP.batchcompress.updateProgress();
					}
				} else {
					var message = '读取进度信息失败![' + data.msg + ', ' + data.code + ']';
					$('#datacompress_progress_message').append(message);
					var returnBtn = '<i class="remove icon"></i>取消';
					$('#datacompress_progress_modal_confirm').html(returnBtn);
					$('#datacompress_progress_modal_confirm').removeClass('disabled');
				}
			}, 'json');
		}
	};// end of $.SFP.batchcompress

	/*
	 * TipMessage(message) ========== Showing the info or warn message.
	 * 
	 * @type Function @usage: $.SFP.tipMessage(message)
	 */
	$.SFP.tipMessage = function(message, isAutoClose) {
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
	};// end of $.SFP.tipMessage
	$.SFP.tipMessageSuccess = function(message, isAutoClose) {
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
	};// end of $.SFP.tipMessage
  
	/*
	 * CheckLoad() ========== check load response.
	 * 
	 * @type Function @usage: $.SFP.CheckLoad(response)
	 */
	$.SFP.CheckLoad = function(response) {
		if(! new RegExp('mainWrapInner').test(response) ){
			window.location.href = '404.html';
		}
			
	};// end of $.SFP.checkLoad

	/*
	 * ErrOccurred() ========== deal with error message, jump to error page
	 * 
	 * @type Function @usage: $.SFP.ErrOccurred(response)
	 */
	$.SFP.ErrOccurred = function(msg, code) {
		sessionStorage.errTip = msg + '[' + code + ']';
		location.href='error.html';
	}// end of $.SFP.errOccurred
	
	/*
	 * PageActivate() ========== do page initialize
	 * 
	 * @type Function @usage: $.SFP.PageActivate(response)
	 */
	$.SFP.PageActivate = function(url) {
		// if( url == 'modules/sys/menu.html' ) {
		if( url == 'pages/system/admin.html' ) {
			$.SFP.admin.activate();
		}
		/*
		 * else if( url == 'pages/system/role.html' ) { $.SFP.role.activate(); }
		 * else if( url == 'pages/system/config.html' ) {
		 * $.SFP.config.activate(); }
		 */
		else if( url == 'pages/device/white_list.html' ) {
			$.SFP.whiteList.activate();
		}
		else if( url == 'pages/device/black_list.html' ) {
			$.SFP.blackList.activate();
		}
		else if( url == 'pages/key/key_list.html' ) {
			$.SFP.keyList.activate();
		}
		else if( url == 'pages/key/key_source.html' ) {
			$.SFP.keySource.activate();
		}
		else if( url == 'pages/cipher/hsm_list.html' ) {
			$.SFP.hsmList.activate();
		}
		else if( url == 'pages/logs/log_list.html' ) {
			$.SFP.logList.activate();
		}else if( url == 'pages/strategy/role_list.html' ) {
			$.SFP.strategy.activate();
		}else if( url == 'pages/groups/device_group.html' ) {
			   $.SFP.groupRole.activate();
		}else if( url == 'pages/device/device_regist.html' ) {
			   $.SFP.deviceRegister.activate();
		}else if( url == 'pages/device/device_query.html' ) {
			   $.SFP.deviceQuery.activate();
		}else if( url == 'pages/device/device_modeifi.html' ) {
			   $.SFP.deviceModifiy.activate();
		}else if( url == 'pages/device/device_logout.html' ) {
			   $.SFP.deviceLogout.activate();
		}else if( url == 'pages/device/white2_list.html' ) {
			   $.SFP.deviceWhiteList.activate();
		}else if( url == 'pages/device/black2_list.html' ) {
			   $.SFP.deviceBlackList.activate();
		}else if(url == 'pages/app/app_regist.html') {
			$.SFP.appRegist.activate();
		} else if(url == 'pages/app/app_query.html') {
			$.SFP.appQuery.activate();
		} else if(url == 'pages/app/app_update.html') {
			$.SFP.appUpdate.activate();
		} else if(url == 'pages/app/app_logout.html') {
			$.SFP.appLogout.activate();
		} else if(url == 'pages/system/admin_insert.html') {
			$.SFP.adminInsert.activate();
		} else if(url == 'pages/system/admin_query.html') {
			$.SFP.adminQuery.activate();
		}else if(url == 'pages/key/key_download.html') {
			$.SFP.keyDownload.activate();
		}else if(url == 'pages/key/key_exit.html') {
			$.SFP.keyExit.activate();
		}else if(url == 'pages/key/key_update.html') {
			$.SFP.keyUpdate.activate();
		}else if(url == 'pages/version/device_version.html') {
			$.SFP.deviceversion.activate();
		}else if(url == 'pages/config/config_query.html') {
            $.SFP.rfidConfig.activate();
        }else if(url == 'pages/rfid/rfid_query.html') {
            $.SFP.rfidQuery.activate();
        }else if(url == "pages/monitor/spring_monitor.html"){
        	$.SFP.springMonitor.activate();
        }else if(url == "pages/monitor/spring_tree.html"){
        	$.SFP.springTree.activate();
        }else if(url == "pages/monitor/db_list.html"){
        	$.SFP.dbMonitorList.activate();
        }else if(url == "pages/monitor/mongodb_list.html"){
        	$.SFP.mongoMonitorList.activate();
        }else if(url == "pages/monitor/redis_list.html"){
        	$.SFP.redisMonitorList.activate();
        }
	}// end of $.SFP.PageActivate
	
	$.SFP.redisMonitorList = {
			activate:function (){
					var dtable = $('#redis_monitor_table').DataTable({
						ajax:{
							url: o.basePath + '/monitor/redisList',
							type: 'POST',
							data: function ( d ) {
							},
							dataSrc: function (json){
								if(json.code != 0) {
				                    json.list = [];
				                    var message = '获取数据失败![' + json.msg + ', ' + json.code + ']';
				                    $.SFP.tipMessage(message, false);
			                    }
			                    return json.list;
							},
						},
						processing: true,
						serverSide: true,
						columns: [
							{ data: 'mode' },
							{ data: 'role' },
							{ data: 'addr' },
							{ data: 'memory' },
							{ data: 'uptime' },
							{ data: 'status' },
						],
						rowId: 'id',
				        //pagingType: "full_numbers_icon",
				        columnDefs: [
				            {
							render: function ( data, type, row ) {
								var html = '';
								if( data == '1' ) {
									html = '<span class="ui basic green button">正常</span>';
								}
								else if( data == '2' ) {
									html = '<span class="ui basic red button">异常</span>';
								}
								return html;
							},
							targets: 5
							}
						],
				        order: [1, 'desc'],
						responsive: true
				   });
			},		
		}
		
		$.SFP.mongoMonitorList = {
			activate:function (){
					var dtable = $('#mongodb_monitor_table').DataTable({
						ajax:{
							url: o.basePath + '/monitor/mongodbList',
							type: 'POST',
							data: function ( d ) {
							},
							dataSrc: function (json){
								if(json.code != 0) {
				                    json.list = [];
				                    var message = '获取数据失败![' + json.msg + ', ' + json.code + ']';
				                    $.SFP.tipMessage(message, false);
			                    }
			                    return json.list;
							},
							error: function(xhr, textStatus, errorThrown){
								alert(xhr.responseJSON.message);
							},
						},
						processing: true,
						serverSide: true,
						columns: [
							{ data: 'addr' },
							{ data: 'stateStr' },
							{ data: 'uptime' },
							{ data: 'health' },
							{ data: 'lastHeartbeat' },
						],
						rowId: 'id',
				        //pagingType: "full_numbers_icon",
				        columnDefs: [
				            {
							render: function ( data, type, row ) {
								var html = '';
								if( data == '1.0' ) {
									html = '<span class="ui basic green button">正常</span>';
								}
								else if( data == '0.0' ) {
									html = '<span class="ui basic red button">异常</span>';
								}
								return html;
							},
							targets: 3
							}
						],
				        order: [1, 'desc'],
						responsive: true
				   });
			},
		}
		
		$.SFP.dbMonitorList = {
			activate:function (){
					var dtable = $('#db_monitor_table').DataTable({
						ajax:{
							url: o.basePath + '/monitor/dbList',
							type: 'POST',
							data: function ( d ) {
							},
							dataSrc: function (json){
								if(json.code != 0) {
				                    json.list = [];
				                    var message = '获取数据失败![' + json.msg + ', ' + json.code + ']';
				                    $.SFP.tipMessage(message, false);
			                    }
			                    return json.list;
							},
						},
						processing: true,
						serverSide: true,
						columns: [
							{ data: 'addr' },
							{ data: 'status' },
						],
						rowId: 'id',
				        //pagingType: "full_numbers_icon",
				        columnDefs: [
				            {
							render: function ( data, type, row ) {
								var html = '';
								if( data == '1' ) {
									html = '<span class="ui basic green button">运行</span>';
								}
								else if( data == '2' ) {
									html = '<span class="ui basic red button">停用</span>';
								}
								return html;
							},
							targets: 1
							}
						],
				        order: [1, 'desc'],
						responsive: true
				   });
			},
		}
		
		$.SFP.springTree = {
			activate: function() {
				var myChart = echarts.init(document.getElementById('main_spring_tree'));
				myChart.showLoading();
				$.get(o.basePath + '/monitor/springTree', function(data) {
					if(data.code == 0) {
						myChart.hideLoading();
						
						var data2 = data.data1;
						
						if(data2.val==1){
							data2.itemStyle = {
	                            borderColor:'#00EE00'
							};
						}

						echarts.util.each(data2.children, function(datum, index) {
							if(datum.val==1){
								datum.itemStyle = {
	                                borderColor:'#00EE00'
								};
								datum.lineStyle = {
	                                color:'#B3EE3A'
								};
								echarts.util.each(datum.children,function(datum, index){
									if(datum.val==1){
										datum.itemStyle = {
	                                        borderColor:'#00EE00'
								        };
								        datum.lineStyle = {
	                                        color:'#B3EE3A'
								        };
									}else{
										datum.itemStyle = {
	                                        borderColor:'#CD0000'
								        };
								        datum.lineStyle = {
	                                        color:'#CD4F39'
								        };
									}
									
								});
							}else{
								datum.itemStyle = {
	                                borderColor:'#CD0000'
								};
								datum.lineStyle = {
	                                color:'#CD4F39'
								};
							}
						});
						
						var option = {
							title: {
	                            text: '服务监控树',
	                        },
							tooltip: {
								trigger: 'item',
								triggerOn: 'mousemove'
							},
							series: [{
								type: 'tree',

								data: [data2],

								top: '1%',
								left: '14%',
								bottom: '1%',
								right: '15%',

								symbolSize: 7,
								
								lineStyle:{
	                               color:'#CD4F39'
	                            },

								label: {
									position: 'left',
									verticalAlign: 'middle',
									align: 'right',
									fontSize: 9
								},

								leaves: {
									label: {
										position: 'right',
										verticalAlign: 'middle',
										align: 'left'
									}
								},

								expandAndCollapse: true,
								animationDuration: 550,
								animationDurationUpdate: 750
							}]
						};

						myChart.setOption(option);
					} else {
						//alert("1111");
					}

				});
				
				var myChartDb = echarts.init(document.getElementById('main_db_tree'));
				myChartDb.showLoading();
				$.get(o.basePath + '/monitor/dbTree', function(data) {
					if(data.code == 0) {
						myChartDb.hideLoading();
						
						var data2 = data.data1;
						
						if(data2.val==1){
							data2.itemStyle = {
	                            borderColor:'#00EE00'
							};
						}

						echarts.util.each(data2.children, function(datum, index) {
							if(datum.val==1){
								datum.itemStyle = {
	                                borderColor:'#00EE00'
								};
								datum.lineStyle = {
	                                color:'#B3EE3A'
								};
							}else{
								datum.itemStyle = {
	                                borderColor:'#CD0000'
								};
								datum.lineStyle = {
	                                color:'#CD4F39'
								};
							}
						});
						
						var option = {
							tooltip: {
								trigger: 'item',
								triggerOn: 'mousemove'
							},
							series: [{
								type: 'tree',

								data: [data2],

								top: '1%',
								left: '23%',
								bottom: '1%',
								right: '31%',

								symbolSize: 7,
								
								lineStyle:{
	                               color:'#CD4F39'
	                            },

								label: {
									position: 'left',
									verticalAlign: 'middle',
									align: 'right',
									fontSize: 9
								},

								leaves: {
									label: {
										position: 'right',
										verticalAlign: 'middle',
										align: 'left'
									}
								},

								expandAndCollapse: true,
								animationDuration: 550,
								animationDurationUpdate: 750
							}]
						};

						myChartDb.setOption(option);
					} else {
						//alert("1111");
					}

				});
				
				var myChartMongo = echarts.init(document.getElementById('main_mongo_tree'));
				myChartMongo.showLoading();
				$.get(o.basePath + '/monitor/mongodbTree', function(data) {
					if(data.code == 0) {
						myChartMongo.hideLoading();
						
						var data2 = data.data1;
						
						if(data2.val==1){
							data2.itemStyle = {
	                            borderColor:'#00EE00'
							};
						}

						echarts.util.each(data2.children, function(datum, index) {
							if(datum.val==1){
								datum.itemStyle = {
	                                borderColor:'#00EE00'
								};
								datum.lineStyle = {
	                                color:'#B3EE3A'
								};
							}else{
								datum.itemStyle = {
	                                borderColor:'#CD0000'
								};
								datum.lineStyle = {
	                                color:'#CD4F39'
								};
							}
						});
						
						var option = {
							tooltip: {
								trigger: 'item',
								triggerOn: 'mousemove'
							},
							series: [{
								type: 'tree',

								data: [data2],

								top: '1%',
								left: '23%',
								bottom: '1%',
								right: '31%',

								symbolSize: 7,
								
								lineStyle:{
	                               color:'#CD4F39'
	                            },

								label: {
									position: 'left',
									verticalAlign: 'middle',
									align: 'right',
									fontSize: 9
								},

								leaves: {
									label: {
										position: 'right',
										verticalAlign: 'middle',
										align: 'left'
									}
								},

								expandAndCollapse: true,
								animationDuration: 550,
								animationDurationUpdate: 750
							}]
						};

						myChartMongo.setOption(option);
					} else {
						//alert("1111");
					}

				});
				
				var myChartRedis = echarts.init(document.getElementById('main_redis_tree'));
				myChartRedis.showLoading();
				$.get(o.basePath + '/monitor/redisTree', function(data) {
					if(data.code == 0) {
						myChartRedis.hideLoading();
						
						var data2 = data.data1;
						
						if(data2.val==1){
							data2.itemStyle = {
	                            borderColor:'#00EE00'
							};
						}

						echarts.util.each(data2.children, function(datum, index) {
							if(datum.val==1){
								datum.itemStyle = {
	                                borderColor:'#00EE00'
								};
								datum.lineStyle = {
	                                color:'#B3EE3A'
								};
							}else{
								datum.itemStyle = {
	                                borderColor:'#CD0000'
								};
								datum.lineStyle = {
	                                color:'#CD4F39'
								};
							}
						});
						
						var option = {
							tooltip: {
								trigger: 'item',
								triggerOn: 'mousemove'
							},
							series: [{
								type: 'tree',

								data: [data2],

								top: '1%',
								left: '23%',
								bottom: '1%',
								right: '31%',

								symbolSize: 7,
								
								lineStyle:{
	                               color:'#CD4F39'
	                            },

								label: {
									position: 'left',
									verticalAlign: 'middle',
									align: 'right',
									fontSize: 9
								},

								leaves: {
									label: {
										position: 'right',
										verticalAlign: 'middle',
										align: 'left'
									}
								},

								expandAndCollapse: true,
								animationDuration: 550,
								animationDurationUpdate: 750
							}]
						};

						myChartRedis.setOption(option);
					} else {
						//alert("1111");
					}

				});
			}
		}
		
		$.SFP.springMonitor = {
			activate:function(){
				var dtable = $('#spring_monitor_table').DataTable({
					ajax:{
						url: o.basePath + '/monitor/springList',
						type: 'POST',
						async: false,
						data: function ( d ) {
						},
						dataSrc: function (json){
							if(json.code != 0) {
				                json.list = [];
				                var message = '获取数据失败![' + json.msg + ', ' + json.code + ']';
				                $.SFP.tipMessage(message, false);
			                }
			            return json.list;
						},
					},
					processing: true,
					serverSide: true,
					columns: [
					    {
	                     "className":      'details-control',
	                     "orderable":      false,
	                     "data":           null,
	                     "defaultContent": ''
	                    },
						{ data: 'appName' },
						{ data: 'number' },
					],
					rowId: 'id',
			        order: [1, 'desc'],
			        select: {
			            selector: 'td:not(:first-child)',
			            style: 'os'
		           },
					responsive: true
			  });
	            dtable.on( 'draw', function () {
			        dtable.rows().every( function () {
	                    this.child($.SFP.springMonitor.format(this.data())).show();
	                });
	            });
			},
			format:function(row){
	 		    var html ='<table class = "ui fixed table">'+
			                    '<thead>'+
			                        '<th>ip:port</th>'+
	                                '<th>注册时间</th>'+
	                                '<th>最后一次续约时间</th>'+
	                                '<th>心跳间隔时间</th>'+
	                                '<th>健康状态</th>'+
	                            '</thead>'+
	                            '<tbody>';
	                            for(var i =0;i<row.detail.length;i++){
	                                html +='<tr>'+
	                                            '<td>'+row.detail[i].addr+'</td>'+
	                                            '<td>'+row.detail[i].registTime+'</td>'+
	                                            '<td>'+row.detail[i].lastTime+'</td>'+
	                                            '<td>'+row.detail[i].heartbeat+'</td>';
	                                     html +='<td>';
	                                                if(row.detail[i].status=='1'){
	                                                    html +='<span  class="ui basic green button">正常</span>';
	                                                }else{
	                                            	    html +='<span  class="ui basic black button">异常</span>';       
	                                                }
	                                       html +='</td>';
	                                html +='</tr>';
	                            }
	                        
	                html +=    '</tbody>'+
	                       '</table>';
	            return html;
			},
		}
	
	/*
	 * ParseDataTableResult() ========== parse response data of datatable ajax
	 * request
	 * 
	 * @type Function @usage: $.SFP.ParseDataTableResult(json)
	 */
	$.SFP.ParseDataTableResult = function(json) {
		if(json.code != 0) {
			json.list = [];
			var message = '获取数据失败![' + json.message + ', ' + json.code + ']';
			$.SFP.tipMessage(message, false);
		}
		return json.list;
	}// end of $.SFP.ParseDataTableResult
	
	//设备注册开始
	var appidR = [];
	$.SFP.deviceRegister = {
		activate:function (){
			$('#dev_regist_tab .item').tab();
			$('#app_list_regist').on('click.SFP.deviceregist.AppListR', $.SFP.deviceRegister.appidListR);
			
			$('#app_lsit_Regist_s').on('click.SFP.deviceregist.appidSubmit', $.SFP.deviceRegister.appidSumbit);
			
			$('#app_list_button_R').on('click.SFP.deviceregist.appidListButton', $.SFP.deviceRegister.appidListButton);
			//清空全局变量
			appidR = [];
			console.log("device reg acivate");
			
			$('#dev_regist_appList_checkClear').on('click.SFP.deviceregist.RegistAppidListCheckClear', $.SFP.deviceRegister.RegistAppidListCheckClear);
			
			$('#device_info_sumbit').on('click.SFP.deviceregist.deviceinfoSubmit', $.SFP.deviceRegister.deviceinfoSubmit);
			$('#device_info_empty').on('click.SFP.deviceregist.deviceinfoEmpty', $.SFP.deviceRegister.deviceinfoEmpty);
			
			$('#import_deviceRegist').on('click.SFP.deviceregist.deviceinfoImport', $.SFP.deviceRegister.deviceinfoImport);
		},
		deviceinfoSubmit : function(){
			var devid = $('#dev_regist_devid').val();
			var devname = $('#dev_regist_devname').val();
			var devtype = $('#dev_regist_devtype').val();
			var tradename = $('#dev_regist_tradename').val();
			var appids = $('#dev_regist_appids').val();
			var locationd = $('#dev_regist_location').val();
			var ip = $('#dev_regist_ip').val();
			if(appids==""){
				$.SFP.tipMessage('保存设备信息时,所属应用不能为空', false);
				return;
			}
			$.ajax({
				url:o.basePath + '/device/register',
				type:"post",
				data:{
					"devId":devid,
					"appIds":appids,
					"devName":devname,
					"devType":devtype,
					"tradeName":tradename,
					"location":locationd,
					"ip":ip,
					},
				dataType:"json",
				success:function(result){
					if (result.code==0) {
						//清空全局变量
						appidR = [];
						swal({
                            title: '设备注册',
                            html: result.devId+":"+result.desc,
                            allowOutsideClick: false
                        });
					    $.SFP.deviceRegister.deviceinfoEmpty();
					}else {
						var message = '注册设备时出现问题!['+result.msg+']';
					    $.SFP.tipMessage(message, false);
					}
				},
				error:function(){
					alert("请求失败！");
				}
			});
		},
		deviceinfoImport : function(){
			var formData =new FormData($("#device_import_info")[0]);
			$.ajax({
			    "url":  o.basePath + '/device/importDevice'+'?rand=' + Math.random(),
			    "data":formData,
			    "type": "POST",
			    "dataType": "json",
			     cache:false,
			     contentType: false,
			     processData: false,
			    "success": function(json){
			     if (json.code == 0) {
			     	swal({
                        title: '设备导入',
                        html: json.desc,
                        allowOutsideClick: false
                   });
			     } else{
			    	swal({
                        html: json.msg,
                        allowOutsideClick: false
                   });
			     }
			    },  
			   });
		},
		appidListR : function(){
			var atable = $('#app_lsit_table_R').DataTable({
                ajax:{
                    url: o.basePath + '/device/list',
                    type: 'POST',
                    data: function ( d ) {
                        d.appId = $('#app_list_Search_R').val();
                    },
                    dataSrc: $.SFP.ParseDataTableResult
                },
                processing: true,
                serverSide: true,
                columns: [
                    { data: '' ,
                        className : 'center aligned'},
                    { data: 'appId'},
                    { data: 'appName'},
                ],
                rowId: 'id',
                //pagingType: "full_numbers_icon",
                columnDefs: [
                    {
                        render: function ( data, type, row ) {
                            var html ='';
                            html +='<div class="ui checkbox">';
                            var flag = true;
                            if(appidR.length==0){
                                flag = false;
                                html += '<input type="checkbox" name="example" id="'+row.appId+'" onclick="$.SFP.deviceRegister.checkoutdecide(this)">';
                            }
                            for (var i = 0; i < appidR.length; i++) {
                                if(row.appId==appidR[i].appid){
                                    flag = false;
                                    html += '<input type="checkbox" checked="checked" name="example" id="'+row.appId+'" onclick="$.SFP.deviceRegister.checkoutdecide(this)">';
                                }
                            }
                            if(flag){
                                html += '<input type="checkbox" name="example" id="'+row.appId+'" onclick="$.SFP.deviceRegister.checkoutdecide(this)">';
                            }
                            html +='<label class="coloring black"></label></div>';
                            return html;
                        },
                        targets: 0
                    }
                ],
                order: [1, 'desc'],
                responsive: true,
                destroy: true
            });
            $('#dev_regist_grid1, #dev_regist_grid2').toggleClass('displaynone');
		},
		checkoutdecide : function(obj){
		    	if($('#'+obj.id).is(':checked')){
		    		var ob = {};
		    		ob.appid = obj.id;
		    		appidR.push(ob);
		    	}else{
		    		var indexv =0;
				    for(var i = 0; i<appidR.length;i++){
					    if(appidR[i].appid==obj.id){
						    indexv=i;
						    break;
					    }
				    }
				    appidR.splice(indexv, 1);
		    	}
		    	
		    },
		appidSumbit : function(){
			$('#app_list_Search_R').val("");
		    $('#dev_regist_grid2, #dev_regist_grid1').toggleClass('displaynone');
		    var str1 = "";
		    for (var i = 0; i < appidR.length; i++) {
				str1=str1+appidR[i].appid+",";
			}
		    str1=str1.substring(0,str1.length-1);
		    $('#dev_regist_appids').val(str1);
		},
		appidListButton : function(){
			$('#app_lsit_table_R').DataTable().ajax.reload();
			return;
		},
		deviceinfoEmpty : function(){
			//全局变量标记,全局变量清空
			appidR = [];
			$('#dev_regist_devid').val("");
			$('#dev_regist_devname').val("");
			$('#dev_regist_devtype').val("");
			$('#dev_regist_tradename').val("");
			$('#dev_regist_appids').val("");
			$('#dev_regist_location').val("");
			$('#dev_regist_ip').val("");
		},
		RegistAppidListCheckClear : function(){
			//全局变量标记,全局变量清空
			appidR = [];
			$('#app_lsit_table_R').DataTable().ajax.reload();
		},
	};
	//设备查询
	$.SFP.deviceQuery = {
		activate:function (){
				var dtable = $('#dev_query_table').DataTable({
					ajax:{
						url: o.basePath + '/device/devicelist',
						type: 'POST',
						data: function ( d ) {
					        d.devName = $('#dev_query_devName').val();
					        d.devId= $('#dev_query_devId').val();
						},
						dataSrc: $.SFP.ParseDataTableResult
					},
					processing: true,
					serverSide: true,
					columns: [
						{ data: 'deviceId' },
						{ data: 'deviceName' },
						{ data: 'appNames' },
						{ data: 'ip' },
					],
					rowId: 'id',
			        //pagingType: "full_numbers_icon",
			        columnDefs: [
			            {
							createdCell: function(td, cellData, rowData) {
								 $(td).attr("title",rowData.appNames);
							},
							targets: 2
						},
						{
							render: function ( data, type, row ) {
								var html = '';
									html = '<div class="btn-group">';
									html += '<div class="ui green horizontal label device_info" data-id="' + row.id + '"><i class="large edit icon"></i>详情</div>';
									html += '</div>';
								return html;							
							},
							targets: 4
						}
					],
			        order: [1, 'desc'],
					responsive: true
			    });	
	        $('#dev_query_table').on( 'draw.dt', function () {
				$('.device_info').on('click.SFP.deviceQuery.detailinfo', $.SFP.deviceQuery.detail);
			});
			$('#dev_query_devbutton').on('click.SFP.deviceQuery.devQueryListButton', $.SFP.deviceQuery.devQueryListButton);
			$('#dev_query_back').on('click.SFP.deviceQuery.devInfoBack', $.SFP.deviceQuery.devInfoBack);
		},
		detail:function(){
			var Id = $(this).data('id');
			$.postjson(o.basePath + '/device/devinfo?devTableId=' + Id + '&rand='
					+ Math.random(), {}, function(data, textStatus, jqXHR) {
				if (data.code == 0) {
					
						var deviceInfoList = data.deviceInfo;
						for (var i = 0; i < deviceInfoList.length; i++) {
							$('#dev_qu_det_devId').val(deviceInfoList[i].deviceId);
					        $('#dev_qu_det_devName').val(deviceInfoList[i].deviceName);
					        $('#dev_qu_det_devType').val(deviceInfoList[i].deviceType);
					        $('#dev_qu_det_tradeName').val(deviceInfoList[i].tradeName);
					        $('#dev_qu_det_locat').val(deviceInfoList[i].locationd);
					        $('#dev_qu_det_ip').val(deviceInfoList[i].ip);
						}
						
						var appIdList = data.appIdList;
						var str1 = "";
						for (var i = 0; i < appIdList.length; i++) {
							str1=str1+appIdList[i].appId+",";
						}
						str1=str1.substring(0,str1.length-1)
                        $('#dev_qu_det_appId').val(str1);

			        $('#dev_query_grid1, #dev_query_grid2').toggleClass('displaynone');
					$('body').getNiceScroll().resize();
				} else {
					var message = '获取设备信息失败![' + data.msg + ']';
					$.SFP.tipMessage(message, false);
				}
			}, 'json');
		},
		devQueryListButton:function(){
			$('#dev_query_table').DataTable().ajax.reload();
			return;
		},
		devInfoBack:function(){
			$('#dev_query_grid1, #dev_query_grid2').toggleClass('displaynone');
		}
	};
	//设备修改开始
	var appidM = [];
	$.SFP.deviceModifiy = {
		activate:function (){
				var dtable = $('#dev_modify_table').DataTable({
					ajax:{
						url: o.basePath + '/device/devicelist',
						type: 'POST',
						data: function ( d ) {
					        d.devName = $('#dev_modify_s_devName').val();
					        d.devId= $('#dev_modify_s_devId').val();
						},
						dataSrc: $.SFP.ParseDataTableResult
					},
					processing: true,
					serverSide: true,
					columns: [
						{ data: 'deviceId' },
						{ data: 'deviceName' },
						{ data: 'appNames' },
						{ data: 'ip' },
					],
					rowId: 'id',
			        //pagingType: "full_numbers_icon",
			        columnDefs: [
			            {
							createdCell: function(td, cellData, rowData) {
								 $(td).attr("title",rowData.appNames);
							},
							targets: 2
						},
						{
							render: function ( data, type, row ) {
								var html = '';
									html = '<div class="btn-group">';
									html += '<div class="ui yellow horizontal label device_info" data-id="' + row.id + '"><i class="large edit icon"></i>修改</div>';
									html += '</div>';
								return html;							
							},
							targets: 4
						}
					],
			        order: [1, 'desc'],
					responsive: true
			    });
			
			$('#dev_modify_table').on( 'draw.dt', function () {
				$('.device_info').on('click.SFP.deviceModifiy.detailinfo', $.SFP.deviceModifiy.detail);
			});
			
		    $('#dev_modify_s_Button').on('click.SFP.deviceModifiy.devQueryListButton', $.SFP.deviceModifiy.devQueryListButton);
		    $('#app_Button_M').on('click.SFP.deviceModifiy.appListButton', $.SFP.deviceModifiy.appListButton);
		    
		    $('#modify_appList_button').on('click.SFP.deviceModifiy.AppListM', $.SFP.deviceModifiy.appidListM);
		    
		    $('#dev_modify_devInfosave').on('click.SFP.deviceModifiy.devInfoSave', $.SFP.deviceModifiy.devInfoModify);
		    $('#dev_modify_devInfoBack').on('click.SFP.deviceModifiy.devInfoBack', $.SFP.deviceModifiy.devInfoBack);
		    
		    $('#modify_applist_save').on('click.SFP.deviceModifiy.devQueryListButton', $.SFP.deviceModifiy.applistSave);
		},
		devQueryListButton:function(){
			$('#dev_modify_table').DataTable().ajax.reload();
			return;
		},
		appListButton : function(){
			$('#app_list_modify').DataTable().ajax.reload();
			return;
		},
		detail:function(){
			$('#app_Serch_M_appid').val("");
			//全局变量标记
		    appidM =[];
			var Id = $(this).data('id');
			$.postjson(o.basePath + '/device/devinfo?devTableId=' + Id + '&rand='
					+ Math.random(), {}, function(data, textStatus, jqXHR) {
				if (data.code == 0) {
					
						var deviceInfoList = data.deviceInfo;
						for (var i = 0; i < deviceInfoList.length; i++) {
							$('#dev_modify_dt_devid').val(deviceInfoList[i].deviceId);
					        $('#dev_modify_dt_devname').val(deviceInfoList[i].deviceName);
					        $('#dev_modify_dt_devtype').val(deviceInfoList[i].deviceType);
					        $('#dev_modify_dt_tradename').val(deviceInfoList[i].tradeName);
					        $('#dev_modify_dt_location').val(deviceInfoList[i].locationd);
					        $('#dev_modify_dt_ip').val(deviceInfoList[i].ip);
						}
						
						var appIdList = data.appIdList;
						var str1 = "";
						for (var i = 0; i < appIdList.length; i++) {
							//全局变量
							var obj = {};
							obj.appid = appIdList[i].appId;
							appidM.push(obj);
							//end
							str1=str1+appIdList[i].appId+",";
						}
						str1=str1.substring(0,str1.length-1)
                        $('#dev_modify_dt_appId').val(str1);
                        
                        $('#dev_modify_devInfosave').data('devTableId', Id);

			        $('#dev_modify_grid1, #dev_modify_grid2').toggleClass('displaynone');
					$('body').getNiceScroll().resize();
				} else {
					var message = '获取设备信息失败![' + data.msg + ']';
					$.SFP.tipMessage(message, false);
				}
			}, 'json');
		},
		appidListM : function(){
				var atable = $('#app_list_modify').DataTable({
					ajax:{
						url: o.basePath + '/device/list',
						type: 'POST',
						data: function ( d ) {
					        d.appId = $('#app_Serch_M_appid').val();
						},
						dataSrc: $.SFP.ParseDataTableResult
					},
					processing: true,
					serverSide: true,
					columns: [
					    { data: '' ,
					      className : 'center aligned'},
						{ data: 'appId'},
						{ data: 'appName'},
					],
					rowId: 'id',
			        //pagingType: "full_numbers_icon",
			        columnDefs: [
						{
							render: function ( data, type, row ) {
								var html ='';
								    html +='<div class="ui checkbox">';
								var flag = true;
								if(appidM.length==0){
									flag = false;
									html += '<input type="checkbox" name="example" id="'+row.appId+'" onclick="$.SFP.deviceModifiy.checkoutdecide(this)">';
								}
								for (var i = 0; i < appidM.length; i++) {
									if(row.appId==appidM[i].appid){
										flag = false;
									html += '<input type="checkbox" checked="checked" name="example" id="'+row.appId+'" onclick="$.SFP.deviceModifiy.checkoutdecide(this)">';
								}
						      }
								if(flag){
									html += '<input type="checkbox" name="example" id="'+row.appId+'" onclick="$.SFP.deviceModifiy.checkoutdecide(this)">';
								}
								    html +='<label class="coloring black"></label></div>';
								return html;							
							},
							targets: 0
						}
					],
			        order: [1, 'desc'],
					responsive: true,
					destroy: true
			  }); 
				$('#dev_modify_grid2, #dev_modify_grid3').toggleClass('displaynone'); 
		},
		checkoutdecide : function(obj){
		    	if($('#'+obj.id).is(':checked')){
		    		var ob = {};
		    		ob.appid = obj.id;
		    		appidM.push(ob);
		    	}else{
		    		var indexv =0;
				    for(var i = 0; i<appidM.length;i++){
					    if(appidM[i].appid==obj.id){
						    indexv=i;
						    break;
					    }
				    }
				    appidM.splice(indexv, 1);
		    	}
		    	
		},
		applistSave:function(){
			/*$('#app_Serch_M_appid').val("");*/
		    $('#dev_modify_grid2, #dev_modify_grid3').toggleClass('displaynone');
		    var str1 = "";
		    for (var i = 0; i < appidM.length; i++) {
				str1=str1+appidM[i].appid+",";
			}
		    str1=str1.substring(0,str1.length-1);
		    $('#dev_modify_dt_appId').val(str1);
		},
		devInfoModify:function(){
    	    var id = $('#dev_modify_devInfosave').data('devTableId');
    	    var devid = $('#dev_modify_dt_devid').val();
			var devName = $('#dev_modify_dt_devname').val();
			var devType = $('#dev_modify_dt_devtype').val();
			var tradeName = $('#dev_modify_dt_tradename').val();
			var locationd = $('#dev_modify_dt_location').val();
			var ip = $('#dev_modify_dt_ip').val();
			var appids = $('#dev_modify_dt_appId').val();
			$.ajax({
				url:o.basePath + '/device/modifydevinfo',
				type:"post",
				data:{
					"Id":id,
					"devId":devid,
					"devName":devName,
					"devType":devType,
					"tradeName":tradeName,
					"locationd":locationd,
					"ip":ip,
					"appIds":appids
					},
				dataType:"json",
				success:function(result){
					if (result.code==0) {
						var message = "";
						if(result.msgadd==""&&result.msgdel==""){
							message = '修改保存成功';
							 $.SFP.tipMessage(message);
						}else{
							swal({
                                title: '设备修改',
                                type: 'warning',
                                html: result.msgadd+' '+result.msgdel,
                                allowOutsideClick: false
                            });
							//message = '['+result.msgadd+' '+result.msgdel+']';
						}
					    //$.SFP.tipMessage(message);
					    $('#dev_modify_table').DataTable().ajax.reload();
					    $('#dev_modify_grid1, #dev_modify_grid2').toggleClass('displaynone');
					}else {
						var message = '保存设备信息失败!['+result.msg+']';
					    $.SFP.tipMessage(message, false);
					}
				},
				error:function(){
					alert("请求失败！");
				}
			});
		},
		devInfoBack:function(){
			$('#dev_modify_grid1, #dev_modify_grid2').toggleClass('displaynone');
		}
	};
	//设备注销
	$.SFP.deviceLogout = {
		activate:function(){
				var dtable = $('#dev_logout_table').DataTable({
					ajax:{
						url: o.basePath + '/device/devicelist',
						type: 'POST',
						data: function ( d ) {
					        d.devName = $('#dev_logout_devName').val();
					        d.devId= $('#dev_logout_devId').val();
						},
						dataSrc: $.SFP.ParseDataTableResult
					},
					processing: true,
					serverSide: true,
					columns: [
						{ data: 'deviceId' },
						{ data: 'deviceName' },
						{ data: 'deviceType' },
						{ data: 'tradeName' },
						{ data: 'appNames' },
						{ data: 'locationd' },
						{ data: 'ip' },
					],
					rowId: 'id',
			        //pagingType: "full_numbers_icon",
			        columnDefs: [
			            {
							createdCell: function(td, cellData, rowData) {
								 $(td).attr("title",rowData.appNames);
							},
							targets: 4
						},
						{
							render: function ( data, type, row ) {
								var html = '';
									html = '<div class="btn-group">';
									html += '<div class="ui red horizontal label device_del" data-id="' + row.id + '"><i class="large trash outline icon"></i>注销</div>';
									html += '</div>';
								return html;							
							},
							targets: 7
						}
					],
			        order: [1, 'desc'],
					responsive: true
			    });
			$('#dev_logout_table').on( 'draw.dt', function () {
				//没问题,必须先选定表之后,的类选择器才生效
				$('.device_del').on('click.SFP.deviceLogout.devLogoutModel', $.SFP.deviceLogout.devLogoutModel);
			});
			$('#dev_logout_devButton').on('click.SFP.deviceLogout.devLogoutTable', $.SFP.deviceLogout.devLogoutTable);
			$('#dev_logout_model_dele').on('click.SFP.deviceLogout.devLogout', $.SFP.deviceLogout.devLogout);
			
		},
		devLogoutTable:function(){
			$('#dev_logout_table').DataTable().ajax.reload();
			return;
		},
		devLogoutModel:function(){
		    var Id = $(this).data('id');
		    var rowData = $('#dev_logout_table').DataTable().row('#' + Id).data();
		    var message = '是否要注销设备[ ' + rowData.deviceId + ' ] ？'; 
		    $('#dev_logout_model_descript').empty().append(message);
		    $('#dev_logout_model_devInfo').data('devTableId', Id);
		    $("#dev_logout_modal").modal({
				closable : false
			}).modal('show');

		},
		devLogout:function(){
			var id = $('#dev_logout_model_devInfo').data('devTableId');
		    var postData = {};
		    postData.devTableId = id;
		    $.post(o.basePath + '/device/logoutDevice', postData, function(data,
				textStatus, jqXHR) {
			    if (data.code == 0) {
			    	var message = "";
			    	if(data.msgremoke==''){
						message = '注销成功';
						$.SFP.tipMessage(message);
					}else{
						//message = '['+data.msgremoke+']';
						swal({
                            type: 'warning',
                            title: '应用注销',
                            html: data.msgremoke,
                            allowOutsideClick: false
                        });
					}
				    $('#dev_logout_table').DataTable().ajax.reload();
			    } else {
				    var message = '注销失败!['+data.msg+']';
				    $.SFP.tipMessage(message, false);
			    }
	        }, 'json');		
		}
		
	};
	//设备白名单
	var appidWsl = [];
	$.SFP.deviceWhiteList = {
		activate: function () {
			appidWsl = [];
			var dtable = $('#dev_white_table').DataTable({
				ajax:{
					url: o.basePath + '/device/deviceWslList',
					type: 'POST',
					data: function ( d ) {
				        d.devId = $('#dev_white_devId').val();
				        d.devName = $('#dev_white_devName').val();
				        d.appIds = $('#dev_white_appIds').val();
					},
					dataSrc: $.SFP.ParseDataTableResult
				},
				processing: true,
				serverSide: true,
				columns: [
					{ data: 'deviceId' },
					{ data: 'deviceName' },
					{ data: 'appId' },
					{ data: 'appName' },
					{ data: 'status' },
				],
				rowId: 'id',
		        // pagingType: "full_numbers_icon",
		        columnDefs: [
		        	{
						render: function ( data, type, row ) {
							var html = '';
							if( data == '1' ) {
								html = '<span class="ui basic red button">初始化</span>';
							}
							else if( data == '2' ) {
								html = '<span class="ui basic green button">已激活</span>';
							}
							else if( data == '3' ) {
								html = '<span class="ui basic black button">注销</span>';
							}
							return html;
						},
						targets: 4
					}
				],
		        order: [1, 'desc'],
				responsive: true
		  });
		  $('#dev_white_button').on('click.SFP.deviceWhiteList.devWhiteTableB', $.SFP.deviceWhiteList.devWhiteTableB);
		  
		  $('#dev_white_appIdListButton').on('click.SFP.deviceWhiteList.AppListWsl', $.SFP.deviceWhiteList.AppListWsl);
		  //全局变量清空按钮
		  $('#dev_white_appList_checkclear').on('click.SFP.deviceWhiteList.AppListcheckClear', $.SFP.deviceWhiteList.AppListcheckClear);
		  
		  $('#dev_white_appList_confirm').on('click.SFP.deviceWhiteList.appidSubmit', $.SFP.deviceWhiteList.appidSumbit);
		  $('#dev_white_appList_button').on('click.SFP.deviceWhiteList.devWhiteAppBut', $.SFP.deviceWhiteList.devWhiteAppBut);
		},
		devWhiteTableB:function(){
			$('#dev_white_table').DataTable().ajax.reload();
			return;
		},
		devWhiteAppBut:function(){
			$('#dev_white_appList_table').DataTable().ajax.reload();
			return;
		},
		AppListWsl:function(){
				var atable = $('#dev_white_appList_table').DataTable({
					ajax:{
						url: o.basePath + '/device/list',
						type: 'POST',
						data: function ( d ) {
					        d.appId = $('#dev_white_appList_appId').val();
						},
						dataSrc: $.SFP.ParseDataTableResult
					},
					processing: true,
					serverSide: true,
					columns: [
					    { data: '' ,
					      className : 'center aligned'},
						{ data: 'appId'},
						{ data: 'appName'},
					],
					rowId: 'id',
			        //pagingType: "full_numbers_icon",
			        columnDefs: [
						{
							render: function ( data, type, row ) {
								var html ='';
								    html +='<div class="ui checkbox">';
								var flag = true;
								if(appidWsl.length==0){
									flag = false;
									html += '<input type="checkbox" name="example" id="'+row.appId+'" onclick="$.SFP.deviceWhiteList.checkoutdecide(this)">';
								}
								for (var i = 0; i < appidWsl.length; i++) {
									if(row.appId==appidWsl[i].appid){
										flag = false;
									html += '<input type="checkbox" checked="checked" name="example" id="'+row.appId+'" onclick="$.SFP.deviceWhiteList.checkoutdecide(this)">';
								}
						      }
								if(flag){
									html += '<input type="checkbox" name="example" id="'+row.appId+'" onclick="$.SFP.deviceWhiteList.checkoutdecide(this)">';
								}
								    html +='<label class="coloring black"></label></div>';
								return html;							
							},
							targets: 0
						}
					],
			        order: [1, 'desc'],
					responsive: true,
					destroy: true
			  }); 
			$('#dev_white_grid1, #dev_white_grid2').toggleClass('displaynone');
		},
		checkoutdecide : function(obj){
		    	if($('#'+obj.id).is(':checked')){
		    		var ob = {};
		    		ob.appid = obj.id;
		    		appidWsl.push(ob);
		    	}else{
		    		var indexv =0;
				    for(var i = 0; i<appidWsl.length;i++){
					    if(appidWsl[i].appid==obj.id){
						    indexv=i;
						    break;
					    }
				    }
				    appidWsl.splice(indexv, 1);
		    	}
		    	
		    },
		appidSumbit : function(){
			$('#dev_white_appList_appId').val("");
		    $('#dev_white_grid1, #dev_white_grid2').toggleClass('displaynone');
		    var str1 = "";
		    for (var i = 0; i < appidWsl.length; i++) {
				str1=str1+appidWsl[i].appid+",";
			}
		    str1=str1.substring(0,str1.length-1);
		    $('#dev_white_appIds').val(str1);
		},
		AppListcheckClear:function(){
			//清空选择
			appidWsl = [];
			$('#dev_white_appList_table').DataTable().ajax.reload();
		}
	}
	//设备黑名单
	$.SFP.deviceBlackList = {
		activate:function(){
			var dtable = $('#dev_black_table').DataTable({
				ajax:{
					url: o.basePath + '/device/deviceBlaList',
					type: 'POST',
					async: false,
					data: function ( d ) {
				        d.devId = $('#dev_black_devid').val();
				        d.ip = $('#dev_black_ip').val();
					},
					dataSrc: $.SFP.ParseDataTableResult
				},
				processing: true,
				serverSide: true,
				columns: [
				    {
                     "className":      'details-control',
                     "orderable":      false,
                     "data":           null,
                     "defaultContent": ''
                    },
					{ data: 'deviceId' },
					{ data: 'deviceName' },
					{ data: 'location' },
					{ data: 'ip' },
				],
				rowId: 'id',
		        order: [1, 'desc'],
		        select: {
		            selector: 'td:not(:first-child)',
		            style: 'os'
	           },
				responsive: true
		   });
		    $('#dev_black_button').on('click.SFP.deviceBlackList.devblackTablereload', $.SFP.deviceBlackList.devblackTablereload);
            dtable.on( 'draw', function () {
		        dtable.rows().every( function () {
                    this.child($.SFP.deviceBlackList.format(this.data())).show();
                });
            });
            
		    /*$('#dev_black_table tbody').on('click', 'td.details-control', function() {
 	            var tr = $(this).closest('tr');
 	            var row = dtable.row(tr);

 	            if(row.child.isShown()) {
 		            // This row is already open - close it
 		            row.child.hide();
 		            tr.removeClass('shown');
 	            } else {
 		            // Open this row
 		            row.child($.SFP.deviceBlackList.format(row.data())).show();
 		            tr.addClass('shown');
 	            }
            });*/
		},
		format:function(row){
 		    var html ='<table class = "ui fixed table">'+
/*		                    '<thead>'+
		                        '<th>应用ID</th>'+
                                '<th>应用名字</th>'+
                                '<th>设备来源</th>'+
                                '<th>操作</th>'+
                            '</thead>'+*/
                            '<tbody>';
                            for(var i =0;i<row.detail.length;i++){
                                html +='<tr>'+
                                            '<td>应用id: '+row.detail[i].appId+'</td>'+
                                            '<td>应用名字: '+row.detail[i].appName+'</td>';
                                            if(row.detail[i].dataFrom=='1'){
                                                html +='<td>状态: '+
                                                            '<span class="ui basic green button">不在黑名单</span>'+
                                                       '</td>';
                                            }else{
                                            	html +='<td>状态: '+
                                                            '<span class="ui basic gray button">在黑名单中</span>'+
                                                       '</td>';
                                            }
                                            html +='<td>操作: ';
                                            if(row.detail[i].dataFrom=='1'){
                                                html +='<span id="'+row.detail[i].id+'" class="ui basic yellow button" onclick="$.SFP.deviceBlackList.statusUpdata(this,'+"1"+')">加入黑名单</span>';
                                            }else{
                                            	html +='<span id="'+row.detail[i].id+'" class="ui basic black button" onclick="$.SFP.deviceBlackList.statusUpdata(this,'+"2"+')">从黑名单中移除</span>';
                                                       
                                            }
                                        html += '</td>';   
                                html +='</tr>';
                            }
                        
                html +=    '</tbody>'+
                       '</table>';
            return html;
		},
		statusUpdata:function(obj,dataFrom){
			 var id = obj.id;
			$.ajax({
				url:o.basePath + '/device/deviceBlackStatusUpdata',
				type:"post",
				data:{
					"id":id,
					"dataFrom":dataFrom
					},
				dataType:"json",
				success:function(result){
					if (result.code==0) {
						if(dataFrom==1){
							$.SFP.tipMessage('加入黑名单成功');
						}else{
							$.SFP.tipMessage('从黑名单移除成功');
						}
						$('#dev_black_table').DataTable().ajax.reload();
					}else {
						var message = '保存设备信息失败![' + result.msg + ']';
					    $.SFP.tipMessage(message, false);
					}
				},
				error:function(){
					alert("请求失败！");
				}
			});
		},
		devblackTablereload:function(){
			$('#dev_black_table').DataTable().ajax.reload();
			return;
		}
	}

	//RFID配置管理
    $.SFP.rfidConfig = {
        activate: function() {
            var postData = {};
            var urlTarget = o.basePath + '/config/query';
            $.postjson(urlTarget + '?rand=' + Math.random(), JSON.stringify(postData),
                function(data, textStatus, jqXHR) {
                    if(data.code == 0) {
                        data = JSON.parse(data.data);
                        $('#KEY_ID').val(data.KEY_ID);
                        $('#KEY_KCV').val(data.KEY_KCV);
                        $('#KEY_INFO').val(data.KEY_INFO);
                    } else {
                        var msg = data.msg;
                        $.SFP.tipMessage(msg, false);
                    }
                }, 'json');

            $('#config_save').on('click.SFP.rfidConfig.config_save',
                $.SFP.rfidConfig.config_save);
            $('#config_save_empty').on('click.SFP.rfidConfig.config_save_empty',
                $.SFP.rfidConfig.config_save_empty);

        },
        emptyVal: function() {
            $('#KEY_ID').val('');
            $('#KEY_KCV').val('');
            $('#KEY_INFO').val('');
        },
        config_save_empty: function() {
            $.SFP.rfidConfig.emptyVal();
        },
        config_save: function() {
            var KEY_ID = $('#KEY_ID').val().trim();
            if(KEY_ID == "") {
                $.SFP.tipMessage('应用ID不能为空', false);
                return;
            }
            if (KEY_ID.length > 32){
                $.SFP.tipMessage('应用ID不能超过32位', false);
                return;
			}
            var KEY_KCV = $('#KEY_KCV').val().trim();
            if(KEY_KCV == "") {
                $.SFP.tipMessage('根密钥KCV不能为空', false);
                return;
            }
            if (KEY_KCV.length > 32){
                $.SFP.tipMessage('根密钥KCV不能超过32位', false);
                return;
            }
            var KEY_INFO = $('#KEY_INFO').val().trim();
            if(KEY_INFO == "") {
                $.SFP.tipMessage('工作密钥参数不能为空', false);
                return;
            }
            if (KEY_INFO.length > 32){
                $.SFP.tipMessage('工作密钥参数不能超过32位', false);
                return;
            }
            var postData = {};
            postData.KEY_ID = KEY_ID;
            postData.KEY_KCV = KEY_KCV;
            postData.KEY_INFO = KEY_INFO;
            var urlTarget = o.basePath + '/config/save';
            /*$.ajax({
                url: urlTarget + '?rand=' + Math.random(),
                type: "post",
                data: postData,
                dataType: "json",
                success:function(result){
                    if(result.code == 0) {
                        var msg='应用ID：'+KEY_ID+"<br>"+'根密钥CV：'+KEY_KCV+
                            '<br>'+'工作密钥参数：'+KEY_INFO;
                        swal({
                            type: 'success',
                            title: '配置成功',
                            html: msg,
                            allowOutsideClick: false
                        });
                    }else{
                        var msg = result.msg;
                        $.SFP.tipMessage(msg, false);
                    }
                },
                error:function(){
                    alert("请求失败！");
                }
            });*/
            $.postjson(urlTarget + '?rand=' + Math.random(), JSON.stringify(postData), function (result, textStatus, jqXHR) {
                if (result.code == 0) {
                    var msg = '应用ID：' + KEY_ID + "<br>" + '根密钥CV：' + KEY_KCV +
                        '<br>' + '工作密钥参数：' + KEY_INFO;
                    swal({
                        type: 'success',
                        title: '配置成功',
                        html: msg,
                        allowOutsideClick: false
                    });
                } else {
                    var msg = result.msg;
                    $.SFP.tipMessage(msg, false);
                }
            }, 'json');
        }

    };
	//标签查询
    $.SFP.rfidQuery = {
        activate: function() {
            var dtable = $('#rfid_main_table').DataTable({
				ajax: {
					url: o.basePath + '/rfid/list',
					type: 'POST',
					data: function(d) {
						d.EPC = $('#EPC').val();
					},
					dataSrc: $.SFP.ParseDataTableResult
				},
				processing: true,
				serverSide: true,
				columns: [
					{data: 'epc'},
					{data: 'kcv'},
					{data: 'work_info'},
                    {data: 'ctime',
                        render: function(data, type, row) {
                            return getMyDate(data)
                        }
                    },
					{data: null}
				],
				columnDefs: [{
					render: function(data, type, row) {
						var html = '';
						html = '<span class="ui basic green button rfidDetail" data-id="' +
							row.id + '" data-epc="' + row.epc + '" data-user="' + row.user_data + '">详情</span>';
						return html;
					},
					targets: 4
				}],
				rowId: 'id',
				// pagingType: "full_numbers_icon",
				order: [1, 'desc'],
				responsive: true
			});
            $('#rfid_main_table').on(
                'draw.dt',
                function() {
                    $('.rfidDetail').on('click.SFP.rfidQuery.rfidDetail',
                        $.SFP.rfidQuery.rfidDetail);
                });
            $('#rfid_search').on('click.SFP.rfidQuery.rfidList',
                $.SFP.rfidQuery.rfidList);
            $('#rfid_detail_back').on('click.SFP.rfidQuery.rfid_detail_back',
                $.SFP.rfidQuery.rfid_detail_back);
        },
        rfid_detail_back: function() {
            $('#rfid_detail_page,#rfid_list_page').toggleClass('displaynone');
        },
        rfidDetail: function() {
            var id = $(this).data('id');
            var epc = $(this).data('epc');
            var user = $(this).data('user');
            $("#EPC1").val(epc);
            $("#USER").val(user);
            var dtable = $('#rfidCheck_main_table').DataTable({
                ajax: {
                    url: o.basePath + '/rfid/checklist',
                    type: 'POST',
                    data: function(d) {
                        d.ID = id;
                    },
                    dataSrc: function(json) {
                    	$("#LENGTH").val(json.recordsTotal);
                        if(json.code != 0) {
                            json.list = [];
                            var message = '获取数据失败![' + json.msg + ', ' + json.code + ']';
                            $.SFP.tipMessage(message, false);
                        }
                        return json.list;
                    }
                },
                processing: true,
                serverSide: true,
                columns: [
                    {data: 'count'},
                    {data: 'check_time',
						render: function(data, type, row) {
                        	return getMyDate(data)
                    	}
                    }
                ],
                rowId: 'id',
                order: [1, 'desc'],
                responsive: true,
                destroy: true
            });
            $('#rfid_detail_page,#rfid_list_page').toggleClass('displaynone');
        },
        rfidList: function() {
            $('#rfid_main_table').DataTable().ajax.reload();
            return;
        }
    };

    //将时间戳格式化
    function getMyDate(time){
        if(typeof(time)=="undefined"){
            return "";
        }
        var oDate = new Date(time),
            oYear = oDate.getFullYear(),
            oMonth = oDate.getMonth()+1,
            oDay = oDate.getDate(),
            oHour = oDate.getHours(),
            oMin = oDate.getMinutes(),
            oSen = oDate.getSeconds(),
            oTime = oYear +'-'+ getzf(oMonth) +'-'+ getzf(oDay) +' '+ getzf(oHour) +':'+ getzf(oMin) +':'+getzf(oSen);//最后拼接时间
        return oTime;
    };

    //补0操作,当时间数据小于10的时候，给该数据前面加一个0
    function getzf(num){
        if(parseInt(num) < 10){
            num = '0'+num;
        }
        return num;
    }

}

