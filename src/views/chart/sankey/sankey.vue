<template>
    <div id="chart_sankey"></div>
</template>

<style scoped>
    @import "./sankey.less";
</style>

<script>
    import * as d3 from 'd3';
    import viz from '../../../libs/d3_viz.js';
    export default {
        name: 'sankey',
        data: function () {
            return {
                dataSource: [
                    ['天猫', '上海', 15216, 25216],
                    ['自营店', '上海', 11278, 13244],
                    ['苏宁易购', '上海', 27, 24],
                    ['直卖网', '上海', 27648, 35411],
                    ['代理商', '上海', 1551, 1545],
                    ['京东', '上海', 22141, 25441],
                    ['天猫', '广州', 15453, 15353],
                    ['自营店', '广州', 24683, 24623],
                    ['苏宁易购', '广州', 1862, 654],
                    ['代理商', '广州', 16228, 13228],
                    ['天猫', '北京', 15001, 18001],
                    ['自营店', '北京', 15001, 1654],
                    ['苏宁易购', '北京', 5001, 6541],
                    ['直卖网', '北京', 28648, 29648],
                    ['代理商', '北京', 9648, 9648],
                    ['天猫', '深圳', 3313, 541],
                    ['自营店', '深圳', 22396, 24396],
                    ['苏宁易购', '深圳', 3362, 3762],
                    ['直卖网', '深圳', 22396, 21396],
                    ['代理商', '深圳', 2473, 2973],
                    ['京东', '深圳', 16541, 11541],
                    ['苏宁易购', '杭州', 3541, 3599],
                    ['代理商', '杭州', 3541, 8741],
                    ['京东', '杭州', 3654, 9874],
                    ['自营店', '重庆', 2166, 654],
                    ['苏宁易购', '重庆', 2286, 3654],
                    ['直卖网', '重庆', 348, 3654],
                    ['代理商', '重庆', 4244, 3654],
                    ['京东', '重庆', 1536, 1654],
                    ['自营店', '成都', 914, 654],
                    ['苏宁易购', '成都', 127, 354],
                    ['代理商', '成都', 1470, 654],
                    ['京东', '成都', 516, 354]
                ]
            };
        },
        methods: {
            loadChart: function () {
                let container = d3.select("#chart_sankey").node();
                let containerWidth = container.offsetWidth - 50,
                    containerHeight = container.offsetHeight - 20,
                    chart = d3.select("#chart_sankey").append("svg")
                        .attr("width", containerWidth)
                        .attr("height", containerHeight);
                const margin = {top: 80, right: 80, bottom: 30, left: 60};
                const width = containerWidth - margin.left - margin.right;
                const height = containerHeight - margin.top - margin.bottom;

                var colors = [...d3.schemeCategory10];
                for (var index = 0; index <= 10; index++) {
                    colors.push(d3.interpolatePiYG(index / 10));
                }
                let z = d3.scaleOrdinal()
                    .range(colors);

                const data = this.dataSource;

                let g = [chart.append("g").attr("transform", "translate(" + (containerWidth / 2 - containerHeight / 2 + 50 ) + ", 50)")];

                /* chart.append("text").attr("x", 250).attr("y", 70)
                 .attr("class", "vbp-header").attr('font-size', '14px').attr('font-weight', '700').text("目标出货量");*/

                /*chart.append("text").attr("x", width / 2 + 250).attr("y", 70)
                 .attr("class", "vbp-header").attr('font-size', '14px').attr('font-weight', '700').text("实际出货量");*/

                let bp = [viz.bP() // 定义BP图
                    .data(data)
                    .min(12)
                    .pad(1)
                    .height(containerHeight - 50)
                    .width(containerHeight - 100)
                    .barSize(35)
                    .fill(d => z(d.primary))
                    /* , viz.bP()
                     .data(data)
                     .value(d => d[3])
                     .min(12)
                     .pad(1)
                     .height(700)
                     .width(300)
                     .barSize(35)
                     .fill(d => z(d.primary))*/
                ];

                [0].forEach(function (i) {// 输出BP图数据
                    g[i].call(bp[i]); // 输出BP图

                    /*  g[i].append("text").attr("x", containerHeight / 2).attr("y", -8).style("text-anchor", "middle").text("出货渠道");
                     g[i].append("text").attr("x", containerHeight).attr("y", -8).style("text-anchor", "middle").text("城市");
                     */
                    g[i].selectAll(".mainBars")
                        .on("mouseover", mouseover)
                        .on("mouseout", mouseout);

                    g[i].selectAll(".mainBars").append("text").attr("class", "label")
                        .attr("x", d => (d.part === "primary" ? -30 : 30))
                        .attr("y", d => +6)
                        .text(d => d.key)
                        .attr("text-anchor", d => (d.part === "primary" ? "end" : "start"));

                    g[i].selectAll(".mainBars").append("text").attr("class", "perc")
                        .attr("x", d => (d.part === "primary" ? -100 : 80))
                        .attr("y", d => +6)
                        .text(function (d) {
                            return d3.format("0.0%")(d.percent);
                        })
                        .attr("text-anchor", d => (d.part === "primary" ? "end" : "start"));

                    g[i].selectAll(".mainBars") // hover
                        .append('title')
                        .text(function (d) {
                            return d.key + '\n' + d.value + ' 台手机';
                        });

                });

                chart.append('g')// 输出标题
                    .attr('class', 'vertical-bp-chart--title')
                    .append('text')
                    .attr('fill', '#000')
                    .attr('font-size', '16px')
                    .attr('font-weight', '700')
                    .attr('text-anchor', 'middle')
                    .attr('x', containerWidth / 2)
                    .attr('y', 20)
                    .text('手机渠道出货量数据汇总');

                function mouseover(d) {
                    [0].forEach(function (i) {
                        bp[i].mouseover(d);

                        g[i].selectAll(".mainBars").select(".perc")
                            .text(function (d) {
                                return d3.format("0.0%")(d.percent)
                            });

                        g[i].selectAll(".mainBars")
                            .select('title')
                            .text(function (d) {
                                return d.key + '\n' + d.value + ' 台手机';
                            });
                    });
                }

                function mouseout(d) {
                    [0].forEach(function (i) {
                        bp[i].mouseout(d);

                        g[i].selectAll(".mainBars").select(".perc")
                            .text(function (d) {
                                return d3.format("0.0%")(d.percent)
                            });

                        g[i].selectAll(".mainBars")
                            .select('title')
                            .text(function (d) {
                                return d.key + '\n' + d.value + ' 台手机';
                            });
                    });
                }
            }
        },
        mounted: function () {
            this.loadChart();
        }
    };
</script>
