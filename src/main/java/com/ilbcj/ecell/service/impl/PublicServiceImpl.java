package com.ilbcj.ecell.service.impl;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;
import java.time.temporal.TemporalAccessor;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.ilbcj.ecell.dto.PubCalendarDayDTO;
import com.ilbcj.ecell.dto.PubDaymatchDTO;
import com.ilbcj.ecell.dto.PubDaymatchSetDTO;
import com.ilbcj.ecell.dto.PubPlayerMatchBriefDTO;
import com.ilbcj.ecell.dto.PubMatchCalendarDTO;
import com.ilbcj.ecell.dto.PubPlayerProfileDTO;
import com.ilbcj.ecell.dto.PubPlayerTop10;
import com.ilbcj.ecell.entity.Ditu;
import com.ilbcj.ecell.entity.Match;
import com.ilbcj.ecell.entity.MatchDetail;
import com.ilbcj.ecell.entity.Player;
import com.ilbcj.ecell.entity.Schedule;
import com.ilbcj.ecell.mapper.DituMapper;
import com.ilbcj.ecell.mapper.MatchDetailMapper;
import com.ilbcj.ecell.mapper.MatchMapper;
import com.ilbcj.ecell.mapper.PlayerMapper;
import com.ilbcj.ecell.mapper.ScheduleMapper;
import com.ilbcj.ecell.service.PublicService;
import com.ilbcj.ecell.util.MatchCalendar;

@Service("publicService")
public class PublicServiceImpl implements PublicService {

	private Logger logger = LoggerFactory.getLogger(PublicServiceImpl.class);
			
	@Resource
	ScheduleMapper scheduleMapper;
	
	@Resource
    private PlayerMapper playerMapper;
	
	@Resource 
	private MatchMapper matchMapper;
	
	@Resource 
	MatchDetailMapper matchDetailMapper;
	
	@Resource
	DituMapper dituMapper;
	
	@SuppressWarnings("unchecked")
	@Override
	public List<PubPlayerProfileDTO> queryPlayerProfileById(Map<String, Object> parm) {
		List<PubPlayerProfileDTO> result = new ArrayList<PubPlayerProfileDTO>();
		
		Optional<List<String>> nicks = Optional.ofNullable( (List<String>)parm.get("players") );
		nicks.orElse(new ArrayList<String>()).forEach(item -> {
			PubPlayerProfileDTO profile = new PubPlayerProfileDTO();
			Player player = playerMapper.selectOne(new QueryWrapper<Player>().lambda().eq(Player::getNick, item));
			if( player == null ) {
				logger.error("[查询选手信息服务]不存在指定ID的选手。ID:" + item);
				return;
			}
			profile.setPlayerId(player.getId());
			profile.setNick(item);
			profile.setName(player.getName());
			profile.setAvatar(player.getPicture());
			profile.setCountry(player.getCountry());
			profile.setAge(getAge(player.getBirth()));
			profile.setRace(player.getRace());
			profile.setTeam(player.getTeamName());
			
			fillPlayerDetail(profile);

			result.add(profile);
		});
		
		return result;
	}

