package com.ilbcj.ecell.entity;

import java.io.Serializable;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;



@TableName(value = "tb_admin")//指定表名
public class Admin implements Serializable, Comparable<Admin>{
	public static final int STATUS_INIT = 0;
	public static final int STATUS_INUSE = 1;
	public static final int STATUS_HANGUP = 2;
	
	private static final long serialVersionUID = 6087973127063030273L;
	
	@TableId(type = IdType.AUTO)
	private Integer id;
	@TableId(value = "login_id")
	private String loginId;
	private String pwd;
	private String name;
	private Integer status;
	
	@TableField(exist = false)
    private Integer count;
	
    public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getLoginId() {
		return loginId;
	}

	public void setLoginId(String loginId) {
		this.loginId = loginId;
	}

	public String getPwd() {
		return pwd;
	}

	public void setPwd(String pwd) {
		this.pwd = pwd;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	@Override
	public int compareTo(Admin o) {
		if (this.id>o.id) {
			return 1;
		} else if (this.id<o.id) {
			return -1;
		} else {
			return 0;
		}
	}
}
