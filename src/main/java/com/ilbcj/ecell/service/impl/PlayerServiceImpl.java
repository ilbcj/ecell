package com.ilbcj.ecell.service.impl;

import java.util.HashMap;
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
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ilbcj.ecell.entity.Player;
import com.ilbcj.ecell.mapper.PlayerMapper;
import com.ilbcj.ecell.service.PlayerService;
import com.ilbcj.ecell.util.PageUtils;
import com.ilbcj.ecell.util.Query;

@Service("playerService")
public class PlayerServiceImpl extends ServiceImpl<PlayerMapper, Player> implements PlayerService{

	@Resource
    private PlayerMapper playerMapper;
	
	private Logger logger = LoggerFactory.getLogger(PlayerServiceImpl.class);
	
	@Override
	public boolean insertPlayer(Map<String, Object> parm) {
		Player player = new Player();
		String nick=parm.get("nick").toString();
		Player pe = playerMapper.selectOne(new QueryWrapper<Player>().lambda().eq(Player::getNick, nick));
		if(pe != null) {
			return false;
		}
		player.setNick(nick);
		
		Optional<String> name = Optional.ofNullable( (String)parm.get("name") );
		player.setName(name.orElse(""));
		
		Optional<Integer> gender = Optional.ofNullable( (Integer)parm.get("gender") );
		player.setGender(gender.orElse(Player.GENDER_UNSET));
		
		Optional<String> race = Optional.ofNullable( (String)parm.get("race") );
		player.setRace(race.orElse(""));

		Optional<String> country = Optional.ofNullable( (String)parm.get("country") );
		player.setCountry(country.orElse(""));
		
		Optional<String> birth = Optional.ofNullable( (String)parm.get("birth") );
		player.setBirth(birth.orElse(""));
		
		Optional<String> picture = Optional.ofNullable( (String)parm.get("picture") );
		player.setPicture(picture.orElse(""));
		
		Optional<String> teamName = Optional.ofNullable( (String)parm.get("teanName") );
		player.setTeamName(teamName.orElse(""));
		
		Optional<String> qq = Optional.ofNullable( (String)parm.get("qq") );
		player.setQq(qq.orElse(""));
		
		Optional<String> wechat = Optional.ofNullable( (String)parm.get("wechat") );
		player.setWechat(wechat.orElse(""));
		
		Optional<String> tel = Optional.ofNullable( (String)parm.get("tel") );
		player.setTel(tel.orElse(""));
		
		player.setStatus(Player.STATUS_INUSE);
		
		int ret =  playerMapper.insert(player);
		if( ret > 0 ) {
			return true;
		}
 		return false;
	}

	@Override
	public PageUtils queryPage(Map<String, Object> params) {
		String nick = (String) params.get("nick");
		String name = (String) params.get("name");
		
		Page<Player> nickIPage = playerMapper.selectPage(new Query<Player>(params).getPage(),
				Wrappers.<Player>lambdaQuery().like(Player::getNick, nick).like(Player::getName, name));
		return new PageUtils(nickIPage);
	}

	@Override
	public boolean updatePlayerStatus(Map<String, Object> params) {
		Map<String, Object> upStatus = new HashMap<String, Object>();
		upStatus.put("nick", params.get("nick"));
		upStatus.put("status", params.get("status"));
		return updatePlayer(upStatus);
	}

	@Override
	public Player detailPlayer(Map<String, Object> params) {
		String nick = params.get("nick").toString();
		return playerMapper.selectOne(new QueryWrapper<Player>().lambda().eq(Player::getNick, nick));
	}
	
	@Transactional
	@Override
	public boolean updatePlayer(Map<String, Object> params) {
		String nick = params.get("nick").toString();
		
		Player player = new Player();
		Optional<String> name = Optional.ofNullable( (String)params.get("name") );
		player.setName(name.orElse(null));
		
		Optional<Integer> gender = Optional.ofNullable( (Integer)params.get("gender") );
		player.setGender(gender.orElse(null));
		
		Optional<String> race = Optional.ofNullable( (String)params.get("race") );
		player.setRace(race.orElse(null));

		Optional<String> country = Optional.ofNullable( (String)params.get("country") );
		player.setCountry(country.orElse(null));
		
		Optional<String> birth = Optional.ofNullable( (String)params.get("birth") );
		player.setBirth(birth.orElse(null));
		
		Optional<String> picture = Optional.ofNullable( (String)params.get("picture") );
		player.setPicture(picture.orElse(null));
		
		Optional<String> teamName = Optional.ofNullable( (String)params.get("teanName") );
		player.setTeamName(teamName.orElse(null));
		
		Optional<String> qq = Optional.ofNullable( (String)params.get("qq") );
		player.setQq(qq.orElse(null));
		
		Optional<String> wechat = Optional.ofNullable( (String)params.get("wechat") );
		player.setWechat(wechat.orElse(null));
		
		Optional<String> tel = Optional.ofNullable( (String)params.get("tel") );
		player.setTel(tel.orElse(null));
		
		Optional<Integer> status = Optional.ofNullable( (Integer)params.get("status") );
		player.setStatus(status.orElse(null));
		int ret = playerMapper.update(
				player,
                Wrappers.<Player>lambdaUpdate().eq(Player::getNick, nick)
        );
		if( ret == 0 ) {
			logger.info("没有匹配的记录被修改");
			return false;
		}
		return true;
	}

	@Override
	public boolean isExistPlayer(Map<String, Object> params) {
		String nick = params.get("nick").toString();
		Player player = playerMapper.selectOne(new QueryWrapper<Player>().lambda().eq(Player::getNick, nick));
		if(player == null) {
			return false;
		}
		return true;
	}
	

}
