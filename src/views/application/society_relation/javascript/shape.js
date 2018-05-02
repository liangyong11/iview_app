/**
 * Created by liangyong on 2018/4/19.
 */
import * as d3 from 'd3';
import {Common, lineState} from './tool.js';
import {Node} from './node.js';
import {Line} from './line.js';
export class Shape {
    constructor(config) {
        this.common = new Common();
        this.guid = config.guid || this.common.guid();
        this.name = config.name || "";
        this.zIndex = 101;
        this.mouseState = lineState.default;
        this.workContainer = document.querySelector("#work_container");
        this.nodes = [];
        this.lines = [];

        this.node_moving = false;
        this.movingNode = null;

        this.line_state = lineState.default;
        this.startPoint = null;
        this.startType = "";
        this.startNode = null;
        this.selectedLine = null;
        this.selectedNodeIndex = -1;

        this.tempLine = null;
        this.tempLineId = "";

        this.dblNode = null;

        this.selected_icon = "";

        this.hasupdated = false;
    }


    loadDefaultNode() {
        //添加几个系统节点
        var config = {
            zIndex: this.zIndex++, type: "common", left: 50, top: 200,
            width: 100, height: 60, text: "学校"
        };
        this.addNode(config);
        config = {
            zIndex: this.zIndex++, type: "common", left: 300, top: 400,
            width: 100, height: 60, text: "邻里"
        };
        this.addNode(config);
        config = {
            zIndex: this.zIndex++, type: "common", left: 300, top: 50,
            width: 100, height: 60, text: "家庭"
        };
        this.addNode(config);
        config = {
            zIndex: this.zIndex++, type: "common", left: 550, top: 200,
            width: 100, height: 60, text: "社会"
        };
        this.addNode(config);

        //添加中心节点
        config = {
            zIndex: this.zIndex++, type: "center", left: 280, top: 200,
            width: 140, height: 80, text: "微观系统"
        };
        this.addNode(config);

        //添加3个属性节点
        config = {
            zIndex: this.zIndex++, type: "property", left: 600, top: 300,
            width: 255, height: 26, text: "心理："
        };
        this.addNode(config);
        config = {
            zIndex: this.zIndex++, type: "property", left: 600, top: 100,
            width: 255, height: 26, text: "生理："
        };
        this.addNode(config);
        config = {
            zIndex: this.zIndex++, type: "property", left: 600, top: 400,
            width: 255, height: 26, text: "社会："
        };
        this.addNode(config);

        //添加中心节点到各个属性节点的连线
        var center_node = null;
        for (var index = 0, len = this.nodes.length; index < len; index++) {
            var node = this.nodes[index];
            if (node.type === "center") {
                center_node = node;
                break;
            }
        }
        for (var index = 0, len = this.nodes.length; index < len; index++) {
            var node = this.nodes[index];
            if (node.type === "property") {
                var config = {
                    startX: center_node.getAnchor("right").x,
                    startY: center_node.getAnchor("right").y,
                    endX: node.getAnchor("left").x,
                    endY: node.getAnchor("left").y,
                    type: lineState.property_line,
                    startNode: center_node,
                    endNode: node,
                    startType: "right",
                    endType: "left"
                };
                var line = new Line(config);
                line.draw();
                center_node.lines.push(line);
                node.lines.push(line);
                this.lines.push(line);
            }
        }
    }


    addNode(config) {
        var c_node = new Node(config);
        this.workContainer.appendChild(c_node.targetNode);
        c_node.reSet();
        this.nodes.push(c_node);
    }


    getTargetNode(target) {
        var node = null;
        if (target.className === "common_node" || target.className === "center_node"
            || target.className === "property_node") {
            var id = target.parentNode.id;
            for (var index = 0; index < this.nodes.length; index++) {
                if (this.nodes[index].guid == id) {
                    node = this.nodes[index];
                    break;
                }
            }
        }
        return node;
    }


