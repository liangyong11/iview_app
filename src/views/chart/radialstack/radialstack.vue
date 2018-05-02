<template>
    <div id="chart_radialstack"></div>
</template>

<style scoped>
    @import "./radialstack.less";
</style>

<script>
    import * as d3 from 'd3';
    import d3Tip from 'd3-tip';
    import scaleRadial from '../../../libs/d3ScaleRadial.js';
    export default {
        name: "radialstack",
        data: function () {
            return {
                dataSource: [{city: '上海', q1: 7000, q2: 7400, q3: 7800, q4: 8200},
                    {city: '北京', q1: 6100, q2: 6800, q3: 7300, q4: 7900},
                    {city: '深圳', q1: 5400, q2: 5600, q3: 5700, q4: 5800},
                    {city: '广州', q1: 5200, q2: 5400, q3: 5500, q4: 5600},
                    {city: '重庆', q1: 4700, q2: 4900, q3: 5300, q4: 5200},
                    {city: '天津', q1: 4400, q2: 4700, q3: 4600, q4: 4300},
                    {city: '苏州', q1: 4300, q2: 4400, q3: 4500, q4: 4100},
                    {city: '成都', q1: 3600, q2: 3400, q3: 3300, q4: 3500},
                    {city: '武汉', q1: 3500, q2: 3400, q3: 3400, q4: 3200},
                    {city: '杭州', q1: 3400, q2: 3300, q3: 3000, q4: 3100}]
            };
        },
        methods: {
            loadChart: function () {
                let container = d3.select("#chart_radialstack").node();
                let containerWidth = container.offsetWidth - 50,
                    containerHeight = container.offsetHeight - 20,
                    chart = d3.select("#chart_radialstack").append("svg")
                        .attr("width", containerWidth)
                        .attr("height", containerHeight);
                const margin = {top: 50, right: 80, bottom: 30, left: 60};
                const width = containerWidth - margin.left - margin.right;
                const height = containerHeight - margin.top - margin.bottom;

                const innerRadius = 110;
                const outerRadius = Math.min(width, height) * 0.5;

                let x = d3.scaleBand() // 定义x轴
                    .range([0, 2 * Math.PI])
                    .align(0);

                let y = scaleRadial().range([innerRadius, outerRadius]); // 定义y轴

                let z = d3.scaleOrdinal() //通用颜色
                    .range(d3.schemeCategory10);

                const data = this.dataSource;
                let keys = Object.keys(data[0]).slice(1);
                const names = {
                    q1: '第一季度',
                    q2: '第二季度',
                    q3: '第三季度',
                    q4: '第四季度'
                };

                let series = d3.stack() // 定义堆栈图
                    .keys(keys)
                    .offset(d3.stackOffsetDiverging)(data);

                x.domain(data.map(function (d) {
                    return d.city;
                })); // x与y轴的值域

                y.domain([0, d3.max(series, function (serie) {
                    return d3.max(serie, function (d) {
                        return d[1];
                    });
                })]);

                let tip = d3Tip() // 设置tip
                    .attr('class', 'd3_tip_radialstack')
                    .offset([-10, 0])
                    .html(function (d) {
                        let total = d.data.q1 + d.data.q2 + d.data.q3 + d.data.q4;
                        return '<strong>' + d.data.city + '</strong><br>'
                            + '<span style="color:' + z(keys[0]) + '">' + names.q1 + ': ' + d.data.q1 + ' 亿</span><br>'
                            + '<span style="color:' + z(keys[1]) + '">' + names.q2 + ': ' + d.data.q2 + ' 亿</span><br>'
                            + '<span style="color:' + z(keys[2]) + '">' + names.q3 + ': ' + d.data.q3 + ' 亿</span><br>'
                            + '<span style="color:' + z(keys[3]) + '">' + names.q4 + ': ' + d.data.q4 + ' 亿</span><br>'
                            + '<span style="color:#fff">年总: ' + total + ' 亿</span>';
                    });

                chart.call(tip);

                let g = chart.append("g").attr("transform", "translate(" + containerWidth / 2 + "," + (containerHeight * 0.5 + 20) + ")"); // 设最外包层在总图上的相对位置

                chart.append("defs").append("clipPath") // 添加圆形遮罩
                    .attr("id", "clip")
                    .append("circle")
                    .attr("r", 0)
                    .transition()
                    .duration(800)
                    .attr("r", outerRadius);

                let label = g.append("g") // 画x轴
                    .selectAll("g")
                    .data(data)
                    .enter().append("g")
                    .attr("text-anchor", "middle")
                    .attr("transform", function (d) {
                        return "rotate(" + ((x(d.city) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)";
                    });

                label.append("line")
                    .attr("x2", -5)
                    .attr("stroke", "#000");

                label.append("text")
                    .attr("transform", function (d) {
                        return (x(d.city) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,16)" : "rotate(-90)translate(0,-9)";
                    })
                    .text(function (d) {
                        return d.city;
                    });

                let yAxis = g.append("g") // 画y轴圈圈及文字
                    .attr("text-anchor", "end");

                let yTick = yAxis
                    .selectAll("g")
                    .data(y.ticks(6).slice(1))
                    .enter().append("g");

                yTick.append("circle")
                    .attr("fill", "none")
                    .attr("stroke", "#000")
                    .attr("stroke-opacity", 0.5)
                    .attr("r", y);

                yTick.append("text")
                    .attr("x", -6)
                    .attr("y", function (d) {
                        return -y(d);
                    })
                    .attr("dy", "0.35em")
                    .attr("fill", "none")
                    .attr("stroke", "#fff")
                    .attr("stroke-width", 5)
                    .text(y.tickFormat(6, "r"));

                yTick.append("text")
                    .attr("x", -6)
                    .attr("y", function (d) {
                        return -y(d);
                    })
                    .attr("dy", "0.35em")
                    .text(y.tickFormat(6, "r"));

                yAxis.append("text")
                    .attr("x", -6)
                    .attr("y", function (d) {
                        return -y(y.ticks(6).pop());
                    })
                    .attr("dy", "-1em");
                // .text("GDP(亿)");

                g.append("g") // 画柱状图
                    .selectAll("g")
                    .data(series)
                    .enter().append("g")
                    .attr('clip-path', 'url(#clip)')
                    .attr("fill", function (d) {
                        return z(d.key);
                    })
                    .selectAll("path")
                    .data(function (d) {
                        return d;
                    })
                    .enter().append("path")
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide)
                    .attr("cursor", "pointer")
                    .attr("d", d3.arc()
                        .innerRadius(function (d) {
                            return y(d[0]);
                        })
                        .outerRadius(function (d) {
                            return y(d[1]);
                        })
                        .startAngle(function (d) {
                            return x(d.data.city);
                        })
                        .endAngle(function (d) {
                            return x(d.data.city) + x.bandwidth();
                        })
                        .padAngle(0.01)
                        .padRadius(innerRadius));

                let legend = g.append("g") // 画legend
                    .selectAll("g")
                    .data(keys.slice())
                    .enter().append("g")
                    .attr("transform", function (d, i) {
                        return "translate(-40," + (i - (keys.length - 1) / 2) * 20 + ")";
                    });

                legend.append("rect")
                    .attr("width", 18)
                    .attr("height", 18)
                    .attr("fill", z);

                legend.append("text")
                    .attr("x", 24)
                    .attr("y", 9)
                    .attr("dy", "0.35em")
                    .text(function (d) {
                        return names[d];
                    });


                chart.append('g')// 输出标题
                    .attr('class', 'grouped-bar--title')
                    .append('text')
                    .attr('fill', '#000')
                    .attr('font-size', '16px')
                    .attr('font-weight', '700')
                    .attr('text-anchor', 'middle')
                    .attr('x', containerWidth / 2)
                    .attr('y', 20)
                    .text('2017年十大城市GDP分析');
            }
        },
        mounted: function () {
            this.loadChart();
        }
    };
</script>
