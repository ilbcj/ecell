package com.ilbcj.ecell.service.impl;

import java.util.Date;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ilbcj.ecell.entity.Admin;
import com.ilbcj.ecell.mapper.AdminMapper;
import com.ilbcj.ecell.service.LoginService;
import com.ilbcj.ecell.util.R;


@Service("loginService")
public class LoginServiceImpl extends ServiceImpl<AdminMapper, Admin> implements LoginService{

	private static final Logger logger = LoggerFactory.getLogger(ServiceImpl.class); 
	@Autowired
	private AdminMapper adminMapper;
	
	private Long sessionValidityPeriod = 24 * 60 * 60 * 1000L;
	
	
	@Override
	public boolean loginPwd(String adminId, String pwd, String sessionid) {
		
		Admin admin = adminMapper.selectOne(new QueryWrapper<Admin>().lambda().eq(Admin::getLoginId, adminId));
		if(admin != null && admin.getPwd() != null && admin.getPwd().equals(pwd)) {
			admin.setSessionId(sessionid);
			admin.setToken(new Date().getTime());
			adminMapper.updateById(admin);
			return true;
		}
		return false;
	}

	@Override
	public boolean changeAdminPassword(String sessionid, String password, String newPassword) {
		Admin admin = adminMapper.selectOne(new QueryWrapper<Admin>().lambda().eq(Admin::getSessionId, sessionid));
		if(admin == null || !password.equals(admin.getPwd()) ) {
			return false;
		}
		admin.setPwd(newPassword);
		int count = adminMapper.updateById(admin);
		if(count != 1) {
			return false;
		}
		return true;
	}
	
	@Override
	public void logout(String sessionid) {
		Admin admin = adminMapper.selectOne(new QueryWrapper<Admin>().lambda().eq(Admin::getSessionId, sessionid));
		if(admin != null) {
			admin.setToken(0L);
			admin.setSessionId("");
			adminMapper.updateById(admin);
		}
		return;
	}

	@Override
	public boolean checkLoggedStatus(String sessionid) {
		if( sessionid == null || sessionid.isEmpty() ) {
			return false;
		}
		logger.debug("check user logon status, sessionid: " + sessionid);
		Admin admin = adminMapper.selectOne(new QueryWrapper<Admin>().lambda().eq(Admin::getSessionId, sessionid));
		if( admin != null ) {
			if( sessionid.equals(admin.getSessionId()) ) { 
				long token = admin.getToken();
				long now = new Date().getTime();
				long span = now - token;
				if( span < sessionValidityPeriod ) {
					admin.setToken(now);
					adminMapper.updateById(admin);
					return true;
				}else {
					logout(sessionid);
					return false;
				}
			}
		}
		else { 
			logger.debug("no user logged with sessionid: " + sessionid);
		}
		return false;
	}

	@Override
	public boolean isLogined(String sessionId) {
		if( sessionId == null || sessionId.isEmpty() ) {
			return false;
		}
		Admin admin = adminMapper.selectOne(new QueryWrapper<Admin>().lambda().eq(Admin::getSessionId, sessionId));
		if(admin == null) {
			return false; 
		}
		return true;
	}

	@Override
	public boolean isLogout(String adminId) {
		Admin admin = adminMapper.selectOne(new QueryWrapper<Admin>().lambda().eq(Admin::getLoginId, adminId));
		if(admin != null && admin.getStatus() == Admin.STATUS_HANGUP) {
			return true;
		}
		return false;

	}

	@Override
	public String getAdminName(String sessionid) {
		Admin admin = adminMapper.selectOne(new QueryWrapper<Admin>().lambda().eq(Admin::getSessionId, sessionid));
		return admin.getName();
	}

	@Override
	public R CommonLogin(Map<String, Object> parm) {
		String loginId = (String) parm.get("loginId");
		String pwd = (String) parm.get("pwd");
		Admin admin = adminMapper.selectOne(new QueryWrapper<Admin>().lambda().eq(Admin::getLoginId, loginId));
		if(admin != null && admin.getPwd() != null && admin.getPwd().equals(pwd)) {
			return R.ok();
		}
		return R.error("账号为空或者密码错误");
	}
}
