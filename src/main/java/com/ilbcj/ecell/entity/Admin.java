package com.ilbcj.ecell.entity;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@SuppressWarnings("unused")
public class Admin implements Serializable, Comparable<Admin>{
	private static final long serialVersionUID = 6087973127063030273L;
	private int id;
	private String loginId;
	private String pwd;
	private int status;
	
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
