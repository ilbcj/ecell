package com.ilbcj.ecell.dto;

import java.util.List;

/**
 *	展示-首页-日历
 *	@author ilbcj
 *
 */
public class PubMatchCalendarDTO {
	private int year;
	private int month;
	private List<PubCalendarDayDTO> days;
	public int getYear() {
		return year;
	}
	public void setYear(int year) {
		this.year = year;
	}
	public int getMonth() {
		return month;
	}
	public void setMonth(int month) {
		this.month = month;
	}
	public List<PubCalendarDayDTO> getDays() {
		return days;
	}
	public void setDays(List<PubCalendarDayDTO> days) {
		this.days = days;
	}
}
