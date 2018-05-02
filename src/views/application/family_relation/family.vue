<template>
    <div id="application_family" @mouseup="shapeMouseUp">
        <div id="head" class="head">
            <div id="inner" class="head_inner">
                <span style="width: 150px;">选择图形</span>
                <select id="shape_list" style="width: 150px; margin-left: 20px;" @change="changeVal">
                    <option v-for="item in selectList" :value="item.value">{{item.text}}</option>
                </select>
                <div id="div_new" :style="{marginLeft: '50px',display: divNewDisplay}">
                    <span>图形名称：</span>
                    <input type="text" id="txtName" v-model="shapeName" style="width: 120px; margin-left:10px;"/>
                    <input type="button" @click="createShape" id="btnCreate" style="width: 80px; margin-left: 20px;"
                           value=" 创 建 "/>
                </div>
                <div id="div_button" :style="{marginLeft: '30px',display: divButtonDisplay}">
                    <input type="button" id="btnSave" style="width: 80px;" value=" 保 存 " @click="saveShape"/>
                    <input type="button" id="btnPicture" style="width: 80px; margin-left: 30px;" value="生成图片"
                           @click="buildPicture"/>
                </div>
            </div>
        </div>
        <div id="container" class="container" v-show="isShowContainer">
            <div id="iconContainer" class="icon_container" @click="iconClick">
                <div id="node_male" class="icon_male" draggable="true" title="男性节点"></div>
                <div id="node_female" class="icon_female" draggable="true" title="女性节点"></div>
                <div id="icon_couple" class="icon_couple" title="婚姻关系">
                    <div class="couple"></div>
                </div>
                <div id="icon_together" class="icon_together" title="特别密切">
                    <div class="together_first"></div>
                    <div class="together_second"></div>
                    <div class="together_third"></div>
                </div>
                <div id="icon_intently" class="icon_intently" title="关系亲密">
                    <div class="intently_first"></div>
                    <div class="intently_second"></div>
                </div>
                <div id="icon_nervous" class="icon_nervous" title="关系紧张">
                    <svg id="svg_nervous" class="svg_inner" version="1.1"></svg>
                </div>
                <div id="icon_clash" class="icon_clash" title="冲突关系">
                    <svg id="svg_clash" class="svg_inner" version="1.1"></svg>
                </div>
                <div id="icon_suspend" class="icon_suspend" title="关系中断">
                    <svg id="svg_suspend" class="svg_inner" version="1.1"></svg>
                </div>
                <div id="icon_child" class="icon_child" title="继承关系">
                    <div class="child"></div>
                </div>
            </div>
            <div id="shape_container" class="shape_container">
                <table id="table_relation" cellspacing="0" cellpadding="0" border="0"
                       style="border-collapse: collapse; margin: 0 auto; width: 100%; vertical-align: middle; text-align: center;">
                    <tr>
                        <td style="width: 10%;">第一代</td>
                        <td style="width: 90%;"></td>
                    </tr>
                    <tr>
                        <td>第二代</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>第三代</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>第四代</td>
                        <td></td>
                    </tr>
                </table>
                <svg id="svg_workspace" style="position: absolute; left: 100px; top: 0px; width: 900px; height: 480px;"
                     version="1.1"></svg>
                <canvas id="canvas_line"
                        style="left: 100px; position: absolute; top: 0; z-index: 5; display: none;"></canvas>
                <div id="work_container" class="work_container" @mousedown="containerMouseDown"
                     @mousemove="containerMouseMove" @mouseup="containerMouseUp" @click="containerClick"
                     @dblclick="containerDoubleClick">
                </div>
                <div id="propertyBox" style="display:none; z-index:10000; position:absolute;">
                    <textarea id="txtTitle" style="font-size:16px; display:block;"></textarea>
                    <input type="checkbox" id="chkSelf"/><span>设为自己</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    @import "./family.less";
</style>

