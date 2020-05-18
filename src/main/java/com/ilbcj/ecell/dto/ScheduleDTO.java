package com.ilbcj.ecell.dto;

import java.util.List;

public class ScheduleDTO {
	
	private String scheduleName;
	private Integer seasonId;
	private Integer scheduleId;
	private Integer sets;
	private Integer format;
	private List<List<MatchDTO>> set;
//	private List<MatchDTO> set1;
//	private List<MatchDTO> set2;
//	private List<MatchDTO> set3;
//	private List<MatchDTO> set4;
//	private List<MatchDTO> set5;
	
	public String getScheduleName() {
		return scheduleName;
	}
	public List<List<MatchDTO>> getSet() {
		return set;
	}
	public void setSet(List<List<MatchDTO>> set) {
		this.set = set;
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
}
