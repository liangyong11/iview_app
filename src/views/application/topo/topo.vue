<template>
    <div id="application_topo">
        <svg id="svg_topo" width="0" height="0" style="position:absolute;"></svg>
        <div id="div_contextmenu" class="contextmenu" style="display:none;">
            <ul>
                <li id="liDelete" class="limenu">
                    <a href="javascript:void(0);">删除拓扑</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
    @import "./topo.less";
</style>

<script>
    import * as d3 from 'd3';
    import {Shape} from './shape.js';
    export default {
        name: "topo",
        methods: {
            init: function () {
                var container = document.querySelector("#application_topo");
                var width = container.offsetWidth;
                var height = container.offsetHeight;
                d3.select("#svg_topo").attr("width", width).attr("height", height);
                var shape = new Shape("svg_topo");
                shape.loadData("resource/topodata.xml")
                    .then(function () {
                        shape.changeLineColor("l135", "red");
                        shape.changeInputText("l134", "680Kbps");
                        shape.changeOutputText("l135", "2.0Mbps");
                        shape.changeTotalText("l135", "2.7Mbps");
                    });
            }
        },
        mounted: function () {
            this.init();
        }
    };
</script>
