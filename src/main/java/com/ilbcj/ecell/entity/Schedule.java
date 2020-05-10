package com.ilbcj.ecell.entity;

import java.io.Serializable;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;



@TableName(value = "tb_schedule")//指定表名
public class Schedule implements Serializable, Comparable<Schedule>{
	/**
	 * 
	 */
	private static final long serialVersionUID = 4538558683983957833L;
	
	public static final int TYPE_TRIALS = 0;
	public static final int TYPE_REGULAR = 1;
	public static final int TYPE_PLAYOFF  = 2;
	
	public static final int STATUS_INIT = 0;
	public static final int STATUS_ACTIVE = 1;
	public static final int STATUS_ARCHIVE = 2;
	
	@TableId(type = IdType.AUTO)
	private Integer id;
	@TableId(value = "season_id")
	private Integer seasonId;
	private String round;
	private Integer sets;
	@TableId(value = "race_day")
	private String raceDay;
	private Integer type;
	private Integer status;
	
    public Integer getSeasonId() {
		return seasonId;
	}

	public void setSeasonId(Integer seasonId) {
		this.seasonId = seasonId;
	}

	public Integer getSets() {
		return sets;
	}

	public void setSets(Integer sets) {
		this.sets = sets;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getRound() {
		return round;
	}

	public void setRound(String round) {
		this.round = round;
	}

	public String getRaceDay() {
		return raceDay;
	}

	public void setRaceDay(String raceDay) {
		this.raceDay = raceDay;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	@Override
	public int compareTo(Schedule o) {
		if (this.id>o.id) {
			return 1;
		} else if (this.id<o.id) {
			return -1;
		} else {
			return 0;
		}
	}
}
