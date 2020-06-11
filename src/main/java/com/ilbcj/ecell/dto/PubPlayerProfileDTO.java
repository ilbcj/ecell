package com.ilbcj.ecell.dto;

import java.util.List;

/**
 *	展示-选手页-选手信息
 *	@author ilbcj
 *
 */
public class PubPlayerProfileDTO {
	private int playerId;
	private String nick;
	private String name;
	private String avatar;
	private String country;
	private String race;
	private String age;
	private String team;
	private String winningVA;
	private String winningVT;
	private String winningVP;
	private String winningVZ;
	private String apm;
	private String duration;
	private String resource;
	private String difference;
	private List<PubPlayerMatchBriefDTO> last10;
	
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	public String getAvatar() {
		return avatar;
	}
	public void setAvatar(String avatar) {
		this.avatar = avatar;
	}
	public int getPlayerId() {
		return playerId;
	}
	public void setPlayerId(int playerId) {
		this.playerId = playerId;
	}
	public String getNick() {
		return nick;
	}
	public void setNick(String nick) {
		this.nick = nick;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getRace() {
		return race;
	}
	public void setRace(String race) {
		this.race = race;
	}
	public String getAge() {
		return age;
	}
	public void setAge(String age) {
		this.age = age;
	}
	public String getTeam() {
		return team;
	}
	public void setTeam(String team) {
		this.team = team;
	}
	public String getWinningVA() {
		return winningVA;
	}
	public void setWinningVA(String winningVA) {
		this.winningVA = winningVA;
	}
	public String getWinningVT() {
		return winningVT;
	}
	public void setWinningVT(String winningVT) {
		this.winningVT = winningVT;
	}
	public String getWinningVP() {
		return winningVP;
	}
	public void setWinningVP(String winningVP) {
		this.winningVP = winningVP;
	}
	public String getWinningVZ() {
		return winningVZ;
	}
	public void setWinningVZ(String winningVZ) {
		this.winningVZ = winningVZ;
	}
	public String getApm() {
		return apm;
	}
	public void setApm(String apm) {
		this.apm = apm;
	}
	public String getDuration() {
		return duration;
	}
	public void setDuration(String duration) {
		this.duration = duration;
	}
	public String getResource() {
		return resource;
	}
	public void setResource(String resource) {
		this.resource = resource;
	}
	public String getDifference() {
		return difference;
	}
	public void setDifference(String difference) {
		this.difference = difference;
	}
	public List<PubPlayerMatchBriefDTO> getLast10() {
		return last10;
	}
	public void setLast10(List<PubPlayerMatchBriefDTO> last10) {
		this.last10 = last10;
	}
}
