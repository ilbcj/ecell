package com.ilbcj.ecell.service.impl;

import java.util.Map;
import java.util.Optional;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ilbcj.ecell.entity.Season;
import com.ilbcj.ecell.mapper.SeasonMapper;
import com.ilbcj.ecell.service.SeasonService;
import com.ilbcj.ecell.util.PageUtils;
import com.ilbcj.ecell.util.Query;

@Service("seasonService")
public class SeasonServiceImpl implements SeasonService {
	
	@Resource
    private SeasonMapper seasonMapper;

	@Override
	public PageUtils queryPage(Map<String, Object> params) {
		Optional<String> nameO = Optional.ofNullable( (String)params.get("name") );
		String name = nameO.orElse("").isEmpty() ? null : nameO.get();
		Optional<String> beginO = Optional.ofNullable( (String)params.get("begin") );
		String begin = beginO.orElse("").isEmpty() ? null : beginO.get();
		Optional<String> endO = Optional.ofNullable( (String)params.get("end") );
		String end = endO.orElse("").isEmpty() ? null : endO.get();
		
		Page<Season> seasonIPage = seasonMapper.selectPage(new Query<Season>(params).getPage(),
				Wrappers.<Season>lambdaQuery()
					.like(Season::getName, name)
					.ge(Season::getStartTime, begin)
					.le(Season::getStartTime, end)
					.orderByDesc(Season::getId)
				);
		return new PageUtils(seasonIPage);
	}

}
