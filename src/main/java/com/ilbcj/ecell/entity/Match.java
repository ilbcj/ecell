package com.ilbcj.ecell.entity;

import java.io.Serializable;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;



@TableName(value = "tb_match")//指定表名
public class Match implements Serializable, Comparable<Match>{
	/**
	 * 
	 */
	private static final long serialVersionUID = -7115220907651538930L;

	public static final int WINNER_INIT = 0;
	public static final int WINNER_A = 1;
	public static final int WINNER_B = 2;
	
	@TableId(type = IdType.AUTO)
	private Integer id;
	@TableId(value = "season_id")
	private Integer seasonId;
	@TableId(value = "schedule_id")
	private Integer scheduleId;
	@TableId(value = "set_id")
	private Integer setId;
	@TableId(value = "map_id")
	private Integer mapId;
	@TableId(value = "pa_id")
	private Integer paId;
	@TableId(value = "pb_id")
	private Integer pbId;
	@TableId(value = "pa_race")
	private String paRace;
	@TableId(value = "pb_race")
	private String pbRace;
	private String duration;
	private Integer winner;
	
	public Integer getMapId() {
		return mapId;
	}

	public void setMapId(Integer mapId) {
		this.mapId = mapId;
	}

	public String getDuration() {
		return duration;
	}

	public void setDuration(String duration) {
		this.duration = duration;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getSeasonId() {
		return seasonId;
	}

	public void setSeasonId(Integer seasonId) {
		this.seasonId = seasonId;
	}

	public Integer getScheduleId() {
		return scheduleId;
	}

	public void setScheduleId(Integer scheduleId) {
		this.scheduleId = scheduleId;
	}

	public Integer getSetId() {
		return setId;
	}

	public void setSetId(Integer setId) {
		this.setId = setId;
	}

	public Integer getPaId() {
		return paId;
	}

	public void setPaId(Integer paId) {
		this.paId = paId;
	}

	public Integer getPbId() {
		return pbId;
	}

	public void setPbId(Integer pbId) {
		this.pbId = pbId;
	}

	public String getPaRace() {
		return paRace;
	}

	public void setPaRace(String paRace) {
		this.paRace = paRace;
	}

	public String getPbRace() {
		return pbRace;
	}

	public void setPbRace(String pbRace) {
		this.pbRace = pbRace;
	}

	public Integer getWinner() {
		return winner;
	}

	public void setWinner(Integer winner) {
		this.winner = winner;
	}

	@Override
	public int compareTo(Match o) {
		if (this.id>o.id) {
			return 1;
		} else if (this.id<o.id) {
			return -1;
		} else {
			return 0;
		}
	}
}
