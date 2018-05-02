/**
 * Created by liangyong on 2018/4/17.
 */

import * as d3 from 'd3';
import {Common, lineState} from './common.js';
export class Line {
    constructor(config) {
        this.guid = config.guid || new Common().guid();
        this.type = config.type || lineState.couple;
        this.startX = config.startX;
        this.startY = config.startY;
        this.endX = config.endX;
        this.endY = config.endY;
        this.startType = config.startType || "";
        this.endType = config.endType || "";
        this.startNode = config.startNode || null;
        this.endNode = config.endNode || null;

        this.totalPoints = [];
    }

    createPath() {
        var path = document.getElementById(this.guid);
        if (path) {
            return d3.select(path);
        }
        path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        var svgContainer = document.querySelector("#svg_workspace");
        svgContainer.appendChild(path);
        var selectItem = d3.select(path);
        selectItem.attr("fill", "white").attr("fill-opacity", "0").attr("stroke", "black").attr("stroke-width", 1)
            .attr("id", this.guid);
        return selectItem;
    }

    drawTemp() {
        var path = this.createPath();
        var pathDefine = "";
        if (this.type == lineState.couple) {
            pathDefine = "M" + this.startX + "," + this.startY + " L" + this.endX + "," + this.endY;
            path.attr("d", pathDefine);
        }
        else {
            this.drawLineFromPoint();
        }
    }

    draw() {
        this.drawLineFromPoint();
    }

    reDraw() {
        this.draw();
    }

    refresh(config) {
        this.startX = config.startX || this.startX;
        this.startY = config.startY || this.startY;
        this.endX = config.endX || this.endX;
        this.endY = config.endY || this.endY;
        this.startType = config.startType || this.startType;
        this.endType = config.endType || this.endType;
        this.type = config.type || this.type;
    }

    highLight() {
        var path = this.createPath();
        path.attr("stroke", "red");
        this.draw();
    }

    resume() {
        var path = this.createPath();
        path.attr("stroke", "black");
        this.drawLineFromPoint();
    }

    drawLineFromPoint() {
        var path = this.createPath();
        this.getPoints();
        var pathDefine = "";
        if (this.type == lineState.couple || this.type == lineState.child) {
            var firstPoints = this.totalPoints[0];
            for (var index = 0, len = firstPoints.length; index < len; index++) {
                var point = firstPoints[index];
                if (index == 0) {
                    pathDefine = pathDefine + "M" + point.x + "," + point.y + " ";
                }
                else {
                    pathDefine = pathDefine + "L" + point.x + "," + point.y + " ";
                }
            }
            path.attr("d", pathDefine);
        }
        if (this.type == lineState.suspend) {
            var middleIndex = -1;
            var firstPoints = this.totalPoints[0];
            if (firstPoints.length % 2 == 0) {
                middleIndex = firstPoints.length / 2;
            }
            else {
                middleIndex = Math.floor(firstPoints.length / 2);
            }
            for (var index = 0, len = firstPoints.length; index < len; index++) {
                var point = firstPoints[index];
                if (index == 0) {
                    pathDefine = pathDefine + "M" + point.x + "," + point.y + " ";
                }
                else {
                    if (index == middleIndex) {
                        var frontPoint = firstPoints[middleIndex - 1], backPoint = firstPoints[middleIndex];
                        if (frontPoint.x == backPoint.x) {
                            var y1 = (frontPoint.y > backPoint.y) ? (frontPoint.y + backPoint.y) / 2 + 10 : (frontPoint.y + backPoint.y) / 2 - 10;
                            var y2 = (frontPoint.y > backPoint.y) ? (frontPoint.y + backPoint.y) / 2 - 10 : (frontPoint.y + backPoint.y) / 2 + 10;
                            pathDefine = pathDefine + "L" + frontPoint.x + "," + y1 + " ";
                            pathDefine = pathDefine + "M" + (frontPoint.x - 10) + "," + y1 + " L" + (frontPoint.x + 10) + "," + y1 + " ";
                            pathDefine = pathDefine + "M" + (frontPoint.x - 10) + "," + y2 + " L" + (frontPoint.x + 10) + "," + y2 + " ";
                            pathDefine = pathDefine + "M" + frontPoint.x + "," + y2 + " ";
                        }
                        if (frontPoint.y == backPoint.y) {
                            var x1 = (frontPoint.x > backPoint.x) ? (frontPoint.x + backPoint.x) / 2 + 10 : (frontPoint.x + backPoint.x) / 2 - 10;
                            var x2 = (frontPoint.x > backPoint.x) ? (frontPoint.x + backPoint.x) / 2 - 10 : (frontPoint.x + backPoint.x) / 2 + 10;
                            pathDefine = pathDefine + "L" + x1 + "," + frontPoint.y + " ";
                            pathDefine = pathDefine + "M" + x1 + "," + (frontPoint.y - 10) + " L" + x1 + "," + (frontPoint.y + 10) + " ";
                            pathDefine = pathDefine + "M" + x2 + "," + (frontPoint.y - 10) + " L" + x2 + "," + (frontPoint.y + 10) + " ";
                            pathDefine = pathDefine + "M" + x2 + "," + frontPoint.y + " ";
                        }
                    }
                    pathDefine = pathDefine + "L" + point.x + "," + point.y + " ";
                }
            }
            path.attr("d", pathDefine);
        }
        if (this.type == lineState.clash) {
            var firstPoints = this.totalPoints[0];
            for (var index = 0, len = firstPoints.length; index < len - 1; index++) {
                var frontPoint = firstPoints[index], backPoint = firstPoints[index + 1];
                //垂直方向线条
                if (frontPoint.x === backPoint.x) {
                    var lineLength = Math.abs(frontPoint.y - backPoint.y);
                    for (var position = 0; position <= lineLength; position = position + 10) {
                        var point = {
                            x: position % 4 == 0 ? (frontPoint.x - 5) : (frontPoint.x + 5),
                            y: (frontPoint.y > backPoint.y) ? (frontPoint.y - position) : (frontPoint.y + position)
                        };
                        if (position == 0) {
                            pathDefine = pathDefine + "M" + point.x + "," + point.y + " ";
                        }
                        else {
                            pathDefine = pathDefine + "L" + point.x + "," + point.y + " ";
                        }
                    }
                    for (var position = 0; position <= lineLength; position = position + 10) {
                        var point = {
                            x: position % 4 == 0 ? (frontPoint.x + 5) : (frontPoint.x - 5),
                            y: (frontPoint.y > backPoint.y) ? (frontPoint.y - position) : (frontPoint.y + position)
                        };
                        if (position == 0) {
                            pathDefine = pathDefine + "M" + point.x + "," + point.y + " ";
                        }
                        else {
                            pathDefine = pathDefine + "L" + point.x + "," + point.y + " ";
                        }
                    }
                }
                //水平方向线条
                if (frontPoint.y === backPoint.y) {
                    var lineLength = Math.abs(frontPoint.x - backPoint.x);
                    for (var position = 0; position <= lineLength; position = position + 10) {
                        var point = {
                            x: (frontPoint.x > backPoint.x) ? (frontPoint.x - position) : (frontPoint.x + position),
                            y: position % 4 == 0 ? (frontPoint.y + 5) : (frontPoint.y - 5)
                        };
                        if (position == 0) {
                            pathDefine = pathDefine + "M" + point.x + "," + point.y + " ";
                        }
                        else {
                            pathDefine = pathDefine + "L" + point.x + "," + point.y + " ";
                        }
                    }
                    for (var position = 0; position <= lineLength; position = position + 10) {
                        var point = {
                            x: (frontPoint.x > backPoint.x) ? (frontPoint.x - position) : (frontPoint.x + position),
                            y: position % 4 == 0 ? (frontPoint.y - 5) : (frontPoint.y + 5)
                        };
                        if (position == 0) {
                            pathDefine = pathDefine + "M" + point.x + "," + point.y + " ";
                        }
                        else {
                            pathDefine = pathDefine + "L" + point.x + "," + point.y + " ";
                        }
                    }
                }
            }
            path.attr("d", pathDefine);
        }
        if (this.type == lineState.intently) {
            var firstPoints = this.totalPoints[0], secondPoints = this.totalPoints[1];
            for (var index = 0, len = firstPoints.length; index < len; index++) {
                var point = firstPoints[index];
                if (index == 0) {
                    pathDefine = pathDefine + "M" + point.x + "," + point.y + " ";
                }
                else {
                    pathDefine = pathDefine + "L" + point.x + "," + point.y + " ";
                }
            }
            for (var i = 0, len = secondPoints.length; i < len; i++) {
                var point = secondPoints[i];
                if (i == 0) {
                    pathDefine = pathDefine + "M" + point.x + "," + point.y + " ";
                }
                else {
                    pathDefine = pathDefine + "L" + point.x + "," + point.y + " ";
                }
            }
            path.attr("d", pathDefine);
        }
        if (this.type == lineState.together) {
            var firstPoints = this.totalPoints[0], secondPoints = this.totalPoints[1],
                thirdPoints = this.totalPoints[2];
            for (var index = 0, len = firstPoints.length; index < len; index++) {
                var point = firstPoints[index];
                if (index == 0) {
                    pathDefine = pathDefine + "M" + point.x + "," + point.y + " ";
                }
                else {
                    pathDefine = pathDefine + "L" + point.x + "," + point.y + " ";
                }
            }
            for (var i = 0, len = secondPoints.length; i < len; i++) {
                var point = secondPoints[i];
                if (i == 0) {
                    pathDefine = pathDefine + "M" + point.x + "," + point.y + " ";
                }
                else {
                    pathDefine = pathDefine + "L" + point.x + "," + point.y + " ";
                }
            }
            for (var i = 0, len = thirdPoints.length; i < len; i++) {
                var point = thirdPoints[i];
                if (i == 0) {
                    pathDefine = pathDefine + "M" + point.x + "," + point.y + " ";
                }
                else {
                    pathDefine = pathDefine + "L" + point.x + "," + point.y + " ";
                }
            }
            path.attr("d", pathDefine);
        }
        if (this.type == lineState.nervous) {
            var firstPoints = this.totalPoints[0], secondPoints = this.totalPoints[1],
                thirdPoints = this.totalPoints[2];
            for (var index = 0, len = firstPoints.length; index < len; index++) {
                var point = firstPoints[index];
                if (index == 0) {
                    pathDefine = pathDefine + "M" + point.x + "," + point.y + " ";
                }
                else {
                    pathDefine = pathDefine + "L" + point.x + "," + point.y + " ";
                }
            }
            for (var i = 0, len = secondPoints.length; i < len; i++) {
                var point = secondPoints[i];
                if (i == 0) {
                    pathDefine = pathDefine + "M" + point.x + "," + point.y + " ";
                }
                else {
                    pathDefine = pathDefine + "L" + point.x + "," + point.y + " ";
                }
            }
            for (var i = 0, len = thirdPoints.length; i < len; i++) {
                var point = thirdPoints[i];
                if (i == 0) {
                    pathDefine = pathDefine + "M" + point.x + "," + point.y + " ";
                }
                else {
                    pathDefine = pathDefine + "L" + point.x + "," + point.y + " ";
                }
            }
            for (var i = 0, len = thirdPoints.length; i < len - 1; i++) {
                var frontPoint = thirdPoints[i], backPoint = thirdPoints[i + 1];
                //垂直方向线条
                if (frontPoint.x === backPoint.x) {
                    var lineLength = Math.abs(frontPoint.y - backPoint.y);
                    for (var position = 0; position < lineLength; position = position + 5) {
                        var point = {
                            x: position % 2 == 0 ? (frontPoint.x - 5) : (frontPoint.x + 5),
                            y: (frontPoint.y > backPoint.y) ? (frontPoint.y - position) : (frontPoint.y + position)
                        };
                        if (position == 0) {
                            pathDefine = pathDefine + "M" + point.x + "," + point.y + " ";
                        }
                        else {
                            pathDefine = pathDefine + "L" + point.x + "," + point.y + " ";
                        }
                    }
                }
                //水平方向线条
                if (frontPoint.y === backPoint.y) {
                    var lineLength = Math.abs(frontPoint.x - backPoint.x);
                    for (var position = 0; position < lineLength; position = position + 5) {
                        var point = {
                            x: (frontPoint.x > backPoint.x) ? (frontPoint.x - position) : (frontPoint.x + position),
                            y: position % 2 == 0 ? (frontPoint.y + 5) : (frontPoint.y - 5)
                        };
                        if (position == 0) {
                            pathDefine = pathDefine + "M" + point.x + "," + point.y + " ";
                        }
                        else {
                            pathDefine = pathDefine + "L" + point.x + "," + point.y + " ";
                        }
                    }
                }
            }
            path.attr("d", pathDefine);
        }
    }

