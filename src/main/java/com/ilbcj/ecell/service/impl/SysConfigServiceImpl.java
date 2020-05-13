package com.ilbcj.ecell.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ilbcj.ecell.entity.Admin;
import com.ilbcj.ecell.entity.SysMenu;
import com.ilbcj.ecell.mapper.AdminMapper;
import com.ilbcj.ecell.mapper.SysConfigMapper;
import com.ilbcj.ecell.service.SysConfigService;

@Service("sysconfService")
public class SysConfigServiceImpl extends ServiceImpl<SysConfigMapper, SysMenu> implements SysConfigService {

	@Autowired
	private SysConfigMapper sysconfMapper;
	
	@Autowired
	private AdminMapper adminMapper;
	
	@Autowired
	private HttpServletRequest httpRequest;
	
	@Override
	public List<SysMenu> queryAllMenuItems() {
		List<SysMenu> all = sysconfMapper.selectList(
				Wrappers.<SysMenu>lambdaQuery()
					.eq(SysMenu::getIsUse, SysMenu.ISUSE_YES)
					.orderByAsc(SysMenu::getParentId).orderByAsc(SysMenu::getOrderNum)
				);
		String session=getJSESSIONID();
		Admin admin = adminMapper.selectOne(new QueryWrapper<Admin>().lambda().eq(Admin::getSessionId, session));
		if( (admin !=null) && (!"admin".equals( admin.getLoginId() )) ) {
			Iterator<SysMenu> iterator = all.iterator();  
			while(iterator.hasNext()){  
			    SysMenu i = iterator.next();  
			    if("管理员管理".equals(i.getName())){  
			        iterator.remove();  
			    }  
			}	
		}
		
		List<SysMenu> menuList = new ArrayList<SysMenu>();
		Map<Integer, SysMenu> menuMap = new HashMap<Integer, SysMenu>();
		for(SysMenu item : all) {
			if(item.getType() == 0) {
				menuList.add(item);
				menuMap.put(item.getMenuId(), item);
			}
		}
		for(SysMenu item : all) {
			if(item.getType() == 1) {
				SysMenu parent = menuMap.get(item.getParentId());
				if(parent != null) {
					List<SysMenu> children = parent.getList();
					if(children == null) {
						children = new ArrayList<SysMenu>();
					}
					children.add(item);
					parent.setList(children);
				}
			}
		}
		return menuList;
	}
	
	private String getJSESSIONID() {
		String jsessionid = "";
		if( httpRequest.isRequestedSessionIdFromURL() ) {		
		}
		else if( httpRequest.isRequestedSessionIdFromCookie() ) {		
			Cookie[] cookies = httpRequest.getCookies();
			for(Cookie cookie : cookies) {
				if(cookie.getName().equals("JSESSIONID")) {
					jsessionid = cookie.getValue();
					break;
				}
			}
		}
		else if( httpRequest.isRequestedSessionIdValid() ) {
		}
		
		return jsessionid;
	}

}
