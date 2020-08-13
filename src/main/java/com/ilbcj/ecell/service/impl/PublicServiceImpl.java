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
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.Set;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.ilbcj.ecell.dto.PubCalendarDayDTO;
import com.ilbcj.ecell.dto.PubDaymatchDTO;
import com.ilbcj.ecell.dto.PubDaymatchSetDTO;
import com.ilbcj.ecell.dto.PubGameDTO;
import com.ilbcj.ecell.dto.PubPlayerMatchBriefDTO;
import com.ilbcj.ecell.dto.PubMatchCalendarDTO;
import com.ilbcj.ecell.dto.PubPlayerProfileDTO;
import com.ilbcj.ecell.dto.PubPlayerTop10;
import com.ilbcj.ecell.dto.PubScheduleMatchesDTO;
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

		Optional<List<String>> nicks = Optional.ofNullable((List<String>) parm.get("players"));
		nicks.orElse(new ArrayList<String>()).forEach(item -> {
			PubPlayerProfileDTO profile = new PubPlayerProfileDTO();
			Player player = playerMapper.selectOne(new QueryWrapper<Player>().lambda().eq(Player::getNick, item));
			if (player == null) {
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
				.eq(Match::getPaId, profile.getPlayerId()).or().eq(Match::getPbId, profile.getPlayerId())
				.orderByDesc(Match::getRaceDay, Match::getSetId, Match::getGameId));

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
		for (Match match : matches) {
			int winner = match.getWinner();
			if (winner == 0) {
				continue;
			}

			allSets++;
			int matchId = match.getId();
			int pa = match.getPaId();
			int pb = match.getPbId();
			int playerId = profile.getPlayerId();
			int adversaryId = 0;
			if (playerId == pa) {
				adversaryId = pb;
				adversaryRace = match.getPbRace();
			} else if (playerId == pb) {
				adversaryId = pa;
				adversaryRace = match.getPaRace();
			}
			boolean isWin = false;
			if ((playerId == pa && winner == Match.WINNER_A) || (playerId == pb && winner == Match.WINNER_B)) {
				isWin = true;
				winA++;
			}

			if (Player.RACE_T.equals(adversaryRace)) {
				vtSets++;
				if (isWin)
					winT++;
			} else if (Player.RACE_P.equals(adversaryRace)) {
				vpSets++;
				if (isWin)
					winP++;
			} else if (Player.RACE_Z.equals(adversaryRace)) {
				vzSets++;
				if (isWin)
					winZ++;
			}

			int schedule = match.getScheduleId();
			if ((schedule%24 == 0) || (schedule%24 > 12 && schedule%24 < 24) ) {
				if (isWin) {
					difference++;
				} else {
					difference--;
				}
			}

			if (count < 10) {
				PubPlayerMatchBriefDTO brief = new PubPlayerMatchBriefDTO();

				if (schedule%24 > 0 && schedule%24 <= 12) {
					brief.setType(PubPlayerMatchBriefDTO.TYPE_REGULAR);
				} else if ((schedule%24 == 0) || (schedule%24 > 12 && schedule%24 < 24) ) {
					brief.setType(PubPlayerMatchBriefDTO.TYPE_PLAYOFF);
				}

				brief.setDate(match.getRaceDay());

				if (isWin) {
					brief.setResult("WIN");
				} else {
					brief.setResult("LOSE");
				}

				Player adversary = playerMapper.selectById(adversaryId);
				brief.setAdversary(adversary.getNick());

				Ditu ditu = dituMapper.selectById(match.getMapId());
				if (ditu == null) {
					System.out.println(match.getMapId());
				}
				brief.setMap(ditu.getName());
				count++;
				briefs.add(brief);
			}

			MatchDetail detail = matchDetailMapper.selectOne(new QueryWrapper<MatchDetail>().lambda()
					.eq(MatchDetail::getMatchId, matchId).eq(MatchDetail::getPlayerId, playerId));
			if (detail == null) {
				logger.error("[查询选手信息服务]不存在指定ID的比赛信息，matchId:" + matchId + ", playerId:" + playerId);
				continue;
			}
			apmAll += detail.getApm();
			duration += detail.getDuration();
			resource += detail.getResource();
		}
		;

		float temp = 0f;
		temp = winA / allSets;
		BigDecimal b = new BigDecimal(temp);
		temp = b.setScale(2, BigDecimal.ROUND_HALF_UP).floatValue() * 100;
		profile.setWinningVA(String.valueOf((int) temp) + "%");
		profile.setVACount("" + winA + "-" + String.valueOf((int) (allSets-winA)));
		if (vtSets > 0) {
			temp = winT / vtSets;
			b = new BigDecimal(temp);
			temp = b.setScale(2, BigDecimal.ROUND_HALF_UP).floatValue() * 100;
			profile.setWinningVT(String.valueOf((int) temp) + "%");
			profile.setVTCount("" + winT + "-" + String.valueOf((int) (vtSets-winT)));
		} else {
			profile.setWinningVT("--");
			profile.setVTCount("0-0");
		}

		if (vpSets > 0) {
			temp = winP / vpSets;
			b = new BigDecimal(temp);
			temp = b.setScale(2, BigDecimal.ROUND_HALF_UP).floatValue() * 100;
			profile.setWinningVP(String.valueOf((int) temp) + "%");
			profile.setVPCount("" + winP + "-" + String.valueOf((int) (vpSets-winP)));
		} else {
			profile.setWinningVP("--");
			profile.setVPCount("0-0");
		}

		if (vzSets > 0) {
			temp = winZ / vzSets;
			b = new BigDecimal(temp);
			temp = b.setScale(2, BigDecimal.ROUND_HALF_UP).floatValue() * 100;
			profile.setWinningVZ(String.valueOf((int) temp) + "%");
			profile.setVZCount("" + winZ + "-" + String.valueOf((int) (vzSets-winZ)));
		} else {
			profile.setWinningVZ("--");
			profile.setVZCount("0-0");
		}

		temp = apmAll / allSets;
		b = new BigDecimal(temp);
		temp = b.setScale(0, BigDecimal.ROUND_HALF_UP).floatValue();
		profile.setApm(String.valueOf((int) temp));

//		temp = duration / allSets / 60;
//		b = new BigDecimal(temp);
//		temp = b.setScale(1, BigDecimal.ROUND_HALF_UP).floatValue();
//		String minute = String.valueOf((int) temp);
//		String second = String.valueOf((int) ((temp * 10 - ((int) temp) * 10)) * 6);
		String minute = String.valueOf( (int)(duration / allSets / 60) );
		String second = String.valueOf( (int)(duration / allSets) - ((int)(duration / allSets / 60)) * 60 );
		if(second.length() == 1) {
			second = "0" + second;
		}
		profile.setDuration(minute + ":" + second);

		temp = resource / (float) duration * 60;
		b = new BigDecimal(temp);
		temp = b.setScale(0, BigDecimal.ROUND_HALF_UP).floatValue();
		profile.setResource(String.valueOf((int) temp));

		profile.setDifference(String.valueOf(difference));
		profile.setLast10(briefs);

	}

	private String getAge(String birth) {
		if (birth == null || birth.isEmpty()) {
			return "???";
		}

		Calendar now = Calendar.getInstance();
		int nowYear = now.get(Calendar.YEAR);
		int birthYear = 0;
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		try {
			Date birthObj = sdf.parse(birth);
			now.setTime(birthObj);
			birthYear = now.get(Calendar.YEAR);
		} catch (ParseException e) {
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
		String month = String.format("%4d-%02d-", calendar.getYear(), calendar.getMonth());
		calendar.getDays().forEach(day -> {
			if (day.getDayOfMonth() == 0) {
				return;
			}
			String raceDay = month + String.format("%02d", day.getDayOfMonth());
			List<Match> matches = matchMapper
					.selectList(new QueryWrapper<Match>().lambda().eq(Match::getRaceDay, raceDay));

			if (matches != null && matches.size() > 0) {
				Match match = matches.get(0);
				day.setSeason(match.getSeasonId());
				day.setSchedule(match.getScheduleId());
				if ((match.getScheduleId() >= 1 && match.getScheduleId() <= 4)
						|| (match.getScheduleId() >= 13 && match.getScheduleId() <= 16)) {
					day.setSets(PubCalendarDayDTO.SETS_5);
				} else {
					day.setSets(PubCalendarDayDTO.SETS_1);
				}

				if ((match.getScheduleId() >= 1 && match.getScheduleId() <= 12)
						|| (match.getScheduleId() >= 13 && match.getScheduleId() <= 24)) {
					day.setType(Schedule.TYPE_REGULAR);
				} else {
					day.setType(Schedule.TYPE_PLAYOFF);
				}
				day.setRaceDay(raceDay);
			}
		});
	}

	@Override
	public List<PubDaymatchDTO> queryDaymatch(String dayStr) {
		DateTimeFormatter formatter = new DateTimeFormatterBuilder().appendValue(ChronoField.YEAR).appendLiteral('-')
				.appendValue(ChronoField.MONTH_OF_YEAR).appendLiteral('-').appendValue(ChronoField.DAY_OF_MONTH)
				.toFormatter();

		TemporalAccessor accessor = formatter.parse(dayStr);
		int year = accessor.get(ChronoField.YEAR);
		int month = accessor.get(ChronoField.MONTH_OF_YEAR);
		int day = accessor.get(ChronoField.DAY_OF_MONTH);
		String raceDay = String.format("%4d-%02d-%02d", year, month, day);
		List<Match> matches = matchMapper.selectList(new QueryWrapper<Match>().lambda().eq(Match::getRaceDay, raceDay));

		Map<Integer, Map<Integer, Map<Integer, Match>>> schedules = new HashMap<Integer, Map<Integer, Map<Integer, Match>>>();
		;
		for (int i = 0; i < matches.size(); i++) {
			Match match = matches.get(i);
			int scheduleId = match.getScheduleId();
			int setId = match.getSetId();
			int gameId = match.getGameId();

			if (!schedules.containsKey(scheduleId)) {
				schedules.put(scheduleId, new HashMap<Integer, Map<Integer, Match>>());
			}

			Map<Integer, Map<Integer, Match>> sets = schedules.get(scheduleId);
			if (!sets.containsKey(setId)) {
				sets.put(setId, new HashMap<Integer, Match>());
			}

			Map<Integer, Match> games = sets.get(setId);
			games.put(gameId, match);
		}

		Map<Integer, Player> playerCache = new HashMap<Integer, Player>();
		List<PubDaymatchDTO> daymatches = new ArrayList<PubDaymatchDTO>();
		for (int scheduleId : schedules.keySet()) {
			PubDaymatchDTO daymatchInfo = null;
			Map<Integer, Map<Integer, Match>> sets = schedules.get(scheduleId);

			Set<String> players = new HashSet<String>();
			List<PubDaymatchSetDTO> setsInfo = new ArrayList<PubDaymatchSetDTO>();

			for (int setId : sets.keySet()) {
				PubDaymatchSetDTO setInfo = null;
				Map<Integer, Match> games = sets.get(setId);

				int paWin = 0;
				int pbWin = 0;
				for (int gameId : games.keySet()) {
					Match match = games.get(gameId);
					if (daymatchInfo == null) {
						daymatchInfo = new PubDaymatchDTO();
						Schedule schedule = scheduleMapper.selectById(match.getScheduleId());
						daymatchInfo.setTitle(schedule.getRound());
						daymatchInfo.setDay(match.getRaceDay());
					}

					int paId = match.getPaId();
					if (!playerCache.containsKey(paId)) {
						Player pTemp = playerMapper.selectById(paId);
						playerCache.put(paId, pTemp);
					}
					int pbId = match.getPbId();
					if (!playerCache.containsKey(pbId)) {
						Player pTemp = playerMapper.selectById(pbId);
						playerCache.put(pbId, pTemp);
					}

					Player pa = playerCache.get(paId);
					Player pb = playerCache.get(pbId);
					players.add(pa.getNick());
					players.add(pb.getNick());
					if (setInfo == null) {
						setInfo = new PubDaymatchSetDTO();
						String setTitle = null;
						if (match.getSetId() == 1) {
							setTitle = daymatchInfo.getTitle() + "第一轮";
						} else if (match.getSetId() == 2) {
							setTitle = daymatchInfo.getTitle() + "第二轮";
						} else if (match.getSetId() == 3) {
							setTitle = daymatchInfo.getTitle() + "第三轮";
						} else if (match.getSetId() == 4) {
							setTitle = daymatchInfo.getTitle() + "第四轮";
						} else if (match.getSetId() == 5) {
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

					if (match.getWinner() == Match.WINNER_A) {
						paWin++;
					} else if (match.getWinner() == Match.WINNER_B) {
						pbWin++;
					}
				}
				if (paWin > pbWin) {
					setInfo.setWinner(PubDaymatchSetDTO.WINNER_P1);
				} else if (pbWin > paWin) {
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
	public List<PubPlayerTop10> queryPlayerTop10(Integer type, String sort) {
		//List<PubPlayerTop10> top10 = null;

		// get players
		List<Player> players = playerMapper.selectList(Wrappers.<Player>lambdaQuery()
				.select(Player::getId, Player::getNick, Player::getCountry).eq(Player::getStatus, Player.STATUS_INUSE));
		Map<Integer, PubPlayerTop10> top10Map = new HashMap<Integer, PubPlayerTop10>();
		players.forEach(player -> {
			PubPlayerTop10 item = new PubPlayerTop10();
			item.setId(player.getId());
			item.setNick(player.getNick());
			item.setCountry(player.getCountry());
			top10Map.put(player.getId(), item);
		});

		// get matches
		List<Match> matches = matchMapper
				.selectList(new QueryWrapper<Match>().lambda().ne(Match::getWinner, Match.WINNER_INIT));

		List<PubPlayerTop10> top10 = new ArrayList<PubPlayerTop10>();
		// caculate winning, apm and resource
		queryPlayerTop10ByWinning(top10Map, matches);
		queryPlayerTop10ByApm(top10Map, matches);
		queryPlayerTop10ByResource(top10Map, matches);

		Iterator<Entry<Integer, PubPlayerTop10>> entries = top10Map.entrySet().iterator();
		while (entries.hasNext()) {
			Entry<Integer, PubPlayerTop10> entry = entries.next();
			PubPlayerTop10 value = entry.getValue();
			top10.add(value);
		}
		
		if(type == PubPlayerTop10.TYPE_WINNING) { 
			Collections.sort(top10, new Comparator<PubPlayerTop10>() {  
				  
		          @Override  
		          public int compare(PubPlayerTop10 o1, PubPlayerTop10 o2) {
		        	  int win1 = Integer.parseInt(o1.getWinning().substring(0, o1.getWinning().length()-1));
		        	  int win2 = Integer.parseInt(o2.getWinning().substring(0, o2.getWinning().length()-1));
		        	  int i = win2 - win1;
		              return i;  
		          }  
				});
				
				top10 = top10.subList(0, 10);
				if(PubPlayerTop10.SORT_ASC.equals(sort)) {
					Collections.sort(top10, new Comparator<PubPlayerTop10>() {  
						  
			            @Override  
			            public int compare(PubPlayerTop10 o1, PubPlayerTop10 o2) {
			            	int win1 = Integer.parseInt(o1.getWinning().substring(0, o1.getWinning().length()-1));
			            	int win2 = Integer.parseInt(o2.getWinning().substring(0, o2.getWinning().length()-1));
			            	int i = win1 - win2;
			                return i;  
			            }  
			        });
				}
		} 
		else if(type ==	PubPlayerTop10.TYPE_APM) { 
			Collections.sort(top10, new Comparator<PubPlayerTop10>() {  
				  
	          @Override  
	          public int compare(PubPlayerTop10 o1, PubPlayerTop10 o2) {
	        	  int apm1 = Integer.parseInt(o1.getApm());
	        	  int apm2 = Integer.parseInt(o2.getApm());
	        	  int i = apm2 - apm1;
	              return i;  
	          }  
	      });
			
			top10 = top10.subList(0, 10);
			
			if(PubPlayerTop10.SORT_ASC.equals(sort)) {
				Collections.sort(top10, new Comparator<PubPlayerTop10>() {  
					  
		            @Override  
		            public int compare(PubPlayerTop10 o1, PubPlayerTop10 o2) {
		            	int apm1 = Integer.parseInt(o1.getApm());
			        	  int apm2 = Integer.parseInt(o2.getApm());
			        	  int i = apm1 - apm2;
		                return i;  
		            }  
		        });
			}
		}
		else if( type == PubPlayerTop10.TYPE_RESOURCE) { 
			Collections.sort(top10, new Comparator<PubPlayerTop10>() {  
			  
	          @Override  
	          public int compare(PubPlayerTop10 o1, PubPlayerTop10 o2) {
	        	  int r1 = Integer.parseInt(o1.getResource());
	        	  int r2 = Integer.parseInt(o2.getResource());
	        	  int i = r2 - r1;
	          	  return i;  
	          }  
			});
			
			top10 = top10.subList(0, 10);
			if(PubPlayerTop10.SORT_ASC.equals(sort)) {
				Collections.sort(top10, new Comparator<PubPlayerTop10>() {  
					  
		            @Override  
		            public int compare(PubPlayerTop10 o1, PubPlayerTop10 o2) {
		            	int r1 = Integer.parseInt(o1.getResource());
			        	  int r2 = Integer.parseInt(o2.getResource());
			        	  int i = r1 - r2;
		                return i;  
		            }  
		        });
			}
		}
		

		return top10;
	}

	private void queryPlayerTop10ByWinning(Map<Integer, PubPlayerTop10> top10Map, List<Match> matches) {

		Map<Integer, Integer> allSets = new HashMap<Integer, Integer>();
		Map<Integer, Integer> winSets = new HashMap<Integer, Integer>();
		matches.forEach(match -> {
			int winnerId = 0;
			int loserId = 0;
			if (Match.WINNER_A == match.getWinner()) {
				winnerId = match.getPaId();
				loserId = match.getPbId();
			} else if (Match.WINNER_B == match.getWinner()) {
				winnerId = match.getPbId();
				loserId = match.getPaId();
			}

			if (allSets.containsKey(winnerId)) {
				allSets.put(winnerId, allSets.get(winnerId) + 1);
			} else {
				allSets.put(winnerId, 1);
			}

			if (winSets.containsKey(winnerId)) {
				winSets.put(winnerId, winSets.get(winnerId) + 1);
			} else {
				winSets.put(winnerId, 1);
			}

			if (allSets.containsKey(loserId)) {
				allSets.put(loserId, allSets.get(loserId) + 1);
			} else {
				allSets.put(loserId, 1);
			}

		});

		Iterator<Entry<Integer, PubPlayerTop10>> entries = top10Map.entrySet().iterator();
		while (entries.hasNext()) {
			Entry<Integer, PubPlayerTop10> entry = entries.next();
			Integer key = entry.getKey();
			PubPlayerTop10 value = entry.getValue();

			int win = 0;
			if (winSets.containsKey(key)) {
				win = winSets.get(key);
			}
			float all = 0;
			if (allSets.containsKey(key)) {
				all = allSets.get(key);
			}
			float temp = 0f;
			if (win > 0) {
				temp = win / all;
			}
			BigDecimal b = new BigDecimal(temp);
			temp = b.setScale(2, BigDecimal.ROUND_HALF_UP).floatValue() * 100;
			value.setWinning(String.valueOf((int) temp) + "%");
		}

		return;
	}

	private void queryPlayerTop10ByApm(Map<Integer, PubPlayerTop10> top10Map, List<Match> matches) {

		Map<Integer, Integer> allSets = new HashMap<Integer, Integer>();
		Map<Integer, Integer> apmMap = new HashMap<Integer, Integer>();

		matches.forEach(match -> {
			List<MatchDetail> details = matchDetailMapper
					.selectList(new QueryWrapper<MatchDetail>().lambda().eq(MatchDetail::getMatchId, match.getId()));

			details.forEach(detail -> {
				int pid = detail.getPlayerId();
				if (allSets.containsKey(pid)) {
					allSets.put(pid, allSets.get(pid) + 1);
				} else {
					allSets.put(pid, 1);
				}

				if (apmMap.containsKey(pid)) {
					apmMap.put(pid, apmMap.get(pid) + detail.getApm());
				} else {
					apmMap.put(pid, detail.getApm());
				}
			});
		});

		Iterator<Entry<Integer, PubPlayerTop10>> entries = top10Map.entrySet().iterator();
		while (entries.hasNext()) {
			Entry<Integer, PubPlayerTop10> entry = entries.next();
			Integer key = entry.getKey();
			PubPlayerTop10 value = entry.getValue();

			float all = 0;
			if (allSets.containsKey(key)) {
				all = allSets.get(key);
			}
			int apm = 0;
			if (apmMap.containsKey(key)) {
				apm = apmMap.get(key);
			}
			float temp = 0;
			if (apm > 0) {
				temp = apm / all;
			}
			BigDecimal b = new BigDecimal(temp);
			temp = b.setScale(0, BigDecimal.ROUND_HALF_UP).floatValue();
			value.setApm(String.valueOf((int) temp));
		}
		return;
	}

	private void queryPlayerTop10ByResource(Map<Integer, PubPlayerTop10> top10Map, List<Match> matches) {
		Map<Integer, Integer> duratonMap = new HashMap<Integer, Integer>();
		Map<Integer, Integer> resourceMap = new HashMap<Integer, Integer>();

		matches.forEach(match -> {
			List<MatchDetail> details = matchDetailMapper
					.selectList(new QueryWrapper<MatchDetail>().lambda().eq(MatchDetail::getMatchId, match.getId()));

			details.forEach(detail -> {
				int pid = detail.getPlayerId();
				if (duratonMap.containsKey(pid)) {
					duratonMap.put(pid, duratonMap.get(pid) + detail.getDuration());
				} else {
					duratonMap.put(pid, detail.getDuration());
				}

				if (resourceMap.containsKey(pid)) {
					resourceMap.put(pid, resourceMap.get(pid) + detail.getResource());
				} else {
					resourceMap.put(pid, detail.getResource());
				}
			});
		});

		Iterator<Entry<Integer, PubPlayerTop10>> entries = top10Map.entrySet().iterator();
		while (entries.hasNext()) {
			Entry<Integer, PubPlayerTop10> entry = entries.next();
			Integer key = entry.getKey();
			PubPlayerTop10 value = entry.getValue();

			float duration = 0;
			if (duratonMap.containsKey(key)) {
				duration = duratonMap.get(key);
			}
			int resource = 0;
			if (resourceMap.containsKey(key)) {
				resource = resourceMap.get(key);
			}
			float temp = 0;
			if (resource > 0) {
				temp = resource / duration * 60;
			}
			BigDecimal b = new BigDecimal(temp);
			temp = b.setScale(0, BigDecimal.ROUND_HALF_UP).floatValue();
			value.setResource(String.valueOf((int) temp));
		}
		return;
	}

	@Override
	public List<PubScheduleMatchesDTO> queryScheduleMatches(String date) {
		List<PubScheduleMatchesDTO> scheduleMatches = new ArrayList<PubScheduleMatchesDTO>();
		
		//选手信息缓存
		List<Player> playersBasic = playerMapper.selectList(
			Wrappers.<Player>lambdaQuery().select(Player::getId, Player::getNick, Player::getCountry)
				.eq(Player::getStatus, Player.STATUS_INUSE)
		);
		Map<Integer, Player> playerMap = new HashMap<Integer, Player>();
		for(Player player: playersBasic) {
			playerMap.put(player.getId(), player);
		}
		
		//get schedule
		LambdaQueryWrapper<Match> lambdaQueryWrapper = new QueryWrapper<Match>().lambda()
			    .select(Match::getScheduleId)
			    .eq(Match::getRaceDay, date)
			    .groupBy(Match::getScheduleId);
		for (Match matchSchedule : matchMapper.selectList(lambdaQueryWrapper)) {
			int scheduleId = matchSchedule.getScheduleId();
			PubScheduleMatchesDTO scheduleMatch = new PubScheduleMatchesDTO();
			Set<String> playerNicks = new HashSet<String>();
			List<PubDaymatchSetDTO> sets = new ArrayList<PubDaymatchSetDTO>();
			scheduleMatch.setDay(date);
			scheduleMatch.setScheduleId(scheduleId);
			Schedule schedule = scheduleMapper.selectById(scheduleId);
			scheduleMatch.setTitle(schedule.getRound());
			
			//get sets
			lambdaQueryWrapper = new QueryWrapper<Match>().lambda()
				    .select(Match::getSetId)
				    .eq(Match::getScheduleId, scheduleId)
				    .groupBy(Match::getSetId);
			for (Match matchSet : matchMapper.selectList(lambdaQueryWrapper)) {
				int setId = matchSet.getSetId();
				
				PubDaymatchSetDTO matchSetInfo = new PubDaymatchSetDTO();
				matchSetInfo.setSetId(setId);
				//get setsinfo
				List<Match> matches = matchMapper.selectList(new QueryWrapper<Match>().lambda()
						.eq(Match::getScheduleId, scheduleId)
						.eq(Match::getSetId, setId));
				
				int paWinCount = 0;
				int pbWinCount = 0;
				for (Match match : matches) {
					int winner = match.getWinner();
					if (winner == 0) {
						continue;
					}
					
					if(winner == Match.WINNER_A) {
						paWinCount++;
					}
					else if(winner == Match.WINNER_B) {
						pbWinCount++;
					}
					
					//根据两人第一局信息获取选手信息、种族信息、国家信息
					if(match.getGameId() == 1) {
						Player p1 = playerMap.get(match.getPaId());
						matchSetInfo.setP1Nick(p1.getNick());
						matchSetInfo.setP1Country(p1.getCountry());
						matchSetInfo.setP1Race(match.getPaRace());
						playerNicks.add(p1.getNick());
						
						Player p2 = playerMap.get(match.getPbId());
						matchSetInfo.setP2Nick(p2.getNick());
						matchSetInfo.setP2Country(p2.getCountry());
						matchSetInfo.setP2Race(match.getPbRace());
						playerNicks.add(p2.getNick());
						
						matchSetInfo.setTitle(scheduleMatch.getTitle() + " 第" + setId + "轮");
					}
				}
				
				if(paWinCount > pbWinCount) {
					matchSetInfo.setWinner(Match.WINNER_A);
				}
				else if(paWinCount < pbWinCount) {
					matchSetInfo.setWinner(Match.WINNER_B);
				}
				
				sets.add(matchSetInfo);
			}
			
			scheduleMatch.setPlayers(playerNicks);
			scheduleMatch.setSets(sets);
			scheduleMatches.add(scheduleMatch);
		}
			
		return scheduleMatches;
	}
	
	@Override
	public List<PubGameDTO> queryScheduleMatchSet(int scheduleId, int setId) {
		List<PubGameDTO> scheduleMatchSet = new ArrayList<PubGameDTO>();
		
		List<Match> matches = matchMapper.selectList(new QueryWrapper<Match>().lambda()
				.eq(Match::getScheduleId, scheduleId)
				.eq(Match::getSetId, setId));
		
		for (Match match : matches) {
			int winner = match.getWinner();
			if (winner == 0) {
				continue;
			}
			
			PubGameDTO gameInfo = new PubGameDTO();
			gameInfo.setGameid(match.getGameId());
			
			Ditu ditu = dituMapper.selectById(match.getMapId());
			if (ditu == null) {
				logger.error("[查询比赛日对战信息服务]地图不存在，mapid:" + match.getMapId());
			}
			gameInfo.setMapName(ditu.getName());
			
			int matchId = match.getId();
			MatchDetail detailPa = matchDetailMapper.selectOne(new QueryWrapper<MatchDetail>().lambda()
					.eq(MatchDetail::getMatchId, matchId).eq(MatchDetail::getPlayerId, match.getPaId()));
			if (detailPa == null) {
				logger.error("[查询比赛日对战信息服务]不存在指定ID的比赛信息，matchId:" + matchId + ", playerId:" + match.getPaId());
				continue;
			}
			else {
				gameInfo.setPaApm(detailPa.getApm());
				gameInfo.setPaCastyle(detailPa.getCrystal());
				gameInfo.setPaOil(detailPa.getOil());
			}

			MatchDetail detailPb = matchDetailMapper.selectOne(new QueryWrapper<MatchDetail>().lambda()
					.eq(MatchDetail::getMatchId, matchId).eq(MatchDetail::getPlayerId, match.getPbId()));
			if (detailPb == null) {
				logger.error("[查询比赛日对战信息服务]不存在指定ID的比赛信息，matchId:" + matchId + ", playerId:" + match.getPbId());
				continue;
			}
			else {
				gameInfo.setPbApm(detailPb.getApm());
				gameInfo.setPbCastyle(detailPb.getCrystal());
				gameInfo.setPbOil(detailPb.getOil());
			}
			
			int duration = detailPb.getDuration();
			int temp = duration / 60;
			String minute = String.valueOf(temp);
			String second = String.valueOf( duration - temp*60 );
			if( second.length() == 1) {
				second = "0"+second;
			}
			gameInfo.setDuration(minute + ":" + second);
			
			gameInfo.setWinner(match.getWinner());
		
			scheduleMatchSet.add(gameInfo);
		}
		return scheduleMatchSet;
	}

}
