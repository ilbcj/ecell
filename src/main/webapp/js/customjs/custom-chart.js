//chart page charts settings
'use strict';
var piedata = [
{
    value: 300,
    color: "#F7464A",
    highlight: "#FF5A5E",
    label: "未激活设备"
},
{
    value: 100,
    color: "#FDB45C",
    highlight: "#FFC870",
    label: "已激活设备"
}
]

var radarChartData = {
    labels: ["Windows", "Android", "Linux", "IOS"],
    datasets: [
        {
            label: "签到情况",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 0, 0]
        },
        {
            label: "指令保护",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "#fff",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [0, 0, 0, 0]
        },
        {
            label: "数据解析",
            fillColor: "rgba(187,205,151,0.2)",
            strokeColor: "#fff",
            pointColor: "rgba(187,205,151,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(187,205,151,1)",
            data: [0, 0, 0, 0]
        }
    ]
};

var polarData = [
       {
           value: 20,
           color: "#F7464A",
           highlight: "#FF5A5E",
           label: "Windows"
       },
       {
           value: 4,
           color: "#46BFBD",
           highlight: "#5AD3D1",
           label: "Android"
       },
       {
           value: 18,
           color: "#FDB45C",
           highlight: "#FFC870",
           label: "Linux"
       },
       {
           value: 10,
           color: "#949FB1",
           highlight: "#A8B3C5",
           label: "IOS"
       }
];

var lineChartdata = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
};
var barChartdata = {
    labels: ["一月", "二月", "三月", "四月", "五月", "六月", "七月"],
    datasets: [
        {
            label: "注册数量",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: [0, 0, 0, 150, 0, 0, 0]
        },
        {
            label: "激活数量",
            fillColor: "rgba(151,187,205,0.5)",
            strokeColor: "rgba(151,187,205,0.8)",
            highlightFill: "rgba(151,187,205,0.75)",
            highlightStroke: "rgba(151,187,205,1)",
            data: [0, 0, 0, 135, 0, 0, 0]
        }
    ]
};
window.onload = function () {
    window.myRadar = new Chart(document.getElementById("radar").getContext("2d")).Radar(radarChartData, {
        responsive: true,
    });

    var ctx1 = document.getElementById("chart-area").getContext("2d");

    window.myPolarArea = new Chart(ctx1).PolarArea(polarData, {
        responsive: true,
    });
/*     var ctx2 = document.getElementById("line-area").getContext("2d");
   		var myLineChart = new Chart(ctx2).Line(lineChartdata, {
        responsive: true,
        maintainAspectRatio: true
    });*/

    var ctx3 = document.getElementById("bar-area").getContext("2d");
    var myLineChart = new Chart(ctx3).Bar(barChartdata, {
        responsive: true,
        maintainAspectRatio: true
    });
    //var ctx4 = document.getElementById("pie-area").getContext("2d");
    var ctx4 = document.getElementById("pie-area").getContext("2d");
    //var ctx5 = document.getElementById("donut-area").getContext("2d");
    // For a pie chart
    var myPieChart = new Chart(ctx4).Pie(piedata, {
        responsive: true,
    });

    // And for a doughnut chart
/*    var myDoughnutChart = new Chart(ctx5).Doughnut(piedata, {
        responsive: true,
    });*/
}