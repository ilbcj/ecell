/*! ECELL main.js
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
 * Main JS application file for ECELL v1. This file
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
	throw new Error('ECELL requires jQuery');
	
}


/*
 * ECELL
 * 
 * @type Object @description $.ECELL is the main object for the app. It's used for
 * implementing functions and options related to the ECELL. Keeping everything
 * wrapped in an object prevents conflict with other plugins and is a better way
 * to organize our code.
 */
$.ECELL = {};

/*
 * -------------------- - ECELL Options - -------------------- Modify these
 * options to suit your implementation
 */
$.ECELL.options = {
	basePath: 'ECELLdemo',
};

/*
 * ------------------ - Implementation - ------------------ The next block of
 * code implements ECELL's functions and plugins as specified by the options
 * above.
 */
$(function () {
	'use strict';
	
	// , headers: { 'x-requested-with': 'XMLHttpRequest' }
    $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
    

	// Extend options if external options exist
	if (typeof ECELLOptions !== 'undefined') {
		$.extend(true, $.ECELL.options, ECELLOptions);
	}

	// Easy access to options
	var o = $.ECELL.options;
	console.log(o.basePath);
	// Set up the object
	_initECELL(o);

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
	$.ECELL.menu.activate();
	
	$.ECELL.indexPage.activate();
});

/*
 * ---------------------------------- - Initialize the ECELL Object -
 * ---------------------------------- All ECELL functions are implemented below.
 */
