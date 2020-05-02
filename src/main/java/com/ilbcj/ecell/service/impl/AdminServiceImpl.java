package com.ilbcj.ecell.service.impl;

import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;

@Service("adminService")
public class AdminServiceImpl extends ServiceImpl<AdminDao, AdminEntity> implements AdminService{

	@Autowired
	private AdminDao adminDao;
	
	@Override
	public boolean insertAdmin(Map<String, Object> parm) {
		AdminEntity admin = new AdminEntity();
		String adminId=parm.get("adminId").toString();
		AdminEntity ae=adminDao.queryByAdminId(adminId);
		if(ae!=null) {
			return false;
		}
		admin.setAdminId(adminId);
		admin.setName(parm.get("name").toString());
		admin.setPwd(parm.get("pwd").toString());
		admin.setSessionid("");
		admin.setToken(0L);
		admin.setType(1);
		admin.setStatus(1);
		return this.insert(admin);
	}

	@Override
	public PageUtils queryPage(Map<String, Object> params) {
		String adminId = (String) params.get("adminId");
		String name = (String) params.get("name");
		Page<AdminEntity> page = this.selectPage(new Query<AdminEntity>(params).getPage(),
				new EntityWrapper<AdminEntity>().like(StringUtils.isNotEmpty(adminId), "ADMINID", adminId)
						.like(StringUtils.isNotEmpty(name), "NAME", name));
		return new PageUtils(page);
	}

	@Override
	public boolean updateAdminStatus(Map<String, Object> params) {
		String adminId=params.get("adminId").toString();
		AdminEntity admin=adminDao.queryByAdminId(adminId);
		admin.setStatus((Integer)params.get("status"));
		adminDao.updateById(admin);
		return true;
	}

	@Override
	public AdminEntity detailAdmin(Map<String, Object> params) {
		return adminDao.queryByAdminId(params.get("adminId").toString());
	}
	@Transactional
	@Override
	public boolean updateAdmmin(Map<String, Object> params) {
		String adminId=params.get("adminId").toString();
		AdminEntity admin=adminDao.queryByAdminId(adminId);
		adminDao.deleteAdmin(adminId);
		admin.setName(params.get("name").toString());
		String pwd=params.get("pwd").toString();
		if("".equals(pwd)) {
			adminDao.insert(admin);
		}else {
			admin.setPwd(pwd);
			adminDao.insert(admin);
		}
		return true;
	}

	@Override
	public boolean isExistAdmmin(Map<String, Object> params) {
		AdminEntity admin=adminDao.queryByAdminId(params.get("adminId").toString());
		if(admin==null) {
			return false;
		}
		return true;
	}
	

}
