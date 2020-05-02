package com.ilbcj.ecell.controller;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.ilbcj.ecell.entity.Admin;
import com.ilbcj.ecell.service.AdminService;
import com.ilbcj.ecell.util.PageUtils;
import com.ilbcj.ecell.util.R;


@RestController
@RequestMapping("/admin")
public class AdminController {
	
	@Autowired
	private AdminService adminService;
	/**
	 * 
	 * @param parm
	 * @return
	 */
	@RequestMapping(value="/regist", method = RequestMethod.POST)
	public R registAdmin(@RequestBody Map<String,Object> parm) {
		boolean isExistAdmmin=adminService.isExistAdmmin(parm);
		if(isExistAdmmin) {
			return R.error("管理员注册失败，该账号已经存在！");
		}
		boolean result=adminService.insertAdmin(parm);
		
		if(result) {
			return R.ok();
		}
		return R.error("管理员添加失败，请联系系统管理员！");
				
	}
	@RequestMapping(value="/updateStatus", method = RequestMethod.POST)
	public R updateAdminStatus(@RequestBody Map<String,Object> parm) {
		boolean result=adminService.updateAdminStatus(parm);
		if(result) {
			return R.ok();
		}
		return R.error("管理员状态更改失败！");
				
	}
	@RequestMapping(value="/detail", method = RequestMethod.POST)
	public R adminDetail(@RequestBody Map<String,Object> parm) {
		Admin admin=adminService.detailAdmin(parm);
		if(admin!=null) {
			return R.ok().put("admin", admin);
		}
		return R.error("管理员信息加载失败！");
	}
	@RequestMapping(value="/modfiyAdmin", method = RequestMethod.POST)
	public R updateAdmin(@RequestBody Map<String,Object> parm) {
		boolean result=adminService.updateAdmmin(parm);
		if(result) {
			return R.ok();
		}
		return R.error("管理员更改失败！");
	}
	/**
	 * 管理员列表
	 */
	@RequestMapping(value="/list", method = RequestMethod.POST)
	@ResponseBody
	public R list(@RequestParam Map<String, Object> params) {
		if (params.isEmpty()) {
			return R.error("分页参数为空");
		} else {
			Integer draw = 0;
			String drawValue = "draw";
			if (params.get(drawValue) != null) {
				draw = Integer.parseInt((String) params.get("draw")) + 1;
			}
			PageUtils page = adminService.queryPage(params);
			@SuppressWarnings("unchecked")
			List<Admin>list=(List<Admin>) page.getList();
			Collections.sort(list);
			return R.ok().put("draw", page.getDraw()).put("recordsTotal", page.getRecordsTotal())
					.put("recordsFiltered", page.getRecordsFiltered()).put("start", page.getStart())
					.put("length", page.getLength()).put("draw", draw).put("list", list);
		}
	}
}