function _initECELL(o) {
	'use strict';
	/*
	 * Menu ====== Create main menu and custom menu
	 * 
	 * @type Object @usage $.ECELL.menu.activate() @usage
	 * $.ECELL.menu.generateMenu()
	 */
	$.ECELL.menu = {
		activate: function () {
			$.post( o.basePath + '/sys/menu/nav?rand=' + Math.random(), function(data){
				if( data.code == 0 ) {
					// sessionStorage.permissions = data.permissions;
					$.ECELL.menu.generateMenu(data.menuList);
				}
				else {
					$.ECELL.ErrOccurred(data.message, data.code);
				}
			},'json');
			
			/*
			 * //get admin info $.post(o.basePath + '/sys/user/info',
			 * function(data){ if( data.code == 0 ) {
			 * $('#title_admin').html(data.admin.name); } });
			 */
			
			// add logoff event
			$('#logout').on('click.ECELL.admin.off', function(e){
				$.post(o.basePath + '/login/logout', function(data){
					window.location = o.basePath + '/login.html';
				});
			});
			
			// add changepwd event
			$('#change_pwd').on('click.ECELL.changepwd.data-api',function(e){
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
							$.ECELL.tipMessage(message, false);
							return;
		    			}
		    			
						var postData = '';
						postData = "password=" + oldPwd;
						postData += "&newPassword=" + newPwd;
						$.post(o.basePath + '/login/user/password', postData, function(data, textStatus, jqXHR) {
							if( data.code == 0 ) {
								var message = '修改口令操作成功!';
								$.ECELL.tipMessage(message);
							} else {
								var message = '修改口令操作失败![' + data.msg + ', ' + data.code + ']';
								$.ECELL.tipMessage(message, false);
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
						$('.menuentry_' + levelTwo.menuId).on('click.ECELL.menu.data-api', function(e){
							$('.modal').remove();
			    			$('div.mainWrap').load(levelTwo.url + '?random=' + Math.random() + ' .mainWrapInner',
			    				function(response,status,xhr){$.ECELL.CheckLoad(response);$.ECELL.PageActivate(levelTwo.url);});
			    		});
					});
				}
		    });
		}
	};// end of $.ECELL.menu
	
	$.ECELL.indexPage = {
		activate: function () {
			/*$.post(o.basePath + '/stat/devquantity?rand=' + Math.random(), {}, function(data,textStatus, jqXHR) {
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
					$.ECELL.tipMessage(message, false);
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
					$.ECELL.tipMessage(message, false);
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
					$.ECELL.tipMessage(message, false);
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
					$.ECELL.tipMessage(message, false);
				}
			}, 'json');		*/	
		}
	};// end of $.ECELL.indexPage
	
	/*
	 * admin ====== admin infomation maintain page
	 * 
	 * @type Object @usage $.ECELL.admin.activate() @usage
	 * $.ECELL.admin.queryAdmin() @usage $.ECELL.admin.addAdminWindow() @usage
	 * $.ECELL.admin.adminDetailReturn() @usage $.ECELL.admin.saveAdminConfirm()
	 * @usage $.ECELL.admin.delAdmin() @usage $.ECELL.admin.delAdminConfirm()
	 */
	$.ECELL.admin = {
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
					dataSrc: $.ECELL.ParseDataTableResult
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
			$('#admin_search').on('click.ECELL.admin.query', $.ECELL.admin.queryAdmin);
			$('#add_admin').on('click.ECELL.admin.add', $.ECELL.admin.addAdminWindow);
			$('#admin_detail_save').on('click.ECELL.admin.detailsave', $.ECELL.admin.saveAdminConfirm);
			$('#admin_detail_return').on('click.ECELL.admin.detailreturn', $.ECELL.admin.adminDetailReturn);
			$('#admin_main_table').on( 'draw.dt', function () {
				$('.admin_info').on('click.ECELL.admin.detail', $.ECELL.admin.addAdminWindow);
				$('.admin_del').on('click.ECELL.admin.delete.single', $.ECELL.admin.delAdmin);
			});
			$('#admin_confirm_modal_confirm').on('click.ECELL.admin.delconfirm', $.ECELL.admin.delAdminConfirm);
			
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
					$.ECELL.tipMessage(message, false);
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
				$.ECELL.tipMessage(message, false);
				return;
		    }
		    if( pwd != repwd ) {
		    	var message = '保存管理员信息失败![口令与重复口令不匹配，请重新输入!]';
		    	$('#admin_pwd').val('');
		    	$('#admin_repwd').val('');
				$.ECELL.tipMessage(message, false);
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
					$.ECELL.admin.adminDetailReturn();
					
					$('#admin_main_table').DataTable().ajax.reload();
					var message = '保存管理员信息成功!';
					$.ECELL.tipMessage(message);
				} else {
					var message = '保存管理员信息失败![' + data.msg + ', ' + data.code + ']';
					$.ECELL.tipMessage(message, false);
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
					$.ECELL.tipMessage(message);
					$('#admin_main_table').DataTable().ajax.reload();
				} else {
					var message = '删除管理员信息失败![' + data.msg + ', ' + data.code + ']';
					$.ECELL.tipMessage(message, false);
				}
			}, 'json');
		}
	};// end of $.ECELL.admin
	
	$.ECELL.player = {
		activate: function() {
			$(".ui.dropdown").dropdown({
				allowCategorySelection: true,
				transition: "fade up"
			});
			
			var dtable = $('#player_main_table').DataTable({
				ajax:{
					url: o.basePath + '/player/list',
					type: 'POST',
					data: function ( d ) {
				        d.nick = $('#player_search_nick').val();
				        d.name = $('#player_search_name').val();
					},
					dataSrc: $.ECELL.ParseDataTableResult
				},
				processing: true,
				serverSide: true,
				columns: [
					{ data: 'nick' },
					{ data: 'name' },
					{ data: 'race' },
					{ data: 'teamName' },
					{ data: null }
				],
				rowId: 'id',
		        columnDefs: [
		        	{
						render: function ( data, type, row ) {
							var html = '';
							if( data == 'T' ) {
								html = '<span class="ui basic black button">人族</span>';
							}
							else if( data == 'P' ) {
								html = '<span class="ui basic black button">神族</span>';
							}
							else if( data == 'Z' ) {
								html = '<span class="ui basic black button">虫族</span>';
							}
							return html;
						},
						targets: 2
					},
					{
						render: function ( data, type, row ) {
							var html = '';
								html = '<div class="btn-group">';
								html += '<div class="ui green horizontal label player_update disabled" data-id="' + row.id + '"><i class="large edit icon"></i>修改</div>';
								html += '<a class="ui red horizontal label player_delete" data-id="' + row.id + '"><i class="large trash outline icon"></i>删除</a>';
								html += '</div>';
							return html;							
						},
						targets: 4
					}
				],
		        //order: [1, 'desc'],
				responsive: true
		    });
			
			// listen page items' event
			$('#player_search').on('click.ECELL.player.query', $.ECELL.player.query);
			$('#player_main_table').on( 'draw.dt', function () {
				$('.player_update').on('click.ECELL.player.update', $.ECELL.player.contentToggle);
				$('.player_delete').on('click.ECELL.player.delete', $.ECELL.player.delConfirm);
			});
            $('#add_player').on('click.ECELL.player.content', $.ECELL.player.contentToggle);
            $('#player_content_save').on('click.ECELL.player.save', $.ECELL.player.regist);
            $('#player_content_return').on('click.ECELL.player.return', $.ECELL.player.contentToggle);
            $('#del_player_yes').on('click.ECELL.player.del.yes', $.ECELL.player.delConfirmYes);
		},
		query: function () {
			$('#player_main_table').DataTable().ajax.reload();
			return;
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
        contentToggle: function() {
			$.ECELL.player.emptyVal();
			$('#player_list,#player_content').toggleClass('displaynone');
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
			
		},
		delete_true: function() {
			var postData = {};
			postData.roleId = delRoleId;
			var urlTarget = o.basePath + '/Role/delRole';
			$.postjson(urlTarget + '?rand=' + Math.random(), JSON
				.stringify(postData),
				function(data, textStatus, jqXHR) {
					if(data.code == 0) {
						$.ECELL.tipMessageSuccess("角色删除成功。");
						$('#role_main_table').DataTable().ajax.reload();
						$("#delete_role_model").modal({
							closable: false
						}).modal('hidden');
					} else {
						var msg = data.msg;
						$.ECELL.tipMessage(msg, false);
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
						$.ECELL.tipMessage(msg, false);
					}
				}, 'json');
			$("#modify_role")
				.click(
					function(e) {
						if(!e.isPropagationStopped()) { // 确定stopPropagation是否被调用过
							var roleName = $('#role_name').val().trim();
							if(roleName == "") {
								$.ECELL.tipMessage("请输入角色名称！", false);
								return false;
							}
							var roleDes = $('#role_Des').val().trim();
							if(roleDes == "") {
								$.ECELL.tipMessage("请输入角色备注！", false);
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
										$.ECELL.tipMessage("请选择加密算法类型！",
											false);
										return false;
									}
									postData.signEnPar = statusE;
									var statusS = $('#signSigAlgo')
										.dropdown('get value');
									if(statusS == "") {
										$.ECELL.tipMessage("请选择签名算法类型！",
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
										$.ECELL.tipMessage("请选择加密算法类型！",
											false);
										return false;
									}
									postData.dataEnPar = statusE;
									var statusS = $('#dataSignAlgo')
										.dropdown('get value');
									if(statusS == "") {
										$.ECELL.tipMessage("请选择签到算法类型！",
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
										$.ECELL.tipMessage("请选择加密算法类型！",
											false);
										return false;
									}
									postData.cmdEnPar = statusE;
									var statusS = $('#cmdSignAlgo')
										.dropdown('get value');
									if(statusS == "") {
										$.ECELL.tipMessage("请选择签名算法类型！",
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
									$.ECELL.tipMessage("请勾选策略参数！", false);
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
							    	$.ECELL.tipMessage("请输入时间间隔策略！", false);
								    return false;
							    }*/
							    if(!$.ECELL.strategy.sumberCheck(heartbeatTime)){
							    	$.ECELL.tipMessage("输入的时间格式不对", false);
							    	return false;
							    }
							    if(!$.ECELL.strategy.sumberCheck(dataGatherTime)){
							    	$.ECELL.tipMessage("输入的时间格式不对", false);
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
											$.ECELL
												.tipMessageSuccess("角色修改成功。");
											$(
													'#role_main_table')
												.DataTable().ajax
												.reload();
											$(
													'#Role_list_page,#Role_regist_page')
												.toggleClass(
													'displaynone');
											$.ECELL.strategy
												.emptyVal();
											$(this)
												.parents(
													'.anElement')
												.remove();
											return false;
										} else {
											var msg = data.msg;
											$.ECELL.tipMessage(
												msg, false);
											$.ECELL.strategy
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
			$("#player_delconfirm_modal").modal({
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
								$.ECELL.tipMessage("请输入角色名称！", false);
								return false;
							}
							var roleDes = $('#role_Des').val().trim();
							if(roleDes == "") {
								$.ECELL.tipMessage("请输入角色备注！", false);
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
										$.ECELL.tipMessage("请选择加密算法类型！",
											false);
										return false;
									}
									postData.signEnPar = statusE;
									var statusS = $('#signSigAlgo')
										.dropdown('get value');
									if(statusS == "") {
										$.ECELL.tipMessage("请选择签名算法类型！",
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
										$.ECELL.tipMessage("请选择加密算法类型！",
											false);
										return false;
									}
									postData.dataEnPar = statusE;
									var statusS = $('#dataSignAlgo')
										.dropdown('get value');
									if(statusS == "") {
										$.ECELL.tipMessage("请选择签到算法类型！",
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
										$.ECELL.tipMessage("请选择加密算法类型！",
											false);
										return false;
									}
									postData.cmdEnPar = statusE;
									var statusS = $('#cmdSignAlgo')
										.dropdown('get value');
									if(statusS == "") {
										$.ECELL.tipMessage("请选择签名算法类型！",
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
									$.ECELL.tipMessage("请勾选策略参数！", false);
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
							    	$.ECELL.tipMessage("请输入策略间隔时间！", false);
								    return false;
							    }*/
							    if(!$.ECELL.strategy.sumberCheck(heartbeatTime)){
							    	$.ECELL.tipMessage("输入的时间格式不对", false);
							    	return false;
							    }
							    if(!$.ECELL.strategy.sumberCheck(dataGatherTime)){
							    	$.ECELL.tipMessage("输入的时间格式不对！", false);
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
											$.ECELL
												.tipMessageSuccess("角色添加成功。");
											$(
													'#role_main_table')
												.DataTable().ajax
												.reload();
											$(
													'#Role_list_page,#Role_regist_page')
												.toggleClass(
													'displaynone');
											$.ECELL.strategy
												.emptyVal();
											$(this)
												.parents(
													'.anElement')
												.remove();
											return false;
										} else {
											var msg = data.msg;
											$.ECELL.tipMessage(
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
	$.ECELL.appRegist = {
		activate: function() {
			$('#app_regist').on('click.ECELL.appRegist.app_regist',
				$.ECELL.appRegist.app_regist);
			$('#app_regist_empty').on('click.ECELL.appRegist.app_regist_empty',
				$.ECELL.appRegist.app_regist_empty);

		},
		emptyVal: function() {
			$('#appId').val('');
			$('#appName').val('');
			$('#appType').val('');
		},
		app_regist_empty: function() {
			$.ECELL.appRegist.emptyVal();
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
						$.ECELL.appRegist.emptyVal();
					} else {

						var msg = data.msg;
						$.ECELL.tipMessage(msg, false);
					}
				}, 'json');

		}

	}; // 应用注册结束
	// 应用查询开始
	$.ECELL.appQuery = {
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
					dataSrc: $.ECELL.ParseDataTableResult
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
					$('.appDetail').on('click.ECELL.appQuery.appDetail', $.ECELL.appQuery.appDetail);
				});
			$('#app_search').on('click.ECELL.appQuery.queryAppList', $.ECELL.appQuery.queryAppList);
			$('#app_detail_back').on('click.ECELL.appQuery.app_detail_back', $.ECELL.appQuery.app_detail_back);
			$("#genkey").on('click.ECELL.appQuery.genkey', $.ECELL.appQuery.genkey)
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
                                        $.ECELL.tipMessage(message, false);
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
						$.ECELL.tipMessage(msg, false);
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
                        $.ECELL.tipMessage(msg, false);
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
	$.ECELL.appUpdate = {
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
						dataSrc: $.ECELL.ParseDataTableResult
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
					$('.appUpdate').on('click.ECELL.appUpdate.appUpdate',
						$.ECELL.appUpdate.appUpdate);
				});
			$('#app_search').on('click.ECELL.appUpdate.queryAppList',
				$.ECELL.appUpdate.queryAppList);
			$('#app_update').on('click.ECELL.appUpdate.app_update',
				$.ECELL.appUpdate.app_update);
			$('#app_update_back').on('click.ECELL.appUpdate.app_update_back',
				$.ECELL.appUpdate.app_update_back);
		},
		emptyVal: function() {
			$('#appId_update').val('');
			$('#appName_update').val('');
			$('#appType_update').val('');
		},
		app_update_back: function() {

			$('#app_update_page,#app_list_page').toggleClass('displaynone');
			$.ECELL.appUpdate.emptyVal();
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
						$.ECELL.tipMessageSuccess("应用修改成功。");
					} else {
						var msg = data.msg;
						$.ECELL.tipMessage(msg, false);
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
						$.ECELL.tipMessage(msg, false);
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
	$.ECELL.appLogout = {
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
						dataSrc: $.ECELL.ParseDataTableResult
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
					$('.appLogout').on('click.ECELL.appLogout.appLogout',
						$.ECELL.appLogout.appLogout);
				});
			$('#app_search').on('click.ECELL.appLogout.queryAppList',
				$.ECELL.appLogout.queryAppList);
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
						$.ECELL.tipMessageSuccess("应用注销成功。");

					} else {
						var msg = data.msg;
						$.ECELL.tipMessage(msg, false);
					}
				}, 'json');
		},
		queryAppList: function() {
			$('#app_main_table').DataTable().ajax.reload();
			return;
		}
	}; // 应用结束
	// 管理员添加开始
	$.ECELL.adminInsert = {
		activate: function() {
			$('#admin_regist').on('click.ECELL.adminInsert.admin_regist',
				$.ECELL.adminInsert.admin_regist);
			$('#admin_regist_empty').on('click.ECELL.adminInsert.emptyVal',
				$.ECELL.adminInsert.emptyVal);
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
				$.ECELL.tipMessage("请输入管理员账号！", false);
				return false;
			}
			var name = $('#admin_Name').val().trim();
			if(name == "") {
				$.ECELL.tipMessage("请输入管理员姓名！", false);
				return false;
			}
			var pwd = $('#admin_pwd1').val().trim();
			if(pwd == "") {
				$.ECELL.tipMessage("请输入密码！", false);
				return false;
			}
			var pwd2 = $('#admin_pwd2').val().trim();
			if(pwd2 == "") {
				$.ECELL.tipMessage("请输入确认密码！", false);
				return false;
			}
			if(!(pwd2 == pwd)) {
				$.ECELL.tipMessage("两次输入密码不一致！", false);
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
						$.ECELL.tipMessageSuccess("管理员添加成功。");
						$.ECELL.adminInsert.emptyVal();
					} else {

						var msg = data.msg;
						$.ECELL.tipMessage(msg, false);
					}
				}, 'json');

		}
	}; // 管理员添加结束
	// 管理员查询开始
	$.ECELL.adminQuery = {
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
						dataSrc: $.ECELL.ParseDataTableResult
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
					$('.start_admin').on('click.ECELL.adminQuery.start_admin',
						$.ECELL.adminQuery.start_admin);
					$('.del_admin').on('click.ECELL.adminQuery.del_admin',
							$.ECELL.adminQuery.del_admin);
					$('.mod_admin').on('click.ECELL.adminQuery.mod_admin',
							$.ECELL.adminQuery.mod_admin);
				});

			$('#admin_search').on('click.ECELL.adminQuery.admin_search',
					$.ECELL.adminQuery.admin_search);
			$('#admin_mod_back').on('click.ECELL.adminQuery.admin_mod_back',
					$.ECELL.adminQuery.admin_mod_back);
			$('#admin_regist_mod').on('click.ECELL.adminQuery.admin_regist_mod',
					$.ECELL.adminQuery.admin_regist_mod);
		},
		admin_regist_mod:function(){
			var adminId = $('#admin_Id_mod').val().trim();
			if(adminId == "") {
				$.ECELL.tipMessage("请输入管理员账号！", false);
				return false;
			}
			var name = $('#admin_Name_mod').val().trim();
			if(name == "") {
				$.ECELL.tipMessage("请输入管理员姓名！", false);
				return false;
			}
			var pwd = $('#admin_pwd1_mod').val().trim();
			if(pwd == "") {
				
			}
			var pwd2 = $('#admin_pwd2_mod').val().trim();
			if(pwd2 == "") {
				
			}
			if(!(pwd2 == pwd)) {
				$.ECELL.tipMessage("两次输入密码不一致！", false);
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
						$.ECELL.tipMessageSuccess("管理员修改成功。");
						$('#admin_main_table').DataTable().ajax.reload();
			            $('#admin_list_page_mod,#admin_list_page').toggleClass('displaynone');
			        	$.ECELL.adminQuery.emptyVal();
					} else {
						$.ECELL.tipMessage(data.msg, false);
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
			$.ECELL.adminQuery.emptyVal();
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
						$.ECELL.tipMessage(data.msg, false);
					}
				}, 'json');
		},
		del_admin:function(){
			var adminId = $(this).data('id') + '';
			if(adminId=='admin'){
				$.ECELL.tipMessage("超级管理员不允许注销！", false);
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
						$.ECELL.tipMessage(data.msg, false);
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
							$.ECELL.tipMessage(msg, false);
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
	$.ECELL.groupRole = {
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
						dataSrc: $.ECELL.ParseDataTableResult
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
					$.ECELL.tipMessage(message, false);
				}
			}, 'json');


			    $('#dev_role_group_b').on('click.ECELL.group.querygroup', $.ECELL.groupRole.querygroup);
			    $('#add_device_group').on('click.ECELL.group.add', $.ECELL.groupRole.GroupWindow);
			    
			    $('#add_appId_List').on('click.ECELL.group.addAppList', $.ECELL.groupRole.addappidList);
			    $('#appId_List_button').on('click.ECELL.group.queryAppList', $.ECELL.groupRole.queryappidList);
			    
			    $('#appid_submit_b').on('click.ECELL.group.appidSubmit', $.ECELL.groupRole.appidSumbit);
			    $('#sumbit_group_info').on('click.ECELL.group.groupinfoSubmit', $.ECELL.groupRole.groupinfoSubmit);
			    $('#sumbit_group_back').on('click.ECELL.group.groupinfoBack', $.ECELL.groupRole.groupinfoSubmitBack);
			    
			    $('#del_group_button').on('click.ECELL.group.deleteGroupButton', $.ECELL.groupRole.deleteGroup);
			    
			    $('#group_role_table').on( 'draw.dt', function () {
				    $('.group_info').on('click.ECELL.group.detail', $.ECELL.groupRole.GroupWindow);
				    $('.group_del').on('click.ECELL.group.delete.single', $.ECELL.groupRole.delGroup);
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
						dataSrc: $.ECELL.ParseDataTableResult
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
									html += '<input type="checkbox" name="example" id="'+row.appId+'" onclick="$.ECELL.groupRole.checkoutdecide(this)">';
								}
								for (var i = 0; i < appidVL.length; i++) {
									if(row.appId==appidVL[i].appid){
										flag = false;
									html += '<input type="checkbox" checked="checked" name="example" id="'+row.appId+'" onclick="$.ECELL.groupRole.checkoutdecide(this)">';
								}
						      }
								if(flag){
									html += '<input type="checkbox" name="example" id="'+row.appId+'" onclick="$.ECELL.groupRole.checkoutdecide(this)">';
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
					$.ECELL.tipMessage(message, false);
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
					    $.ECELL.tipMessage(message);
					    $('#group_role_table').DataTable().ajax.reload();
					}else {
						var message = '保存设备组信息失败![' + result.msg + ']';
					    $.ECELL.tipMessage(message, false);
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
					$.ECELL.tipMessage("删除成功");
					$('#group_role_table').DataTable().ajax.reload();
				} else {
					var message = '删除组失败![' + data.msg + ']';
					$.ECELL.tipMessage(message, false);
				}
			}, 'json');
		   },
		   groupinfoSubmitBack : function(){
		   	$('#dev_group_list, #dev_group_context').toggleClass('displaynone');
		   }
		};
	//设备组管理结束
	
	//设备版本管理
	$.ECELL.deviceversion = {
			activate: function () {
				var dtable = $('#device_version_main_table').DataTable({
					ajax:{
						url: o.basePath + '/deviceVersion/list',
						type: 'POST',
						data: function ( d ) {
					        d.devId = $('#device_version_search_devid').val();
					        d.appId = $('#device_version_search_appid').val();
						},
						dataSrc: $.ECELL.ParseDataTableResult
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
				
				$('#device_version_search_button').on('click.ECELL.deviceversion.query', $.ECELL.deviceversion.queryDeviceVersionList);
			},
			queryDeviceVersionList : function () {
				$('#device_version_main_table').DataTable().ajax.reload();
				return;
			}
		};
	//设备版本管理结束
	
	

	/*
	 * device black list ====== device black list infomation maintain page
	 * 
	 * @type Object @usage $.ECELL.blackList.activate() @usage
	 * $.ECELL.blackList.queryBlackList()
	 */
	$.ECELL.blackList = {
		activate: function () {
			var dtable = $('#dbl_main_table').DataTable({
				ajax:{
					url: o.basePath + '/dev/bl/list',
					type: 'POST',
					data: function ( d ) {
				        d.devId = $('#dbl_search_devid').val();
				        d.appId = $('#dbl_search_appid').val();
					},
					dataSrc: $.ECELL.ParseDataTableResult
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
			$('#dbl_search').on('click.ECELL.blackList.query', $.ECELL.blackList.queryBlackList);
		},
		queryBlackList: function () {
			$('#dbl_main_table').DataTable().ajax.reload();
			return;
		}
	};// end of $.ECELL.blackList
	
	/*
	 * key list ====== key list infomation maintain page
	 * 
	 * @type Object @usage $.ECELL.keyList.activate() @usage
	 * $.ECELL.keyList.queryKeyList()
	 */
	$.ECELL.keyList = {
		activate: function () {
			var dtable = $('#keylist_main_table').DataTable({
				ajax:{
					url: o.basePath + '/key/list',
					type: 'POST',
					data: function ( d ) {
				        d.devId = $('#keylist_search_devid').val();
				        d.appId = $('#keylist_search_appid').val();
					},
					dataSrc: $.ECELL.ParseDataTableResult
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
			$('#keylist_search').on('click.ECELL.keyList.query', $.ECELL.keyList.queryKeyList);
		},
		queryKeyList: function () {
			$('#keylist_main_table').DataTable().ajax.reload();
			return;
		}
	};// end of $.ECELL.keyList
	
	/*
	 * key source ====== key source infomation maintain page
	 * 
	 * @type Object @usage $.ECELL.keySource.activate() @usage
	 * $.ECELL.keySource.queryKeyList()
	 */
	$.ECELL.keySource = {
		activate: function () {
			var dtable = $('#keysource_main_table').DataTable({
				ajax:{
					url: o.basePath + '/key/source',
					type: 'POST',
					data: function ( d ) {
				        d.devId = $('#keysource_search_devid').val();
				        d.appId = $('#keysource_search_appid').val();
					},
					dataSrc: $.ECELL.ParseDataTableResult
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
			$('#keysource_search').on('click.ECELL.keySource.query', $.ECELL.keySource.queryKeySource);
		},
		queryKeySource: function () {
			$('#keysource_main_table').DataTable().ajax.reload();
			return;
		}
	};// end of $.ECELL.keySource
	
	/*
	 * hsm list ====== hsm list infomation maintain page
	 * 
	 * @type Object @usage $.ECELL.hsmList.activate() @usage
	 * $.ECELL.hsmList.queryHsmList()
	 */
	$.ECELL.hsmList = {
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
					dataSrc: $.ECELL.ParseDataTableResult
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
			$('#hsmlist_search').on('click.ECELL.logList.query', $.ECELL.hsmList.queryHsmList);
		},
		queryHsmList: function () {
			$('#hsmlist_main_table').DataTable().ajax.reload();
			return;
		}
	};// end of $.ECELL.hsmList
	
	/*
	 * log list ====== log list infomation maintain page
	 * 
	 * @type Object @usage $.ECELL.logList.activate() @usage
	 * $.ECELL.logList.queryLogList()
	 */
	$.ECELL.logList = {
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
					dataSrc: $.ECELL.ParseDataTableResult
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
			$('#loglist_search').on('click.ECELL.logList.query', $.ECELL.logList.queryLogList);
		},
		queryLogList: function () {
			$('#loglist_main_table').DataTable().ajax.reload();
			return;
		}
	};// end of $.ECELL.logList
	
	/*
	 * role ====== role infomation maintain page
	 * 
	 * @type Object @usage $.ECELL.role.activate() @usage $.ECELL.role.queryRole()
	 */
	$.ECELL.role = {
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
					dataSrc: $.ECELL.ParseDataTableResult
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
			$('#role_search').on('click.ECELL.role.query', $.ECELL.role.queryRole);			
		},
		queryRole: function () {
			$('#role_main_table').DataTable().ajax.reload();
			return;
		}
	};// end of $.ECELL.role
	
	/*
	 * config ====== config infomation maintain page
	 * 
	 * @type Object @usage $.ECELL.config.activate() @usage $.ECELL.config.save()
	 * @usage $.ECELL.config.reset()
	 */
	$.ECELL.config = {
		activate: function () {
			$('.tabular .item').tab();
			
			$.ECELL.config.reset();
			
			// listen page items' event
			$('.config_reset').on('click.ECELL.config.reset', $.ECELL.config.reset);
			$('.config_save').on('click.ECELL.config.save', $.ECELL.config.save);
			
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
					$.ECELL.tipMessage(message, false);
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
					$.ECELL.config.reset();
					
					$('#role_main_table').DataTable().ajax.reload();
					var message = '保存配置信息成功!';
					$.ECELL.tipMessage(message);
				} else {
					var message = '保存配置信息失败![' + data.msg + ', ' + data.code + ']';
					$.ECELL.tipMessage(message, false);
				}
			}, 'json');
		}
	};// end of $.ECELL.config
	
	/*
	 * syslog ====== syslog infomation maintain page
	 * 
	 * @type Object @usage $.ECELL.syslog.activate() @usage
	 * $.ECELL.syslog.queryLog()
	 */
	$.ECELL.syslog = {
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
					dataSrc: $.ECELL.ParseDataTableResult
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
			$('#syslog_search').on('click.ECELL.syslog.query', $.ECELL.syslog.querySyslog);
		},
		querySyslog: function () {
			$('#syslog_main_table').DataTable().ajax.reload();
			return;
		}
	};// end of $.ECELL.syslog
	
	/*
	 * symmetricRoot ====== symmetric root key infomation maintain page
	 * 
	 * @type Object @usage $.ECELL.symmetricRoot.activate() @usage
	 * $.ECELL.symmetricRoot.save() @usage $.ECELL.symmetricRoot.reset()
	 */
	$.ECELL.symmetricRoot = {
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
					dataSrc: $.ECELL.ParseDataTableResult
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
			$('#symmetric_root_search').on('click.ECELL.symmetricroot.query', $.ECELL.symmetricRoot.querySymmetricRoot);
			$('#add_symmetric_root').on('click.ECELL.symmetricroot.add', $.ECELL.symmetricRoot.addSymmetricRootWindow);
			$('#symmetric_root_detail_save').on('click.ECELL.symmetricroot.detailsave', $.ECELL.symmetricRoot.saveAdminConfirm);
			$('#symmetric_root_detail_return').on('click.ECELL.symmetricroot.detailreturn', $.ECELL.symmetricRoot.adminDetailReturn);
			$('#revoke_symmetric_root').on('click.ECELL.symmetricroot.revoke', $.ECELL.symmetricRoot.revokeSymmetricRootWindow);
			$('#backup_symmetric_root').on('click.ECELL.symmetricroot.backup', $.ECELL.symmetricRoot.backupSymmetricRootWindow);
			$('#recover_symmetric_root').on('click.ECELL.symmetricroot.recover', $.ECELL.symmetricRoot.recoverSymmetricRootWindow);
			$('#symmetric_root_main_table').on( 'draw.dt', function () {
				$('.symmetric_root_info').on('click.ECELL.symmetricroot.detail', $.ECELL.symmetricRoot.addSymmetricRootWindow);
				$('.symmetric_root_distribution').on('click.ECELL.symmetricroot.distribution', $.ECELL.symmetricRoot.distributionSymmetricRoot);
			});
			$('#symmetric_root_genkey_random').on('click.ECELL.symmetricroot.delconfirm', $.ECELL.symmetricRoot.genkeyRandom);
			$('#symmetric_root_genkey_cipher').on('click.ECELL.symmetricroot.delconfirm', $.ECELL.symmetricRoot.genkeyCipher);
			$('#symmetric_root_genkey_input').on('click.ECELL.symmetricroot.delconfirm', $.ECELL.symmetricRoot.genkeyInput);
			
			
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
					$.ECELL.tipMessage(message, false);
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
				$.ECELL.tipMessage(message, false);
				return;
		    }
		    
		    if( pwd != repwd ) {
		    	var message = '保存管理员信息失败![口令与重复口令不匹配，请重新输入!]';
		    	$('#admin_pwd').val('');
		    	$('#admin_repwd').val('');
				$.ECELL.tipMessage(message, false);
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
					$.ECELL.admin.adminDetailReturn();
					
					$('#admin_main_table').DataTable().ajax.reload();
					var message = '保存管理员信息成功!';
					$.ECELL.tipMessage(message);
				} else {
					var message = '保存管理员信息失败![' + data.msg + ', ' + data.code + ']';
					$.ECELL.tipMessage(message, false);
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
					$.ECELL.tipMessage(message);
					$('#admin_main_table').DataTable().ajax.reload();
				} else {
					var message = '删除管理员信息失败![' + data.msg + ', ' + data.code + ']';
					$.ECELL.tipMessage(message, false);
				}
			}, 'json');
		}
	};// end of $.ECELL.symmetricRoot

	/*
	 * symmetricSub ====== symmetric sub key infomation maintain page
	 * 
	 * @type Object @usage $.ECELL.symmetricSub.activate() @usage
	 * $.ECELL.symmetricSub.save() @usage $.ECELL.symmetricSub.reset()
	 */
	$.ECELL.symmetricSub = {
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
					dataSrc: $.ECELL.ParseDataTableResult
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
			$('#symmetric_sub_search').on('click.ECELL.symmetricsub.query', $.ECELL.symmetricSub.querySymmetricSub);
			$('#add_symmetric_sub').on('click.ECELL.symmetricsub.add', $.ECELL.symmetricSub.addSymmetricSubWindow);
			$('#symmetric_sub_detail_save').on('click.ECELL.symmetricsub.detailsave', $.ECELL.symmetricSub.saveAdminConfirm);
			$('#symmetric_sub_detail_return').on('click.ECELL.symmetricsub.detailreturn', $.ECELL.symmetricSub.adminDetailReturn);
			$('#revoke_symmetric_sub').on('click.ECELL.symmetricsub.revoke', $.ECELL.symmetricSub.revokeSymmetricSubWindow);
			$('#symmetric_sub_main_table').on( 'draw.dt', function () {
				$('.symmetric_sub_info').on('click.ECELL.symmetricsub.detail', $.ECELL.symmetricSub.addSymmetricSubWindow);
				$('.symmetric_sub_distribution').on('click.ECELL.symmetricsub.distribution', $.ECELL.symmetricSub.distributionSymmetricSub);
				
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
			 * $('#symmetric_sub_genkey_random').on('click.ECELL.symmetricsub.delconfirm',
			 * $.ECELL.symmetricSub.genkeyRandom);
			 * $('#symmetric_sub_genkey_cipher').on('click.ECELL.symmetricsub.delconfirm',
			 * $.ECELL.symmetricSub.genkeyCipher);
			 * $('#symmetric_sub_genkey_input').on('click.ECELL.symmetricsub.delconfirm',
			 * $.ECELL.symmetricSub.genkeyInput);
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
					$.ECELL.tipMessage(message, false);
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
				$.ECELL.tipMessage(message, false);
				return;
		    }
		    
		    if( pwd != repwd ) {
		    	var message = '保存管理员信息失败![口令与重复口令不匹配，请重新输入!]';
		    	$('#admin_pwd').val('');
		    	$('#admin_repwd').val('');
				$.ECELL.tipMessage(message, false);
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
					$.ECELL.admin.adminDetailReturn();
					
					$('#admin_main_table').DataTable().ajax.reload();
					var message = '保存管理员信息成功!';
					$.ECELL.tipMessage(message);
				} else {
					var message = '保存管理员信息失败![' + data.msg + ', ' + data.code + ']';
					$.ECELL.tipMessage(message, false);
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
					$.ECELL.tipMessage(message);
					$('#admin_main_table').DataTable().ajax.reload();
				} else {
					var message = '删除管理员信息失败![' + data.msg + ', ' + data.code + ']';
					$.ECELL.tipMessage(message, false);
				}
			}, 'json');
		}
	};// end of $.ECELL.symmetricSub
	
	/*
	 * worksconfig ====== worksconfig infomation maintain page
	 * 
	 * @type Object @usage $.ECELL.worksconfig.activate() @usage
	 * $.ECELL.worksconfig.save() @usage $.ECELL.worksconfig.reset()
	 */
	$.ECELL.worksconfig = {
		activate: function () {
			$('.tabular .item').tab();
			
			$.ECELL.worksconfig.reset();
			
			// listen page items' event
			$('.config_reset').on('click.ECELL.worksconfig.reset', $.ECELL.worksconfig.reset);
			$('.config_save').on('click.ECELL.worksconfig.save', $.ECELL.worksconfig.save);
			
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
					$.ECELL.tipMessage(message, false);
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
					$.ECELL.worksconfig.reset();
					
					var message = '保存配置信息成功!';
					$.ECELL.tipMessage(message);
				} else {
					var message = '保存配置信息失败![' + data.msg + ', ' + data.code + ']';
					$.ECELL.tipMessage(message, false);
				}
			}, 'json');
		}
	};// end of $.ECELL.worksconfig

	/*
	 * batchcompress ====== batchcompress infomation maintain page
	 * 
	 * @type Object @usage $.ECELL.batchcompress.activate() @usage
	 * $.ECELL.batchcompress.refreshTask() @usage $.ECELL.batchcompress.start()
	 */
	$.ECELL.batchcompress = {
		activate: function () {
			$('.tabular .item').tab();
			
			$.ECELL.batchcompress.refreshTask();
			
			// listen page items' event
			$('.batch_starter').on('click.ECELL.batchcompress.save', $.ECELL.batchcompress.start);
			$('.batch_refresh').on('click.ECELL.batchcompress.refreshTask', $.ECELL.batchcompress.refreshTask);
			$('#datacompress_progress_modal_confirm').on('click.ECELL.batchcompress.refreshTask', $.ECELL.batchcompress.refreshTask);
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
					$.ECELL.tipMessage(message);
				}
				else {
					var message = '获取配置信息失败![' + data.msg + ', ' + data.code + ']';
					$.ECELL.tipMessage(message, false);
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
					$.ECELL.batchcompress.updateProgress();
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
						$.ECELL.batchcompress.updateProgress();
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
	};// end of $.ECELL.batchcompress

	/*
	 * TipMessage(message) ========== Showing the info or warn message.
	 * 
	 * @type Function @usage: $.ECELL.tipMessage(message)
	 */
	$.ECELL.tipMessage = function(message, isAutoClose) {
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
	};// end of $.ECELL.tipMessage
	$.ECELL.tipMessageSuccess = function(message, isAutoClose) {
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
	};// end of $.ECELL.tipMessage
  
	/*
	 * CheckLoad() ========== check load response.
	 * 
	 * @type Function @usage: $.ECELL.CheckLoad(response)
	 */
	$.ECELL.CheckLoad = function(response) {
		if(! new RegExp('mainWrapInner').test(response) ){
			window.location.href = '404.html';
		}
			
	};// end of $.ECELL.checkLoad

	/*
	 * ErrOccurred() ========== deal with error message, jump to error page
	 * 
	 * @type Function @usage: $.ECELL.ErrOccurred(response)
	 */
	$.ECELL.ErrOccurred = function(msg, code) {
		sessionStorage.errTip = msg + '[' + code + ']';
		location.href='error.html';
	}// end of $.ECELL.errOccurred
	
	/*
	 * PageActivate() ========== do page initialize
	 * 
	 * @type Function @usage: $.ECELL.PageActivate(response)
	 */
	$.ECELL.PageActivate = function(url) {
		// if( url == 'modules/sys/menu.html' ) {
		if( url == 'pages/system/admin.html' ) {
			$.ECELL.admin.activate();
		}
		/*
		 * else if( url == 'pages/system/role.html' ) { $.ECELL.role.activate(); }
		 * else if( url == 'pages/system/config.html' ) {
		 * $.ECELL.config.activate(); }
		 */
		else if( url == 'pages/player/player.html' ) {
			$.ECELL.player.activate();
		}
	}// end of $.ECELL.PageActivate
	
	/*
	 * ParseDataTableResult() ========== parse response data of datatable ajax
	 * request
	 * 
	 * @type Function @usage: $.ECELL.ParseDataTableResult(json)
	 */
	$.ECELL.ParseDataTableResult = function(json) {
		if(json.code != 0) {
			json.list = [];
			var message = '获取数据失败![' + json.message + ', ' + json.code + ']';
			$.ECELL.tipMessage(message, false);
		}
		return json.list;
	}// end of $.ECELL.ParseDataTableResult
	
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

