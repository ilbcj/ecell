package com.ilbcj.ecell.dto;

/**
 *	展示-首页-日历-单日信息
 *	@author ilbcj
 *
 */
public class PubCalendarDayDTO {
	public static final int SETS_5 = 1;
	public static final int SETS_1 = 2;
	
	private int dayOfMonth;
	//常规赛,季后赛
	private int type;
	private int sets;
	private int schedule;
	private int season;
	private String raceDay;
	public int getDayOfMonth() {
		return dayOfMonth;
	}
	public void setDayOfMonth(int dayOfMonth) {
		this.dayOfMonth = dayOfMonth;
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	public int getSchedule() {
		return schedule;
	}
	public void setSchedule(int schedule) {
		this.schedule = schedule;
	}
	public int getSeason() {
		return season;
	}
	public void setSeason(int season) {
		this.season = season;
	}
	public int getSets() {
		return sets;
	}
	public void setSets(int sets) {
		this.sets = sets;
	}
	public String getRaceDay() {
		return raceDay;
	}
	public void setRaceDay(String raceDay) {
		this.raceDay = raceDay;
	}
}
