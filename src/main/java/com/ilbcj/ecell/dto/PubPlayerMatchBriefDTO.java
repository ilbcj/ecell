package com.ilbcj.ecell.dto;

/**
 *	展示-选手页-选手信息-最近十场比赛信息
 *	@author ilbcj
 *
 */
public class PubPlayerMatchBriefDTO {
	public static final String TYPE_REGULAR = "常规赛";
	public static final String TYPE_PLAYOFF  = "季后赛";
	private String type;
	private String date;
	private String result;
	private String adversary;
	private String map;
	
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getResult() {
		return result;
	}
	public void setResult(String result) {
		this.result = result;
	}
	public String getAdversary() {
		return adversary;
	}
	public void setAdversary(String adversary) {
		this.adversary = adversary;
	}
	public String getMap() {
		return map;
	}
	public void setMap(String map) {
		this.map = map;
	}
}
