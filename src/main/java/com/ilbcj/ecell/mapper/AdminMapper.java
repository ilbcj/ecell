package com.ilbcj.ecell.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ilbcj.ecell.entity.Admin;

@Mapper
public interface AdminMapper extends BaseMapper<Admin>{
	/**
	 * 根据管理员标识查询管理员
	 */
	Admin queryByLoginId(@Param("arg0")String loginId);
	
	Integer deleteAdmin(@Param("loginId")String loginId);
}
