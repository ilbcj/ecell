package com.ilbcj.ecell.entity;

import java.io.Serializable;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;



@TableName(value = "tb_season")//指定表名
public class Season implements Serializable, Comparable<Season>{
	/**
	 * 
	 */
	private static final long serialVersionUID = 309581702729210312L;
	
	public static final int STATUS_INIT = 0;
	public static final int STATUS_ACTIVE = 1;
	public static final int STATUS_ARCHIVE = 2;
	
	@TableId(type = IdType.AUTO)
	private Integer id;
	private String name;
	@TableId(value = "start_ts")
	private String startTs;
	@TableId(value = "start_time")
	private String startTime;
	private Integer status;
	
	public String getStartTs() {
		return startTs;
	}

	public void setStartTs(String startTs) {
		this.startTs = startTs;
	}

	public String getStartTime() {
		return startTime;
	}

	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}

    public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	@Override
	public int compareTo(Season o) {
		if (this.id>o.id) {
			return 1;
		} else if (this.id<o.id) {
			return -1;
		} else {
			return 0;
		}
	}
}
