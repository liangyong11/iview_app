/**
 * Created by liangyong on 2018/4/16.
 */
import * as d3 from 'd3';
import {Common, lineState} from './common.js';
import {Node} from './node.js';
import {Line} from './line.js';
export class Shape {
    constructor(config) {
        this.common = new Common();

        this.guid = config.guid || this.common.guid();
        this.name = config.name || '';
        this.zIndex = 101;
        this.mouseState = lineState.default;
        this.workContainer = document.querySelector('#work_container');
        this.nodes = [];
        this.lines = [];

        this.node_moving = false;
        this.movingNode = null;

        this.line_state = lineState.default;
        this.startPoint = null;
        this.startType = '';
        this.startNode = null;
        this.selectedLine = null;
        this.selectedNodeIndex = -1;

        this.tempLine = null;
        this.tempLineId = '';

        this.dblNode = null;
        this.selected_icon = '';

        this.hasupdated = false;
    }

    addNode(config) {
        var c_node = new Node(config);
        this.workContainer.appendChild(c_node.targetNode);
        this.nodes.push(c_node);
    }

    getTargetNode(target) {
        var node = null;
        if (target.className === "male_node" || target.className === "female_node") {
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
        if (target.className === "male_node" || target.className === "female_node") {
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
        var point = {
            x: event.pageX - this.common.getOffset(nodeElement).left,
            y: event.pageY - this.common.getOffset(nodeElement).top
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
        if (line.type == lineState.couple) {
            //如果当前线下有继承线,先删掉继承线
            var lines = line.startNode.getChildLine();
            for (var index = 0, len = lines.length; index < len; index++) {
                var l = lines[index];
                this.deleteLine(l);
            }
            line.startNode.coupleLine = null;
            line.endNode.coupleLine = null;
            line.startNode.anotherNode = null;
            line.endNode.anotherNode = null;
        }
        if (line.type == lineState.child) {
            line.startNode.anotherNode.deleteLine(line.guid);
        }
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
        node.lines.sort(function (a, b) {
            return b.type > a.type;
        });
        var lines = [];
        for (var i = 0; i < node.lines.length; i++) {
            var l = node.lines[i];
            lines.push(l);
        }
        for (var index = 0; index < lines.length; index++) {
            var line = lines[index];
            this.deleteLine(line);
        }
        d3.select("#" + node.guid).remove();
        this.nodes.splice(nodeIndex, 1);   //减少节点数
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
            if (node != null) {
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
        var left = event.pageX - this.common.getOffset(this.workContainer).left;
        var top = event.pageY - this.common.getOffset(this.workContainer).top;
        var endPoint = {x: left, y: top};
        if (this.node_moving == true) {
            this.movingNode.move(event);
            this.hasupdated = true;
            return;
        }
        if (this.line_state == lineState.couple) {
            var startX = 0, startY = this.startNode.origin.y;
            if (left < this.startNode.origin.x) {
                startX = this.startNode.anchors.left.x;
                this.startType = "left";
            }
            else {
                startX = this.startNode.anchors.right.x;
                this.startType = "right";
            }
            var config = {startX: startX, startY: startY, endX: left, endY: top, type: lineState.couple};
            if (this.tempLine == null) {
                var line = new Line(config);
                this.tempLine = line;
                this.tempLineId = line.guid;
            }
            else {
                this.tempLine.refresh(config);
            }
            this.tempLine.drawTemp();
            this.hasupdated = true;
            return;
        }
        if (this.line_state == lineState.intently || this.line_state == lineState.together || this.line_state == lineState.nervous
            || this.line_state == lineState.suspend || this.line_state == lineState.clash || this.line_state == lineState.child) {
            var endType = this.getEndDirection(this.startPoint, endPoint, this.startType);
            var config = {
                startX: this.startPoint.x, startY: this.startPoint.y, endX: left, endY: top,
                type: this.line_state, startType: this.startType, endType: endType
            };
            if (this.tempLine == null) {
                var line = new Line(config);
                this.tempLine = line;
                this.tempLineId = line.guid;
            }
            else {
                this.tempLine.refresh(config);
            }
            this.tempLine.drawTemp();
            this.hasupdated = true;
            return;
        }
    }

    onMouseUp(event) {
        var target = event.target;
        var left = event.pageX - this.common.getOffset(this.workContainer).left;
        var top = event.pageY - this.common.getOffset(this.workContainer).top;
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
            if (this.line_state === lineState.couple) {
                if (this.startNode.coupleLine != null || node.coupleLine != null) {
                    //alert("连接双方必须都不存在婚姻关系");
                    return true;
                }
                if (node.generation != this.startNode.generation || node.type == this.startNode.type) {
                    //alert("婚姻线双方必须为同代的异性");
                    return true;
                }
            }
            else if (this.line_state === lineState.child) {
                if (this.startNode.coupleLine == null) {
                    //alert("节点必须有婚姻关系,才能画集成关系");
                    return true;
                }
                if ((node.generation - this.startNode.generation) != 1) {
                    //alert("子节点必须为父节点的下一代节点");
                    return true;
                }
                var childLines = this.startNode.getChildLine();
                for (var index = 0, len = childLines.length; index < len; index++) {
                    var childLine = childLines[index];
                    if (childLine.endNode.guid == node.guid) {
                        //alert("该继承关系已经存在");
                        return true;
                    }
                }
            }
            else {
                var moodLines = this.startNode.getMoodLine();
                for (var index = 0, len = moodLines.length; index < len; index++) {
                    var moodLine = moodLines[index];
                    if ((moodLine.startNode.guid == this.startNode.guid && moodLine.endNode.guid == node.guid)
                        || (moodLine.startNode.guid == node.guid && moodLine.endNode.guid == this.startNode.guid)) {
                        //alert("两节点之间已经有情绪关系");
                        return true;
                    }
                }
            }
        }
        if (this.line_state === lineState.couple) {
            var endX = 0, endY = node.origin.y;
            var endType = "";
            if (left > this.tempLine.startX) {
                endX = node.anchors.left.x;
                endType = "left";
            }
            else {
                endX = node.anchors.right.x;
                endType = "right";
            }
            var config = {
                startX: this.tempLine.startX,
                startY: this.tempLine.startY,
                endX: endX,
                endY: endY,
                type: lineState.couple,
                startNode: this.startNode,
                endNode: node,
                startType: this.startType,
                endType: endType
            };
            var line = new Line(config);
            line.draw();
            this.startNode.coupleLine = line;
            node.coupleLine = line;
            this.startNode.anotherNode = node;
            node.anotherNode = this.startNode;
            this.startNode.lines.push(line);
            node.lines.push(line);
            this.lines.push(line);
            return true;
        }
        if (this.line_state === lineState.child) {
            var endX = node.origin.x, endY = node.top;
            var middlePoint = this.startNode.coupleLine.getMiddle();
            var config = {
                startX: middlePoint.x, startY: middlePoint.y, endX: endX, endY: endY,
                type: lineState.child, startNode: this.startNode, endNode: node, startType: "middle", endType: "top"
            };
            var line = new Line(config);
            line.draw();
            this.startNode.lines.push(line);
            this.startNode.anotherNode.lines.push(line);
            node.lines.push(line);
            this.lines.push(line);
            return true;
        }
        if (this.line_state === lineState.intently || this.line_state === lineState.together || this.line_state == lineState.nervous
            || this.line_state === lineState.suspend || this.line_state == lineState.clash) {
            var position = this.getBestPoint(event, node);
            var endPoint = position.point, endType = position.type;
            var config = {
                startX: this.tempLine.startX,
                startY: this.tempLine.startY,
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

    onShapeMouseUp() {
        if (this.tempLineId) {
            d3.select("#" + this.tempLineId).remove();
        }
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
        if (this.selectedNodeIndex > -1) {
            var last_node = this.nodes[this.selectedNodeIndex].targetNode;
            last_node.style.border = "none";
            this.selectedNodeIndex = -1;
        }
        if (this.dblNode != null) {
            var chkSelf = document.querySelector("#chkSelf");
            if (chkSelf.checked) {
                for (var index = 0, len = this.nodes.length; index < len; index++) {
                    var node = this.nodes[index];
                    if (node.isSelf == 1) {
                        node.setOther();
                    }
                }
                this.dblNode.setSelf();
            }
            else {
                this.dblNode.setOther();
            }
            var title = document.querySelector("#txtTitle").value;
            this.dblNode.changeText(title);
            this.dblNode = null;
            d3.select("#propertyBox").style("display", "none");
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

    getEndDirection(_startPoint, _endPoint, _startDirection) {
        var origin_x = _startPoint.x;
        var origin_y = _startPoint.y;
        var target_x = _endPoint.x;
        var target_y = _endPoint.y;
        var _endDirection = "";
        switch (_startDirection) {
            case "top":
                if (target_y < origin_y - 10) {
                    _endDirection = "bottom";
                }
                else {
                    _endDirection = "top";
                }
                break;
            case "bottom":
                if (target_y > origin_y + 10) {
                    _endDirection = "top";
                }
                else {
                    _endDirection = "bottom";
                }
                break;
            case "left":
                if (target_x < origin_x - 10) {
                    _endDirection = "right";
                }
                else {
                    _endDirection = "left";
                }
                break;
            case "right":
                if (target_x > origin_x + 10) {
                    _endDirection = "left";
                }
                else {
                    _endDirection = "right";
                }
                break;
        }
        return _endDirection;
    }

    setSelectedIcon(iconId) {
        this.selected_icon = iconId;
    }

    ToJson() {
        var managerJson = {ID: this.guid, Name: this.name, TopOffset: 0, LeftOffset: 0, Height: 400, Width: 1000};
        return managerJson;
    }
}
