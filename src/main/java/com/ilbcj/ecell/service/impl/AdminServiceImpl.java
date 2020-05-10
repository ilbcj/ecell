package com.ilbcj.ecell.service.impl;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
		Map<String, Object> upStatus = new HashMap<String, Object>();
		upStatus.put("loginId", params.get("loginId"));
		upStatus.put("status", params.get("status"));
		updateAdmmin(upStatus);
		return true;
	}

	@Override
	public Admin detailAdmin(Map<String, Object> params) {
		String loginId = params.get("loginId").toString();
		return adminMapper.selectOne(new QueryWrapper<Admin>().lambda().eq(Admin::getLoginId, loginId));
	}
	
	@Transactional
	@Override
	public boolean updateAdmmin(Map<String, Object> params) {
		String loginId = params.get("loginId").toString();
		
		Admin admin = new Admin();
		Optional<String> pwd = Optional.ofNullable( (String)params.get("pwd") );
		admin.setPwd(pwd.orElse(null));
		Optional<String> name = Optional.ofNullable( (String)params.get("name") );
		admin.setName(name.orElse(null));
		Optional<Integer> status = Optional.ofNullable( (Integer)params.get("status") );
		admin.setStatus(status.orElse(null));
		adminMapper.update(
				admin,
                Wrappers.<Admin>lambdaUpdate().eq(Admin::getLoginId, loginId)
        );
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