<script>
    import * as d3 from 'd3';
    import {Shape} from './javascript/shape.js';
    import {Common, lineState} from './javascript/common.js';
    import {Line} from './javascript/line.js';
    export default {
        name: 'family',
        data: function () {
            return {
                selectList: [{
                    value: -1, text: "选择图形"
                }, {
                    value: 0, text: "新建图形"
                }],
                selectedValue: "-1",
                shapeName: "",
                isShowContainer: false,
                selectedIconId: '',
                shape: null,
                saveDataList: []
            };
        },
        computed: {
            divNewDisplay: function () {
                if (this.selectedValue === "0") {
                    return "inline";
                }
                else {
                    return "none";
                }
            },
            divButtonDisplay: function () {
                if (this.selectedValue === "-1") {
                    return "none";
                }
                else {
                    return "inline";
                }
            }
        },
        methods: {
            init: function () {
                var icon_nervous_svg = document.querySelector("#svg_nervous");
                var icon_nervous_path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                icon_nervous_svg.appendChild(icon_nervous_path);
                var path_define = "M5,15 L55,15 M5,20 L55,20 M5,25 L55,25 M5,25";
                var startX = 5;
                for (var position = 5; position < 55; position = position + 5) {
                    var point = {x: startX + position, y: position % 2 == 1 ? 15 : 25};
                    path_define = path_define + "L" + point.x + "," + point.y + " ";
                }
                d3.select(icon_nervous_path).attr("fill", "white").attr("fill-opacity", "0").attr("stroke", "black")
                    .attr("stroke-width", 0.5).attr("d", path_define);

                var icon_clash_svg = document.querySelector("#svg_clash");
                var icon_clash_path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                icon_clash_svg.appendChild(icon_clash_path)
                var path_define = "M5,15 ";
                var startX = 5, startY = 15;
                for (var position = 10; position < 55; position = position + 10) {
                    var point = {x: startX + position, y: position % 4 == 2 ? startY + 10 : startY};
                    path_define = path_define + "L" + point.x + "," + point.y + " ";
                }
                path_define = path_define + "M5,25 ";
                for (var position = 10; position < 55; position = position + 10) {
                    var point = {x: startX + position, y: position % 4 == 2 ? startY : startY + 10};
                    path_define = path_define + "L" + point.x + "," + point.y + " ";
                }
                d3.select(icon_clash_path).attr("fill", "white").attr("fill-opacity", "0").attr("stroke", "black")
                    .attr("stroke-width", 0.5).attr("d", path_define);

                var icon_suspend_svg = document.querySelector("#svg_suspend");
                var icon_suspend_path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                icon_suspend_svg.appendChild(icon_suspend_path);
                var path_define = "M5,20 L25,20 M25,15 L25,25 M35,15 L35,25 M35,20 L55,20";
                d3.select(icon_suspend_path).attr("fill", "white").attr("fill-opacity", "0").attr("stroke", "black")
                    .attr("stroke-width", 0.5).attr("d", path_define);

                document.body.onselectstart = function () {
                    return false;
                };
                this.initShapeEvent();
            },
            initShapeEvent: function () {
                var common = new Common();
                var icons = [document.querySelector("#node_male"), document.querySelector("#node_female")];
                common.dragArrayDrop(icons, document.querySelector("#work_container"), (event, data) => {
                    if (this.shape === null) {
                        return;
                    }
                    var left = event.pageX - common.getOffset(this.shape.workContainer).left;
                    var top = event.pageY - common.getOffset(this.shape.workContainer).top;
                    var num = Math.floor(top / 120);
                    top = num * 120 + 30;
                    var config = {
                        zIndex: this.shape.zIndex++,
                        type: data.substring(5),
                        left: left,
                        top: top,
                        width: 60,
                        height: 60,
                        generation: num + 1
                    };
                    this.shape.addNode(config);
                    this.shape.hasupdated = true;
                });
                document.onkeyup = this.containerKeyUp;
            },
            containerMouseDown: function (event) {
                this.shape.onMouseDown(event);
            },
            containerMouseMove: function (event) {
                this.shape.onMouseMove(event);
            },
            containerMouseUp: function (event) {
                var result = this.shape.onMouseUp(event);
                if (result === true) {
                    this.selectedIconId = '';
                }
            },
            containerClick: function (event) {
                this.shape.onClick(event);
            },
            containerDoubleClick: function (event) {
                this.shape.onDblClick(event);
            },
            containerKeyUp: function (event) {
                if (this.shape) {
                    this.shape.onKeyUp(event);
                }
            },
            shapeMouseUp: function (event) {
                if (this.shape) {
                    this.shape.onShapeMouseUp();
                }
            },
            iconClick: function (event) {
                var target = event.target;
                if (target.id && target.id.indexOf("icon_") === 0) {
                    this.selectedIconId = target.id;
                }
                else {
                    var parentNode = target.parentNode;
                    var hasSet = false;
                    while (parentNode) {
                        if (parentNode.id && parentNode.id.indexOf("icon_") === 0) {
                            this.selectedIconId = parentNode.id;
                            hasSet = true;
                            break;
                        }
                        else {
                            target = parentNode;
                            parentNode = target.parentNode;
                        }
                    }
                    if (hasSet === false) {
                        this.selectedIconId = "";
                    }
                }
                event.stopPropagation();
                event.preventDefault();
            },
            changeVal: function (event) {
                var target = event.target;
                this.selectedValue = target.value;
                if (this.selectedValue === "0" || this.selectedValue === "-1") {
                    this.shapeName = "";
                    this.isShowContainer = false;
                }
                else {
                    this.shapeName = target.options[target.selectedIndex].text;
                    this.isShowContainer = true;
                    document.querySelector("#work_container").innerHTML = "";
                    document.querySelector("#svg_workspace").innerHTML = "";
                    this.shape = new Shape({guid: this.selectedValue, name: this.shapeName});

                    var shape_json_data = this.saveDataList.find(d => {
                        return d.guid === this.selectedValue;
                    })
                    var nodes = shape_json_data.node, lines = shape_json_data.line;
                    for (var index = 0; index < nodes.length; index++) {
                        var nodeObj = nodes[index];
                        var config = {
                            guid: nodeObj.ID, type: nodeObj.Type, text: nodeObj.Title, top: nodeObj.TopOffset,
                            left: nodeObj.LeftOffset, width: nodeObj.Width, height: nodeObj.Height,
                            generation: nodeObj.Generation, coupleLine_id: nodeObj.CoupleLineID,
                            anotherNode_id: nodeObj.AnotherID, isSelf: nodeObj.IsSelf
                        };
                        this.shape.addNode(config);
                    }
                    for (var index = 0; index < lines.length; index++) {
                        var lineObj = lines[index];
                        var start_Node = null, end_Node = null;
                        for (var i = 0; i < this.shape.nodes.length; i++) {
                            var node = this.shape.nodes[i];
                            if (node.guid == lineObj.StartNodeID) {
                                start_Node = node;
                            }
                            if (node.guid == lineObj.EndNodeID) {
                                end_Node = node;
                            }
                        }
                        var config = {
                            guid: lineObj.ID,
                            startX: lineObj.StartX,
                            startY: lineObj.StartY,
                            endX: lineObj.EndX,
                            endY: lineObj.EndY,
                            type: lineObj.Type,
                            startNode: start_Node,
                            endNode: end_Node,
                            startType: lineObj.StartType,
                            endType: lineObj.EndType
                        };
                        var line = new Line(config);
                        line.draw();
                        start_Node.lines.push(line);
                        end_Node.lines.push(line);
                        if (line.type == lineState.couple) {
                            start_Node.coupleLine = line;
                            end_Node.coupleLine = line;
                            start_Node.anotherNode = end_Node;
                            end_Node.anotherNode = start_Node;
                        }
                        if (line.type == lineState.child) {
                            start_Node.anotherNode.lines.push(line);
                        }
                        this.shape.lines.push(line);
                    }
                }
            },
            createShape: function () {
                if (this.shapeName === "") {
                    alert("请输入图形名称");
                    return false;
                }
                this.isShowContainer = true;
                document.querySelector("#work_container").innerHTML = "";
                document.querySelector("#svg_workspace").innerHTML = "";
                this.shape = new Shape({name: this.shapeName});
            },
            saveShape: function () {
                if (this.shape == null) {
                    alert("还没创建图形");
                    return false;
                }
                var shapeJson = this.shape.ToJson();
                var nodeJsonArray = [];
                for (var index = 0; index < this.shape.nodes.length; index++) {
                    var nodeJson = this.shape.nodes[index].ToJson();
                    nodeJsonArray.push(nodeJson);
                }
                var lineJsonArray = [];
                for (var index = 0; index < this.shape.lines.length; index++) {
                    var lineJson = this.shape.lines[index].ToJson();
                    lineJsonArray.push(lineJson);
                }
                var saveJsonData = {
                    guid: this.shape.guid,
                    name: this.shape.name,
                    shape: shapeJson,
                    node: nodeJsonArray,
                    line: lineJsonArray
                };
                for (var index = 0, len = this.saveDataList.length; index < len; index++) {
                    var currentData = this.saveDataList[index];
                    if (currentData.guid === this.shape.guid) {
                        this.saveDataList[index] = saveJsonData;
                        alert("更新成功");
                        return;
                    }
                }
                this.selectList.push({value: this.shape.guid, text: this.shape.name});
                this.saveDataList.push(saveJsonData);
                alert("保存成功");
            },
            buildPicture: function () {
                if (this.shape == null) {
                    alert("还没创建图形");
                    return false;
                }
                var svgObject = document.querySelector("#svg_workspace");
                var canvasObject = document.querySelector("#canvas_line");
                var svgHTML = svgObject.outerHTML;
                svgObject.style.display = "none";
                canvasObject.style.display = "block";
                window.canvg(canvasObject, svgHTML);
                var container = document.querySelector("#container");
                window.html2canvas(container, {
                    onrendered: function (canvas) {
                        svgObject.style.display = "block";
                        canvasObject.style.display = "none";
                        var dataURL = canvas.toDataURL("image/png");

                        var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
                        save_link.href = dataURL;
                        save_link.download = new Common().guid() + ".png";
                        var event = document.createEvent('MouseEvents');
                        event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                        save_link.dispatchEvent(event);
                    }
                });
            }
        },
        watch: {
            selectedIconId: function (newValue, oldValue) {
                if (oldValue) {
                    document.querySelector("#" + oldValue).style.border = '1px solid black';
                }
                if (newValue) {
                    document.querySelector("#" + newValue).style.border = '1px solid red';
                }
                if (this.shape) {
                    this.shape.setSelectedIcon(newValue);
                }
            }
        },
        mounted: function () {
            this.init();
        }
    }
</script>
