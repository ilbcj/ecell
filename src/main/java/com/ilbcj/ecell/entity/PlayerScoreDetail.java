package com.ilbcj.ecell.entity;

import java.io.Serializable;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;



@TableName(value = "tb_player_score_detail")//指定表名
public class PlayerScoreDetail implements Serializable, Comparable<PlayerScoreDetail>{
	/**
	 * 
	 */
	private static final long serialVersionUID = -618450448168521985L;
	
	public static final Integer COUNTRY_CN = 1;
	public static final Integer COUNTRY_KR = 2;

	@TableId(type = IdType.AUTO)
	private Integer id;
	@TableId(value = "player_id")
	private Integer playerId;
	private Integer tvtw;
	private Integer tvta;
	private Integer tvpw;
	private Integer tvpa;
	private Integer tvzw;
	private Integer tvza;
	private Integer pvtw;
	private Integer pvta;
	private Integer pvpw;
	private Integer pvpa;
	private Integer pvzw;
	private Integer pvza;
	private Integer zvtw;
	private Integer zvta;
	private Integer zvpw;
	private Integer zvpa;
	private Integer zvzw;
	private Integer zvza;
	private Integer country;
	
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

	public Integer getTvtw() {
		return tvtw;
	}

	public void setTvtw(Integer tvtw) {
		this.tvtw = tvtw;
	}

	public Integer getTvta() {
		return tvta;
	}

	public void setTvta(Integer tvta) {
		this.tvta = tvta;
	}

	public Integer getTvpw() {
		return tvpw;
	}

	public void setTvpw(Integer tvpw) {
		this.tvpw = tvpw;
	}

	public Integer getTvpa() {
		return tvpa;
	}

	public void setTvpa(Integer tvpa) {
		this.tvpa = tvpa;
	}

	public Integer getTvzw() {
		return tvzw;
	}

	public void setTvzw(Integer tvzw) {
		this.tvzw = tvzw;
	}

	public Integer getTvza() {
		return tvza;
	}

	public void setTvza(Integer tvza) {
		this.tvza = tvza;
	}

	public Integer getPvtw() {
		return pvtw;
	}

	public void setPvtw(Integer pvtw) {
		this.pvtw = pvtw;
	}

	public Integer getPvta() {
		return pvta;
	}

	public void setPvta(Integer pvta) {
		this.pvta = pvta;
	}

	public Integer getPvpw() {
		return pvpw;
	}

	public void setPvpw(Integer pvpw) {
		this.pvpw = pvpw;
	}

	public Integer getPvpa() {
		return pvpa;
	}

	public void setPvpa(Integer pvpa) {
		this.pvpa = pvpa;
	}

	public Integer getPvzw() {
		return pvzw;
	}

	public void setPvzw(Integer pvzw) {
		this.pvzw = pvzw;
	}

	public Integer getPvza() {
		return pvza;
	}

	public void setPvza(Integer pvza) {
		this.pvza = pvza;
	}

	public Integer getZvtw() {
		return zvtw;
	}

	public void setZvtw(Integer zvtw) {
		this.zvtw = zvtw;
	}

	public Integer getZvta() {
		return zvta;
	}

	public void setZvta(Integer zvta) {
		this.zvta = zvta;
	}

	public Integer getZvpw() {
		return zvpw;
	}

	public void setZvpw(Integer zvpw) {
		this.zvpw = zvpw;
	}

	public Integer getZvpa() {
		return zvpa;
	}

	public void setZvpa(Integer zvpa) {
		this.zvpa = zvpa;
	}

	public Integer getZvzw() {
		return zvzw;
	}

	public void setZvzw(Integer zvzw) {
		this.zvzw = zvzw;
	}

	public Integer getZvza() {
		return zvza;
	}

	public void setZvza(Integer zvza) {
		this.zvza = zvza;
	}

	public Integer getCountry() {
		return country;
	}

	public void setCountry(Integer country) {
		this.country = country;
	}

	@Override
	public int compareTo(PlayerScoreDetail o) {
		if (this.id>o.id) {
			return 1;
		} else if (this.id<o.id) {
			return -1;
		} else {
			return 0;
		}
	}
}
