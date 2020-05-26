package com.ilbcj.ecell.entity;

import java.io.Serializable;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;



@TableName(value = "tb_schedule")//指定表名
public class Schedule implements Serializable, Comparable<Schedule>{
	/**
	 * 
	 */
	private static final long serialVersionUID = 4538558683983957833L;
	
	public static final Integer TYPE_TRIALS = 0;
	public static final Integer TYPE_REGULAR = 1;
	public static final Integer TYPE_PLAYOFF  = 2;
	
	public static final String ROUND_R_1 = "常规赛16进8_A组";
	public static final String ROUND_R_2 = "常规赛16进8_B组";
	public static final String ROUND_R_3 = "常规赛16进8_C组";
	public static final String ROUND_R_4 = "常规赛16进8_D组";
	public static final String ROUND_R_5 = "常规赛8进4_1";
	public static final String ROUND_R_6 = "常规赛8进4_2";
	public static final String ROUND_R_7 = "常规赛8进4_3";
	public static final String ROUND_R_8 = "常规赛8进4_4";
	public static final String ROUND_R_9 = "常规赛4进2_1";
	public static final String ROUND_R_10 = "常规赛4进2_2";
	public static final String ROUND_R_11 = "常规赛3、4名";;
	public static final String ROUND_R_12 = "常规赛1、2名";
	
	public static final String ROUND_P_1 = "季后赛16进8_A组";
	public static final String ROUND_P_2 = "季后赛16进8_B组";
	public static final String ROUND_P_3 = "季后赛16进8_C组";
	public static final String ROUND_P_4 = "季后赛16进8_D组";
	public static final String ROUND_P_5 = "季后赛8进4_1";
	public static final String ROUND_P_6 = "季后赛8进4_2";
	public static final String ROUND_P_7 = "季后赛8进4_3";
	public static final String ROUND_P_8 = "季后赛8进4_4";
	public static final String ROUND_P_9 = "季后赛4进2_1";
	public static final String ROUND_P_10 = "季后赛4进2_2";
	public static final String ROUND_P_11 = "季后赛3、4名";;
	public static final String ROUND_P_12 = "季后赛1、2名";
	
	public static final Integer FORMAT_BO3 = 3;
	public static final Integer FORMAT_BO5 = 5;
	public static final Integer FORMAT_BO7 = 7;
	public static final Integer FORMAT_BO9 = 9;
	
	public static final Integer STATUS_INIT = 0;
	public static final Integer STATUS_ACTIVE = 1;
	public static final Integer STATUS_ARCHIVE = 2;
	
	@TableId(type = IdType.AUTO)
	private Integer id;
	@TableId(value = "season_id")
	private Integer seasonId;
	private String round;
	private Integer sets;
	private Integer format;
	@TableId(value = "race_day")
	private String raceDay;
	private Integer type;
	private Integer status;
	
	@TableField(exist = false)
	private String seasonName;
	
    public String getSeasonName() {
		return seasonName;
	}

	public Integer getFormat() {
		return format;
	}

	public void setFormat(Integer format) {
		this.format = format;
	}

	public void setSeasonName(String seasonName) {
		this.seasonName = seasonName;
	}

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
