package com.ilbcj.ecell.service;

import java.util.List;

import com.ilbcj.ecell.entity.SysMenu;


public interface SysConfigService {
	/**
	 * 获取所有菜单项
	 * @return List<Menu> 
	 */
	public List<SysMenu> queryAllMenuItems();
}
