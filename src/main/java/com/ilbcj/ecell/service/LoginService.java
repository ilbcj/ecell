package com.ilbcj.ecell.service;

import java.util.Map;

import com.baomidou.mybatisplus.extension.service.IService;
import com.ilbcj.ecell.entity.Admin;
import com.ilbcj.ecell.util.R;


/**
 * 登录service
 * @author wxs
 *
 */
public interface LoginService extends IService<Admin>{
	/**
	 * 设备注册
	 * @param adminId 管理员标识
	 * @param pwd 管理员口令
	 * @param sessionid 登录sessionid
	 * @return boolean
	 */
	public boolean loginPwd(String adminId,String pwd, String sessionid);

	/**
	 * 修改管理员产口令
	 * @param adminId	管理员ID
	 * @param password	旧口令
	 * @param newPassword	新口令
	 * @return
	 */
	public boolean changeAdminPassword(String adminId, String password, String newPassword);

	/**
	 * 注销登录状态
	 * @param sessionid 登录sessionid
	 */
	public void logout(String sessionid);

	/**
	 * 检查登录状态
	 * @param sessionid 登录sessionid
	 * @return
	 */
	public boolean checkLoggedStatus(String sessionid);
	/**
	 * 判断当前浏览器是否登录系统
	 * @param sessionid
	 * @return
	 */
	boolean isLogined(String sessionid);
	/**
	 * 判断当前账号是否已注销
	 * @param adminId
	 * @return
	 */
	boolean isLogout(String adminId);
	/**
	 * 获取当前登录管理员的姓名
	 * @param sessionid
	 * @return
	 */
	String getAdminName(String sessionid);

	/**
	 * 远程服务登录
	 * @param parm
	 * @return
	 */
	public R CommonLogin(Map<String, Object> parm);
	
}
