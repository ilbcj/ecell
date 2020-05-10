package com.ilbcj.ecell.service;

import java.util.List;
import java.util.Map;

import com.ilbcj.ecell.entity.Schedule;
import com.ilbcj.ecell.util.PageUtils;

public interface ScheduleService {
	/**
	 * 赛程列表分页
	 * @param params
	 * @return
	 */
	PageUtils queryPage(Map<String, Object> params);
	
	List<Schedule> queryBySeason(Integer seasonId);
}
