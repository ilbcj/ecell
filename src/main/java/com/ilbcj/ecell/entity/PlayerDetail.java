package com.ilbcj.ecell.entity;

import java.io.Serializable;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;



@TableName(value = "tb_player_detail")//指定表名
public class PlayerDetail implements Serializable, Comparable<PlayerDetail>{
	/**
	 * 
	 */
	private static final long serialVersionUID = -1839230411791740179L;
	
	@TableId(type = IdType.AUTO)
	private Integer id;
	@TableId(value = "player_id")
	private Integer playerId;
	@TableId(value = "all_apm")
	private Integer allApm;
	@TableId(value = "all_sets")
	private Integer allSets;
	@TableId(value = "all_resource")
	private Integer allResource;
	@TableId(value = "all_crystal")
	private Integer allCrystal;
	@TableId(value = "all_oil")
	private Integer allOil;
	@TableId(value = "all_duration")
	private Integer allDuration;
	
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getPlayerId() {
		return playerId;
	}

	public void setPlayerId(Integer playerId) {
		this.playerId = playerId;
	}

	public Integer getAllApm() {
		return allApm;
	}

	public void setAllApm(Integer allApm) {
		this.allApm = allApm;
	}

	public Integer getAllSets() {
		return allSets;
	}

	public void setAllSets(Integer allSets) {
		this.allSets = allSets;
	}

	public Integer getAllResource() {
		return allResource;
	}

	public void setAllResource(Integer allResource) {
		this.allResource = allResource;
	}

	public Integer getAllCrystal() {
		return allCrystal;
	}

	public void setAllCrystal(Integer allCrystal) {
		this.allCrystal = allCrystal;
	}

	public Integer getAllOil() {
		return allOil;
	}

	public void setAllOil(Integer allOil) {
		this.allOil = allOil;
	}

	public Integer getAllDuration() {
		return allDuration;
	}

	public void setAllDuration(Integer allDuration) {
		this.allDuration = allDuration;
	}

	@Override
	public int compareTo(PlayerDetail o) {
		if (this.id>o.id) {
			return 1;
		} else if (this.id<o.id) {
			return -1;
		} else {
			return 0;
		}
	}
}
