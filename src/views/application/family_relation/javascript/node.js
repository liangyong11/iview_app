/**
 * Created by liangyong on 2018/4/17.
 */
import * as d3 from 'd3';
import {Common, lineState} from './common.js';
export class Node {
    constructor(config) {
        this.common = new Common();
        this.guid = config.guid || this.common.guid();
        this.lines = [];
        this.type = config.type;
        this.left = config.left;
        this.top = config.top;
        this.width = config.width;
        this.height = config.height;
        this.text = config.text || '';
        this.generation = config.generation || 0;
        this.isSelf = config.isSelf || 0;
        this.origin = {x: config.left + config.width / 2, y: config.top + config.height / 2};
        this.anchors = this.setAnchors();
        this.targetNode = this.getTargetNode(config);

        this.coupleLine_id = config.coupleLine_id || '';
        this.anotherNode_id = config.anotherNode_id || '';

        this.coupleLine = config.coupleLine || null;
        this.anotherNode = config.anotherNode || null;

        this.sourceCoord = {
            start: {
                left: parseInt(this.targetNode.style.left),
                top: parseInt(this.targetNode.style.top)
            },
            real: {
                left: parseInt(this.targetNode.style.left),
                top: parseInt(this.targetNode.style.top)
            },
            last: {
                left: parseInt(this.targetNode.style.left),
                top: parseInt(this.targetNode.style.top)
            }
        };

        this.eventCoord = {
            start: {
                X: this.sourceCoord.start.left,
                Y: this.sourceCoord.start.top
            }
        };
    }

    /*    设置图形节点的4个锚点   */
    setAnchors() {
        var top = {x: this.left + this.width / 2, y: this.top};
        var right = {x: this.left + this.width, y: this.top + this.height / 2};
        var left = {x: this.left, y: this.top + this.height / 2};
        var bottom = {x: this.left + this.width / 2, y: this.top + this.height};
        return {top: top, right: right, left: left, bottom: bottom};
    }

    /*   获得图形的dom呈现节点  */
    getTargetNode(config) {
        function addNodeContent(tar, config) {
            var type = config.type;
            if (type === "male") {
                var node = document.createElement("div");
                node.id = tar.id + "_text";
                node.className = "male_node";
                node.innerHTML = config.text || "称呼";
                if (config.isSelf) {
                    node.style.backgroundColor = "#808080";
                }
                tar.appendChild(node);
            }
            if (type === "female") {
                var node = document.createElement("div");
                node.id = tar.id + "_text";
                node.className = "female_node";
                node.innerHTML = config.text || "称呼";
                if (config.isSelf) {
                    node.style.backgroundColor = "#808080";
                }
                tar.appendChild(node);
            }
        }

        var tar = document.createElement('div');
        tar.id = this.guid;
        tar.className = "node_container";
        tar.style.left = config.left + "px";
        tar.style.top = config.top + "px";
        tar.style.width = config.width + "px";
        tar.style.height = config.height + "px";
        tar.style.zIndex = config.zIndex;
        addNodeContent(tar, config);
        return tar;
    }

    /* 节点移动开始事件(鼠标按下)  */
    start(event) {
        this.sourceCoord.start.left = parseInt(this.targetNode.style.left);
        this.sourceCoord.start.top = parseInt(this.targetNode.style.top);
        this.eventCoord.start.X = event.pageX;
        this.eventCoord.start.Y = event.pageY;
    }

