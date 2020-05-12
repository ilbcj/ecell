package com.ilbcj.ecell;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;

@SpringBootApplication
@ServletComponentScan
public class EcellApplication {

	public static void main(String[] args) {
		SpringApplication.run(EcellApplication.class, args);
	}

}
