package com.ilbcj.ecell.util;

import java.util.Arrays;
import java.util.Optional;

public class tester {

	public static void main(String[] args) {
		
		//Integer abc = null;
		
		//System.out.println(abc > 0);
		String[] hhmmss = (":22:33" + " ").split(":");
		
		Arrays.asList(hhmmss).forEach(x -> {
			Optional<String> tmp = Optional.ofNullable( x.trim() );
			String xStr = tmp.orElse("").isEmpty() ? "0" : tmp.get();
			System.out.println(Integer.parseInt( xStr ));
		});
		
	}

}