    /* 节点移动过程事件(鼠标move事件)  */
    move(event) {
        //如有选择内容，进行清除
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();

        //获得实际的 left,top
        this.sourceCoord.real.left = this.sourceCoord.start.left + event.pageX - this.eventCoord.start.X;
        this.sourceCoord.real.top = this.sourceCoord.start.top + event.pageY - this.eventCoord.start.Y;

        if (this.sourceCoord.real.left < this.getRange().minLeft) {
            this.sourceCoord.last.left = this.getRange().minLeft;
        }
        else if (this.sourceCoord.real.left > this.getRange().maxLeft) {
            this.sourceCoord.last.left = this.getRange().maxLeft;
        }
        else {
            this.sourceCoord.last.left = this.sourceCoord.real.left;
        }
        this.targetNode.style.left = this.sourceCoord.last.left + 'px';

        this.refresh();

        for (var index = 0, len = this.lines.length; index < len; index++) {
            var line = this.lines[index];
            if (line.type == lineState.couple) {
                var bothPoint = {
                    start: line.startNode.getAnchor(line.startType),
                    end: line.endNode.getAnchor(line.endType)
                };
                line.refresh({
                    startX: bothPoint.start.x,
                    startY: bothPoint.start.y,
                    endX: bothPoint.end.x,
                    endY: bothPoint.end.y
                });
                line.reDraw();
            }
            if (line.type == lineState.child) {
                if (line.endNode == this) {
                    var endX = this.origin.x, endY = this.top;
                    line.refresh({endX: endX, endY: endY});
                    line.reDraw();
                }
                else {
                    var point = line.startNode.coupleLine.getMiddle();
                    line.refresh({startX: point.x, startY: point.y});
                    line.reDraw();
                }
            }
            if (line.type == lineState.suspend || line.type == lineState.clash || line.type == lineState.intently
                || line.type == lineState.together || line.type == lineState.nervous) {
                var bothPoint = {
                    start: line.startNode.getAnchor(line.startType),
                    end: line.endNode.getAnchor(line.endType)
                };
                line.refresh({
                    startX: bothPoint.start.x,
                    startY: bothPoint.start.y,
                    endX: bothPoint.end.x,
                    endY: bothPoint.end.y
                });
                line.reDraw();
            }
        }
    }

    refresh() {
        var l = parseInt(this.targetNode.style.left),
            t = parseInt(this.targetNode.style.top);
        this.left = l;
        this.top = t;
        this.origin = {x: l + this.width / 2, y: t + this.height / 2};
        this.anchors = this.setAnchors();
    }

    getRange() {
        var range = {
            minLeft: 0,
            maxLeft: 840,
            minTop: 0,
            maxTop: 420
        };
        return range;
    }

    /*  根据id删除当前节点下的线条   */
    deleteLine(id) {
        for (var j = 0, len = this.lines.length; j < len; j++) {
            var line = this.lines[j];
            if (line.guid === id) {
                this.lines.splice(j, 1);
                line = null;
                break;
            }
        }
    }

    getAnchor(type) {
        if (type === "left") {
            return this.anchors.left;
        }
        if (type === "top") {
            return this.anchors.top;
        }
        if (type === "bottom") {
            return this.anchors.bottom;
        }
        return this.anchors.right;
    }

    /*  获取节点下的继承关系  */
    getChildLine() {
        var lines = [];
        for (var j = 0, len = this.lines.length; j < len; j++) {
            var line = this.lines[j];
            if (line.type == lineState.child) {
                lines.push(line);
            }
        }
        return lines;
    }

    /*  获取节点下的情绪关系  */
    getMoodLine() {
        var lines = [];
        for (var j = 0, len = this.lines.length; j < len; j++) {
            var line = this.lines[j];
            if (line.type != lineState.child && line.type != lineState.couple) {
                lines.push(line);
            }
        }
        return lines;
    }

    ToJson() {
        var nodeJson = {
            ID: this.guid,
            Title: this.text,
            TopOffset: this.top,
            LeftOffset: this.left,
            Height: this.height,
            Width: this.width,
            Type: this.type,
            Generation: this.generation,
            IsSelf: this.isSelf
        };
        if (this.coupleLine != null) {
            nodeJson.CoupleLineID = this.coupleLine.guid;
        }
        if (this.anotherNode != null) {
            nodeJson.AnotherID = this.anotherNode.guid;
        }
        return nodeJson;
    }

    setSelf() {
        this.isSelf = 1;
        this.targetNode.childNodes[0].style.backgroundColor = "#808080";
    }

    setOther() {
        this.isSelf = 0;
        this.targetNode.childNodes[0].style.backgroundColor = "#5ec592";
    }

    changeText(text) {
        this.text = text || this.text || "称呼";
        this.targetNode.childNodes[0].innerHTML = this.text;
    }

    showBox() {
        var workContainer = document.querySelector("#work_container");
        var title = this.text || "称呼";
        var left = this.left + 99;
        var top = this.top - 1;
        d3.select("#propertyBox").style("left", left + "px").style("top", top + "px").style("display", "block");
        var txtTitleElement = d3.select("#txtTitle").style("width", (this.width + 2) + "px")
            .style("height", (this.height + 2) + "px").node();
        txtTitleElement.focus();
        txtTitleElement.value = title;
        var flag = this.isSelf ? true : false;
        d3.select("#chkSelf").node().checked = flag;
    }
}

