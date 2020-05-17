package com.ilbcj.ecell.dto;

import java.util.List;

public class ScheduleDTO {
	
	private String scheduleName;
	private Integer seasonId;
	private Integer scheduleId;
	private Integer sets;
	private Integer format;
	private List<MatchDTO> set1;
	private List<MatchDTO> set2;
	private List<MatchDTO> set3;
	private List<MatchDTO> set4;
	private List<MatchDTO> set5;
	
	public List<MatchDTO> getSet5() {
		return set5;
	}
	public void setSet5(List<MatchDTO> set5) {
		this.set5 = set5;
	}
	public String getScheduleName() {
		return scheduleName;
	}
	public void setScheduleName(String scheduleName) {
		this.scheduleName = scheduleName;
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
	public Integer getSets() {
		return sets;
	}
	public void setSets(Integer sets) {
		this.sets = sets;
	}
	public Integer getFormat() {
		return format;
	}
	public void setFormat(Integer format) {
		this.format = format;
	}
	public List<MatchDTO> getSet1() {
		return set1;
	}
	public void setSet1(List<MatchDTO> set1) {
		this.set1 = set1;
	}
	public List<MatchDTO> getSet2() {
		return set2;
	}
	public void setSet2(List<MatchDTO> set2) {
		this.set2 = set2;
	}
	public List<MatchDTO> getSet3() {
		return set3;
	}
	public void setSet3(List<MatchDTO> set3) {
		this.set3 = set3;
	}
	public List<MatchDTO> getSet4() {
		return set4;
	}
	public void setSet4(List<MatchDTO> set4) {
		this.set4 = set4;
	}
}
