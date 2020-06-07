package com.ilbcj.ecell.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ilbcj.ecell.dto.MatchDTO;
import com.ilbcj.ecell.dto.ScheduleDTO;
import com.ilbcj.ecell.entity.Match;
import com.ilbcj.ecell.entity.MatchDetail;
import com.ilbcj.ecell.entity.Schedule;
import com.ilbcj.ecell.entity.Season;
import com.ilbcj.ecell.mapper.MatchDetailMapper;
import com.ilbcj.ecell.mapper.MatchMapper;
import com.ilbcj.ecell.mapper.ScheduleMapper;
import com.ilbcj.ecell.mapper.SeasonMapper;
import com.ilbcj.ecell.service.ScheduleService;
import com.ilbcj.ecell.util.PageUtils;
import com.ilbcj.ecell.util.Query;

@Service("scheduleService")
public class ScheduleServiceImpl implements ScheduleService {
	private Logger logger = LoggerFactory.getLogger(ScheduleServiceImpl.class);
			
	@Resource
    private ScheduleMapper scheduleMapper;
	
	@Resource
    private SeasonMapper seasonMapper;
	
	@Resource 
	private MatchMapper matchMapper;
	
	@Resource 
	MatchDetailMapper matchDetailMapper;

	@Override
	public PageUtils queryPage(Map<String, Object> params) {
		String seasonName = (String) params.get("name");
		
		Map<Integer, Season> seasonMap = new HashMap<Integer, Season>();
		List<Integer> seasonIds = new ArrayList<Integer>();
		seasonMapper.selectList(
			Wrappers.<Season>lambdaQuery()
			.like(Season::getName, seasonName)
		).forEach(x -> {
			seasonMap.put(x.getId(), x);
			seasonIds.add(x.getId());
        });
		
		if( seasonIds.size() == 0 ) {
			seasonIds.add(-1);
		}
		Page<Schedule> scheduleIPage = scheduleMapper.selectPage(new Query<Schedule>(params).getPage(),
				Wrappers.<Schedule>lambdaQuery()
					.in(Schedule::getSeasonId, seasonIds)
				);
		scheduleIPage.getRecords().forEach(x->{
			x.setSeasonName( seasonMap.get( x.getSeasonId() ).getName() );
		});
		return new PageUtils(scheduleIPage);
	}

	@Override
	public List<Schedule> queryBySeason(Integer seasonId) {
		return scheduleMapper.selectList(
				Wrappers.<Schedule>lambdaQuery()
					.eq(Schedule::getSeasonId, seasonId)
				);
	}