	@SuppressWarnings("unchecked")
	private void fillPlayerDetail(PubPlayerProfileDTO profile) {
		
		List<Match> matches = matchMapper.selectList(new QueryWrapper<Match>().lambda()
				.eq(Match::getPaId, profile.getPlayerId())
				.or()
				.eq(Match::getPbId, profile.getPlayerId())
				.orderByDesc(Match::getRaceDay, Match::getSetId, Match::getGameId)
				);
		
		float allSets = 0;
		float vtSets = 0;
		float vpSets = 0;
		float vzSets = 0;
		int winA = 0;
		int winT = 0;
		int winP = 0;
		int winZ = 0;
		int apmAll = 0;
		int duration = 0;
		int resource = 0;
		int difference = 0;
		String adversaryRace = null;
		List<PubPlayerMatchBriefDTO> briefs = new ArrayList<PubPlayerMatchBriefDTO>();
		int count = 0;
		for(Match match : matches ) {
			int winner = match.getWinner();
			if( winner == 0) {
				continue;
			}
			
			allSets++;
			int matchId = match.getId();
			int pa = match.getPaId();
			int pb = match.getPbId();
			int playerId = profile.getPlayerId();
			int adversaryId = 0;
			if(playerId == pa) {
				adversaryId = pb;
				adversaryRace = match.getPbRace();
			}
			else if(playerId == pb) {
				adversaryId = pa;
				adversaryRace = match.getPaRace();
			}
			boolean isWin = false;
			if( (playerId == pa && winner == Match.WINNER_A) || (playerId == pb && winner == Match.WINNER_B) ) {
				isWin = true;
				winA++;
			}
			
			if( Player.RACE_T.equals(adversaryRace) ) {
				vtSets++;
				if(isWin) winT++;
			}
			else if( Player.RACE_P.equals(adversaryRace) ) {
				vpSets++;
				if(isWin) winP++;
			}
			else if( Player.RACE_Z.equals(adversaryRace) ) {
				vzSets++;
				if(isWin) winZ++;
			}
			
			int schedule = match.getScheduleId();
			if( schedule > 12 && schedule <= 24 ) {
				if( isWin) {
					difference++;
				}
				else {
					difference--;
				}
			}
			
			if(count < 10) {
				PubPlayerMatchBriefDTO brief = new PubPlayerMatchBriefDTO();
				
				if( schedule > 0 && schedule <= 12 ) {
					brief.setType(PubPlayerMatchBriefDTO.TYPE_REGULAR);
				}
				else if( schedule > 12 && schedule <= 24 ) {
					brief.setType(PubPlayerMatchBriefDTO.TYPE_PLAYOFF);
				}
				
				brief.setDate(match.getRaceDay());
				
				if( isWin ) {
					brief.setResult("WIN");
				}
				else {
					brief.setResult("LOSE");
				}
				
				Player adversary = playerMapper.selectById(adversaryId);
				brief.setAdversary(adversary.getNick());
				
				Ditu ditu = dituMapper.selectById(match.getMapId());
				if(ditu == null) {
					System.out.println(match.getMapId());
				}
				brief.setMap(ditu.getName());
				count++;
				briefs.add(brief);
			}
			
			MatchDetail detail = matchDetailMapper.selectOne(new QueryWrapper<MatchDetail>().lambda()
				.eq(MatchDetail::getMatchId, matchId)
				.eq(MatchDetail::getPlayerId, playerId)
				);
			if(detail == null) {
				logger.error("[查询选手信息服务]不存在指定ID的比赛信息，matchId:" + matchId + ", playerId:" + playerId);
				continue;
			}
			apmAll += detail.getApm();
			duration += detail.getDuration();
			resource += detail.getResource();
		};
		
		float temp = 0f;
		temp = winA/allSets;
		BigDecimal b = new BigDecimal(temp);
		temp = b.setScale(2, BigDecimal.ROUND_HALF_UP).floatValue() * 100;
		profile.setWinningVA(String.valueOf((int)temp) + "%");
		profile.setVACount("" + winA + ":" + String.valueOf((int)allSets));
		if( vtSets > 0 ) {
			temp = winT/vtSets;
			b = new BigDecimal(temp);
			temp = b.setScale(2, BigDecimal.ROUND_HALF_UP).floatValue() * 100;
			profile.setWinningVT(String.valueOf((int)temp) + "%");
			profile.setVTCount("" + winT + ":" + String.valueOf((int)vtSets));
		}
		else {
			profile.setWinningVT("--");
			profile.setVTCount("0:0");
		}
		
		if( vpSets > 0 ) {
			temp = winP/vpSets;
			b = new BigDecimal(temp);
			temp = b.setScale(2, BigDecimal.ROUND_HALF_UP).floatValue() * 100;
			profile.setWinningVP(String.valueOf((int)temp) + "%");
			profile.setVPCount("" + winP + ":" + String.valueOf((int)vpSets));
		}
		else {
			profile.setWinningVP("--");
			profile.setVPCount("0:0");
		}
		
		if( vzSets > 0 ) {
			temp = winZ/vzSets;
			b = new BigDecimal(temp);
			temp = b.setScale(2, BigDecimal.ROUND_HALF_UP).floatValue() * 100;
			profile.setWinningVZ(String.valueOf((int)temp) + "%");
			profile.setVZCount("" + winZ + ":" + String.valueOf((int)vzSets));
		}
		else {
			profile.setWinningVZ("--");
			profile.setVZCount("0:0");
		}
		
		temp = apmAll/allSets;
		b = new BigDecimal(temp);
		temp = b.setScale(0, BigDecimal.ROUND_HALF_UP).floatValue();
		profile.setApm(String.valueOf((int)temp));
		
		temp = duration/allSets/60;
		b = new BigDecimal(temp);
		temp = b.setScale(1, BigDecimal.ROUND_HALF_UP).floatValue();
		String minute = String.valueOf((int)temp);
		String second = String.valueOf( (int)((temp*10 - ((int)temp)*10)) * 6 ); 
		profile.setDuration( minute + ":" + second );
		
		temp = resource / (float)duration * 60;
		b = new BigDecimal(temp);
		temp = b.setScale(0, BigDecimal.ROUND_HALF_UP).floatValue();
		profile.setResource(String.valueOf((int)temp));
		
		profile.setDifference(String.valueOf(difference));
		profile.setLast10(briefs);
		
	}

