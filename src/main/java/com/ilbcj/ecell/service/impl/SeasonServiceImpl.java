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
import com.ilbcj.ecell.entity.Season;
import com.ilbcj.ecell.mapper.SeasonMapper;
import com.ilbcj.ecell.service.SeasonService;
import com.ilbcj.ecell.util.PageUtils;
import com.ilbcj.ecell.util.Query;

@Service("seasonService")
public class SeasonServiceImpl implements SeasonService {
	
	private Logger logger = LoggerFactory.getLogger(SeasonServiceImpl.class);
	
	@Resource
    private SeasonMapper seasonMapper;

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
		
		if( !season.getStartTime().isEmpty() ) {
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
		
		season.setStatus(Season.STATUS_INIT);
		int ret =  seasonMapper.insert(season);
		if( ret > 0 ) {
			return true;
		}
 		return false;
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

}
