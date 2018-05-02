<template>
    <div id="chart_bar"></div>
</template>

<style scoped>
    @import "./bar.less";
</style>

<script>
    import * as d3 from 'd3';
    import d3Tip from 'd3-tip';
    export default {
        name: 'bar',
        data: function () {
            return {
                dataset: [
                    {name: "A", val: 0.0916},
                    {name: "B", val: 0.01492},
                    {name: "C", val: 0.02782},
                    {name: "D", val: 0.04253},
                    {name: "E", val: 0.10702},
                    {name: "F", val: 0.02288},
                    {name: "G", val: 0.02015},
                    {name: "H", val: 0.06094},
                    {name: "I", val: 0.08966},
                    {name: "J", val: 0.05153},
                    {name: "K", val: 0.06772},
                    {name: "L", val: 0.04025},
                    {name: "M", val: 0.02406},
                    {name: "N", val: 0.06749},
                    {name: "O", val: 0.09507},
                    {name: "P", val: 0.01929},
                    {name: "Q", val: 0.03095},
                    {name: "R", val: 0.05987},
                    {name: "S", val: 0.06327},
                    {name: "T", val: 0.05056},
                    {name: "U", val: 0.02758},
                    {name: "V", val: 0.05978},
                    {name: "W", val: 0.02360},
                    {name: "X", val: 0.03150},
                    {name: "Y", val: 0.01974},
                    {name: "Z", val: 0.04074}
                ]
            }
        },
        methods: {
            loadChart: function () {
                var container = d3.select("#chart_bar").node();
                var svgContainerWidth = container.offsetWidth;
                var svgContainerHeight = container.offsetHeight - 30;
                var svg = d3.select("#chart_bar")
                    .append("svg")
                    .attr("width", svgContainerWidth)
                    .attr("height", svgContainerHeight)
                    .attr('transform', 'translate(0,20)');
                var margin = {
                    left: 30,
                    top: 50,
                    right: 30,
                    bottom: 20
                };
                var chartWidth = svg.attr("width") - margin.left - margin.right;
                var chartHeight = svg.attr("height") - margin.top - margin.bottom;
                var xScale = d3.scaleBand()
                    .domain(this.dataset.map(function (d) {
                        return d.name;
                    }))
                    .rangeRound([0, chartWidth])
                    .paddingInner(0.1);
                var yScale = d3.scaleLinear()
                    .domain([0, d3.max(this.dataset, function (d) {
                        return d.val;
                    })])
                    .range([chartHeight, 0]);
                let chart = svg.append("g")
                    .attr("class", "bar_chart")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                let tip = d3Tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html(function (d) {
                        return "<strong>字母 " + d.name + "<br>使用率： </strong> <span style='color:#eee'>" + (d.val * 100).toFixed(2) + "%</span>";
                    });
                chart.call(tip);
                chart.selectAll("rect")
                    .data(this.dataset)
                    .enter()
                    .append("rect")
                    .attr("x", function (d, i) {
                        return xScale(d.name);
                    })
                    .attr("y", function (d, i) {
                        //return yScale(d.val)
                        return chartHeight;
                    })
                    .attr("width", xScale.bandwidth())
                    .attr("height", function (d) {
                        //return chartHeight - yScale(d.val)
                        return 0;
                    })
                    .attr("fill", "#8acee2")
                    .on('mouseenter', tip.show)
                    .on('mouseleave', tip.hide)
                    .transition()
                    .duration(200)
                    .ease(d3.easeBounceInOut)
                    .delay(function (d, i) {
                        return i * 200;
                    })
                    .attr("y", function (d) {
                        return yScale(d.val);
                    })
                    .attr("height", function (d) {
                        return chartHeight - yScale(d.val);
                    });
                let chartText = svg.append("g")
                    .attr("class", "bar_text")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                chartText.selectAll("text")
                    .data(this.dataset)
                    .enter()
                    .append("text")
                    .attr("x", function (d, i) {
                        return xScale(d.name)
                    })
                    .attr("y", function (d, i) {
                        return yScale(d.val)
                    })
                    .attr("width", xScale.bandwidth())
                    .attr("height", function (d) {
                        return chartHeight - yScale(d.val)
                    })
                    .attr("text-anchor", "middle")
                    .attr("dx", xScale.bandwidth() / 2)
                    .attr("dy", "1em")
                    .attr("fill", "rgba(255,0,0,0)")
                    .attr("font-size", "14px")
                    .text(function (d) {
                        return (d.val * 100).toFixed(2);
                    })
                    .transition()
                    .duration(200)
                    .delay(function (d, i) {
                        return i * 200;
                    })
                    .attr("fill", "rgba(255,0,0,1)");
                let xAxis = svg.append("g")
                    .attr("class", "bar_xAxis")
                    .attr("transform", "translate(" + margin.left + "," + (margin.top + chartHeight) + ")")
                    .call(d3.axisBottom(xScale));
                let yAxis = svg.append("g")
                    .attr("class", "bar_yAxis")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .call(d3.axisLeft(yScale).ticks(10, "%"));

                svg.append('g')
                    .attr('class', 'bar_tile')
                    .append('text')
                    .attr('fill', '#000')
                    .attr('font-size', '16px')
                    .attr('font-weight', '700')
                    .attr('text-anchor', 'middle')
                    .attr('x', svgContainerWidth / 2)
                    .attr('y', 20)
                    .text('26字母使用率（百分比）');
            }
        },
        mounted: function () {
            this.loadChart();
        }
    };
</script>
