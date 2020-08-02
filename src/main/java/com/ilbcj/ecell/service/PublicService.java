package com.ilbcj.ecell.service;

import java.util.List;
import java.util.Map;

import com.ilbcj.ecell.dto.PubDaymatchDTO;
import com.ilbcj.ecell.dto.PubGameDTO;
import com.ilbcj.ecell.dto.PubMatchCalendarDTO;
import com.ilbcj.ecell.dto.PubPlayerProfileDTO;
import com.ilbcj.ecell.dto.PubPlayerTop10;
import com.ilbcj.ecell.dto.PubScheduleMatchesDTO;

public interface PublicService {

	public List<PubPlayerProfileDTO> queryPlayerProfileById(Map<String, Object> parm);

	public PubMatchCalendarDTO queryMatchCalendar(String dateStr);

	public List<PubDaymatchDTO> queryDaymatch(String day);

	public List<PubPlayerTop10> queryPlayerTop10(Integer type, String sort);

	public List<PubScheduleMatchesDTO> queryScheduleMatches(String date);

	public List<PubGameDTO> queryScheduleMatchSet(int scheduleId, int setId);
}
