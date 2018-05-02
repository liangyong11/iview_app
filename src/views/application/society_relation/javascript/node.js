/**
 * Created by liangyong on 2018/4/19.
 */

import {Common} from "./tool.js";
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
        this.text = config.text || "";
        this.origin = {x: config.left + config.width / 2, y: config.top + config.height / 2};
        this.anchors = this.setAnchors();
        this.targetNode = this.getTargetNode(config);

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
            if (type === "common") {
                var node = document.createElement("div");
                node.id = tar.id + "_content";
                node.className = "common_node";
                node.innerHTML = config.text;
                tar.appendChild(node);
            }
            if (type === "center") {
                var node = document.createElement("div");
                node.id = tar.id + "_content";
                node.className = "center_node";
                node.innerHTML = config.text;
                tar.appendChild(node);
            }
            if (type === "property") {
                var node = document.createElement("div");
                node.id = tar.id + "_content";
                node.className = "property_node";
                node.innerHTML = config.text;
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
        if (this.sourceCoord.real.top < this.getRange().minTop) {
            this.sourceCoord.last.top = this.getRange().minTop;
        }
        else if (this.sourceCoord.real.top > this.getRange().maxTop) {
            this.sourceCoord.last.top = this.getRange().maxTop;
        }
        else {
            this.sourceCoord.last.top = this.sourceCoord.real.top;
        }
        this.targetNode.style.left = this.sourceCoord.last.left + "px";
        this.targetNode.style.top = this.sourceCoord.last.top + "px";

        this.refresh();

        for (var index = 0, len = this.lines.length; index < len; index++) {
            var line = this.lines[index];
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
            maxLeft: 1000 - this.width,
            minTop: 0,
            maxTop: 500 - this.height
        };
        return range;
    }

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

    changeText(text) {
        this.text = text || this.text || "";
        this.targetNode.childNodes[0].innerHTML = this.text;
    }

    showBox() {
        var title = this.text || "";
        var left = this.left;
        var top = this.top;
        var txtBox = null;
        if (this.type === "property") {
            if (this.height < 30) {
                txtBox = document.querySelector("#txtProperty");
            }
            else {
                txtBox = document.querySelector("#txtTitle");
            }
        }
        else {
            txtBox = document.querySelector("#txtTitle");
        }
        txtBox.style.top = top + "px";
        txtBox.style.left = left + "px";
        txtBox.style.width = (this.width + 2) + "px";
        txtBox.style.height = (this.height + 2) + "px";
        txtBox.style.display = "block";
        txtBox.value = title;
        txtBox.focus();
    }

    changeHeight() {
        if (this.type === "property") {
            var div_text = document.querySelector("#div_text");
            div_text.style.display = "block";
            div_text.innerHTML = this.text;
            var height = parseInt(div_text.offsetHeight);
            div_text.style.display = "none";
            if (height > 130) {
                height = 130;
            }
            document.querySelector("#" + this.guid + "_content").style.height = height + "px";
            document.querySelector("#" + this.guid).style.height = height + "px";
            this.height = height;
            this.refresh();
            for (var index = 0, len = this.lines.length; index < len; index++) {
                var line = this.lines[index];
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

    reSet() {
        if (this.type === "property") {
            var height = document.querySelector("#" + this.guid).offsetHeight;
            if (height > 130) {
                height = 130;
                document.querySelector("#" + this.guid + "_content").style.height = height + "px";
                document.querySelector("#" + this.guid).style.height = height + "px";
            }
        }
    }

    ToJson() {
        var nodeJson = {
            ID: this.guid,
            Name: this.text,
            TopOffset: this.top,
            LeftOffset: this.left,
            Height: this.height,
            Width: this.width,
            Type: this.type
        };
        return nodeJson;
    }
}

