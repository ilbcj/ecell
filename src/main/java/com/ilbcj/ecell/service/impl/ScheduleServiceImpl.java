package com.ilbcj.ecell.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ilbcj.ecell.dto.ScheduleDTO;
import com.ilbcj.ecell.entity.Schedule;
import com.ilbcj.ecell.entity.Season;
import com.ilbcj.ecell.mapper.MatchDetailMapper;
import com.ilbcj.ecell.mapper.MatchMapper;
import com.ilbcj.ecell.mapper.ScheduleMapper;
import com.ilbcj.ecell.mapper.SeasonMapper;
import com.ilbcj.ecell.service.ScheduleService;
import com.ilbcj.ecell.util.PageUtils;
import com.ilbcj.ecell.util.Query;

@Service("scheduleService")
public class ScheduleServiceImpl implements ScheduleService {
	
	@Resource
    private ScheduleMapper scheduleMapper;
	
	@Resource
    private SeasonMapper seasonMapper;
	
	@Resource 
	private MatchMapper matchMapper;
	
	@Resource MatchDetailMapper matchDetailMapper;

	@Override
	public PageUtils queryPage(Map<String, Object> params) {
		String seasonName = (String) params.get("name");
		
		Map<Integer, Season> seasonMap = new HashMap<Integer, Season>();
		List<Integer> seasonIds = new ArrayList<Integer>();
		seasonMapper.selectList(
			Wrappers.<Season>lambdaQuery()
			.like(Season::getName, seasonName)
		).forEach(x -> {
			seasonMap.put(x.getId(), x);
			seasonIds.add(x.getId());
        });
		
		if( seasonIds.size() == 0 ) {
			seasonIds.add(-1);
		}
		Page<Schedule> scheduleIPage = scheduleMapper.selectPage(new Query<Schedule>(params).getPage(),
				Wrappers.<Schedule>lambdaQuery()
					.in(Schedule::getSeasonId, seasonIds)
				);
		scheduleIPage.getRecords().forEach(x->{
			x.setSeasonName( seasonMap.get( x.getSeasonId() ).getName() );
		});
		return new PageUtils(scheduleIPage);
	}

	@Override
	public List<Schedule> queryBySeason(Integer seasonId) {
		return scheduleMapper.selectList(
				Wrappers.<Schedule>lambdaQuery()
					.eq(Schedule::getSeasonId, seasonId)
				);
	}

	@Override
	public boolean saveMatches(ScheduleDTO params) {
		//check match record
		for(int i = 0; i < params.getSets(); i++) {
			for(int j = 0; j < params.getFormat(); j++) {
				Match match = matchMapper.selectOne(new QueryWrapper<Admin>().lambda().eq(Admin::getLoginId, loginId));
			}
		}
		return false;
	}
	
	

}
