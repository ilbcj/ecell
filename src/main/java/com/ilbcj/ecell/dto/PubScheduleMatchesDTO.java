package com.ilbcj.ecell.dto;

import java.util.List;
import java.util.Set;

/**
 *	展示-比赛日信息
 *	@author ilbcj
 *
 */
public class PubScheduleMatchesDTO {
	private String day;
	private int scheduleId;
	private String title;
	private Set<String> players;
	private List<PubDaymatchSetDTO> sets;
	
	public int getScheduleId() {
		return scheduleId;
	}
	public void setScheduleId(int scheduleId) {
		this.scheduleId = scheduleId;
	}
	public String getDay() {
		return day;
	}
	public void setDay(String day) {
		this.day = day;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public Set<String> getPlayers() {
		return players;
	}
	public void setPlayers(Set<String> players) {
		this.players = players;
	}
	public List<PubDaymatchSetDTO> getSets() {
		return sets;
	}
	public void setSets(List<PubDaymatchSetDTO> sets) {
		this.sets = sets;
	}
}
