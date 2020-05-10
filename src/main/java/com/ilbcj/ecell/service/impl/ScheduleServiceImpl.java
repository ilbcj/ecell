package com.ilbcj.ecell.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ilbcj.ecell.entity.Schedule;
import com.ilbcj.ecell.mapper.ScheduleMapper;
import com.ilbcj.ecell.service.ScheduleService;
import com.ilbcj.ecell.util.PageUtils;
import com.ilbcj.ecell.util.Query;

@Service("scheduleService")
public class ScheduleServiceImpl implements ScheduleService {
	
	@Resource
    private ScheduleMapper scheduleMapper;

	@Override
	public PageUtils queryPage(Map<String, Object> params) {
		Integer seasonId = (Integer) params.get("seasonId");
		
		Page<Schedule> scheduleIPage = scheduleMapper.selectPage(new Query<Schedule>(params).getPage(),
				Wrappers.<Schedule>lambdaQuery()
					.eq(Schedule::getSeasonId, seasonId)
				);
		return new PageUtils(scheduleIPage);
	}

	@Override
	public List<Schedule> queryBySeason(Integer seasonId) {
		return scheduleMapper.selectList(
				Wrappers.<Schedule>lambdaQuery()
					.eq(Schedule::getSeasonId, seasonId)
				);
	}
	
	

}
