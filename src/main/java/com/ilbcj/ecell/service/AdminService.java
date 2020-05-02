package com.ilbcj.ecell.service;
import java.util.Map;

import com.ilbcj.ecell.entity.Admin;
import com.ilbcj.ecell.util.PageUtils;


public interface AdminService {
	/**
	 * 新增管理员
	 * @param parm 
	 * @return 是否新增成功
	 */
	boolean insertAdmin(Map<String,Object> parm);
	/**
	 * 管理员列表分页
	 * @param params
	 * @return
	 */
	PageUtils queryPage(Map<String, Object> params);
	/**
	 * 更新管理员状态
	 * @param params
	 * @return
	 */
	boolean updateAdminStatus(Map<String, Object> params);
	/**
	 * 管理员详细信息
	 * @param params
	 * @return
	 */
	Admin detailAdmin(Map<String, Object> params);
	/**
	 * 修改管理员信息
	 * @param params
	 * @return
	 */
	boolean updateAdmmin(Map<String, Object> params);
	/**
	 * 判断该系统是否存在某个管理员账号
	 * @param params
	 * @return
	 */
	boolean isExistAdmmin(Map<String, Object> params);
}