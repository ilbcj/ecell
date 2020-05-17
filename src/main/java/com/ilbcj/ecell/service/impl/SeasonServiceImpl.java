package com.ilbcj.ecell.service.impl;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
import java.util.Optional;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ilbcj.ecell.entity.Schedule;
import com.ilbcj.ecell.entity.Season;
import com.ilbcj.ecell.mapper.ScheduleMapper;
import com.ilbcj.ecell.mapper.SeasonMapper;
import com.ilbcj.ecell.service.SeasonService;
import com.ilbcj.ecell.util.PageUtils;
import com.ilbcj.ecell.util.Query;

@Service("seasonService")
public class SeasonServiceImpl implements SeasonService {
	
	private Logger logger = LoggerFactory.getLogger(SeasonServiceImpl.class);
	
	@Resource
    private SeasonMapper seasonMapper;
	
	@Resource
    private ScheduleMapper scheduleMapper;

	@Override
	public PageUtils queryPage(Map<String, Object> params) {
		Optional<String> nameO = Optional.ofNullable( (String)params.get("name") );
		String name = nameO.orElse("").isEmpty() ? "" : nameO.get();
		Optional<String> beginO = Optional.ofNullable( (String)params.get("begin") );
		String begin = beginO.orElse("").isEmpty() ? "1900-01-01" : beginO.get();
		Optional<String> endO = Optional.ofNullable( (String)params.get("end") );
		String end = endO.orElse("").isEmpty() ? "3000-12-31" : endO.get();
		
		Page<Season> seasonIPage = seasonMapper.selectPage(new Query<Season>(params).getPage(),
				Wrappers.<Season>lambdaQuery()
					.like(Season::getName, name)
					.between(Season::getStartTime, begin, end)
					.orderByDesc(Season::getId)
				);
		return new PageUtils(seasonIPage);
	}

	@Transactional
	@Override
	public boolean insertSeason(Map<String, Object> parm) {
		Season season = new Season();
		
		Optional<String> name = Optional.ofNullable( (String)parm.get("name") );
		season.setName(name.orElse(""));
		if(season.getName().isEmpty()) {
			logger.info("赛季名称不能为空");
			return false;
		}
		
		Optional<String> startTime = Optional.ofNullable( (String)parm.get("startTime") );
		season.setStartTime(startTime.orElse(""));
		
		if( season.getStartTime().isEmpty() ) {
			season.setStartTime("2020-05-18");
		}
		
		DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Long ts = null;
		try {
			
			Date date = sdf.parse( season.getStartTime() );
			ts = date.getTime();
		} catch (ParseException e) {
			logger.info("保存赛季信息时转换时间数据出错， 时间数据：" + season.getStartTime());
			return false;
		}
		season.setStartTs(ts.toString());
			
		season.setStatus(Season.STATUS_INIT);
		int ret =  seasonMapper.insert(season);
		if( ret == 0 ) {
			return false;
		}
		
		return generateSchedule(season);
	}

	@Transactional
	@Override
	public boolean updateSeason(Map<String, Object> params) {
		Season season = new Season();
		Optional<Integer> id = Optional.ofNullable( (Integer)params.get("id") );
		if(id.orElse(0) == 0) {
			logger.info("赛季更新时id数据不能为空" + season.toString());
			return false;
		}
		season.setId( id.get() );
		
		Optional<String> name = Optional.ofNullable( (String)params.get("name") );
		season.setName(name.orElse(null));
		
		Optional<String> startTime = Optional.ofNullable( (String)params.get("startTime") );
		season.setStartTime(startTime.orElse(null));
		
		if( season != null && !season.getStartTime().isEmpty() ) {
			DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Long ts = null;
			try {
				
				Date date = sdf.parse( season.getStartTime() );
				ts = date.getTime();
			} catch (ParseException e) {
				logger.info("保存赛季信息时转换时间数据出错， 时间数据：" + season.getStartTime());
				return false;
			}
			season.setStartTs(ts.toString());
		}
		
		Optional<String> status = Optional.ofNullable( (String)params.get("status") );
		season.setStatus( Integer.parseInt( status.orElse( Season.STATUS_INIT.toString() ) ) );
		
		int ret = seasonMapper.update(
				season,
                Wrappers.<Season>lambdaUpdate().eq(Season::getId, season.getId())
        );
		if( ret == 0 ) {
			logger.info("没有匹配的记录被修改");
			return false;
		}
		return true;
	}
	
