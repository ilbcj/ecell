package com.ilbcj.ecell.service;

import java.util.List;
import java.util.Map;

import com.ilbcj.ecell.dto.PubDaymatchDTO;
import com.ilbcj.ecell.dto.PubMatchCalendarDTO;
import com.ilbcj.ecell.dto.PubPlayerProfileDTO;
import com.ilbcj.ecell.dto.PubPlayerTop10;

public interface PublicService {

	public List<PubPlayerProfileDTO> queryPlayerProfileById(Map<String, Object> parm);

	public PubMatchCalendarDTO queryMatchCalendar(String dateStr);

	public List<PubDaymatchDTO> queryDaymatch(String day);

	public PubPlayerTop10 queryPlayerTop10(Integer type, String sort);
}
