package com.ilbcj.ecell.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ilbcj.ecell.dto.PubDaymatchDTO;
import com.ilbcj.ecell.dto.PubGameDTO;
import com.ilbcj.ecell.dto.PubMatchCalendarDTO;
import com.ilbcj.ecell.dto.PubPlayerProfileDTO;
import com.ilbcj.ecell.dto.PubPlayerTop10;
import com.ilbcj.ecell.dto.PubScheduleMatchesDTO;
import com.ilbcj.ecell.service.PublicService;
import com.ilbcj.ecell.util.R;

@RestController
@RequestMapping("/public")
public class PublicController {

	@Autowired
	private PublicService publicService;
	
	@RequestMapping(value="/profile", method = RequestMethod.POST)
	public R queryPlayProfile(@RequestBody Map<String,Object> parm) {
		
		List<PubPlayerProfileDTO> profile = publicService.queryPlayerProfileById(parm);
		
		if(profile != null) {
			return R.ok().put("players", profile);
		}
		return R.error("查询选手数据失败，请稍后再试！");
				
	}
	
	@RequestMapping(value="/top10", method = RequestMethod.POST)
	public R queryPlayerTop10(@RequestBody Map<String,Object> parm) {
		
		Integer type = (Integer)parm.get("type");
		if(type == null) {
			return R.error("查询Top10数据失败，没有指定要查询的指标");
		}
		
		String sort = (String)parm.get("sort");
		if(sort == null) {
			sort = PubPlayerTop10.SORT_ASC;
		}
		
		List<PubPlayerTop10> players = publicService.queryPlayerTop10(type, sort);
		if(players != null) {
			return R.ok().put("top10Players", players);
		}
		
		return R.error("查询Top10选手数据失败，请稍后再试！");
	}
	
	@RequestMapping(value="/schedule/matches", method = RequestMethod.POST)
	public R queryScheduleMatches(@RequestBody Map<String,Object> parm) {
		
		String date = (String)parm.get("date");
		if(date == null) {
			return R.error("查询比赛日数据失败，没有指定要查询的日期");
		}
		
		List<PubScheduleMatchesDTO> scheduleMatches = publicService.queryScheduleMatches(date);
		
		if(scheduleMatches != null) {
			return R.ok().put("scheduleMatches", scheduleMatches);
		}
		
		return R.error("查询比赛日数据失败，请稍后再试！");
	}
	
	@RequestMapping(value="/schedule/match/set", method = RequestMethod.POST)
	public R queryScheduleMatchSet(@RequestBody Map<String,Object> parm) {
		
		Integer scheduleId = (Integer)parm.get("scheduleId");
		Integer setId = (Integer)parm.get("setId");
		if(scheduleId == null || setId == null) {
			return R.error("查询比赛日对战数据失败，没有指定要查询的日期");
		}
		
		List<PubGameDTO> scheduleMatchSet = publicService.queryScheduleMatchSet(scheduleId, setId);
		
		if(scheduleMatchSet != null) {
			return R.ok().put("scheduleMatchSet", scheduleMatchSet);
		}
		
		return R.error("查询比赛日对战数据失败，请稍后再试！");
	}
	
	@Deprecated
	@RequestMapping(value="/calendar", method = RequestMethod.POST)
	public R queryCalendar(@RequestBody Map<String,Object> parm) {
		
		String month = (String)parm.get("month");
		if(month == null) {
			return R.error("查询赛程日历数据失败，没有指定要查询的月份");
		}
		
		PubMatchCalendarDTO calendar = publicService.queryMatchCalendar(month);
		
		if(calendar != null) {
			return R.ok().put("calendar", calendar);
		}
		
		return R.error("查询赛程日历数据失败，请稍后再试！");
	}
	
	@Deprecated
	@RequestMapping(value="/daymatch", method = RequestMethod.POST)
	public R queryDaymatch(@RequestBody Map<String,Object> parm) {
		
		String day = (String)parm.get("day");
		if(day == null) {
			return R.error("查询比赛日据失败，没有指定要查询的日期");
		}
		
		List<PubDaymatchDTO> daymatches = publicService.queryDaymatch(day);
		
		if(daymatches != null) {
			return R.ok().put("daymatches", daymatches);
		}
		
		return R.error("查询比赛日据失败，请稍后再试！");
	}
	
	@Deprecated
	@RequestMapping(value="/Regular16", method = RequestMethod.POST)
	public R queryRegularTop16(@RequestBody Map<String,Object> parm) {
		
		String day = (String)parm.get("day");
		if(day == null) {
			return R.error("查询比赛日据失败，没有指定要查询的日期");
		}
		
		List<PubDaymatchDTO> daymatches = publicService.queryDaymatch(day);
		
		if(daymatches != null) {
			return R.ok().put("daymatches", daymatches);
		}
		
		return R.error("查询比赛日据失败，请稍后再试！");
	}
	
}
