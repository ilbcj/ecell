package com.ilbcj.ecell.util;

import java.io.Serializable;
import java.util.List;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

public class PageUtils implements Serializable {
	private static final long serialVersionUID = 1L;
	/**总记录数*/
	private int totalCount;
	/**每页记录数*/
	private int pageSize;
	/**总页数*/
	private int totalPage;
	/**当前页数*/
	private int currPage;
	/**拿到加1返回*/
	private int draw;
	/**总记录数*/
	private long recordsTotal;
	/**总记录数*/
	private long recordsFiltered;
	/**开始索引*/
	private int start;
	/**每页记录数*/
	private int length;
	/**列表数据*/
	private List<?> list;
	

	/**
	 * 分页
	 */
	public PageUtils(Page<?> page) {
		this.list = page.getRecords();
		this.recordsTotal = page.getTotal();
		this.recordsFiltered = page.getTotal();
//		this.pageSize = page.getSize();
//		this.start = (page.getCurrent() - 1) * page.getSize();
//		this.length = page.getSize();
//		
//		this.totalCount = page.getTotal();
//		this.pageSize = page.getSize();
//		this.currPage = page.getCurrent();
//		this.totalPage = page.getPages();
	}

	public int getTotalCount() {
		return totalCount;
	}

	public void setTotalCount(int totalCount) {
		this.totalCount = totalCount;
	}

	public int getPageSize() {
		return pageSize;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	public int getTotalPage() {
		return totalPage;
	}

	public void setTotalPage(int totalPage) {
		this.totalPage = totalPage;
	}

	public int getCurrPage() {
		return currPage;
	}

	public void setCurrPage(int currPage) {
		this.currPage = currPage;
	}

	public List<?> getList() {
		return list;
	}

	public void setList(List<?> list) {
		this.list = list;
	}

	public int getDraw() {
		return draw;
	}

	public void setDraw(int draw) {
		this.draw = draw;
	}

	public long getRecordsTotal() {
		return recordsTotal;
	}

	public void setRecordsTotal(long recordsTotal) {
		this.recordsTotal = recordsTotal;
	}

	public long getRecordsFiltered() {
		return recordsFiltered;
	}

	public void setRecordsFiltered(long recordsFiltered) {
		this.recordsFiltered = recordsFiltered;
	}

	public int getStart() {
		return start;
	}

	public void setStart(int start) {
		this.start = start;
	}

	public int getLength() {
		return length;
	}

	public void setLength(int length) {
		this.length = length;
	}
	
}