	private boolean generateSchedule(Season season) {
		int ret = 0;
		Schedule schedule = null;
		// generate 4 bo3, 4 bo7, 2bo7, 1bo9, 1bo9
		schedule = new Schedule();
		schedule.setSeasonId(season.getId());
		schedule.setRound(Schedule.ROUND_R_1);
		schedule.setSets(4);
		schedule.setFormat(Schedule.FORMAT_BO3);
		schedule.setType(Schedule.TYPE_REGULAR);
		schedule.setStatus(Schedule.STATUS_INIT);
		ret = scheduleMapper.insert(schedule);
		if( ret == 0 ) {
			return false;
		}
		
		schedule = new Schedule();
		schedule.setSeasonId(season.getId());
		schedule.setRound(Schedule.ROUND_R_2);
		schedule.setSets(4);
		schedule.setFormat(Schedule.FORMAT_BO3);
		schedule.setType(Schedule.TYPE_REGULAR);
		schedule.setStatus(Schedule.STATUS_INIT);
		ret = scheduleMapper.insert(schedule);
		if( ret == 0 ) {
			return false;
		}
		
		schedule = new Schedule();
		schedule.setSeasonId(season.getId());
		schedule.setRound(Schedule.ROUND_R_3);
		schedule.setSets(4);
		schedule.setFormat(Schedule.FORMAT_BO3);
		schedule.setType(Schedule.TYPE_REGULAR);
		schedule.setStatus(Schedule.STATUS_INIT);
		ret = scheduleMapper.insert(schedule);
		if( ret == 0 ) {
			return false;
		}
		
		schedule = new Schedule();
		schedule.setSeasonId(season.getId());
		schedule.setRound(Schedule.ROUND_R_4);
		schedule.setSets(4);
		schedule.setFormat(Schedule.FORMAT_BO3);
		schedule.setType(Schedule.TYPE_REGULAR);
		schedule.setStatus(Schedule.STATUS_INIT);
		ret = scheduleMapper.insert(schedule);
		if( ret == 0 ) {
			return false;
		}
		
		schedule = new Schedule();
		schedule.setSeasonId(season.getId());
		schedule.setRound(Schedule.ROUND_R_5);
		schedule.setSets(1);
		schedule.setFormat(Schedule.FORMAT_BO7);
		schedule.setType(Schedule.TYPE_REGULAR);
		schedule.setStatus(Schedule.STATUS_INIT);
		ret = scheduleMapper.insert(schedule);
		if( ret == 0 ) {
			return false;
		}
		
		schedule = new Schedule();
		schedule.setSeasonId(season.getId());
		schedule.setRound(Schedule.ROUND_R_6);
		schedule.setSets(1);
		schedule.setFormat(Schedule.FORMAT_BO7);
		schedule.setType(Schedule.TYPE_REGULAR);
		schedule.setStatus(Schedule.STATUS_INIT);
		ret = scheduleMapper.insert(schedule);
		if( ret == 0 ) {
			return false;
		}
		
		schedule = new Schedule();
		schedule.setSeasonId(season.getId());
		schedule.setRound(Schedule.ROUND_R_7);
		schedule.setSets(1);
		schedule.setFormat(Schedule.FORMAT_BO7);
		schedule.setType(Schedule.TYPE_REGULAR);
		schedule.setStatus(Schedule.STATUS_INIT);
		ret = scheduleMapper.insert(schedule);
		if( ret == 0 ) {
			return false;
		}
		
		schedule = new Schedule();
		schedule.setSeasonId(season.getId());
		schedule.setRound(Schedule.ROUND_R_8);
		schedule.setSets(1);
		schedule.setFormat(Schedule.FORMAT_BO7);
		schedule.setType(Schedule.TYPE_REGULAR);
		schedule.setStatus(Schedule.STATUS_INIT);
		ret = scheduleMapper.insert(schedule);
		if( ret == 0 ) {
			return false;
		}
		
		schedule = new Schedule();
		schedule.setSeasonId(season.getId());
		schedule.setRound(Schedule.ROUND_R_9);
		schedule.setSets(1);
		schedule.setFormat(Schedule.FORMAT_BO7);
		schedule.setType(Schedule.TYPE_REGULAR);
		schedule.setStatus(Schedule.STATUS_INIT);
		ret = scheduleMapper.insert(schedule);
		if( ret == 0 ) {
			return false;
		}
		
		schedule = new Schedule();
		schedule.setSeasonId(season.getId());
		schedule.setRound(Schedule.ROUND_R_10);
		schedule.setSets(1);
		schedule.setFormat(Schedule.FORMAT_BO7);
		schedule.setType(Schedule.TYPE_REGULAR);
		schedule.setStatus(Schedule.STATUS_INIT);
		ret = scheduleMapper.insert(schedule);
		if( ret == 0 ) {
			return false;
		}
		
		schedule = new Schedule();
		schedule.setSeasonId(season.getId());
		schedule.setRound(Schedule.ROUND_R_11);
		schedule.setSets(1);
		schedule.setFormat(Schedule.FORMAT_BO9);
		schedule.setType(Schedule.TYPE_REGULAR);
		schedule.setStatus(Schedule.STATUS_INIT);
		ret = scheduleMapper.insert(schedule);
		if( ret == 0 ) {
			return false;
		}
		
		schedule = new Schedule();
		schedule.setSeasonId(season.getId());
		schedule.setRound(Schedule.ROUND_R_12);
		schedule.setSets(1);
		schedule.setFormat(Schedule.FORMAT_BO9);
		schedule.setType(Schedule.TYPE_REGULAR);
		schedule.setStatus(Schedule.STATUS_INIT);
		ret = scheduleMapper.insert(schedule);
		if( ret == 0 ) {
			return false;
		}
		
		// generate 4 bo3, 4 bo7, 2bo7, 1bo9, 1bo9
		schedule = new Schedule();
		schedule.setSeasonId(season.getId());
		schedule.setRound(Schedule.ROUND_P_1);
		schedule.setSets(4);
		schedule.setFormat(Schedule.FORMAT_BO3);
		schedule.setType(Schedule.TYPE_PLAYOFF);
		schedule.setStatus(Schedule.STATUS_INIT);
		ret = scheduleMapper.insert(schedule);
		if( ret == 0 ) {
			return false;
		}
		
		schedule = new Schedule();
		schedule.setSeasonId(season.getId());
		schedule.setRound(Schedule.ROUND_P_2);
		schedule.setSets(4);
		schedule.setFormat(Schedule.FORMAT_BO3);
		schedule.setType(Schedule.TYPE_PLAYOFF);
		schedule.setStatus(Schedule.STATUS_INIT);
		ret = scheduleMapper.insert(schedule);
		if( ret == 0 ) {
			return false;
		}
		
		schedule = new Schedule();
		schedule.setSeasonId(season.getId());
		schedule.setRound(Schedule.ROUND_P_3);
		schedule.setSets(4);
		schedule.setFormat(Schedule.FORMAT_BO3);
		schedule.setType(Schedule.TYPE_PLAYOFF);
		schedule.setStatus(Schedule.STATUS_INIT);
		ret = scheduleMapper.insert(schedule);
		if( ret == 0 ) {
			return false;
		}
		
		schedule = new Schedule();
		schedule.setSeasonId(season.getId());
		schedule.setRound(Schedule.ROUND_P_4);
		schedule.setSets(4);
		schedule.setFormat(Schedule.FORMAT_BO3);
		schedule.setType(Schedule.TYPE_PLAYOFF);
		schedule.setStatus(Schedule.STATUS_INIT);
		ret = scheduleMapper.insert(schedule);
		if( ret == 0 ) {
			return false;
		}
		
		schedule = new Schedule();
		schedule.setSeasonId(season.getId());
		schedule.setRound(Schedule.ROUND_P_5);
		schedule.setSets(1);
		schedule.setFormat(Schedule.FORMAT_BO7);
		schedule.setType(Schedule.TYPE_PLAYOFF);
		schedule.setStatus(Schedule.STATUS_INIT);
		ret = scheduleMapper.insert(schedule);
		if( ret == 0 ) {
			return false;
		}
		
		schedule = new Schedule();
		schedule.setSeasonId(season.getId());
		schedule.setRound(Schedule.ROUND_P_6);
		schedule.setSets(1);
		schedule.setFormat(Schedule.FORMAT_BO7);
		schedule.setType(Schedule.TYPE_PLAYOFF);
		schedule.setStatus(Schedule.STATUS_INIT);
		ret = scheduleMapper.insert(schedule);
		if( ret == 0 ) {
			return false;
		}
		
		schedule = new Schedule();
		schedule.setSeasonId(season.getId());
		schedule.setRound(Schedule.ROUND_P_7);
		schedule.setSets(1);
		schedule.setFormat(Schedule.FORMAT_BO7);
		schedule.setType(Schedule.TYPE_PLAYOFF);
		schedule.setStatus(Schedule.STATUS_INIT);
		ret = scheduleMapper.insert(schedule);
		if( ret == 0 ) {
			return false;
		}
		
		schedule = new Schedule();
		schedule.setSeasonId(season.getId());
		schedule.setRound(Schedule.ROUND_P_8);
		schedule.setSets(1);
		schedule.setFormat(Schedule.FORMAT_BO7);
		schedule.setType(Schedule.TYPE_PLAYOFF);
		schedule.setStatus(Schedule.STATUS_INIT);
		ret = scheduleMapper.insert(schedule);
		if( ret == 0 ) {
			return false;
		}
		
		schedule = new Schedule();
		schedule.setSeasonId(season.getId());
		schedule.setRound(Schedule.ROUND_P_9);
		schedule.setSets(1);
		schedule.setFormat(Schedule.FORMAT_BO7);
		schedule.setType(Schedule.TYPE_PLAYOFF);
		schedule.setStatus(Schedule.STATUS_INIT);
		ret = scheduleMapper.insert(schedule);
		if( ret == 0 ) {
			return false;
		}
		
		schedule = new Schedule();
		schedule.setSeasonId(season.getId());
		schedule.setRound(Schedule.ROUND_P_10);
		schedule.setSets(1);
		schedule.setFormat(Schedule.FORMAT_BO7);
		schedule.setType(Schedule.TYPE_PLAYOFF);
		schedule.setStatus(Schedule.STATUS_INIT);
		ret = scheduleMapper.insert(schedule);
		if( ret == 0 ) {
			return false;
		}
		
		schedule = new Schedule();
		schedule.setSeasonId(season.getId());
		schedule.setRound(Schedule.ROUND_P_11);
		schedule.setSets(1);
		schedule.setFormat(Schedule.FORMAT_BO9);
		schedule.setType(Schedule.TYPE_PLAYOFF);
		schedule.setStatus(Schedule.STATUS_INIT);
		ret = scheduleMapper.insert(schedule);
		if( ret == 0 ) {
			return false;
		}
		
		schedule = new Schedule();
		schedule.setSeasonId(season.getId());
		schedule.setRound(Schedule.ROUND_P_12);
		schedule.setSets(1);
		schedule.setFormat(Schedule.FORMAT_BO9);
		schedule.setType(Schedule.TYPE_PLAYOFF);
		schedule.setStatus(Schedule.STATUS_INIT);
		ret = scheduleMapper.insert(schedule);
		if( ret == 0 ) {
			return false;
		}
		return true;
	}

	@Override
	public Season detail(Map<String, Object> parm) {
		Integer seasonId = (Integer)parm.get("id");
		Season se = seasonMapper.selectById(seasonId);
		return se;
	}

}
