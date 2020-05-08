package com.ilbcj.ecell.service.impl;

import java.util.Map;
import java.util.Optional;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ilbcj.ecell.entity.Admin;
import com.ilbcj.ecell.mapper.AdminMapper;
import com.ilbcj.ecell.service.AdminService;
import com.ilbcj.ecell.util.PageUtils;
import com.ilbcj.ecell.util.Query;

@Service("adminService")
public class AdminServiceImpl extends ServiceImpl<AdminMapper, Admin> implements AdminService{

	@Resource
    private AdminMapper adminMapper;
	
	@Override
	public boolean insertAdmin(Map<String, Object> parm) {
		Admin admin = new Admin();
		String loginId=parm.get("loginId").toString();
		Admin ae = adminMapper.selectOne(new QueryWrapper<Admin>().lambda().eq(Admin::getLoginId, loginId));
		if(ae!=null) {
			return false;
		}
		admin.setLoginId(loginId);
		Optional<String> pwd = Optional.ofNullable( (String)parm.get("pwd") );
		admin.setPwd(pwd.orElse(""));
		Optional<String> name = Optional.ofNullable( (String)parm.get("name") );
		admin.setName(name.orElse(""));
		admin.setStatus(Admin.STATUS_INUSE);
		int ret =  adminMapper.insert(admin);
		if( ret > 0 ) {
			return true;
		}
 		return false;
	}

	@Override
	public PageUtils queryPage(Map<String, Object> params) {
		String loginId = (String) params.get("loginId");
		String name = (String) params.get("name");
		
		Page<Admin> adminIPage = adminMapper.selectPage(new Query<Admin>(params).getPage(),
				Wrappers.<Admin>lambdaQuery().like(Admin::getLoginId, loginId).like(Admin::getName, name));
		return new PageUtils(adminIPage);
	}

	@Override
	public boolean updateAdminStatus(Map<String, Object> params) {
		String loginId=params.get("loginId").toString();
//		Admin admin=adminMapper.queryByLoginId(loginId);
//		admin.setStatus((Integer)params.get("status"));
//		adminMapper.updateById(admin);
		return true;
	}

	@Override
	public Admin detailAdmin(Map<String, Object> params) {
		//return adminMapper.queryByLoginId(params.get("loginId").toString());
		return null;
	}
	
	@Transactional
	@Override
	public boolean updateAdmmin(Map<String, Object> params) {
		String loginId = params.get("loginId").toString();
//		Admin admin=adminMapper.queryByLoginId(loginId);
//		adminMapper.deleteAdmin(loginId);
//		String pwd=params.get("pwd").toString();
//		if("".equals(pwd)) {
//			adminMapper.insert(admin);
//		}else {
//			admin.setPwd(pwd);
//			adminMapper.insert(admin);
//		}
		return true;
	}

	@Override
	public boolean isExistAdmmin(Map<String, Object> params) {
		String loginId=params.get("loginId").toString();
		Admin admin = adminMapper.selectOne(new QueryWrapper<Admin>().lambda().eq(Admin::getLoginId, loginId));
		if(admin == null) {
			return false;
		}
		return true;
	}
	

}
