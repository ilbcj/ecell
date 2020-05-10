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

import com.ilbcj.ecell.entity.Schedule;
import com.ilbcj.ecell.service.ScheduleService;
import com.ilbcj.ecell.util.PageUtils;
import com.ilbcj.ecell.util.R;


@RestController
@RequestMapping("/schedule")
public class ScheduleController {
	
	@Autowired
	private ScheduleService scheduleService;
	
	/**
	 * 赛程列表
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
			PageUtils page = scheduleService.queryPage(params);
			@SuppressWarnings("unchecked")
			List<Schedule>list=(List<Schedule>) page.getList();
			Collections.sort(list);
			return R.ok().put("draw", page.getDraw()).put("recordsTotal", page.getRecordsTotal())
					.put("recordsFiltered", page.getRecordsFiltered()).put("start", page.getStart())
					.put("length", page.getLength()).put("draw", draw).put("list", list);
		}
	}
	
	@RequestMapping(value="/list/season", method = RequestMethod.POST)
	public R updateAdminStatus(@RequestBody Map<String,Object> parm) {
		Integer seasonId = (Integer) parm.get("seasonId");
		List<Schedule> list = scheduleService.queryBySeason(seasonId);
		Collections.sort(list);
		return R.ok().put("list", list);
	}
}
