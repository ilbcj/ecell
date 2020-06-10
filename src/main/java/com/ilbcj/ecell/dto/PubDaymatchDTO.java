package com.ilbcj.ecell.dto;

import java.util.List;
import java.util.Set;

/**
 *	展示-比赛日页
 *	@author ilbcj
 *
 */
public class PubDaymatchDTO {
	private String day;
	private String title;
	private Set<String> players;
	private List<PubDaymatchSetDTO> sets;
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
	public List<PubDaymatchSetDTO> getSets() {
		return sets;
	}
	public Set<String> getPlayers() {
		return players;
	}
	public void setPlayers(Set<String> players) {
		this.players = players;
	}
	public void setSets(List<PubDaymatchSetDTO> sets) {
		this.sets = sets;
	}
}
