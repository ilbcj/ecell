package com.ilbcj.ecell.service;

import java.util.List;
import java.util.Map;

import com.ilbcj.ecell.dto.PlayerProfileDTO;

public interface PublicService {

	List<PlayerProfileDTO> queryPlayerProfileById(Map<String, Object> parm);

}
