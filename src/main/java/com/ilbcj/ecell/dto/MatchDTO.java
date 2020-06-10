package com.ilbcj.ecell.dto;

/**
 *	管理台-赛程信息-单局信息
 *	@author ilbcj
 *
 */
public class MatchDTO {
	private Integer setId;
	private Integer gameId;
	private Integer player1Id;
	private Integer player2Id;
	private String raceDay;
	private Integer mapId;
	private String duration;
	private Integer winner;
	private String player1Race;
	private String player2Race;
	private Integer player1Apm;
	private Integer player2Apm;
	private Integer player1Oil;
	private Integer player2Oil;
	private Integer player1Crystal;
	private Integer player2Crystal;
	
	public Integer getPlayer1Id() {
		return player1Id;
	}
	public void setPlayer1Id(Integer player1Id) {
		this.player1Id = player1Id;
	}
	public Integer getPlayer2Id() {
		return player2Id;
	}
	public void setPlayer2Id(Integer player2Id) {
		this.player2Id = player2Id;
	}
	public Integer getGameId() {
		return gameId;
	}
	public void setGameId(Integer gameId) {
		this.gameId = gameId;
	}
	public Integer getSetId() {
		return setId;
	}
	public void setSetId(Integer setId) {
		this.setId = setId;
	}
	public String getRaceDay() {
		return raceDay;
	}
	public void setRaceDay(String raceDay) {
		this.raceDay = raceDay;
	}
	public Integer getMapId() {
		return mapId;
	}
	public void setMapId(Integer mapId) {
		this.mapId = mapId;
	}
	public String getDuration() {
		return duration;
	}
	public void setDuration(String duration) {
		this.duration = duration;
	}
	public Integer getWinner() {
		return winner;
	}
	public void setWinner(Integer winner) {
		this.winner = winner;
	}
	public String getPlayer1Race() {
		return player1Race;
	}
	public void setPlayer1Race(String player1Race) {
		this.player1Race = player1Race;
	}
	public String getPlayer2Race() {
		return player2Race;
	}
	public void setPlayer2Race(String player2Race) {
		this.player2Race = player2Race;
	}
	public Integer getPlayer1Apm() {
		return player1Apm;
	}
	public void setPlayer1Apm(Integer player1Apm) {
		this.player1Apm = player1Apm;
	}
	public Integer getPlayer2Apm() {
		return player2Apm;
	}
	public void setPlayer2Apm(Integer player2Apm) {
		this.player2Apm = player2Apm;
	}
	public Integer getPlayer1Oil() {
		return player1Oil;
	}
	public void setPlayer1Oil(Integer player1Oil) {
		this.player1Oil = player1Oil;
	}
	public Integer getPlayer2Oil() {
		return player2Oil;
	}
	public void setPlayer2Oil(Integer player2Oil) {
		this.player2Oil = player2Oil;
	}
	public Integer getPlayer1Crystal() {
		return player1Crystal;
	}
	public void setPlayer1Crystal(Integer player1Crystal) {
		this.player1Crystal = player1Crystal;
	}
	public Integer getPlayer2Crystal() {
		return player2Crystal;
	}
	public void setPlayer2Crystal(Integer player2Crystal) {
		this.player2Crystal = player2Crystal;
	}
	@Override
	public String toString() {
		return "MatchDTO [setId=" + setId + ", gameId=" + gameId + ", player1Id=" + player1Id + ", player2Id="
				+ player2Id + ", raceDay=" + raceDay + ", mapId=" + mapId + ", duration=" + duration + ", winner="
				+ winner + ", player1Race=" + player1Race + ", player2Race=" + player2Race + ", player1Apm="
				+ player1Apm + ", player2Apm=" + player2Apm + ", player1Oil=" + player1Oil + ", player2Oil="
				+ player2Oil + ", player1Crystal=" + player1Crystal + ", player2Crystal=" + player2Crystal + "]";
	}
}