	@Transactional
	@Override
	public boolean saveMatches(ScheduleDTO params) {
		//log
		logger.info("save match details: " + params );
		
		//check match record, if not exist then init match info
		Match[][] matches = new Match[params.getSets()][params.getFormat()];
		for(int i = 0; i < params.getSets(); i++) {
			for(int j = 0; j < params.getFormat(); j++) {
				matches[i][j] = matchMapper.selectOne(new QueryWrapper<Match>().lambda().eq(Match::getSeasonId, params.getSeasonId())
						.eq(Match::getScheduleId, params.getScheduleId())
						.eq(Match::getSetId, i+1)
						.eq(Match::getGameId, j+1)
				);
				if( matches[i][j] == null ) {
					matches[i][j] = new Match();
					matches[i][j].setSeasonId(params.getSeasonId());
					matches[i][j].setScheduleId(params.getScheduleId());
					matches[i][j].setSetId(i+1);
					matches[i][j].setGameId(j+1);
					matchMapper.insert(matches[i][j]);
				}
			}
		}
		
		//update match info
		for(int i = 0; i < params.getSets(); i++) {
			List<MatchDTO> set = params.getSetList().get(i);
			for(int j = 0; j < params.getFormat(); j++) {
				MatchDTO game = set.get(j);
				//setId --> setIndex
				int setIdx = game.getSetId() - 1;
				//gameId --> gameIndex
				int gameIdx = game.getGameId() - 1;
				matches[setIdx][gameIdx].setMapId(game.getMapId());
				matches[setIdx][gameIdx].setRaceDay(game.getRaceDay());
				matches[setIdx][gameIdx].setPaId(game.getPlayer1Id());
				matches[setIdx][gameIdx].setPbId(game.getPlayer2Id());
				matches[setIdx][gameIdx].setPaRace(game.getPlayer1Race());
				matches[setIdx][gameIdx].setPbRace(game.getPlayer2Race());
				
				String[] hhmmss = (game.getDuration() + " ").split(":");
				Optional<String> tmp = Optional.ofNullable( hhmmss[0].trim() );
				String hhStr = tmp.orElse("").isEmpty() ? "0" : tmp.get();
				int hh = Integer.parseInt( hhStr );
				tmp = Optional.ofNullable( hhmmss[1].trim() );
				String mmStr = tmp.orElse("").isEmpty() ? "0" : tmp.get();
				int mm = Integer.parseInt( mmStr );
				tmp = Optional.ofNullable( hhmmss[2].trim() );
				String ssStr = tmp.orElse("").isEmpty() ? "0" : tmp.get();
				int ss = Integer.parseInt( ssStr );
				int duration = ss + 60*mm + 60*60*hh;
				matches[setIdx][gameIdx].setDuration(String.valueOf(duration));

				matches[setIdx][gameIdx].setWinner(game.getWinner());
				matchMapper.updateById(matches[setIdx][gameIdx]);
				
				
				Integer player1Id = game.getPlayer1Id();
				if(player1Id != null && player1Id != 0) {
					MatchDetail matchDetail = matchDetailMapper.selectOne(new QueryWrapper<MatchDetail>().lambda()
							.eq(MatchDetail::getMatchId, matches[setIdx][gameIdx].getId())
							.eq(MatchDetail::getPlayerId, player1Id)
					);
					
					if( matchDetail == null ) {
						matchDetail = new MatchDetail();
						matchDetail.setMatchId( matches[setIdx][gameIdx].getId() );
						matchDetail.setPlayerId( player1Id );
						matchDetailMapper.insert( matchDetail );
					}
					
					matchDetail.setDuration( duration );
					matchDetail.setPlayerRace( game.getPlayer1Race() );
					Optional<Integer> apm = Optional.ofNullable( game.getPlayer1Apm() );
					matchDetail.setApm( apm.orElse(0) );
					Optional<Integer> crystal = Optional.ofNullable( game.getPlayer1Crystal() );
					matchDetail.setCrystal( crystal.orElse(0) );
					Optional<Integer> oil = Optional.ofNullable( game.getPlayer1Oil() );
					matchDetail.setOil( oil.orElse(0) );
					matchDetail.setResource( crystal.orElse(0) + oil.orElse(0) );
					
					matchDetailMapper.updateById(matchDetail);
				}
				
				Integer player2Id = game.getPlayer2Id();
				if(player2Id != null && player2Id != 0) {
					MatchDetail matchDetail = matchDetailMapper.selectOne(new QueryWrapper<MatchDetail>().lambda()
							.eq(MatchDetail::getMatchId, matches[setIdx][gameIdx].getId())
							.eq(MatchDetail::getPlayerId, player2Id)
					);
					
					if( matchDetail == null ) {
						matchDetail = new MatchDetail();
						matchDetail.setMatchId( matches[setIdx][gameIdx].getId() );
						matchDetail.setPlayerId( player2Id );
						matchDetailMapper.insert( matchDetail );
					}
					
					matchDetail.setDuration( duration );
					matchDetail.setPlayerRace( game.getPlayer2Race() );
					Optional<Integer> apm = Optional.ofNullable( game.getPlayer2Apm() );
					matchDetail.setApm( apm.orElse(0) );
					Optional<Integer> crystal = Optional.ofNullable( game.getPlayer2Crystal() );
					matchDetail.setCrystal( crystal.orElse(0) );
					Optional<Integer> oil = Optional.ofNullable( game.getPlayer2Oil() );
					matchDetail.setOil( oil.orElse(0) );
					matchDetail.setResource( crystal.orElse(0) + oil.orElse(0) );
					
					matchDetailMapper.updateById(matchDetail);
				}
				
				//clean old data
				if(player1Id != null && player1Id > 0 && player2Id != null && player2Id > 0) {
					List<Integer> playerIds = new ArrayList<Integer>();
					playerIds.add(player1Id);
					playerIds.add(player2Id);
					List<MatchDetail> dirtyList = matchDetailMapper.selectList(new QueryWrapper<MatchDetail>().lambda()
							.eq(MatchDetail::getMatchId, matches[setIdx][gameIdx].getId())
							.notIn(MatchDetail::getPlayerId, playerIds)
					);
					
					dirtyList.forEach(x->{
						matchDetailMapper.deleteById(x.getId());
					});
							
					
				}
			}
		}
		
		return true;
	}

