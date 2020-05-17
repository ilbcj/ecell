package com.ilbcj.ecell.service;
import java.util.List;
import java.util.Map;

import com.ilbcj.ecell.entity.Player;
import com.ilbcj.ecell.util.PageUtils;


public interface PlayerService {
	/**
	 * 新增选手
	 * @param parm 
	 * @return 是否新增成功
	 */
	boolean insertPlayer(Map<String,Object> parm);
	/**
	 * 选手列表分页
	 * @param params
	 * @return
	 */
	PageUtils queryPage(Map<String, Object> params);
	/**
	 * 更新选手状态
	 * @param params
	 * @return
	 */
	boolean updatePlayerStatus(Map<String, Object> params);
	/**
	 * 选手信息
	 * @param params
	 * @return
	 */
	Player detailPlayer(Map<String, Object> params);
	/**
	 * 修改选手信息
	 * @param params
	 * @return
	 */
	boolean updatePlayer(Map<String, Object> params);
	/**
	 * 判断该系统是否存在某个选手账号
	 * @param params
	 * @return
	 */
	boolean isExistPlayer(Map<String, Object> params);
	/**
	 * 删除选手信息--逻辑删除
	 * @param params
	 * @return
	 */
	boolean deletePlayer(Map<String, Object> parm);
	List<Player> queryBasic(Map<String, Object> params);
}