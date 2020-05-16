package com.ilbcj.ecell.controller;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.ilbcj.ecell.entity.Season;
import com.ilbcj.ecell.service.SeasonService;
import com.ilbcj.ecell.util.PageUtils;
import com.ilbcj.ecell.util.R;


@RestController
@RequestMapping("/season")
public class SeasonController {
	
	@Autowired
	private SeasonService seasonService;


	@RequestMapping(value="/regist", method = RequestMethod.POST)
	public R registAdmin(@RequestBody Map<String,Object> parm) {
		boolean result=seasonService.insertSeason(parm);
		
		if(result) {
			return R.ok();
		}
		return R.error("管理员添加失败，请联系系统管理员！");
				
	}
	/**
	 * 赛季列表
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
			PageUtils page = seasonService.queryPage(params);
			@SuppressWarnings("unchecked")
			List<Season>list=(List<Season>) page.getList();
			Collections.sort(list);
			return R.ok().put("draw", page.getDraw()).put("recordsTotal", page.getRecordsTotal())
					.put("recordsFiltered", page.getRecordsFiltered()).put("start", page.getStart())
					.put("length", page.getLength()).put("draw", draw).put("list", list);
		}
	}
	
	@RequestMapping(value="/modfiy", method = RequestMethod.POST)
	public R updateAdmin(@RequestBody Map<String,Object> parm) {
		boolean result=seasonService.updateSeason(parm);
		if(result) {
			return R.ok();
		}
		return R.error("管理员更改失败！");
	}
}