    isOnLine(point) {
        var check_width = 5;
        var targetPoints = [];
        if (this.type == lineState.together || this.type == lineState.nervous || this.type == lineState.intently) {
            targetPoints = this.totalPoints[2];
        }
        else {
            targetPoints = this.totalPoints[0];
        }
        for (var index = 1, len = targetPoints.length; index < len; index++) {
            var frontPoint = targetPoints[index - 1], backPoint = targetPoints[index];
            if (frontPoint.x === backPoint.x) {
                var maxY = Math.max(frontPoint.y, backPoint.y),
                    minY = Math.min(frontPoint.y, backPoint.y),
                    currentX = frontPoint.x;
                if (point.y > minY && point.y < maxY) {
                    if (point.x > currentX - check_width && point.x < currentX + check_width) {
                        return true;
                    }
                }
            }
            if (frontPoint.y === backPoint.y) {
                var minX = Math.min(frontPoint.x, backPoint.x),
                    maxX = Math.max(frontPoint.x, backPoint.x),
                    currentY = frontPoint.y;
                if (point.x > minX && point.x < maxX) {
                    if (point.y > currentY - check_width && point.y < currentY + check_width) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    getMiddle() {
        if (this.type == lineState.couple) {
            return {x: (this.startX + this.endX) / 2, y: (this.startY + this.endY) / 2};
        }
    }

    ToJson() {
        var lineJson = {
            ID: this.guid, Type: this.type, StartNodeID: this.startNode.guid,
            EndNodeID: this.endNode.guid, StartType: this.startType, EndType: this.endType, StartX: this.startX,
            EndX: this.endX, StartY: this.startY, EndY: this.endY
        };
        return lineJson;
    }

    getPoints() {
        this.totalPoints = [];
        var linePad = 15;
        var height = 45;
        var firstPoints = [], secondPoints = [], thirdPoints = [];
        var startx = this.startX;
        var starty = this.startY;
        var endx = this.endX;
        var endy = this.endY;

        if (this.type == lineState.couple) {
            firstPoints.push({x: startx, y: starty});
            firstPoints.push({x: endx, y: endy});
        }
        else if (this.type == lineState.child) {
            firstPoints.push({x: startx, y: starty});
            firstPoints.push({x: startx, y: starty + height});
            firstPoints.push({x: endx, y: starty + height});
            firstPoints.push({x: endx, y: endy});
        }
        else {
            switch (this.startType) {
                case "top": {
                    switch (this.endType) {
                        case "left": {
                            if (this.type == lineState.together || this.type == lineState.nervous || this.type == lineState.intently) {
                                //第一象限
                                if (endy < starty && endx > startx) {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: endy - 5});
                                    firstPoints.push({x: endx, y: endy - 5});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: endy + 5});
                                    secondPoints.push({x: endx, y: endy + 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第二象限
                                else if (endy < starty && endx <= startx) {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: starty / 2 + endy / 2 + 5});
                                    firstPoints.push({x: endx - linePad - 5, y: starty / 2 + endy / 2 + 5});
                                    firstPoints.push({x: endx - linePad - 5, y: endy - 5});
                                    firstPoints.push({x: endx, y: endy - 5});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: starty / 2 + endy / 2 - 5});
                                    secondPoints.push({x: endx - linePad + 5, y: starty / 2 + endy / 2 - 5});
                                    secondPoints.push({x: endx - linePad + 5, y: endy + 5});
                                    secondPoints.push({x: endx, y: endy + 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx - linePad, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx - linePad, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: starty - linePad + 5});
                                    firstPoints.push({x: endx - linePad + 5, y: starty - linePad + 5});
                                    firstPoints.push({x: endx - linePad + 5, y: endy - 5});
                                    firstPoints.push({x: endx, y: endy - 5});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: starty - linePad - 5});
                                    secondPoints.push({x: endx - linePad - 5, y: starty - linePad - 5});
                                    secondPoints.push({x: endx - linePad - 5, y: endy + 5});
                                    secondPoints.push({x: endx, y: endy + 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: starty - linePad});
                                    thirdPoints.push({x: endx - linePad, y: starty - linePad});
                                    thirdPoints.push({x: endx - linePad, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第四象限
                                else {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: starty - linePad - 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 + 5, y: starty - linePad - 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 + 5, y: endy - 5});
                                    firstPoints.push({x: endx, y: endy - 5});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: starty - linePad + 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 - 5, y: starty - linePad + 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 - 5, y: endy + 5});
                                    secondPoints.push({x: endx, y: endy + 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: starty - linePad});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: starty - linePad});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                            }
                            if (this.type == lineState.clash || this.type == lineState.suspend) {
                                //第一象限
                                if (endy < starty && endx > startx) {
                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第二象限
                                else if (endy < starty && endx <= startx) {
                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx - linePad, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx - linePad, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {
                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: starty - linePad});
                                    firstPoints.push({x: endx - linePad, y: starty - linePad});
                                    firstPoints.push({x: endx - linePad, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第四象限
                                else {
                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: starty - linePad});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: starty - linePad});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                            }
                        }
                            break;
                        case "bottom": {
                            if (this.type == lineState.together || this.type == lineState.nervous || this.type == lineState.intently) {
                                //直线
                                if (endx == startx && endy < starty) {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: endy});
                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: endy});
                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: endy});
                                }
                                //一象限
                                else if (endy < starty && endx > startx) {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: starty / 2 + endy / 2 - 5});
                                    firstPoints.push({x: endx - 5, y: starty / 2 + endy / 2 - 5});
                                    firstPoints.push({x: endx - 5, y: endy});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: starty / 2 + endy / 2 + 5});
                                    secondPoints.push({x: endx + 5, y: starty / 2 + endy / 2 + 5});
                                    secondPoints.push({x: endx + 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //二象限
                                else if (endy < starty && endx <= startx) {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: starty / 2 + endy / 2 + 5});
                                    firstPoints.push({x: endx - 5, y: starty / 2 + endy / 2 + 5});
                                    firstPoints.push({x: endx - 5, y: endy});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: starty / 2 + endy / 2 - 5});
                                    secondPoints.push({x: endx + 5, y: starty / 2 + endy / 2 - 5});
                                    secondPoints.push({x: endx + 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: starty - linePad + 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 + 5, y: starty - linePad + 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 + 5, y: endy + linePad + 5});
                                    firstPoints.push({x: endx - 5, y: endy + linePad + 5});
                                    firstPoints.push({x: endx - 5, y: endy});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: starty - linePad - 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 - 5, y: starty - linePad - 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 - 5, y: endy + linePad - 5});
                                    secondPoints.push({x: endx + 5, y: endy + linePad - 5});
                                    secondPoints.push({x: endx + 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: starty - linePad});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: starty - linePad});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: endy + linePad});
                                    thirdPoints.push({x: endx, y: endy + linePad});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //四象限
                                else {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: starty - linePad - 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 + 5, y: starty - linePad - 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 + 5, y: endy + linePad - 5});
                                    firstPoints.push({x: endx - 5, y: endy + linePad - 5});
                                    firstPoints.push({x: endx - 5, y: endy});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: starty - linePad + 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 - 5, y: starty - linePad + 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 - 5, y: endy + linePad + 5});
                                    secondPoints.push({x: endx + 5, y: endy + linePad + 5});
                                    secondPoints.push({x: endx + 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: starty - linePad});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: starty - linePad});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: endy + linePad});
                                    thirdPoints.push({x: endx, y: endy + linePad});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                            }
                            if (this.type == lineState.clash || this.type == lineState.suspend) {
                                //直线
                                if (endx == startx && endy < starty) {
                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: endy});
                                }
                                //一象限
                                else if (endy < starty && endx > startx) {
                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //二象限
                                else if (endy < starty && endx <= startx) {
                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: starty - linePad});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: starty - linePad});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: endy + linePad});
                                    firstPoints.push({x: endx, y: endy + linePad});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //四象限
                                else {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: starty - linePad});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: starty - linePad});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: endy + linePad});
                                    firstPoints.push({x: endx, y: endy + linePad});
                                    firstPoints.push({x: endx, y: endy});
                                }
                            }
                        }
                            break;
                        case "right": {
                            if (this.type == lineState.together || this.type == lineState.nervous || this.type == lineState.intently) {
                                //第一象限
                                if (endy < starty && endx > startx) {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: starty / 2 + endy / 2 - 5});
                                    firstPoints.push({x: endx + linePad - 5, y: starty / 2 + endy / 2 - 5});
                                    firstPoints.push({x: endx + linePad - 5, y: endy + 5});
                                    firstPoints.push({x: endx, y: endy + 5});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: starty / 2 + endy / 2 + 5});
                                    secondPoints.push({x: endx + linePad + 5, y: starty / 2 + endy / 2 + 5});
                                    secondPoints.push({x: endx + linePad + 5, y: endy - 5});
                                    secondPoints.push({x: endx, y: endy - 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx + linePad, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx + linePad, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第二象限
                                else if (endy < starty && endx <= startx) {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: endy + 5});
                                    firstPoints.push({x: endx, y: endy + 5});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: endy - 5});
                                    secondPoints.push({x: endx, y: endy - 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: starty - linePad + 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 + 5, y: starty - linePad + 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 + 5, y: endy + 5});
                                    firstPoints.push({x: endx, y: endy + 5});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: starty - linePad - 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 - 5, y: starty - linePad - 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 - 5, y: endy - 5});
                                    secondPoints.push({x: endx, y: endy - 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: starty - linePad});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: starty - linePad});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第四象限
                                else {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: starty - linePad - 5});
                                    firstPoints.push({x: endx + linePad + 5, y: starty - linePad - 5});
                                    firstPoints.push({x: endx + linePad + 5, y: endy + 5});
                                    firstPoints.push({x: endx, y: endy + 5});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: starty - linePad + 5});
                                    secondPoints.push({x: endx + linePad - 5, y: starty - linePad + 5});
                                    secondPoints.push({x: endx + linePad - 5, y: endy - 5});
                                    secondPoints.push({x: endx, y: endy - 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: starty - linePad});
                                    thirdPoints.push({x: endx + linePad, y: starty - linePad});
                                    thirdPoints.push({x: endx + linePad, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                            }
                            if (this.type == lineState.clash || this.type == lineState.suspend) {
                                //第一象限
                                if (endy < starty && endx > startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx + linePad, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx + linePad, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第二象限
                                else if (endy < starty && endx <= startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: starty - linePad});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: starty - linePad});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第四象限
                                else {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: starty - linePad});
                                    firstPoints.push({x: endx + linePad, y: starty - linePad});
                                    firstPoints.push({x: endx + linePad, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                            }
                        }
                            break;
                        case "top": {
                            if (this.type == lineState.together || this.type == lineState.nervous || this.type == lineState.intently) {
                                //第一象限
                                if (endy < starty && endx > startx) {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: endy - linePad - 5});
                                    firstPoints.push({x: endx + 5, y: endy - linePad - 5});
                                    firstPoints.push({x: endx + 5, y: endy});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: endy - linePad + 5});
                                    secondPoints.push({x: endx - 5, y: endy - linePad + 5});
                                    secondPoints.push({x: endx - 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: endy - linePad});
                                    thirdPoints.push({x: endx, y: endy - linePad});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第二象限
                                else if (endy < starty && endx <= startx) {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: endy - linePad + 5});
                                    firstPoints.push({x: endx + 5, y: endy - linePad + 5});
                                    firstPoints.push({x: endx + 5, y: endy});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: endy - linePad - 5});
                                    secondPoints.push({x: endx - 5, y: endy - linePad - 5});
                                    secondPoints.push({x: endx - 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: endy - linePad});
                                    thirdPoints.push({x: endx, y: endy - linePad});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: starty - linePad + 5});
                                    firstPoints.push({x: endx + 5, y: starty - linePad + 5});
                                    firstPoints.push({x: endx + 5, y: endy});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: starty - linePad - 5});
                                    secondPoints.push({x: endx - 5, y: starty - linePad - 5});
                                    secondPoints.push({x: endx - 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: starty - linePad});
                                    thirdPoints.push({x: endx, y: starty - linePad});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第四象限
                                else {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: starty - linePad - 5});
                                    firstPoints.push({x: endx + 5, y: starty - linePad - 5});
                                    firstPoints.push({x: endx + 5, y: endy});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: starty - linePad + 5});
                                    secondPoints.push({x: endx - 5, y: starty - linePad + 5});
                                    secondPoints.push({x: endx - 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: starty - linePad});
                                    thirdPoints.push({x: endx, y: starty - linePad});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                            }
                            if (this.type == lineState.clash || this.type == lineState.suspend) {
                                //第一象限
                                if (endy < starty && endx > startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: endy - linePad});
                                    firstPoints.push({x: endx, y: endy - linePad});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第二象限
                                else if (endy < starty && endx <= startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: endy - linePad});
                                    firstPoints.push({x: endx, y: endy - linePad});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: starty - linePad});
                                    firstPoints.push({x: endx, y: starty - linePad});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第四象限
                                else {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: starty - linePad});
                                    firstPoints.push({x: endx, y: starty - linePad});
                                    firstPoints.push({x: endx, y: endy});
                                }
                            }
                        }
                            break;
                    }
                }
                    break;
                case "bottom": {
                    switch (this.endType) {
                        case "left": {
                            if (this.type == lineState.together || this.type == lineState.nervous || this.type == lineState.intently) {
                                //第一象限
                                if (endy < starty && endx > startx) {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: starty + linePad + 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 + 5, y: starty + linePad + 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 + 5, y: endy + 5});
                                    firstPoints.push({x: endx, y: endy + 5});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: starty + linePad - 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 - 5, y: starty + linePad - 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 - 5, y: endy - 5});
                                    secondPoints.push({x: endx, y: endy - 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: starty + linePad});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: starty + linePad});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第二象限
                                else if (endy < starty && endx <= startx) {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: starty + linePad - 5});
                                    firstPoints.push({x: endx - linePad + 5, y: starty + linePad - 5});
                                    firstPoints.push({x: endx - linePad + 5, y: endy + 5});
                                    firstPoints.push({x: endx, y: endy + 5});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: starty + linePad + 5});
                                    secondPoints.push({x: endx - linePad - 5, y: starty + linePad + 5});
                                    secondPoints.push({x: endx - linePad - 5, y: endy - 5});
                                    secondPoints.push({x: endx, y: endy - 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: starty + linePad});
                                    thirdPoints.push({x: endx - linePad, y: starty + linePad});
                                    thirdPoints.push({x: endx - linePad, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: starty / 2 + endy / 2 - 5});
                                    firstPoints.push({x: endx - linePad - 5, y: starty / 2 + endy / 2 - 5});
                                    firstPoints.push({x: endx - linePad - 5, y: endy + 5});
                                    firstPoints.push({x: endx, y: endy + 5});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: starty / 2 + endy / 2 + 5});
                                    secondPoints.push({x: endx - linePad + 5, y: starty / 2 + endy / 2 + 5});
                                    secondPoints.push({x: endx - linePad + 5, y: endy - 5});
                                    secondPoints.push({x: endx, y: endy - 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx - linePad, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx - linePad, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第四象限
                                else {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: endy + 5});
                                    firstPoints.push({x: endx, y: endy + 5});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: endy - 5});
                                    secondPoints.push({x: endx, y: endy - 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                            }
                            if (this.type == lineState.clash || this.type == lineState.suspend) {
                                //第一象限
                                if (endy < starty && endx > startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: starty + linePad});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: starty + linePad});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第二象限
                                else if (endy < starty && endx <= startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: starty + linePad});
                                    firstPoints.push({x: endx - linePad, y: starty + linePad});
                                    firstPoints.push({x: endx - linePad, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx - linePad, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx - linePad, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第四象限
                                else {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                            }
                        }
                            break;
                        case "bottom": {
                            if (this.type == lineState.together || this.type == lineState.nervous || this.type == lineState.intently) {
                                //一象限
                                if (endy < starty && endx > startx) {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: starty + linePad + 5});
                                    firstPoints.push({x: endx + 5, y: starty + linePad + 5});
                                    firstPoints.push({x: endx + 5, y: endy});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: starty + linePad - 5});
                                    secondPoints.push({x: endx - 5, y: starty + linePad - 5});
                                    secondPoints.push({x: endx - 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: starty + linePad});
                                    thirdPoints.push({x: endx, y: starty + linePad});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //二象限
                                else if (endy < starty && endx <= startx) {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: starty + linePad - 5});
                                    firstPoints.push({x: endx + 5, y: starty + linePad - 5});
                                    firstPoints.push({x: endx + 5, y: endy});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: starty + linePad + 5});
                                    secondPoints.push({x: endx - 5, y: starty + linePad + 5});
                                    secondPoints.push({x: endx - 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: starty + linePad});
                                    thirdPoints.push({x: endx, y: starty + linePad});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: endy + linePad - 5});
                                    firstPoints.push({x: endx + 5, y: endy + linePad - 5});
                                    firstPoints.push({x: endx + 5, y: endy});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: endy + linePad + 5});
                                    secondPoints.push({x: endx - 5, y: endy + linePad + 5});
                                    secondPoints.push({x: endx - 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: endy + linePad});
                                    thirdPoints.push({x: endx, y: endy + linePad});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //四象限
                                else {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: endy + linePad + 5});
                                    firstPoints.push({x: endx + 5, y: endy + linePad + 5});
                                    firstPoints.push({x: endx + 5, y: endy});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: endy + linePad - 5});
                                    secondPoints.push({x: endx - 5, y: endy + linePad - 5});
                                    secondPoints.push({x: endx - 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: endy + linePad});
                                    thirdPoints.push({x: endx, y: endy + linePad});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                            }
                            if (this.type == lineState.clash || this.type == lineState.suspend) {
                                //一象限
                                if (endy < starty && endx > startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: starty + linePad});
                                    firstPoints.push({x: endx, y: starty + linePad});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //二象限
                                else if (endy < starty && endx <= startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: starty + linePad});
                                    firstPoints.push({x: endx, y: starty + linePad});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: endy + linePad});
                                    firstPoints.push({x: endx, y: endy + linePad});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //四象限
                                else {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: endy + linePad});
                                    firstPoints.push({x: endx, y: endy + linePad});
                                    firstPoints.push({x: endx, y: endy});
                                }
                            }
                        }
                            break;
                        case "right": {
                            if (this.type == lineState.together || this.type == lineState.nervous || this.type == lineState.intently) {
                                //第一象限
                                if (endy < starty && endx > startx) {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: starty + linePad + 5});
                                    firstPoints.push({x: endx + linePad + 5, y: starty + linePad + 5});
                                    firstPoints.push({x: endx + linePad + 5, y: endy - 5});
                                    firstPoints.push({x: endx, y: endy - 5});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: starty + linePad - 5});
                                    secondPoints.push({x: endx + linePad - 5, y: starty + linePad - 5});
                                    secondPoints.push({x: endx + linePad - 5, y: endy + 5});
                                    secondPoints.push({x: endx, y: endy + 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: starty + linePad});
                                    thirdPoints.push({x: endx + linePad, y: starty + linePad});
                                    thirdPoints.push({x: endx + linePad, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第二象限
                                else if (endy < starty && endx <= startx) {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: starty + linePad - 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 + 5, y: starty + linePad - 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 + 5, y: endy - 5});
                                    firstPoints.push({x: endx, y: endy - 5});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: starty + linePad + 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 - 5, y: starty + linePad + 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 - 5, y: endy + 5});
                                    secondPoints.push({x: endx, y: endy + 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: starty + linePad});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: starty + linePad});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: endy - 5});
                                    firstPoints.push({x: endx, y: endy - 5});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: endy + 5});
                                    secondPoints.push({x: endx, y: endy + 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第四象限
                                else {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: starty / 2 + endy / 2 + 5});
                                    firstPoints.push({x: endx + linePad - 5, y: starty / 2 + endy / 2 + 5});
                                    firstPoints.push({x: endx + linePad - 5, y: endy - 5});
                                    firstPoints.push({x: endx, y: endy - 5});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: starty / 2 + endy / 2 - 5});
                                    secondPoints.push({x: endx + linePad + 5, y: starty / 2 + endy / 2 - 5});
                                    secondPoints.push({x: endx + linePad + 5, y: endy + 5});
                                    secondPoints.push({x: endx, y: endy + 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx + linePad, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx + linePad, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                            }
                            if (this.type == lineState.clash || this.type == lineState.suspend) {
                                //第一象限
                                if (endy < starty && endx > startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: starty + linePad});
                                    firstPoints.push({x: endx + linePad, y: starty + linePad});
                                    firstPoints.push({x: endx + linePad, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第二象限
                                else if (endy < starty && endx <= startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: starty + linePad});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: starty + linePad});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第四象限
                                else {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx + linePad, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx + linePad, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                            }
                        }
                            break;
                        case "top": {
                            if (this.type == lineState.together || this.type == lineState.nervous || this.type == lineState.intently) {
                                //直线
                                if (endx == startx && endy > starty) {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: endy});
                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: endy});
                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: endy});
                                }
                                //一象限
                                else if (endy < starty && endx > startx) {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: starty + linePad + 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 + 5, y: starty + linePad + 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 + 5, y: endy - linePad + 5});
                                    firstPoints.push({x: endx - 5, y: endy - linePad + 5});
                                    firstPoints.push({x: endx - 5, y: endy});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: starty + linePad - 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 - 5, y: starty + linePad - 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 - 5, y: endy - linePad - 5});
                                    secondPoints.push({x: endx + 5, y: endy - linePad - 5});
                                    secondPoints.push({x: endx + 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: starty + linePad});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: starty + linePad});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: endy - linePad});
                                    thirdPoints.push({x: endx, y: endy - linePad});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //二象限
                                else if (endy < starty && endx <= startx) {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: starty + linePad - 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 + 5, y: starty + linePad - 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 + 5, y: endy - linePad - 5});
                                    firstPoints.push({x: endx - 5, y: endy - linePad - 5});
                                    firstPoints.push({x: endx - 5, y: endy});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: starty + linePad + 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 - 5, y: starty + linePad + 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 - 5, y: endy - linePad + 5});
                                    secondPoints.push({x: endx + 5, y: endy - linePad + 5});
                                    secondPoints.push({x: endx + 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: starty + linePad});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: starty + linePad});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: endy - linePad});
                                    thirdPoints.push({x: endx, y: endy - linePad});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: starty / 2 + endy / 2 - 5});
                                    firstPoints.push({x: endx - 5, y: starty / 2 + endy / 2 - 5});
                                    firstPoints.push({x: endx - 5, y: endy});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: starty / 2 + endy / 2 + 5});
                                    secondPoints.push({x: endx + 5, y: starty / 2 + endy / 2 + 5});
                                    secondPoints.push({x: endx + 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //四象限
                                else {
                                    firstPoints.push({x: startx - 5, y: starty});
                                    firstPoints.push({x: startx - 5, y: starty / 2 + endy / 2 + 5});
                                    firstPoints.push({x: endx - 5, y: starty / 2 + endy / 2 + 5});
                                    firstPoints.push({x: endx - 5, y: endy});

                                    secondPoints.push({x: startx + 5, y: starty});
                                    secondPoints.push({x: startx + 5, y: starty / 2 + endy / 2 - 5});
                                    secondPoints.push({x: endx + 5, y: starty / 2 + endy / 2 - 5});
                                    secondPoints.push({x: endx + 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                            }
                            if (this.type == lineState.clash || this.type == lineState.suspend) {
                                //直线
                                if (endx == startx && endy > starty) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: endy});
                                }
                                //一象限
                                else if (endy < starty && endx > startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: starty + linePad});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: starty + linePad});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: endy - linePad});
                                    firstPoints.push({x: endx, y: endy - linePad});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //二象限
                                else if (endy < starty && endx <= startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: starty + linePad});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: starty + linePad});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: endy - linePad});
                                    firstPoints.push({x: endx, y: endy - linePad});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //四象限
                                else {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx, y: endy});
                                }
                            }
                        }
                            break;
                    }
                }
                    break;
                case "left": {
                    switch (this.endType) {
                        case "left": {
                            if (this.type == lineState.together || this.type == lineState.nervous || this.type == lineState.intently) {
                                //同水平线上
                                if (starty == endy) {
                                    if (startx < endx) {
                                        firstPoints.push({x: startx, y: starty - 5});
                                        firstPoints.push({x: startx - linePad + 5, y: starty - 5});
                                        firstPoints.push({x: startx - linePad + 5, y: endy - height + 5});
                                        firstPoints.push({x: startx / 2 + endx / 2 - 5, y: endy - height + 5});
                                        firstPoints.push({x: startx / 2 + endx / 2 - 5, y: endy + 5});
                                        firstPoints.push({x: endx, y: endy + 5});

                                        secondPoints.push({x: startx, y: starty + 5});
                                        secondPoints.push({x: startx - linePad - 5, y: starty + 5});
                                        secondPoints.push({x: startx - linePad - 5, y: endy - height - 5});
                                        secondPoints.push({x: startx / 2 + endx / 2 + 5, y: endy - height - 5});
                                        secondPoints.push({x: startx / 2 + endx / 2 + 5, y: endy - 5});
                                        secondPoints.push({x: endx, y: endy - 5});

                                        thirdPoints.push({x: startx, y: starty});
                                        thirdPoints.push({x: startx - linePad, y: starty});
                                        thirdPoints.push({x: startx - linePad, y: endy - height});
                                        thirdPoints.push({x: startx / 2 + endx / 2, y: endy - height});
                                        thirdPoints.push({x: startx / 2 + endx / 2, y: endy});
                                        thirdPoints.push({x: endx, y: endy});
                                    }
                                    else if (startx >= endx) {
                                        firstPoints.push({x: startx, y: starty - 5});
                                        firstPoints.push({x: startx / 2 + endx / 2 + 5, y: starty - 5});
                                        firstPoints.push({x: startx / 2 + endx / 2 + 5, y: endy - height - 5});
                                        firstPoints.push({x: endx - linePad - 5, y: endy - height - 5});
                                        firstPoints.push({x: endx - linePad - 5, y: endy + 5});
                                        firstPoints.push({x: endx, y: endy + 5});

                                        secondPoints.push({x: startx, y: starty + 5});
                                        secondPoints.push({x: startx / 2 + endx / 2 - 5, y: starty + 5});
                                        secondPoints.push({x: startx / 2 + endx / 2 - 5, y: endy - height + 5});
                                        secondPoints.push({x: endx - linePad + 5, y: endy - height + 5});
                                        secondPoints.push({x: endx - linePad + 5, y: endy - 5});
                                        secondPoints.push({x: endx, y: endy - 5});

                                        thirdPoints.push({x: startx, y: starty});
                                        thirdPoints.push({x: startx / 2 + endx / 2, y: starty});
                                        thirdPoints.push({x: startx / 2 + endx / 2, y: endy - height});
                                        thirdPoints.push({x: endx - linePad, y: endy - height});
                                        thirdPoints.push({x: endx - linePad, y: endy});
                                        thirdPoints.push({x: endx, y: endy});
                                    }
                                }
                                //第一象限
                                else if (endy < starty && endx > startx) {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: startx - linePad + 5, y: starty - 5});
                                    firstPoints.push({x: startx - linePad + 5, y: endy + 5});
                                    firstPoints.push({x: endx, y: endy + 5});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: startx - linePad - 5, y: starty + 5});
                                    secondPoints.push({x: startx - linePad - 5, y: endy - 5});
                                    secondPoints.push({x: endx, y: endy - 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx - linePad, y: starty});
                                    thirdPoints.push({x: startx - linePad, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第二象限
                                else if (endy < starty && endx <= startx) {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: endx - linePad + 5, y: starty - 5});
                                    firstPoints.push({x: endx - linePad + 5, y: endy + 5});
                                    firstPoints.push({x: endx, y: endy + 5});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: endx - linePad - 5, y: starty + 5});
                                    secondPoints.push({x: endx - linePad - 5, y: endy - 5});
                                    secondPoints.push({x: endx, y: endy - 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: endx - linePad, y: starty});
                                    thirdPoints.push({x: endx - linePad, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: endx - linePad - 5, y: starty - 5});
                                    firstPoints.push({x: endx - linePad - 5, y: endy + 5});
                                    firstPoints.push({x: endx, y: endy + 5});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: endx - linePad + 5, y: starty + 5});
                                    secondPoints.push({x: endx - linePad + 5, y: endy - 5});
                                    secondPoints.push({x: endx, y: endy - 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: endx - linePad, y: starty});
                                    thirdPoints.push({x: endx - linePad, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第四象限
                                else {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: startx - linePad - 5, y: starty - 5});
                                    firstPoints.push({x: startx - linePad - 5, y: endy + 5});
                                    firstPoints.push({x: endx, y: endy + 5});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: startx - linePad + 5, y: starty + 5});
                                    secondPoints.push({x: startx - linePad + 5, y: endy - 5});
                                    secondPoints.push({x: endx, y: endy - 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx - linePad, y: starty});
                                    thirdPoints.push({x: startx - linePad, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                            }
                            if (this.type == lineState.clash || this.type == lineState.suspend) {
                                //同水平线上
                                if (starty == endy) {
                                    if (startx < endx) {
                                        firstPoints.push({x: startx, y: starty});
                                        firstPoints.push({x: startx - linePad, y: starty});
                                        firstPoints.push({x: startx - linePad, y: endy - height});
                                        firstPoints.push({x: startx / 2 + endx / 2, y: endy - height});
                                        firstPoints.push({x: startx / 2 + endx / 2, y: endy});
                                        firstPoints.push({x: endx, y: endy});
                                    }
                                    else if (startx >= endx) {
                                        firstPoints.push({x: startx, y: starty});
                                        firstPoints.push({x: startx / 2 + endx / 2, y: starty});
                                        firstPoints.push({x: startx / 2 + endx / 2, y: endy - height});
                                        firstPoints.push({x: endx - linePad, y: endy - height});
                                        firstPoints.push({x: endx - linePad, y: endy});
                                        firstPoints.push({x: endx, y: endy});
                                    }
                                }
                                //第一象限
                                else if (endy < starty && endx > startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx - linePad, y: starty});
                                    firstPoints.push({x: startx - linePad, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第二象限
                                else if (endy < starty && endx <= startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: endx - linePad, y: starty});
                                    firstPoints.push({x: endx - linePad, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: endx - linePad, y: starty});
                                    firstPoints.push({x: endx - linePad, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第四象限
                                else {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx - linePad, y: starty});
                                    firstPoints.push({x: startx - linePad, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                            }
                        }
                            break;
                        case "bottom": {
                            if (this.type == lineState.together || this.type == lineState.nervous || this.type == lineState.intently) {
                                //一象限
                                if (endy < starty && endx > startx) {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: startx - linePad + 5, y: starty - 5});
                                    firstPoints.push({x: startx - linePad + 5, y: starty / 2 + endy / 2 + 5});
                                    firstPoints.push({x: endx + 5, y: starty / 2 + endy / 2 + 5});
                                    firstPoints.push({x: endx + 5, y: endy});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: startx - linePad - 5, y: starty + 5});
                                    secondPoints.push({x: startx - linePad - 5, y: starty / 2 + endy / 2 - 5});
                                    secondPoints.push({x: endx - 5, y: starty / 2 + endy / 2 - 5});
                                    secondPoints.push({x: endx - 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx - linePad, y: starty});
                                    thirdPoints.push({x: startx - linePad, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //二象限
                                else if (endy < starty && endx <= startx) {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: endx + 5, y: starty - 5});
                                    firstPoints.push({x: endx + 5, y: endy});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: endx - 5, y: starty + 5});
                                    secondPoints.push({x: endx - 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: endx, y: starty});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 - 5, y: starty - 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 - 5, y: endy + linePad - 5});
                                    firstPoints.push({x: endx + 5, y: endy + linePad - 5});
                                    firstPoints.push({x: endx + 5, y: endy});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 + 5, y: starty + 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 + 5, y: endy + linePad + 5});
                                    secondPoints.push({x: endx - 5, y: endy + linePad + 5});
                                    secondPoints.push({x: endx - 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: starty});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: endy + linePad});
                                    thirdPoints.push({x: endx, y: endy + linePad});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //四象限
                                else {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: startx - linePad - 5, y: starty - 5});
                                    firstPoints.push({x: startx - linePad - 5, y: endy + linePad + 5});
                                    firstPoints.push({x: endx + 5, y: endy + linePad + 5});
                                    firstPoints.push({x: endx + 5, y: endy});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: startx - linePad + 5, y: starty + 5});
                                    secondPoints.push({x: startx - linePad + 5, y: endy + linePad - 5});
                                    secondPoints.push({x: endx - 5, y: endy + linePad - 5});
                                    secondPoints.push({x: endx - 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx - linePad, y: starty});
                                    thirdPoints.push({x: startx - linePad, y: endy + linePad});
                                    thirdPoints.push({x: endx, y: endy + linePad});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                            }
                            if (this.type == lineState.clash || this.type == lineState.suspend) {
                                //一象限
                                if (endy < starty && endx > startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx - linePad, y: starty});
                                    firstPoints.push({x: startx - linePad, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //二象限
                                else if (endy < starty && endx <= startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: endx, y: starty});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: starty});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: endy + linePad});
                                    firstPoints.push({x: endx, y: endy + linePad});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //四象限
                                else {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx - linePad, y: starty});
                                    firstPoints.push({x: startx - linePad, y: endy + linePad});
                                    firstPoints.push({x: endx, y: endy + linePad});
                                    firstPoints.push({x: endx, y: endy});
                                }
                            }
                        }
                            break;
                        case "right": {
                            if (this.type == lineState.together || this.type == lineState.nervous || this.type == lineState.intently) {
                                //同水平线上
                                if (starty == endy) {
                                    if (startx < endx) {
                                        firstPoints.push({x: startx, y: starty - 5});
                                        firstPoints.push({x: startx - linePad + 5, y: starty - 5});
                                        firstPoints.push({x: startx - linePad + 5, y: endy - height + 5});
                                        firstPoints.push({x: endx + linePad - 5, y: endy - height + 5});
                                        firstPoints.push({x: endx + linePad - 5, y: endy - 5});
                                        firstPoints.push({x: endx, y: endy - 5});

                                        secondPoints.push({x: startx, y: starty + 5});
                                        secondPoints.push({x: startx - linePad - 5, y: starty + 5});
                                        secondPoints.push({x: startx - linePad - 5, y: endy - height - 5});
                                        secondPoints.push({x: endx + linePad + 5, y: endy - height - 5});
                                        secondPoints.push({x: endx + linePad + 5, y: endy + 5});
                                        secondPoints.push({x: endx, y: endy + 5});

                                        thirdPoints.push({x: startx, y: starty});
                                        thirdPoints.push({x: startx - linePad, y: starty});
                                        thirdPoints.push({x: startx - linePad, y: endy - height});
                                        thirdPoints.push({x: endx + linePad, y: endy - height});
                                        thirdPoints.push({x: endx + linePad, y: endy});
                                        thirdPoints.push({x: endx, y: endy});
                                    }
                                    else if (startx >= endx) {
                                        firstPoints.push({x: startx, y: starty - 5});
                                        firstPoints.push({x: endx, y: endy - 5});

                                        secondPoints.push({x: startx, y: starty + 5});
                                        secondPoints.push({x: endx, y: endy + 5});

                                        thirdPoints.push({x: startx, y: starty});
                                        thirdPoints.push({x: endx, y: endy});
                                    }
                                }
                                //第一象限
                                else if (endy < starty && endx > startx) {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: startx - linePad + 5, y: starty - 5});
                                    firstPoints.push({x: startx - linePad + 5, y: starty / 2 + endy / 2 + 5});
                                    firstPoints.push({x: endx + linePad + 5, y: starty / 2 + endy / 2 + 5});
                                    firstPoints.push({x: endx + linePad + 5, y: endy - 5});
                                    firstPoints.push({x: endx, y: endy - 5});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: startx - linePad - 5, y: starty + 5});
                                    secondPoints.push({x: startx - linePad - 5, y: starty / 2 + endy / 2 - 5});
                                    secondPoints.push({x: endx + linePad - 5, y: starty / 2 + endy / 2 - 5});
                                    secondPoints.push({x: endx + linePad - 5, y: endy + 5});
                                    secondPoints.push({x: endx, y: endy + 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx - linePad, y: starty});
                                    thirdPoints.push({x: startx - linePad, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx + linePad, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx + linePad, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第二象限
                                else if (endy < starty && endx <= startx) {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 + 5, y: starty - 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 + 5, y: endy - 5});
                                    firstPoints.push({x: endx, y: endy - 5});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 - 5, y: starty + 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 - 5, y: endy + 5});
                                    secondPoints.push({x: endx, y: endy + 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: starty});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 - 5, y: starty - 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 - 5, y: endy - 5});
                                    firstPoints.push({x: endx, y: endy - 5});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 + 5, y: starty + 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 + 5, y: endy + 5});
                                    secondPoints.push({x: endx, y: endy + 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: starty});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第四象限
                                else {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: startx - linePad - 5, y: starty - 5});
                                    firstPoints.push({x: startx - linePad - 5, y: starty / 2 + endy / 2 + 5});
                                    firstPoints.push({x: endx + linePad - 5, y: starty / 2 + endy / 2 + 5});
                                    firstPoints.push({x: endx + linePad - 5, y: endy - 5});
                                    firstPoints.push({x: endx, y: endy - 5});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: startx - linePad + 5, y: starty + 5});
                                    secondPoints.push({x: startx - linePad + 5, y: starty / 2 + endy / 2 - 5});
                                    secondPoints.push({x: endx + linePad + 5, y: starty / 2 + endy / 2 - 5});
                                    secondPoints.push({x: endx + linePad + 5, y: endy + 5});
                                    secondPoints.push({x: endx, y: endy + 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx - linePad, y: starty});
                                    thirdPoints.push({x: startx - linePad, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx + linePad, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx + linePad, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                            }
                            if (this.type == lineState.clash || this.type == lineState.suspend) {
                                //同水平线上
                                if (starty == endy) {
                                    if (startx < endx) {

                                        firstPoints.push({x: startx, y: starty});
                                        firstPoints.push({x: startx - linePad, y: starty});
                                        firstPoints.push({x: startx - linePad, y: endy - height});
                                        firstPoints.push({x: endx + linePad, y: endy - height});
                                        firstPoints.push({x: endx + linePad, y: endy});
                                        firstPoints.push({x: endx, y: endy});
                                    }
                                    else if (startx >= endx) {

                                        firstPoints.push({x: startx, y: starty});
                                        firstPoints.push({x: endx, y: endy});
                                    }
                                }
                                //第一象限
                                else if (endy < starty && endx > startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx - linePad, y: starty});
                                    firstPoints.push({x: startx - linePad, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx + linePad, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx + linePad, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第二象限
                                else if (endy < starty && endx <= startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: starty});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: starty});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第四象限
                                else {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx - linePad, y: starty});
                                    firstPoints.push({x: startx - linePad, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx + linePad, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx + linePad, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                            }
                        }
                            break;
                        case "top": {
                            if (this.type == lineState.together || this.type == lineState.nervous || this.type == lineState.intently) {
                                //一象限
                                if (endy < starty && endx > startx) {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: startx - linePad + 5, y: starty - 5});
                                    firstPoints.push({x: startx - linePad + 5, y: endy - linePad + 5});
                                    firstPoints.push({x: endx - 5, y: endy - linePad + 5});
                                    firstPoints.push({x: endx - 5, y: endy});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: startx - linePad - 5, y: starty + 5});
                                    secondPoints.push({x: startx - linePad - 5, y: endy - linePad - 5});
                                    secondPoints.push({x: endx + 5, y: endy - linePad - 5});
                                    secondPoints.push({x: endx + 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx - linePad, y: starty});
                                    thirdPoints.push({x: startx - linePad, y: endy - linePad});
                                    thirdPoints.push({x: endx, y: endy - linePad});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //二象限
                                else if (endy < starty && endx <= startx) {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 + 5, y: starty - 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 + 5, y: endy - linePad - 5});
                                    firstPoints.push({x: endx - 5, y: endy - linePad - 5});
                                    firstPoints.push({x: endx - 5, y: endy});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 - 5, y: starty + 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 - 5, y: endy - linePad + 5});
                                    secondPoints.push({x: endx + 5, y: endy - linePad + 5});
                                    secondPoints.push({x: endx + 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: starty});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: endy - linePad});
                                    thirdPoints.push({x: endx, y: endy - linePad});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: endx - 5, y: starty - 5});
                                    firstPoints.push({x: endx - 5, y: endy});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: endx + 5, y: starty + 5});
                                    secondPoints.push({x: endx + 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: endx, y: starty});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //四象限
                                else {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: startx - linePad - 5, y: starty - 5});
                                    firstPoints.push({x: startx - linePad - 5, y: starty / 2 + endy / 2 + 5});
                                    firstPoints.push({x: endx - 5, y: starty / 2 + endy / 2 + 5});
                                    firstPoints.push({x: endx - 5, y: endy});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: startx - linePad + 5, y: starty + 5});
                                    secondPoints.push({x: startx - linePad + 5, y: starty / 2 + endy / 2 - 5});
                                    secondPoints.push({x: endx + 5, y: starty / 2 + endy / 2 - 5});
                                    secondPoints.push({x: endx + 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx - linePad, y: starty});
                                    thirdPoints.push({x: startx - linePad, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                            }
                            if (this.type == lineState.clash || this.type == lineState.suspend) {
                                //一象限
                                if (endy < starty && endx > startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx - linePad, y: starty});
                                    firstPoints.push({x: startx - linePad, y: endy - linePad});
                                    firstPoints.push({x: endx, y: endy - linePad});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //二象限
                                else if (endy < starty && endx <= startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: starty});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: endy - linePad});
                                    firstPoints.push({x: endx, y: endy - linePad});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: endx, y: starty});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //四象限
                                else {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx - linePad, y: starty});
                                    firstPoints.push({x: startx - linePad, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx, y: endy});
                                }
                            }
                        }
                            break;
                    }
                }
                    break;
                case "right": {
                    switch (this.endType) {
                        case "left": {
                            if (this.type == lineState.together || this.type == lineState.nervous || this.type == lineState.intently) {
                                //同水平线上
                                if (starty == endy) {
                                    if (startx < endx) {
                                        firstPoints.push({x: startx, y: starty - 5});
                                        firstPoints.push({x: endx, y: endy - 5});

                                        secondPoints.push({x: startx, y: starty + 5});
                                        secondPoints.push({x: endx, y: endy + 5});

                                        thirdPoints.push({x: startx, y: starty});
                                        thirdPoints.push({x: endx, y: endy});
                                    }
                                    else if (startx >= endx) {
                                        firstPoints.push({x: startx, y: starty - 5});
                                        firstPoints.push({x: startx + linePad - 5, y: starty - 5});
                                        firstPoints.push({x: startx + linePad - 5, y: endy - height + 5});
                                        firstPoints.push({x: endx - linePad + 5, y: endy - height + 5});
                                        firstPoints.push({x: endx - linePad + 5, y: endy - 5});
                                        firstPoints.push({x: endx, y: endy - 5});

                                        secondPoints.push({x: startx, y: starty + 5});
                                        secondPoints.push({x: startx + linePad + 5, y: starty + 5});
                                        secondPoints.push({x: startx + linePad + 5, y: endy - height - 5});
                                        secondPoints.push({x: endx - linePad - 5, y: endy - height - 5});
                                        secondPoints.push({x: endx - linePad - 5, y: endy + 5});
                                        secondPoints.push({x: endx, y: endy + 5});

                                        thirdPoints.push({x: startx, y: starty});
                                        thirdPoints.push({x: startx + linePad, y: starty});
                                        thirdPoints.push({x: startx + linePad, y: endy - height});
                                        thirdPoints.push({x: endx - linePad, y: endy - height});
                                        thirdPoints.push({x: endx - linePad, y: endy});
                                        thirdPoints.push({x: endx, y: endy});
                                    }
                                }
                                //第一象限
                                else if (endy < starty && endx > startx) {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 - 5, y: starty - 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 - 5, y: endy - 5});
                                    firstPoints.push({x: endx, y: endy - 5});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 + 5, y: starty + 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 + 5, y: endy + 5});
                                    secondPoints.push({x: endx, y: endy + 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: starty});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第二象限
                                else if (endy < starty && endx <= startx) {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: startx + linePad - 5, y: starty - 5});
                                    firstPoints.push({x: startx + linePad - 5, y: starty / 2 + endy / 2 + 5});
                                    firstPoints.push({x: endx - linePad - 5, y: starty / 2 + endy / 2 + 5});
                                    firstPoints.push({x: endx - linePad - 5, y: endy - 5});
                                    firstPoints.push({x: endx, y: endy - 5});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: startx + linePad + 5, y: starty + 5});
                                    secondPoints.push({x: startx + linePad + 5, y: starty / 2 + endy / 2 - 5});
                                    secondPoints.push({x: endx - linePad + 5, y: starty / 2 + endy / 2 - 5});
                                    secondPoints.push({x: endx - linePad + 5, y: endy + 5});
                                    secondPoints.push({x: endx, y: endy + 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx + linePad, y: starty});
                                    thirdPoints.push({x: startx + linePad, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx - linePad, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx - linePad, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: startx + linePad + 5, y: starty - 5});
                                    firstPoints.push({x: startx + linePad + 5, y: starty / 2 + endy / 2 + 5});
                                    firstPoints.push({x: endx - linePad + 5, y: starty / 2 + endy / 2 + 5});
                                    firstPoints.push({x: endx - linePad + 5, y: endy - 5});
                                    firstPoints.push({x: endx, y: endy - 5});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: startx + linePad - 5, y: starty + 5});
                                    secondPoints.push({x: startx + linePad - 5, y: starty / 2 + endy / 2 - 5});
                                    secondPoints.push({x: endx - linePad - 5, y: starty / 2 + endy / 2 - 5});
                                    secondPoints.push({x: endx - linePad - 5, y: endy + 5});
                                    secondPoints.push({x: endx, y: endy + 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx + linePad, y: starty});
                                    thirdPoints.push({x: startx + linePad, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx - linePad, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx - linePad, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第四象限
                                else {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 + 5, y: starty - 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 + 5, y: endy - 5});
                                    firstPoints.push({x: endx, y: endy - 5});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 - 5, y: starty + 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 - 5, y: endy + 5});
                                    secondPoints.push({x: endx, y: endy + 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: starty});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                            }
                            if (this.type == lineState.clash || this.type == lineState.suspend) {
                                //同水平线上
                                if (starty == endy) {
                                    if (startx < endx) {

                                        firstPoints.push({x: startx, y: starty});
                                        firstPoints.push({x: endx, y: endy});
                                    }
                                    else if (startx >= endx) {

                                        firstPoints.push({x: startx, y: starty});
                                        firstPoints.push({x: startx + linePad, y: starty});
                                        firstPoints.push({x: startx + linePad, y: endy - height});
                                        firstPoints.push({x: endx - linePad, y: endy - height});
                                        firstPoints.push({x: endx - linePad, y: endy});
                                        firstPoints.push({x: endx, y: endy});
                                    }
                                }
                                //第一象限
                                else if (endy < starty && endx > startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: starty});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第二象限
                                else if (endy < starty && endx <= startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx + linePad, y: starty});
                                    firstPoints.push({x: startx + linePad, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx - linePad, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx - linePad, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx + linePad, y: starty});
                                    firstPoints.push({x: startx + linePad, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx - linePad, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx - linePad, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第四象限
                                else {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: starty});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                            }
                        }
                            break;
                        case "bottom": {
                            if (this.type == lineState.together || this.type == lineState.nervous || this.type == lineState.intently) {
                                //一象限
                                if (endy < starty && endx > startx) {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: endx - 5, y: starty - 5});
                                    firstPoints.push({x: endx - 5, y: endy});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: endx + 5, y: starty + 5});
                                    secondPoints.push({x: endx + 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: endx, y: starty});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //二象限
                                else if (endy < starty && endx <= startx) {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: startx + linePad - 5, y: starty - 5});
                                    firstPoints.push({x: startx + linePad - 5, y: starty / 2 + endy / 2 + 5});
                                    firstPoints.push({x: endx - 5, y: starty / 2 + endy / 2 + 5});
                                    firstPoints.push({x: endx - 5, y: endy});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: startx + linePad + 5, y: starty + 5});
                                    secondPoints.push({x: startx + linePad + 5, y: starty / 2 + endy / 2 - 5});
                                    secondPoints.push({x: endx + 5, y: starty / 2 + endy / 2 - 5});
                                    secondPoints.push({x: endx + 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx + linePad, y: starty});
                                    thirdPoints.push({x: startx + linePad, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: startx + linePad + 5, y: starty - 5});
                                    firstPoints.push({x: startx + linePad + 5, y: endy + linePad + 5});
                                    firstPoints.push({x: endx - 5, y: endy + linePad + 5});
                                    firstPoints.push({x: endx - 5, y: endy});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: startx + linePad - 5, y: starty + 5});
                                    secondPoints.push({x: startx + linePad - 5, y: endy + linePad - 5});
                                    secondPoints.push({x: endx + 5, y: endy + linePad - 5});
                                    secondPoints.push({x: endx + 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx + linePad, y: starty});
                                    thirdPoints.push({x: startx + linePad, y: endy + linePad});
                                    thirdPoints.push({x: endx, y: endy + linePad});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //四象限
                                else {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 + 5, y: starty - 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 + 5, y: endy + linePad - 5});
                                    firstPoints.push({x: endx - 5, y: endy + linePad - 5});
                                    firstPoints.push({x: endx - 5, y: endy});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 - 5, y: starty + 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 - 5, y: endy + linePad + 5});
                                    secondPoints.push({x: endx + 5, y: endy + linePad + 5});
                                    secondPoints.push({x: endx + 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: starty});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: endy + linePad});
                                    thirdPoints.push({x: endx, y: endy + linePad});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                            }
                            if (this.type == lineState.clash || this.type == lineState.suspend) {
                                //一象限
                                if (endy < starty && endx > startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: endx, y: starty});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //二象限
                                else if (endy < starty && endx <= startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx + linePad, y: starty});
                                    firstPoints.push({x: startx + linePad, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx + linePad, y: starty});
                                    firstPoints.push({x: startx + linePad, y: endy + linePad});
                                    firstPoints.push({x: endx, y: endy + linePad});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //四象限
                                else {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: starty});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: endy + linePad});
                                    firstPoints.push({x: endx, y: endy + linePad});
                                    firstPoints.push({x: endx, y: endy});
                                }
                            }
                        }
                            break;
                        case "right": {
                            if (this.type == lineState.together || this.type == lineState.nervous || this.type == lineState.intently) {
                                //同水平线上
                                if (starty == endy) {
                                    if (startx < endx) {
                                        firstPoints.push({x: startx, y: starty - 5});
                                        firstPoints.push({x: startx / 2 + endx / 2 - 5, y: starty - 5});
                                        firstPoints.push({x: startx / 2 + endx / 2 - 5, y: endy - height - 5});
                                        firstPoints.push({x: endx + linePad + 5, y: endy - height - 5});
                                        firstPoints.push({x: endx + linePad + 5, y: endy + 5});
                                        firstPoints.push({x: endx, y: endy + 5});

                                        secondPoints.push({x: startx, y: starty + 5});
                                        secondPoints.push({x: startx / 2 + endx / 2 + 5, y: starty + 5});
                                        secondPoints.push({x: startx / 2 + endx / 2 + 5, y: endy - height + 5});
                                        secondPoints.push({x: endx + linePad - 5, y: endy - height + 5});
                                        secondPoints.push({x: endx + linePad - 5, y: endy - 5});
                                        secondPoints.push({x: endx, y: endy - 5});

                                        thirdPoints.push({x: startx, y: starty});
                                        thirdPoints.push({x: startx / 2 + endx / 2, y: starty});
                                        thirdPoints.push({x: startx / 2 + endx / 2, y: endy - height});
                                        thirdPoints.push({x: endx + linePad, y: endy - height});
                                        thirdPoints.push({x: endx + linePad, y: endy});
                                        thirdPoints.push({x: endx, y: endy});
                                    }
                                    else if (startx >= endx) {
                                        firstPoints.push({x: startx, y: starty - 5});
                                        firstPoints.push({x: startx + linePad - 5, y: starty - 5});
                                        firstPoints.push({x: startx + linePad - 5, y: endy - height + 5});
                                        firstPoints.push({x: startx / 2 + endx / 2 + 5, y: endy - height + 5});
                                        firstPoints.push({x: startx / 2 + endx / 2 + 5, y: endy + 5});
                                        firstPoints.push({x: endx, y: endy + 5});

                                        secondPoints.push({x: startx, y: starty + 5});
                                        secondPoints.push({x: startx + linePad + 5, y: starty + 5});
                                        secondPoints.push({x: startx + linePad + 5, y: endy - height - 5});
                                        secondPoints.push({x: startx / 2 + endx / 2 - 5, y: endy - height - 5});
                                        secondPoints.push({x: startx / 2 + endx / 2 - 5, y: endy - 5});
                                        secondPoints.push({x: endx, y: endy - 5});

                                        thirdPoints.push({x: startx, y: starty});
                                        thirdPoints.push({x: startx + linePad, y: starty});
                                        thirdPoints.push({x: startx + linePad, y: endy - height});
                                        thirdPoints.push({x: startx / 2 + endx / 2, y: endy - height});
                                        thirdPoints.push({x: startx / 2 + endx / 2, y: endy});
                                        thirdPoints.push({x: endx, y: endy});
                                    }
                                }
                                //第一象限
                                else if (endy < starty && endx > startx) {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: endx + linePad - 5, y: starty - 5});
                                    firstPoints.push({x: endx + linePad - 5, y: endy + 5});
                                    firstPoints.push({x: endx, y: endy + 5});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: endx + linePad + 5, y: starty + 5});
                                    secondPoints.push({x: endx + linePad + 5, y: endy - 5});
                                    secondPoints.push({x: endx, y: endy - 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: endx + linePad, y: starty});
                                    thirdPoints.push({x: endx + linePad, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第二象限
                                else if (endy < starty && endx <= startx) {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: startx + linePad - 5, y: starty - 5});
                                    firstPoints.push({x: startx + linePad - 5, y: endy + 5});
                                    firstPoints.push({x: endx, y: endy + 5});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: startx + linePad + 5, y: starty + 5});
                                    secondPoints.push({x: startx + linePad + 5, y: endy - 5});
                                    secondPoints.push({x: endx, y: endy - 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx + linePad, y: starty});
                                    thirdPoints.push({x: startx + linePad, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: startx + linePad + 5, y: starty - 5});
                                    firstPoints.push({x: startx + linePad + 5, y: endy + 5});
                                    firstPoints.push({x: endx, y: endy + 5});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: startx + linePad - 5, y: starty + 5});
                                    secondPoints.push({x: startx + linePad - 5, y: endy - 5});
                                    secondPoints.push({x: endx, y: endy - 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx + linePad, y: starty});
                                    thirdPoints.push({x: startx + linePad, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第四象限
                                else {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: endx + linePad + 5, y: starty - 5});
                                    firstPoints.push({x: endx + linePad + 5, y: endy + 5});
                                    firstPoints.push({x: endx, y: endy + 5});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: endx + linePad - 5, y: starty + 5});
                                    secondPoints.push({x: endx + linePad - 5, y: endy - 5});
                                    secondPoints.push({x: endx, y: endy - 5});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: endx + linePad, y: starty});
                                    thirdPoints.push({x: endx + linePad, y: endy});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                            }
                            if (this.type == lineState.clash || this.type == lineState.suspend) {
                                //同水平线上
                                if (starty == endy) {
                                    if (startx < endx) {

                                        firstPoints.push({x: startx, y: starty});
                                        firstPoints.push({x: startx / 2 + endx / 2, y: starty});
                                        firstPoints.push({x: startx / 2 + endx / 2, y: endy - height});
                                        firstPoints.push({x: endx + linePad, y: endy - height});
                                        firstPoints.push({x: endx + linePad, y: endy});
                                        firstPoints.push({x: endx, y: endy});
                                    }
                                    else if (startx >= endx) {

                                        firstPoints.push({x: startx, y: starty});
                                        firstPoints.push({x: startx + linePad, y: starty});
                                        firstPoints.push({x: startx + linePad, y: endy - height});
                                        firstPoints.push({x: startx / 2 + endx / 2, y: endy - height});
                                        firstPoints.push({x: startx / 2 + endx / 2, y: endy});
                                        firstPoints.push({x: endx, y: endy});
                                    }
                                }
                                //第一象限
                                else if (endy < starty && endx > startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: endx + linePad, y: starty});
                                    firstPoints.push({x: endx + linePad, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第二象限
                                else if (endy < starty && endx <= startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx + linePad, y: starty});
                                    firstPoints.push({x: startx + linePad, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx + linePad, y: starty});
                                    firstPoints.push({x: startx + linePad, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第四象限
                                else {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: endx + linePad, y: starty});
                                    firstPoints.push({x: endx + linePad, y: endy});
                                    firstPoints.push({x: endx, y: endy});
                                }
                            }
                        }
                            break;
                        case "top": {
                            if (this.type == lineState.together || this.type == lineState.nervous || this.type == lineState.intently) {
                                //一象限
                                if (endy < starty && endx > startx) {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 - 5, y: starty - 5});
                                    firstPoints.push({x: startx / 2 + endx / 2 - 5, y: endy - linePad - 5});
                                    firstPoints.push({x: endx + 5, y: endy - linePad - 5});
                                    firstPoints.push({x: endx + 5, y: endy});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 + 5, y: starty + 5});
                                    secondPoints.push({x: startx / 2 + endx / 2 + 5, y: endy - linePad + 5});
                                    secondPoints.push({x: endx - 5, y: endy - linePad + 5});
                                    secondPoints.push({x: endx - 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: starty});
                                    thirdPoints.push({x: startx / 2 + endx / 2, y: endy - linePad});
                                    thirdPoints.push({x: endx, y: endy - linePad});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //二象限
                                else if (endy < starty && endx <= startx) {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: startx + linePad - 5, y: starty - 5});
                                    firstPoints.push({x: startx + linePad - 5, y: endy - linePad + 5});
                                    firstPoints.push({x: endx + 5, y: endy - linePad + 5});
                                    firstPoints.push({x: endx + 5, y: endy});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: startx + linePad + 5, y: starty + 5});
                                    secondPoints.push({x: startx + linePad + 5, y: endy - linePad - 5});
                                    secondPoints.push({x: endx - 5, y: endy - linePad - 5});
                                    secondPoints.push({x: endx - 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx + linePad, y: starty});
                                    thirdPoints.push({x: startx + linePad, y: endy - linePad});
                                    thirdPoints.push({x: endx, y: endy - linePad});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: startx + linePad + 5, y: starty - 5});
                                    firstPoints.push({x: startx + linePad + 5, y: starty / 2 + endy / 2 + 5});
                                    firstPoints.push({x: endx + 5, y: starty / 2 + endy / 2 + 5});
                                    firstPoints.push({x: endx + 5, y: endy});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: startx + linePad - 5, y: starty + 5});
                                    secondPoints.push({x: startx + linePad - 5, y: starty / 2 + endy / 2 - 5});
                                    secondPoints.push({x: endx - 5, y: starty / 2 + endy / 2 - 5});
                                    secondPoints.push({x: endx - 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: startx + linePad, y: starty});
                                    thirdPoints.push({x: startx + linePad, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx, y: starty / 2 + endy / 2});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                                //四象限
                                else {
                                    firstPoints.push({x: startx, y: starty - 5});
                                    firstPoints.push({x: endx + 5, y: starty - 5});
                                    firstPoints.push({x: endx + 5, y: endy});

                                    secondPoints.push({x: startx, y: starty + 5});
                                    secondPoints.push({x: endx - 5, y: starty + 5});
                                    secondPoints.push({x: endx - 5, y: endy});

                                    thirdPoints.push({x: startx, y: starty});
                                    thirdPoints.push({x: endx, y: starty});
                                    thirdPoints.push({x: endx, y: endy});
                                }
                            }
                            if (this.type == lineState.clash || this.type == lineState.suspend) {
                                //一象限
                                if (endy < starty && endx > startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: starty});
                                    firstPoints.push({x: startx / 2 + endx / 2, y: endy - linePad});
                                    firstPoints.push({x: endx, y: endy - linePad});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //二象限
                                else if (endy < starty && endx <= startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx + linePad, y: starty});
                                    firstPoints.push({x: startx + linePad, y: endy - linePad});
                                    firstPoints.push({x: endx, y: endy - linePad});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //第三象限
                                else if (endy >= starty && endx <= startx) {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: startx + linePad, y: starty});
                                    firstPoints.push({x: startx + linePad, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx, y: starty / 2 + endy / 2});
                                    firstPoints.push({x: endx, y: endy});
                                }
                                //四象限
                                else {

                                    firstPoints.push({x: startx, y: starty});
                                    firstPoints.push({x: endx, y: starty});
                                    firstPoints.push({x: endx, y: endy});
                                }
                            }
                        }
                            break;
                    }
                }
                    break;
            }
        }
        this.totalPoints.push(firstPoints);
        this.totalPoints.push(secondPoints);
        this.totalPoints.push(thirdPoints);
    }
}

