package com.ilbcj.ecell;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class test {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		List<String> arr = new ArrayList<String>();
		arr.add("abc");
		arr.add("123");
		arr.add("abd");
		arr.add("aba");
		
		Collections.sort(arr, new Comparator<String>() {
			@Override
			public int compare(String o1, String o2) {
				int i = o1.compareTo(o2);
				return i;
			}
		});
		System.out.println(arr.get(0));
	}

}
