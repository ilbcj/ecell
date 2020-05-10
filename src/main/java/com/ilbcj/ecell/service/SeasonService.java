package com.ilbcj.ecell.service;

import java.util.Map;

import com.ilbcj.ecell.util.PageUtils;

public interface SeasonService {
	/**
	 * 管理员列表分页
	 * @param params
	 * @return
	 */
	PageUtils queryPage(Map<String, Object> params);
}
