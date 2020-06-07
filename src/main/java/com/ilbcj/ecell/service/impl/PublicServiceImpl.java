package com.ilbcj.ecell.service.impl;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.ilbcj.ecell.dto.MatchBriefDTO;
import com.ilbcj.ecell.dto.PlayerProfileDTO;
import com.ilbcj.ecell.entity.Ditu;
import com.ilbcj.ecell.entity.Match;
import com.ilbcj.ecell.entity.MatchDetail;
import com.ilbcj.ecell.entity.Player;
import com.ilbcj.ecell.mapper.DituMapper;
import com.ilbcj.ecell.mapper.MatchDetailMapper;
import com.ilbcj.ecell.mapper.MatchMapper;
import com.ilbcj.ecell.mapper.PlayerMapper;
import com.ilbcj.ecell.service.PublicService;

@Service("publicService")
public class PublicServiceImpl implements PublicService {

	private Logger logger = LoggerFactory.getLogger(PublicServiceImpl.class);
			
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
	public List<PlayerProfileDTO> queryPlayerProfileById(Map<String, Object> parm) {
		List<PlayerProfileDTO> result = new ArrayList<PlayerProfileDTO>();
		
		Optional<List<String>> nicks = Optional.ofNullable( (List<String>)parm.get("players") );
		nicks.orElse(new ArrayList<String>()).forEach(item -> {
			PlayerProfileDTO profile = new PlayerProfileDTO();
			Player player = playerMapper.selectOne(new QueryWrapper<Player>().lambda().eq(Player::getNick, item));
			if( player == null ) {
				logger.error("[查询选手信息服务]不存在指定ID的选手。ID:" + item);
				return;
			}
			profile.setPlayerId(player.getId());
			profile.setNick(item);
			profile.setName(player.getName());
			profile.setAge(getAge(player.getBirth()));
			profile.setRace(player.getRace());
			profile.setTeam(player.getTeamName());
			
			fillPlayerDetail(profile);

			result.add(profile);
		});
		
		return result;
	}

	private void fillPlayerDetail(PlayerProfileDTO profile) {
		
		List<Match> matches = matchMapper.selectList(new QueryWrapper<Match>().lambda()
				.eq(Match::getPaId, profile.getPlayerId())
				.or()
				.eq(Match::getPbId, profile.getPlayerId())
				//.orderByDesc(Match::getRaceDay, Match::getSetId, Match::getGameId)
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
		List<MatchBriefDTO> briefs = new ArrayList<MatchBriefDTO>();
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
				MatchBriefDTO brief = new MatchBriefDTO();
				
				if( schedule > 0 && schedule <= 12 ) {
					brief.setType(MatchBriefDTO.TYPE_REGULAR);
				}
				else if( schedule > 12 && schedule <= 24 ) {
					brief.setType(MatchBriefDTO.TYPE_PLAYOFF);
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
		if( vtSets > 0 ) {
			temp = winT/vtSets;
			b = new BigDecimal(temp);
			temp = b.setScale(2, BigDecimal.ROUND_HALF_UP).floatValue() * 100;
			profile.setWinningVT(String.valueOf((int)temp) + "%");
		}
		else {
			profile.setWinningVT("--");
		}
		
		if( vpSets > 0 ) {
			temp = winP/vpSets;
			b = new BigDecimal(temp);
			temp = b.setScale(2, BigDecimal.ROUND_HALF_UP).floatValue() * 100;
			profile.setWinningVP(String.valueOf((int)temp) + "%");
		}
		else {
			profile.setWinningVP("--");
		}
		
		if( vzSets > 0 ) {
			temp = winZ/vzSets;
			b = new BigDecimal(temp);
			temp = b.setScale(2, BigDecimal.ROUND_HALF_UP).floatValue() * 100;
			profile.setWinningVZ(String.valueOf((int)temp) + "%");
		}
		else {
			profile.setWinningVZ("--");
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

}
