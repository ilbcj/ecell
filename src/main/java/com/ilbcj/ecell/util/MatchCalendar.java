package com.ilbcj.ecell.util;

import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;
import java.time.temporal.TemporalAccessor;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.HashSet;
import java.util.List;
import java.util.Scanner;
import java.util.Set;

import com.ilbcj.ecell.dto.PubCalendarDayDTO;
import com.ilbcj.ecell.dto.PubMatchCalendarDTO;

public class MatchCalendar {
	
    public static void main(String[] args) {
    	
    	Set<String> names = new HashSet<String>();
    	names.add("abc");
    	names.add("123");
    	names.add("abc");
    	System.out.println(names.size());
    	
    	
    	PubMatchCalendarDTO calendar = queryCalendar("2019-12");
    	calendar.getDays().forEach(x->{
    		System.out.println(x.getDayOfMonth());
    	});
    	
    	
        try (Scanner sc = new Scanner(System.in)) {
            System.out.println("please input the year:");
            int year = sc.nextInt();
            System.out.println("please input the month:");
            int month = sc.nextInt();
            List<String> MONTH_LIST = Arrays.asList(
                    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
            );
            System.out.printf("         %s, %4d\n", MONTH_LIST.get(month - 1), year);
            System.out.println("-----------------------------");
            System.out.println(" Sun Mon Tue Wed Thu Fri Sat");
            Calendar c = Calendar.getInstance();
            c.set(year, month-1, 1);
            int totalDay = c.getActualMaximum(Calendar.DATE);
            for (int i = 1; i < c.get(Calendar.DAY_OF_WEEK); i++) {
                System.out.print("    ");
            }
            for (int i = 1; i <= totalDay; i++) {
                c.set(year, month-1, i);
                System.out.printf("%4d", i);
                if (c.get(Calendar.DAY_OF_WEEK)==Calendar.SATURDAY) {
                    System.out.println("");
                }
            }
        }
    }
    
    public static PubMatchCalendarDTO queryCalendar(String dateStr) {
    	//DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    	//LocalDate date = LocalDate.parse(dateStr, formatter);
    	//int year = date.getYear();
        //int month = date.getMonthValue();
    	DateTimeFormatter formatter = new DateTimeFormatterBuilder()
    			.appendValue(ChronoField.YEAR)
    			.appendLiteral('-')
    			.appendValue(ChronoField.MONTH_OF_YEAR)
                .toFormatter();
    	
    	TemporalAccessor accessor = formatter.parse(dateStr);
        int year = accessor.get(ChronoField.YEAR);
        int month = accessor.get(ChronoField.MONTH_OF_YEAR);    	
    	
    	return queryCalendar(year, month);
    }

    public static PubMatchCalendarDTO queryCalendar(int year, int month) {
    	PubMatchCalendarDTO calendar = new PubMatchCalendarDTO();
    	calendar.setYear(year);
    	calendar.setMonth(month);
    	List<PubCalendarDayDTO> days = new ArrayList<PubCalendarDayDTO>();
    	
    	Calendar c = Calendar.getInstance();
    	c.set(year, month-1, 1);
    	for (int i = 1; i < c.get(Calendar.DAY_OF_WEEK); i++) {
    		PubCalendarDayDTO day = new PubCalendarDayDTO();
    		days.add(day);
        }
    	
    	int totalDay = c.getActualMaximum(Calendar.DATE);
    	for (int i = 1; i <= totalDay; i++) {
            c.set(year, month-1, i);
            PubCalendarDayDTO day = new PubCalendarDayDTO();
            day.setDayOfMonth(i);
            days.add(day);
        }
    	
    	calendar.setDays(days);
    	return calendar;
    }

}