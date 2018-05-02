<template>
    <div id="application_threechart">
        <div class="threechart_header">近几年二线城市人口流入情况</div>
        <div class="threechart_chart"></div>
    </div>
</template>

<style scoped>
    @import "./threechart.less";
</style>

<script>
    import {DataSet, Graph3d} from '../../../../node_modules/vis/index-graph3d.js';
    export default {
        name: 'threechart',
        data: function () {
            return {
                dataSource: [
                    {
                        year: "2012",
                        data: [{city: "武汉", d: 10}, {city: "西安", d: 13}, {city: "郑州", d: 12}, {city: "南京", d: 15}, {
                            city: "成都",
                            d: 12
                        }, {city: "杭州", d: 20}]
                    },
                    {
                        year: "2013",
                        data: [{city: "武汉", d: 13}, {city: "西安", d: 14}, {city: "郑州", d: 15}, {city: "南京", d: 17}, {
                            city: "成都",
                            d: 15
                        }, {city: "杭州", d: 23}]
                    },
                    {
                        year: "2014",
                        data: [{city: "武汉", d: 15}, {city: "西安", d: 18}, {city: "郑州", d: 17}, {city: "南京", d: 20}, {
                            city: "成都",
                            d: 18
                        }, {city: "杭州", d: 25}]
                    },
                    {
                        year: "2015",
                        data: [{city: "武汉", d: 18}, {city: "西安", d: 20}, {city: "郑州", d: 22}, {city: "南京", d: 25}, {
                            city: "成都",
                            d: 20
                        }, {city: "杭州", d: 29}]
                    },
                    {
                        year: "2016",
                        data: [{city: "武汉", d: 21}, {city: "西安", d: 25}, {city: "郑州", d: 29}, {city: "南京", d: 32}, {
                            city: "成都",
                            d: 25
                        }, {city: "杭州", d: 33}]
                    },
                    {
                        year: "2017",
                        data: [{city: "武汉", d: 28}, {city: "西安", d: 30}, {city: "郑州", d: 34}, {city: "南京", d: 33}, {
                            city: "成都",
                            d: 28
                        }, {city: "杭州", d: 37}]
                    }
                ],
                cityArray: ['武汉', '西安', '郑州', '南京', '成都', '杭州'],
                yearArray: ['2012', '2013', '2014', '2015', '2016', '2017']
            };
        },
        methods: {
            loadChart: function () {
                var container = document.querySelector(".threechart_chart");
                var width = (container.offsetWidth) + "px";
                var height = ( container.offsetHeight) + "px";

                var dataSet = new DataSet();
                for (let x = 0; x < this.yearArray.length; x++) {
                    let year = this.yearArray[x];
                    let item = this.dataSource.find(d => d.year === year);
                    let data = item.data;
                    for (let y = 0; y < this.cityArray.length; y++) {
                        var city = this.cityArray[y];
                        var amount = data.find(n => n.city === city);
                        if (amount) {
                            var number = amount.d;
                            dataSet.add({x: x, y: y, z: number});
                        }
                    }
                }

                var options = {
                    width: width,
                    height: height,
                    style: 'bar',
                    showPerspective: true,
                    showGrid: true,
                    showShadow: false,
                    tooltip: point => {
                        return this.yearArray[point.x] + '年' + this.cityArray[point.y] + '人口净流入 <b>' + point.z + '万</b>';
                    },
                    xValueLabel: value => {
                        return this.yearArray[value];
                    },
                    yValueLabel: value => {
                        return this.cityArray[value];
                    },
                    zValueLabel: value => {
                        return value + "万";
                    },
                    keepAspectRatio: true,
                    verticalRatio: 0.5,
                    xLabel: '',
                    yLabel: '',
                    zLabel: ''
                };
                var graph = new Graph3d(container, dataSet, options);
                var pos = {
                    horizontal: 1.0,
                    vertical: 0.28,
                    distance: 2.5
                };
                graph.setCameraPosition(pos)
            }
        },
        mounted: function () {
            this.loadChart();
        }
    }
</script>