	@Transactional
	@Override
	public ScheduleDTO queryMatches(Map<String, Object> parm) {
		ScheduleDTO matches = new ScheduleDTO();
		Integer seasonId = (Integer) parm.get("seasonId");
		Integer scheduleId = (Integer) parm.get("scheduleId");
		Schedule schedule = scheduleMapper.selectOne(new QueryWrapper<Schedule>().lambda()
				.eq(Schedule::getSeasonId, seasonId)
				.eq(Schedule::getId, scheduleId)
		);

		if( schedule == null ) {
			return null;
		}
		matches.setSeasonId(seasonId);
		matches.setScheduleId(scheduleId);
		matches.setScheduleName(schedule.getRound());
		matches.setSets(schedule.getSets());
		matches.setFormat(schedule.getFormat());
		
		List<List<MatchDTO>> setList = new ArrayList<List<MatchDTO>>();
		for(int i = 1; i <= matches.getSets(); i++) {
			List<MatchDTO> games = new ArrayList<MatchDTO>();
			for(int j = 1; j <= matches.getFormat(); j++) {
				Match match = matchMapper.selectOne(new QueryWrapper<Match>().lambda()
					.eq(Match::getSeasonId, seasonId)
					.eq(Match::getScheduleId, scheduleId)
					.eq(Match::getSetId, i)
					.eq(Match::getGameId, j)
				);
				
				if( match != null ) { 
					Integer player1Id = match.getPaId();
					Integer player2Id = match.getPbId();
					if( (player1Id != null && player1Id > 0) || (player2Id != null && player2Id > 0) ) {
						MatchDTO game = new MatchDTO();
						game.setSetId(i);
						game.setGameId(j);
						int duration = Integer.parseInt( match.getDuration() );
						int hh = duration / 3600 ;
						int mm = ( duration % 3600 ) / 60;
						int ss =  duration % 3600 %  60;
						String durationStr = hh + ":" + mm + ":" + ss;
						game.setDuration( durationStr );
						game.setRaceDay( match.getRaceDay() );
						game.setWinner( match.getWinner() );
						game.setMapId( match.getMapId() );
						
						MatchDetail detail1 = matchDetailMapper.selectOne(new QueryWrapper<MatchDetail>().lambda()
							.eq(MatchDetail::getMatchId, match.getId())
							.eq(MatchDetail::getPlayerId, player1Id)
						);
						if( detail1 != null ) {
							game.setPlayer1Id(detail1.getPlayerId());
							game.setPlayer1Race(detail1.getPlayerRace());
							game.setPlayer1Apm( detail1.getApm() );
							game.setPlayer1Oil( detail1.getOil() );
							game.setPlayer1Crystal( detail1.getCrystal() );
						}
						
						MatchDetail detail2 = matchDetailMapper.selectOne(new QueryWrapper<MatchDetail>().lambda()
							.eq(MatchDetail::getMatchId, match.getId())
							.eq(MatchDetail::getPlayerId, player2Id)
						);
						if( detail2 != null ) {
							game.setPlayer2Id(detail2.getPlayerId());
							game.setPlayer2Race(detail2.getPlayerRace());
							game.setPlayer2Apm( detail2.getApm() );
							game.setPlayer2Oil( detail2.getOil() );
							game.setPlayer2Crystal( detail2.getCrystal() );
						}
						games.add( game );
					}
				}
			}
			setList.add(games);
		}
		matches.setSetList(setList);
		
		return matches;
		
	}
	
	

}
