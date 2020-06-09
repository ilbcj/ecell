package com.ilbcj.ecell.dto;

import java.util.List;

public class MatchCalendarDTO {
	private int year;
	private int month;
	private List<CalendarDayDTO> days;
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
	public List<CalendarDayDTO> getDays() {
		return days;
	}
	public void setDays(List<CalendarDayDTO> days) {
		this.days = days;
	}
}
