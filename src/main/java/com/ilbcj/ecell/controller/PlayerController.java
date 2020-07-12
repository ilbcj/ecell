package com.ilbcj.ecell.controller;

import java.io.File;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ilbcj.ecell.entity.Player;
import com.ilbcj.ecell.service.PlayerService;
import com.ilbcj.ecell.util.PageUtils;
import com.ilbcj.ecell.util.R;


@RestController
@RequestMapping("/player")
public class PlayerController {
	
	@Value("${web.upload-path}")
	private String picPath;
	
	@Autowired
	private PlayerService playerService;
	/**
	 * 
	 * @param parm
	 * @return
	 */
	@RequestMapping(value="/regist", method = RequestMethod.POST)
	public R registPlayer(@RequestBody Map<String,Object> parm) {
		boolean isExist=playerService.isExistPlayer(parm);
		if(isExist) {
			return R.error("选手注册失败，该账号已经存在！");
		}
		boolean result=playerService.insertPlayer(parm);
		
		if(result) {
			return R.ok();
		}
		return R.error("选手添加失败，请联系系统管理员！");
				
	}
	
	@RequestMapping(value="/delete", method = RequestMethod.POST)
	public R deletePlayer(@RequestBody Map<String,Object> parm) {
		boolean result=playerService.deletePlayer(parm);
		if(result) {
			return R.ok();
		}
		return R.error("选手状态更改失败！");
				
	}
	
	@RequestMapping(value="/status", method = RequestMethod.POST)
	public R updatePlayerStatus(@RequestBody Map<String,Object> parm) {
		boolean result=playerService.updatePlayerStatus(parm);
		if(result) {
			return R.ok();
		}
		return R.error("选手状态更改失败！");
				
	}
	@RequestMapping(value="/detail", method = RequestMethod.POST)
	public R playerDetail(@RequestBody Map<String,Object> parm) {
		Player player = playerService.detailPlayer(parm);
		if(player != null) {
			return R.ok().put("player", player);
		}
		return R.error("选手信息加载失败！");
	}
	@RequestMapping(value="/modfiy", method = RequestMethod.POST)
	public R updatePlayer(@RequestBody Map<String,Object> parm) {
		boolean result=playerService.updatePlayer(parm);
		if(result) {
			return R.ok();
		}
		return R.error("选手更改失败！");
	}
	/**
	 * 选手列表
	 */
	@RequestMapping(value="/list", method = RequestMethod.POST)
	@ResponseBody
	public R list(@RequestParam Map<String, Object> params) {
		if (params.isEmpty()) {
			return R.error("分页参数为空");
		} else {
			Integer draw = 0;
			String drawValue = "draw";
			if (params.get(drawValue) != null) {
				draw = Integer.parseInt((String) params.get("draw")) + 1;
			}
			PageUtils page = playerService.queryPage(params);
			@SuppressWarnings("unchecked")
			List<Player>list=(List<Player>) page.getList();
			Collections.sort(list);
			return R.ok().put("draw", page.getDraw()).put("recordsTotal", page.getRecordsTotal())
					.put("recordsFiltered", page.getRecordsFiltered()).put("start", page.getStart())
					.put("length", page.getLength()).put("draw", draw).put("list", list);
		}
	}
	
	/**
	 * 选手基础信息列表
	 */
	@RequestMapping(value="/basic/list", method = RequestMethod.POST)
	@ResponseBody
	public R listBasic(@RequestParam Map<String, Object> params) {
			List<Player> list = playerService.queryBasic();
			return R.ok().put("list", list);
	}
	
	@RequestMapping(value = "/picture/upload")
    public R fileUpload(@RequestParam(value = "playerPic") MultipartFile file) {
        if (file.isEmpty()) {
            System.out.println("文件为空空");
        }
        String fileName = file.getOriginalFilename();  // 文件名
        String suffixName = fileName.substring(fileName.lastIndexOf("."));  // 后缀名
        //String filePath = "D://temp-rainy//"; // 上传后的路径
        fileName = UUID.randomUUID() + suffixName; // 新文件名
        File dest = new File(picPath + fileName);
        if (!dest.getParentFile().exists()) {
            dest.getParentFile().mkdirs();
        }
        try {
            file.transferTo(dest);
        } catch (IOException e) {
            return R.error("保存图片失败");
        }
        return R.ok().put("picName", fileName);
    }
	
}
