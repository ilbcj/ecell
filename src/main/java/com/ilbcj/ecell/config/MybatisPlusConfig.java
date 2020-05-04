package com.ilbcj.ecell.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan("com.ilbcj.ecell.mapper")
public class MybatisPlusConfig {

}
