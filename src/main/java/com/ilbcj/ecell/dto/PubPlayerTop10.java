package com.ilbcj.ecell.dto;

public class PubPlayerTop10 {
	public static final String SORT_ASC = "asc";
	public static final String SORT_DESC = "desc";
	private int id;
	private String nick;
	private String country;
	private String winning;
	private String apm;
	private String resource;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getNick() {
		return nick;
	}
	public void setNick(String nick) {
		this.nick = nick;
	}
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	public String getWinning() {
		return winning;
	}
	public void setWinning(String winning) {
		this.winning = winning;
	}
	public String getApm() {
		return apm;
	}
	public void setApm(String apm) {
		this.apm = apm;
	}
	public String getResource() {
		return resource;
	}
	public void setResource(String resource) {
		this.resource = resource;
	}
}
