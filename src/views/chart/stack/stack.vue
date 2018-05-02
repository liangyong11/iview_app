<template>
    <div id="chart_stack"></div>
</template>

<style scoped>
    @import "./stack.less";
</style>

<script>
    import * as d3 from 'd3';
    import d3Tip from 'd3-tip';
    export default {
        name: 'stack',
        data: function () {
            return {
                dataSource: [
                    {date: '2011', q1: 155, q2: 200, q3: 214, q4: 234},
                    {date: '2012', q1: 165, q2: 210, q3: 244, q4: 254},
                    {date: '2013', q1: 175, q2: 230, q3: 274, q4: 274},
                    {date: '2014', q1: 185, q2: 250, q3: 304, q4: 294},
                    {date: '2015', q1: 195, q2: 270, q3: 334, q4: 314},
                    {date: '2016', q1: 205, q2: 290, q3: 364, q4: 330}
                ]
            };
        },
        methods: {
            loadChart: function () {
                let container = d3.select("#chart_stack").node();
                let containerWidth = container.offsetWidth - 50,
                    containerHeight = container.offsetHeight - 20,
                    chart = d3.select("#chart_stack").append("svg")
                        .attr("width", containerWidth)
                        .attr("height", containerHeight);
                const margin = {top: 80, right: 100, bottom: 30, left: 60};
                const width = containerWidth - margin.left - margin.right;
                const height = containerHeight - margin.top - margin.bottom;

                let x = d3.scaleBand()
                    .rangeRound([0, width - 50])
                    .paddingInner(0.1);

                let y = d3.scaleLinear()
                    .rangeRound([height, 0]);

                var colorArray = [];
                d3.schemeCategory10.forEach(color => {
                    colorArray.push(color);
                });
                let z = d3.scaleOrdinal()
                    .range(colorArray.reverse());

                const data = [
                    {date: '2011', q1: 155, q2: 200, q3: 214, q4: 234},
                    {date: '2012', q1: 165, q2: 210, q3: 244, q4: 254},
                    {date: '2013', q1: 175, q2: 230, q3: 274, q4: 274},
                    {date: '2014', q1: 185, q2: 250, q3: 304, q4: 294},
                    {date: '2015', q1: 195, q2: 270, q3: 334, q4: 314},
                    {date: '2016', q1: 205, q2: 290, q3: 364, q4: 330}
                ];
                let keys = Object.keys(data[0]).slice(1);
                const names = {
                    q1: '第一季度',
                    q2: '第二季度',
                    q3: '第三季度',
                    q4: '第四季度'
                };

                let series = d3.stack()
                    .keys(keys)
                    .offset(d3.stackOffsetDiverging)(data);

                let tip = d3Tip() // 设置tip
                    .attr('class', 'd3_tip_stack')
                    .offset([-10, 0])
                    .html(function (d) {
                        let total = d.data.q1 + d.data.q2 + d.data.q3 + d.data.q4;
                        return '<strong>' + d.data.date + '年</strong><br>'
                            + '<span style="color:' + z(keys[0]) + '">' + names.q1 + ': ' + d.data.q1 + ' 万</span><br>'
                            + '<span style="color:' + z(keys[1]) + '">' + names.q2 + ': ' + d.data.q2 + ' 万</span><br>'
                            + '<span style="color:' + z(keys[2]) + '">' + names.q3 + ': ' + d.data.q3 + ' 万</span><br>'
                            + '<span style="color:' + z(keys[3]) + '">' + names.q4 + ': ' + d.data.q4 + ' 万</span><br>'
                            + '<span style="color:#fff">年总: ' + total + ' 万</span>';
                    });

                chart.call(tip);

                x.domain(data.map(function (d) {
                    return d.date;
                }));
                y.domain([d3.min(series, function (serie) {
                    return d3.min(serie, function (d) {
                        return d[0];
                    });
                }), d3.max(series, function (serie) {
                    return d3.max(serie, function (d) {
                        return d[1];
                    });
                })]);

                let g = chart.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // 设最外包层在总图上的相对位置

                g.append("g") // 画柱状图
                    .selectAll("g")
                    .data(series)
                    .enter().append("g")
                    .attr("fill", function (d) {
                        return z(d.key);
                    })
                    .selectAll("rect")
                    .data(function (d) {
                        return d;
                    })
                    .enter().append("rect")
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide)
                    .attr("width", x.bandwidth)
                    .attr("cursor", "pointer")
                    .attr("x", function (d) {
                        return x(d.data.date);
                    })
                    .attr("height", 0)
                    .attr("y", y(0))
                    .transition()
                    .duration(750)
                    .delay(function (d, i) {
                        return i * 10;
                    })
                    .attr("y", function (d) {
                        return y(d[1]);
                    })
                    .attr("height", function (d) {
                        return y(d[0]) - y(d[1]);
                    })

                g.append("g") // 画x轴
                    .attr("class", "axis")
                    .attr("transform", "translate(0," + y(0) + ")")
                    .call(d3.axisBottom(x));

                g.append("g") // 画y轴
                    .attr("class", "axis")
                    .call(d3.axisLeft(y))
                    .append("text")
                    .attr("x", 10)
                    .attr("y", y(y.ticks().pop()) - 20)
                    .attr("dy", "0.32em")
                    .attr("fill", "#000")
                    .attr("font-weight", "bold")
                    .attr("text-anchor", "start")
                    .text("利润(万)");

                let legend = g.append("g") // 画legend
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 10)
                    .attr("transform", "translate(60,0)")
                    .attr("text-anchor", "end")
                    .selectAll("g")
                    .data(keys.slice())
                    .enter().append("g")
                    .attr("transform", function (d, i) {
                        return "translate(0," + i * 20 + ")";
                    });

                legend.append("rect")
                    .attr("x", width - 19)
                    .attr("width", 19)
                    .attr("height", 19)
                    .attr("fill", z);

                legend.append("text")
                    .attr("x", width - 24)
                    .attr("y", 9.5)
                    .attr("dy", "0.32em")
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
                    .attr('y', 40)
                    .text('公司利润统计');
            }
        },
        mounted: function () {
            this.loadChart();
        }
    };
</script>
