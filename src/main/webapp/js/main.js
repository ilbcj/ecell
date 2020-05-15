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
			
			jeDate("#player_content_birth",{
		        theme:{ bgcolor:"#00A1CB",color:"#ffffff", pnColor:"#00CCFF"},
		        onClose: false,
		        format: "YYYY-MM-DD"
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
							else if( data == 'R' ) {
								html = '<span class="ui basic black button">随机</span>';
							}
							return html;
						},
						targets: 2
					},
					{
						render: function ( data, type, row ) {
							var html = '';
								html = '<div class="btn-group">';
								html += '<div class="ui green horizontal label player_update" data-id="' + row.id + '"><i class="large edit icon"></i>修改</div>';
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
			$('#player_content_nick').val('');
			$('#player_content_race').dropdown('clear');
			$('#player_content_name').val('');
			$("#player_content_gender").dropdown('clear');
			$("#player_content_country").dropdown('clear');
			$("#player_content_birth").val('');
			$('#player_content_team').val('');
			$('#player_content_tel').val('');
			$('#player_content_qq').val('');
			$('#player_content_wechat').val('');
			$('#player_content_status').dropdown('clear');
			return;
		},
        contentToggle: function() {
			$.ECELL.player.emptyVal();
			$('#player_list,#player_content').toggleClass('displaynone');
			
			var playerId = $(this).data('id');
			if( undefined != playerId ) {
				$.ECELL.player.fillDetailData(playerId);
			}
			else{
				$('#player_content_race').dropdown('set selected', '');
				$("#player_content_gender").dropdown('set selected', '1');
				$("#player_content_country").dropdown('set selected', 'CN');
				$('#player_content_status').dropdown('set selected', '1');
				playerId = 0;
			}
			$('#player_content').data('player_id', playerId);
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
			postData.tel = $('#player_content_tel').val();
			postData.qq = $('#player_content_qq').val();
			postData.wechat = $('#player_content_wechat').val();
			postData.status = $('#player_content_status').dropdown('get value');
			
			var urlTarget = o.basePath + '/player/';;
			if( postData.id == 0 ) {
				urlTarget += 'regist';
			}
			else {
				urlTarget += 'modfiy';
			}
			$.postjson(urlTarget + '?rand=' + Math.random(), JSON.stringify(postData), function(data,textStatus, jqXHR) {
	    		if( data.code == 0 ) {
					$.ECELL.player.contentToggle();
					
					$('#player_main_table').DataTable().ajax.reload();
					var message = '保存选手信息成功!';
					$.ECELL.tipMessage(message);
				} else {
					var message = '保存选手信息失败![' + data.msg + ', ' + data.code + ']';
					$.ECELL.tipMessage(message, false);
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
						$.ECELL.tipMessageSuccess("选手删除成功。");
						$('#player_main_table').DataTable().ajax.reload();
						$("#player_delconfirm_modal").modal({
							closable: false
						}).modal('hide');
					} else {
						var msg = data.msg;
						$.ECELL.tipMessage(msg, false);
					}
				}, 'json');
		}
	}; // player管理结束
	
	$.ECELL.season = {
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
			
			var dtable = $('#season_main_table').DataTable({
				ajax:{
					url: o.basePath + '/season/list',
					type: 'POST',
					data: function ( d ) {
				        d.name = $('#season_search_name').val();
				        d.begin = $('#season_search_start').val();
				        d.end = $('#season_search_end').val();
					},
					dataSrc: $.ECELL.ParseDataTableResult
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
			$('#season_search').on('click.ECELL.season.query', $.ECELL.season.query);
			$('#season_main_table').on( 'draw.dt', function () {
				$('.season_schedule').on('click.ECELL.season.update', $.ECELL.season.schedule);
				$('.season_update').on('click.ECELL.season.update', $.ECELL.season.contentToggle);
				$('.season_delete').on('click.ECELL.season.delete', $.ECELL.season.delConfirm);
			});
            $('#add_season').on('click.ECELL.season.content', $.ECELL.season.contentToggle);
            $('#season_content_save').on('click.ECELL.season.save', $.ECELL.season.regist);
            $('#season_content_return').on('click.ECELL.season.return', $.ECELL.season.contentToggle);
            $('#del_season_yes').on('click.ECELL.season.del.yes', $.ECELL.season.delConfirmYes);
		},
		query: function () {
			$('#season_main_table').DataTable().ajax.reload();
			return;
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

	}; // season管理结束

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
		else if( url == 'pages/player/player.html' ) {
			$.ECELL.player.activate();
		}
		else if( url == 'pages/season/season.html' ) {
			$.ECELL.season.activate();
		}
		else if( url == 'pages/match/match.html' ) {
			$.ECELL.match.activate();
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
}

