package com.ilbcj.ecell.entity;

import java.io.Serializable;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;



@TableName(value = "tb_player_season_detail")//指定表名
public class PlayerSeasonDetail implements Serializable, Comparable<PlayerSeasonDetail>{
	/**
	 * 
	 */
	private static final long serialVersionUID = -8797527573497934705L;
	
	@TableId(type = IdType.AUTO)
	private Integer id;
	@TableId(value = "season_id")
	private Integer seasonId;
	@TableId(value = "player_id")
	private Integer playerId;
	@TableId(value = "post_season_difference")
	private Integer postSeasonDifference;

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

	public Integer getPlayerId() {
		return playerId;
	}

	public void setPlayerId(Integer playerId) {
		this.playerId = playerId;
	}

	public Integer getPostSeasonDifference() {
		return postSeasonDifference;
	}

	public void setPostSeasonDifference(Integer postSeasonDifference) {
		this.postSeasonDifference = postSeasonDifference;
	}

	@Override
	public int compareTo(PlayerSeasonDetail o) {
		if (this.id>o.id) {
			return 1;
		} else if (this.id<o.id) {
			return -1;
		} else {
			return 0;
		}
	}
}
