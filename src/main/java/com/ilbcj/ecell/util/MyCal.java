package com.ilbcj.ecell.util;

import java.util.Arrays;
import java.util.Calendar;
import java.util.List;
import java.util.Scanner;

public class MyCal {

    public static void main(String[] args) {
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
            for (int i = 1; i < c.get(Calendar.DAY_OF_WEEK); i++)
                System.out.print("    ");
            for (int i = 1; i <= totalDay; i++) {
                c.set(year, month-1, i);
                System.out.printf("%4d", i);
                if (c.get(Calendar.DAY_OF_WEEK)==Calendar.SATURDAY)
                    System.out.println("");
            }
        }
    }

}