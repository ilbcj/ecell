package com.ilbcj.ecell.util;


import org.apache.commons.lang.StringUtils;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import java.util.LinkedHashMap;
import java.util.Map;

public class Query<T> extends LinkedHashMap<String, Object> {
	private static final long serialVersionUID = 1L;
    /**
     * mybatis-plus分页参数
     */
    private Page<T> page;
    /**
     * 当前页码
     */
    private int currPage = 1;
    /**
     * 每页条数
     */
    private int limit = 10;
    /**拿到加1返回*/
    private int draw;
    /**开始索引*/
	private int start;
	/**每页记录数*/
	private int length;

    public Query(Map<String, Object> params){
    	String drawPar = "draw";
    	String startPar = "start";
    	String lengthPar = "length";
    	String pagePar = "page";
    	String limitPar = "limit";
        this.putAll(params);
        /**ADMINLTE分页参数*/
        if(params.get(drawPar) != null){
        	draw = Integer.parseInt((String)params.get(drawPar)) + 1;
        }
        if(params.get(startPar) != null){
        	start = Integer.parseInt((String)params.get(startPar));
        }
        if(params.get(lengthPar) != null){
        	length = Integer.parseInt((String)params.get(lengthPar));
        }
        /**普通分页参数*/
        if(params.get(pagePar) != null){
            currPage = Integer.parseInt((String)params.get(pagePar));
        }
        if(params.get(limitPar) != null){
            limit = Integer.parseInt((String)params.get(limitPar));
        }
        /**当前页第一条数据索引*/
        this.put("start", start);
        this.put("length", length);
        this.put("draw", draw);
        
        this.put("offset", (currPage - 1) * limit);
        this.put("page", currPage);
        this.put("limit", limit);

        //防止SQL注入（因为sidx、order是通过拼接SQL实现排序的，会有SQL注入风险）
        String sidx = SqlFilter.sqlInject((String)params.get("sidx"));
        String order = SqlFilter.sqlInject((String)params.get("order"));
        this.put("sidx", sidx);
        this.put("order", order);

        //mybatis-plus分页
        if(start >= 0 && length > 0) {
        	this.page = new Page<>(start / length + 1, length);
        }else {
        	this.page = new Page<>(currPage, limit);
        }
        //排序
        if(StringUtils.isNotBlank(sidx) && StringUtils.isNotBlank(order)){
//            this.page.setOrderByField(sidx);
//            this.page.setAsc("ASC".equalsIgnoreCase(order));
        }

    }

    public Page<T> getPage() {
        return page;
    }

	public int getDraw() {
		return draw;
	}

	public int getStart() {
		return start;
	}

	public int getLength() {
		return length;
	}
}
