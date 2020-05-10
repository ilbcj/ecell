package com.ilbcj.ecell.service.impl;

import java.util.Map;

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
		//String name = (String) params.get("name");
		
		Page<Season> seasonIPage = seasonMapper.selectPage(new Query<Season>(params).getPage(),
				Wrappers.<Season>lambdaQuery()
					//.like(Season::getName, name)
				);
		return new PageUtils(seasonIPage);
	}

}