    getTargetNodeIndex(target) {
        var targetIndex = -1;
        if (target.className === "common_node") {
            var id = target.parentNode.id;
            for (var index = 0; index < this.nodes.length; index++) {
                if (this.nodes[index].guid == id) {
                    targetIndex = index;
                    break;
                }
            }
        }
        return targetIndex;
    }


    getBestPoint(event, node) {
        var nodeElement = document.querySelector("#" + node.guid);
        var position = this.common.getOffset(nodeElement);
        var point = {
            x: event.pageX - position.left,
            y: event.pageY - position.top
        };
        if (point.x < node.width / 4) {
            return {point: node.anchors.left, type: "left"};
        }
        else if (point.x > node.width * 3 / 4) {
            return {point: node.anchors.right, type: "right"};
        }
        else if (point.y < node.height / 2) {
            return {point: node.anchors.top, type: "top"};
        }
        else {
            return {point: node.anchors.bottom, type: "bottom"};
        }
    }


    deleteElement() {
        if (this.selectedLine !== null) {
            var line = this.selectedLine;
            this.deleteLine(line);
        }
        if (this.selectedNodeIndex < 0) {
            return;
        }
        this.deleteNode(this.selectedNodeIndex);
        this.selectedNodeIndex = -1;
    }


    deleteLine(line) {
        line.startNode.deleteLine(line.guid);
        line.endNode.deleteLine(line.guid);
        for (var index = 0, len = this.lines.length; index < len; index++) {
            if (this.lines[index].guid === line.guid) {
                this.lines.splice(index, 1);
                break;
            }
        }
        d3.select("#" + line.guid).remove();
        this.selectedLine = null;
    }


    deleteNode(nodeIndex) {
        var node = this.nodes[nodeIndex];
        for (var index = 0, len = node.lines.length; index < len; index++) {
            var line = node.lines[index];
            var another_node = null;
            if (line.startNode.guid == node.guid) {
                another_node = line.endNode;
            }
            if (line.endNode.guid == node.guid) {
                another_node = line.startNode;
            }
            another_node.deleteLine(line.guid);
            for (var n = 0, length = this.lines.length; n < length; n++) {
                if (this.lines[n].guid === line.guid) {
                    this.lines.splice(n, 1);
                    break;
                }
            }
            d3.select("#" + line.guid).remove();
        }
        d3.select("#" + node.guid).remove();
        this.nodes.splice(nodeIndex, 1);   //减少节点数
    }


    clearDisplayLine() {
        var canvas = document.getElementById("canvas_display");
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
    }


    //事件处理
    onMouseDown(event) {
        var target = event.target;
        if (this.selected_icon == "") {
            var node = this.getTargetNode(target);
            if (node != null) {
                this.node_moving = true;
                this.movingNode = node;
                node.targetNode.style.zIndex = this.zIndex++;
                node.start(event);
            }
            return;
        }
        else {
            var icon = this.selected_icon.substring(5);
            var node = this.getTargetNode(target);
            if (node != null && node.type != "property") {
                var position = this.getBestPoint(event, node);
                this.startPoint = position.point;
                this.startType = position.type;
                this.startNode = node;
                this.line_state = lineState[icon];
            }
            return;
        }
    }

    onMouseMove(event) {
        if (this.node_moving == true) {
            this.movingNode.move(event);
            this.hasupdated = true;
            return;
        }
        if (this.line_state != lineState.default) {
            var left = event.pageX - this.common.getOffset(this.workContainer).left;
            var top = event.pageY - this.common.getOffset(this.workContainer).top;
            var config = {
                startX: this.startPoint.x, startY: this.startPoint.y, endX: left, endY: top,
                type: this.line_state, guid: "canvas_display"
            };
            if (this.tempLine == null) {
                var line = new Line(config);
                this.tempLine = line;
                this.tempLineId = line.guid;
            }
            else {
                this.tempLine.refresh(config);
            }
            this.tempLine.drawDisplay();
            this.hasupdated = true;
            return;
        }
    }

