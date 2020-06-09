package com.ilbcj.ecell.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ilbcj.ecell.dto.PlayerProfileDTO;
import com.ilbcj.ecell.service.PublicService;
import com.ilbcj.ecell.util.R;

@RestController
@RequestMapping("/public")
public class PublicController {

	@Autowired
	private PublicService publicService;
	
	@RequestMapping(value="/profile", method = RequestMethod.POST)
	public R queryPlayProfile(@RequestBody Map<String,Object> parm) {
		
		List<PlayerProfileDTO> profile = publicService.queryPlayerProfileById(parm);
		
		if(profile != null) {
			return R.ok().put("player", profile);
		}
		return R.error("查询选手数据失败，请稍后再试！");
				
	}
}