	private String getAge(String birth) {
		if ( birth == null || birth.isEmpty() ) {
			return "???";
		}
		
		Calendar now = Calendar.getInstance();
		int nowYear = now.get(Calendar.YEAR);
		int birthYear = 0;
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		try{
			Date birthObj = sdf.parse(birth);
			now.setTime(birthObj);
			birthYear =  now.get(Calendar.YEAR);
		}
		catch(ParseException e) {
			logger.info("[查询选手信息服务]转换选手生日信息错误。date:" + birth);
			return "??";
		}
		
		return String.valueOf(nowYear - birthYear + 1);
	}
	
	@Override
	public PubMatchCalendarDTO queryMatchCalendar(String dateStr) {
		PubMatchCalendarDTO calendar = MatchCalendar.queryCalendar(dateStr);
		fillCalendarDayDTOInfo(calendar);
		return calendar;
	}
	
	private void fillCalendarDayDTOInfo(PubMatchCalendarDTO calendar) {
		String month = String.format( "%4d-%02d-", calendar.getYear(), calendar.getMonth() );
		calendar.getDays().forEach(day -> {
			if( day.getDayOfMonth() == 0 ) {
				return;
			}
			String raceDay = month + String.format("%02d", day.getDayOfMonth());
			List<Match> matches = matchMapper.selectList(new QueryWrapper<Match>().lambda()
					.eq(Match::getRaceDay, raceDay )
					);
			
			if( matches != null && matches.size() > 0 ) {
				Match match = matches.get(0);
				day.setSeason(match.getSeasonId());
				day.setSchedule(match.getScheduleId());
				if ( (match.getScheduleId() >=1 && match.getScheduleId() <=4) || (match.getScheduleId() >=13 && match.getScheduleId() <=16) ) {
					day.setSets(PubCalendarDayDTO.SETS_5);
				}
				else {
					day.setSets(PubCalendarDayDTO.SETS_1);
				}
				
				if ( (match.getScheduleId() >=1 && match.getScheduleId() <=12) || (match.getScheduleId() >=13 && match.getScheduleId() <=24) ) {
					day.setType(Schedule.TYPE_REGULAR);
				}
				else {
					day.setType(Schedule.TYPE_PLAYOFF);
				}
				day.setRaceDay(raceDay);
			}
		});
	}