    onMouseUp(event) {
        var target = event.target;
        var node = this.getTargetNode(target);
        if (node == null) {
            return 1;
        }

        if (this.selected_icon) {
            d3.select("#" + this.selected_icon).style("border", "1px solid black");
            this.selected_icon = "";
        }

        if (this.line_state != lineState.default) {
            if (node.guid == this.startNode.guid) {
                //alert("关系线不能连接自身");
                return true;
            }
            if (node.type == "property") {
                return true;
            }
            for (var index = 0, len = this.lines.length; index < len; index++) {
                var exist_line = this.lines[index];
                if ((exist_line.startNode.guid == this.startNode.guid && exist_line.endNode.guid == node.guid)) {
                    return true;
                }
            }
            var position = this.getBestPoint(event, node);
            var endPoint = position.point, endType = position.type;
            var config = {
                startX: this.startPoint.x,
                startY: this.startPoint.y,
                endX: endPoint.x,
                endY: endPoint.y,
                type: this.line_state,
                startNode: this.startNode,
                endNode: node,
                startType: this.startType,
                endType: endType
            };
            var line = new Line(config);
            line.draw();
            this.startNode.lines.push(line);
            node.lines.push(line);
            this.lines.push(line);
            return true;
        }
    }

    onDocumentUp() {
        this.clearDisplayLine();
        this.node_moving = false;
        this.movingNode = null;
        this.startPoint = null;
        this.startType = "";
        this.startNode = null;
        this.tempLine = null;
        this.tempLineId = "";
        this.line_state = lineState.default;
    }

    onClick(event) {
        var target = event.target;
        var left = event.pageX - this.common.getOffset(this.workContainer).left;
        var top = event.pageY - this.common.getOffset(this.workContainer).top;
        if (this.selectedLine != null) {
            this.selectedLine.resume();
            this.selectedLine = null;
        }
        if (this.dblNode != null) {
            var txtBox = null;
            if (document.querySelector("#txtProperty").style.display == "none") {
                txtBox = document.querySelector("#txtTitle");
            } else {
                txtBox = document.querySelector("#txtProperty");
            }
            var title = txtBox.value;
            this.dblNode.changeText(title);
            this.dblNode.changeHeight();
            this.dblNode = null;
            txtBox.style.display = "none";
        }
        if (this.selectedNodeIndex > -1) {
            var last_node = this.nodes[this.selectedNodeIndex].targetNode;
            last_node.style.border = "none";
            this.selectedNodeIndex = -1;
        }
        var targetIndex = this.getTargetNodeIndex(target);
        if (targetIndex > -1) {
            var htmlNode = this.nodes[targetIndex].targetNode;
            htmlNode.style.border = "1px solid red";
            this.selectedNodeIndex = targetIndex;
            return true;
        }
        for (var i = 0, len = this.lines.length; i < len; i++) {
            var line = this.lines[i];
            var point = {
                x: left,
                y: top
            };
            if (line.isOnLine(point)) {
                this.selectedLine = line;
                line.highLight();
                return;
            }
        }
    }

    onDblClick(event) {
        var target = event.target;
        var node = this.getTargetNode(target);
        if (node != null) {
            this.hasupdated = true;
            this.dblNode = node;
            this.dblNode.showBox();
        }
    }

    onKeyUp(event) {
        if (event.keyCode == 46 || event.keyCode == 110) {
            this.hasupdated = true;
            this.deleteElement();
        }
    }

    ToJson() {
        var managerJson = {ID: this.guid, Name: this.name, TopOffset: 0, LeftOffset: 0, Height: 500, Width: 1000};
        return managerJson;
    }

    setSelectedIcon(iconId) {
        this.selected_icon = iconId;
    }
}

