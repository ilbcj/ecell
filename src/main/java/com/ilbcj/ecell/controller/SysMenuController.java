package com.ilbcj.ecell.controller;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/sys/menu")
public class SysMenuController {

	@Autowired
	private SysConfigService sysconfService;
	
	@RequestMapping(value = "/nav", method = RequestMethod.POST)
	public R menuNavPost() {
		List<SysMenuEntity> menuList = new ArrayList<SysMenuEntity>();
		menuList = sysconfService.queryAllMenuItems();
		Set<String> permissions = new HashSet<>();
		return R.ok().put("menuList", menuList).put("permissions", permissions);
		//return "{\"msg\":\"success\",\"menuList\":[{\"menuId\":1,\"parentId\":0,\"parentName\":null,\"name\":\"系统管理\",\"url\":null,\"perms\":null,\"type\":0,\"icon\":\"fa fa-cog\",\"orderNum\":0,\"open\":null,\"list\":[{\"menuId\":2,\"parentId\":1,\"parentName\":null,\"name\":\"管理员管理\",\"url\":\"pages/system/admin.html\",\"perms\":null,\"type\":1,\"icon\":\"fa fa-user\",\"orderNum\":1,\"open\":null,\"list\":null},{\"menuId\":29,\"parentId\":1,\"parentName\":null,\"name\":\"系统日志\",\"url\":\"pages/system/syslog.html\",\"perms\":\"sys:log:list\",\"type\":1,\"icon\":\"fa fa-file-text-o\",\"orderNum\":4,\"open\":null,\"list\":null},{\"menuId\":3,\"parentId\":1,\"parentName\":null,\"name\":\"角色管理\",\"url\":\"pages/system/role.html\",\"perms\":null,\"type\":1,\"icon\":\"fa fa-user-secret\",\"orderNum\":100002,\"open\":null,\"list\":null},{\"menuId\":4,\"parentId\":1,\"parentName\":null,\"name\":\"菜单管理\",\"url\":\"pages/system/privilege.html\",\"perms\":null,\"type\":1,\"icon\":\"fa fa-th-list\",\"orderNum\":100003,\"open\":null,\"list\":null}]},{\"menuId\":71,\"parentId\":0,\"parentName\":null,\"name\":\"数据压缩\",\"url\":null,\"perms\":null,\"type\":0,\"icon\":\"dashboard\",\"orderNum\":5,\"open\":null,\"list\":[{\"menuId\":72,\"parentId\":71,\"parentName\":null,\"name\":\"数据批量压缩\",\"url\":\"pages/compress/batch.html\",\"perms\":\"reduce:data:init,reduce:data:reduceData,reduce:data:rate,reduce:data:check\",\"type\":1,\"icon\":null,\"orderNum\":0,\"open\":null,\"list\":null},{\"menuId\":73,\"parentId\":71,\"parentName\":null,\"name\":\"数据压缩记录\",\"url\":\"pages/compress/result.html\",\"perms\":\"reduce:data:list\",\"type\":1,\"icon\":null,\"orderNum\":0,\"open\":null,\"list\":null}]},{\"menuId\":74,\"parentId\":0,\"parentName\":null,\"name\":\"系统配置\",\"url\":null,\"perms\":null,\"type\":0,\"icon\":\"sitemap\",\"orderNum\":6,\"open\":null,\"list\":[{\"menuId\":75,\"parentId\":74,\"parentName\":null,\"name\":\"压缩配置\",\"url\":\"pages/config/compress.html\",\"perms\":\"reduce:config:saveOrUpdate,reduce:config:init\",\"type\":1,\"icon\":null,\"orderNum\":0,\"open\":null,\"list\":null},{\"menuId\":76,\"parentId\":74,\"parentName\":null,\"name\":\"工作线程配置\",\"url\":\"pages/config/works.html\",\"perms\":\"run:config:saveOrUpdate,run:config:init\",\"type\":1,\"icon\":null,\"orderNum\":0,\"open\":null,\"list\":null}]}],\"code\":0,\"permissions\":[\"sys:menu:update\",\"sys:menu:delete\",\"run:config:init\",\"reduce:config:init\",\"run:config:saveOrUpdate\",\"sys:menu:list\",\"sys:menu:perms\",\"sys:user:delete\",\"sys:user:update\",\"sys:role:list\",\"sys:menu:info\",\"sys:menu:select\",\"reduce:data:check\",\"reduce:data:reduceData\",\"sys:role:select\",\"sys:user:list\",\"sys:menu:save\",\"sys:role:save\",\"reduce:data:init\",\"sys:role:info\",\"sys:role:update\",\"sys:user:info\",\"reduce:data:rate\",\"reduce:config:saveOrUpdate\",\"sys:role:delete\",\"sys:user:save\",\"sys:log:list\",\"reduce:data:list\"]}";
	}
	
	@RequestMapping(value = "/nav", method = RequestMethod.GET)
	public R menuNavGet(){
		return menuNavPost();
	}
}
// 