	@Override
	public List<PubDaymatchDTO> queryDaymatch(String dayStr) {
		DateTimeFormatter formatter = new DateTimeFormatterBuilder()
    			.appendValue(ChronoField.YEAR)
    			.appendLiteral('-')
    			.appendValue(ChronoField.MONTH_OF_YEAR)
    			.appendLiteral('-')
    			.appendValue(ChronoField.DAY_OF_MONTH)
                .toFormatter();
    	
    	TemporalAccessor accessor = formatter.parse(dayStr);
        int year = accessor.get(ChronoField.YEAR);
        int month = accessor.get(ChronoField.MONTH_OF_YEAR);
        int day = accessor.get(ChronoField.DAY_OF_MONTH);
		String raceDay = String.format("%4d-%02d-%02d", year, month, day);
		List<Match> matches = matchMapper.selectList(new QueryWrapper<Match>().lambda()
				.eq(Match::getRaceDay, raceDay )
				);
		
		Map<Integer, Map<Integer, Map<Integer, Match>>> schedules = new HashMap<Integer, Map<Integer, Map<Integer, Match>>>();;
		for(int i = 0; i<matches.size(); i++) {
			Match match = matches.get(i);
			int scheduleId = match.getScheduleId();
			int setId = match.getSetId();
			int gameId = match.getGameId();
			
			if( !schedules.containsKey(scheduleId) ) {
				schedules.put(scheduleId, new HashMap<Integer, Map<Integer, Match>>());
			}
			
			Map<Integer, Map<Integer, Match>> sets = schedules.get(scheduleId);
			if( !sets.containsKey(setId) ) {
				sets.put(setId, new HashMap<Integer, Match>());
			}
			
			Map<Integer, Match> games = sets.get(setId);
			games.put(gameId, match);
		}
		
		Map<Integer, Player> playerCache = new HashMap<Integer, Player>();
		List<PubDaymatchDTO> daymatches = new ArrayList<PubDaymatchDTO>();
		for(int scheduleId : schedules.keySet()){
		    PubDaymatchDTO daymatchInfo = null;
		    Map<Integer, Map<Integer, Match>> sets = schedules.get(scheduleId);
		    
		    Set<String> players = new HashSet<String>();
		    List<PubDaymatchSetDTO> setsInfo = new ArrayList<PubDaymatchSetDTO>();
		    
		    for(int setId : sets.keySet()){
		    	PubDaymatchSetDTO setInfo = null;
		    	Map<Integer, Match> games = sets.get(setId);
		    	
		    	int paWin = 0;
		    	int pbWin = 0;
		    	for(int gameId : games.keySet()) {
		    		Match match = games.get(gameId);
		    		if( daymatchInfo == null ) {
		    			daymatchInfo = new PubDaymatchDTO();
		    			Schedule schedule = scheduleMapper.selectById(match.getScheduleId());
		    			daymatchInfo.setTitle(schedule.getRound());
		    			daymatchInfo.setDay(match.getRaceDay());
		    		}
		    		
		    		int paId = match.getPaId();
		    		if( !playerCache.containsKey(paId) ) {
		    			Player pTemp = playerMapper.selectById(paId);
		    			playerCache.put(paId, pTemp);
		    		}
		    		int pbId = match.getPbId();
		    		if( !playerCache.containsKey(pbId) ) {
		    			Player pTemp = playerMapper.selectById(pbId);
		    			playerCache.put(pbId, pTemp);
		    		}
		    		
		    		Player pa = playerCache.get(paId);
		    		Player pb = playerCache.get(pbId);
		    		players.add(pa.getNick());
		    		players.add(pb.getNick());
		    		if( setInfo == null ) {
		    			setInfo = new PubDaymatchSetDTO();
		    			String setTitle = null;
		    			if(match.getSetId() == 1) {
		    				setTitle = daymatchInfo.getTitle() + "第一轮"; 
		    			}
		    			else if(match.getSetId() == 2) {
		    				setTitle = daymatchInfo.getTitle() + "第二轮"; 
		    			}
		    			else if(match.getSetId() == 3) {
		    				setTitle = daymatchInfo.getTitle() + "第三轮"; 
		    			}
		    			else if(match.getSetId() == 4) {
		    				setTitle = daymatchInfo.getTitle() + "第四轮"; 
		    			}
		    			else if(match.getSetId() == 5) {
		    				setTitle = daymatchInfo.getTitle() + "第五轮"; 
		    			}
		    			setInfo.setTitle(setTitle);
		    			setInfo.setSetId(match.getSetId());
		    			
		    			setInfo.setP1Nick(pa.getNick());
		    			setInfo.setP1Race(match.getPaRace());
		    			setInfo.setP1Country(pa.getCountry());
		    			
		    			setInfo.setP2Nick(pb.getNick());
		    			setInfo.setP2Race(match.getPbRace());
		    			setInfo.setP2Country(pb.getCountry());
		    		}
		    		
		    		if(match.getWinner() == Match.WINNER_A) {
		    			paWin++;
		    		}
		    		else if(match.getWinner() == Match.WINNER_B) {
		    			pbWin++;
		    		}
		    	}
		    	if(paWin > pbWin) {
		    		setInfo.setWinner(PubDaymatchSetDTO.WINNER_P1);
		    	}
		    	else if (pbWin > paWin) {
		    		setInfo.setWinner(PubDaymatchSetDTO.WINNER_P2);
		    	}
		    	setsInfo.add(setInfo);
		    }
		    daymatchInfo.setPlayers(players);
		    daymatchInfo.setSets(setsInfo);
		    daymatches.add(daymatchInfo);
		}
		
		return daymatches;
	}

	@Override
	public PubPlayerTop10 queryPlayerTop10(Map<String, Object> parm) {
		// TODO Auto-generated method stub
		return null;
	}

}
