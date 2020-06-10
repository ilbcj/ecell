package com.ilbcj.ecell.dto;

/**
 *	展示-比赛日页
 *	@author ilbcj
 *
 */
public class PubDaymatchSetDTO {
	public static final int WINNER_P1 = 1;
	public static final int WINNER_P2 = 2;
	private int setId;
	private String title;
	private String p1Nick;
	private String p1Race;
	private String p1Country;
	private String p2Nick;
	private String p2Race;
	private String p2Country;
	private int winner;
	public int getSetId() {
		return setId;
	}
	public void setSetId(int setId) {
		this.setId = setId;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getP1Nick() {
		return p1Nick;
	}
	public void setP1Nick(String p1Nick) {
		this.p1Nick = p1Nick;
	}
	public String getP1Race() {
		return p1Race;
	}
	public void setP1Race(String p1Race) {
		this.p1Race = p1Race;
	}
	public String getP1Country() {
		return p1Country;
	}
	public void setP1Country(String p1Country) {
		this.p1Country = p1Country;
	}
	public String getP2Nick() {
		return p2Nick;
	}
	public void setP2Nick(String p2Nick) {
		this.p2Nick = p2Nick;
	}
	public String getP2Race() {
		return p2Race;
	}
	public void setP2Race(String p2Race) {
		this.p2Race = p2Race;
	}
	public String getP2Country() {
		return p2Country;
	}
	public void setP2Country(String p2Country) {
		this.p2Country = p2Country;
	}
	public int getWinner() {
		return winner;
	}
	public void setWinner(int winner) {
		this.winner = winner;
	}
}
