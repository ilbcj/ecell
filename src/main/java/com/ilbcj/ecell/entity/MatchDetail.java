package com.ilbcj.ecell.entity;

import java.io.Serializable;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;



@TableName(value = "tb_match_detail")//指定表名
public class MatchDetail implements Serializable, Comparable<MatchDetail>{
	/**
	 * 
	 */
	private static final long serialVersionUID = -8010435516756141007L;
	
	@TableId(type = IdType.AUTO)
	private Integer id;
	@TableId(value = "match_id")
	private Integer matchId;
	private Integer duration;
	@TableId(value = "player_id")
	private Integer playerId;
	private Integer apm;
	private Integer crystal;
	private Integer oil;
	private Integer resource;
	
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getMatchId() {
		return matchId;
	}

	public void setMatchId(Integer matchId) {
		this.matchId = matchId;
	}

	public Integer getDuration() {
		return duration;
	}

	public void setDuration(Integer duration) {
		this.duration = duration;
	}

	public Integer getPlayerId() {
		return playerId;
	}

	public void setPlayerId(Integer playerId) {
		this.playerId = playerId;
	}

	public Integer getApm() {
		return apm;
	}

	public void setApm(Integer apm) {
		this.apm = apm;
	}

	public Integer getCrystal() {
		return crystal;
	}

	public void setCrystal(Integer crystal) {
		this.crystal = crystal;
	}

	public Integer getOil() {
		return oil;
	}

	public void setOil(Integer oil) {
		this.oil = oil;
	}

	public Integer getResource() {
		return resource;
	}

	public void setResource(Integer resource) {
		this.resource = resource;
	}

	@Override
	public int compareTo(MatchDetail o) {
		if (this.id>o.id) {
			return 1;
		} else if (this.id<o.id) {
			return -1;
		} else {
			return 0;
		}
	}
}
