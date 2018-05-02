/**
 * Created by liangyong on 2018/4/19.
 */

import {Common, lineState} from './tool.js';
export class Line {
    constructor(config) {
        this.common = new Common();
        this.guid = config.guid || this.common.guid();
        this.type = config.type || lineState.default;
        this.startX = config.startX;
        this.startY = config.startY;
        this.endX = config.endX;
        this.endY = config.endY;
        this.startType = config.startType || "";
        this.endType = config.endType || "";
        this.startNode = config.startNode || null;
        this.endNode = config.endNode || null;
    }

    getContext() {
        var canvas = document.getElementById(this.guid);
        var context = canvas.getContext("2d");
        context.lineWidth = 1;
        context.fillStyle = "#808080";
        context.strokeStyle = "#808080";
        return context;
    }

    createContext() {
        var canvas = document.createElement("canvas");
        canvas.id = this.guid;
        canvas.width = 1000;
        canvas.height = 500;
        canvas.style.cssText = "position: absolute; left: 0px; top: 0px;";
        document.getElementById("work_container").appendChild(canvas);
    }

    clear() {
        var context = this.getContext();
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }

    drawLine() {
        var context = this.getContext();
        if (this.type == lineState.full_line_single) {
            context.save();
            context.beginPath();
            context.moveTo(this.startX, this.startY);
            context.lineTo(this.endX, this.endY);
            context.stroke();
            context.closePath();
            context.restore();

            context.save();
            context.translate(this.endX, this.endY);
            var expresss = (this.endX - this.startX) / (this.endY - this.startY);
            if (this.startY - this.endY > 0) {
                context.rotate(-Math.atan(expresss));
            }
            else {
                context.rotate(Math.PI - Math.atan(expresss));
            }
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(-5, 7);
            context.lineTo(5, 7);
            context.lineTo(0, 0);
            context.closePath();
            context.fill();
            context.restore();
        }
        if (this.type == lineState.full_line_double) {
            context.save();
            context.beginPath();
            context.moveTo(this.startX, this.startY);
            context.lineTo(this.endX, this.endY);
            context.stroke();
            context.closePath();
            context.restore();

            context.save();
            context.translate(this.startX, this.startY);
            var expresss = (this.endX - this.startX) / (this.endY - this.startY);
            if (this.startY - this.endY < 0) {
                context.rotate(-Math.atan(expresss));
            }
            else {
                context.rotate(Math.PI - Math.atan(expresss));
            }
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(-5, 7);
            context.lineTo(5, 7);
            context.lineTo(0, 0);
            context.closePath();
            context.fill();
            context.restore();

            context.save();
            context.translate(this.endX, this.endY);
            var expresss = (this.endX - this.startX) / (this.endY - this.startY);
            if (this.startY - this.endY > 0) {
                context.rotate(-Math.atan(expresss));
            }
            else {
                context.rotate(Math.PI - Math.atan(expresss));
            }
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(-5, 7);
            context.lineTo(5, 7);
            context.lineTo(0, 0);
            context.closePath();
            context.fill();
            context.restore();
        }
        if (this.type == lineState.dotted_line_single) {
            context.save();
            context.beginPath();
            context.moveTo(this.startX, this.startY);
            context.dottedLine(this.startX, this.startY, this.endX, this.endY);
            context.stroke();
            context.closePath();
            context.restore();

            context.save();
            context.translate(this.endX, this.endY);
            var expresss = (this.endX - this.startX) / (this.endY - this.startY);
            if (this.startY - this.endY > 0) {
                context.rotate(-Math.atan(expresss));
            }
            else {
                context.rotate(Math.PI - Math.atan(expresss));
            }
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(-5, 7);
            context.lineTo(5, 7);
            context.lineTo(0, 0);
            context.closePath();
            context.fill();
            context.restore();
        }
        if (this.type == lineState.dotted_line_double) {
            context.save();
            context.beginPath();
            context.moveTo(this.startX, this.startY);
            context.dottedLine(this.startX, this.startY, this.endX, this.endY);
            context.stroke();
            context.closePath();
            context.restore();

            context.save();
            context.translate(this.startX, this.startY);
            var expresss = (this.endX - this.startX) / (this.endY - this.startY);
            if (this.startY - this.endY < 0) {
                context.rotate(-Math.atan(expresss));
            }
            else {
                context.rotate(Math.PI - Math.atan(expresss));
            }
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(-5, 7);
            context.lineTo(5, 7);
            context.lineTo(0, 0);
            context.closePath();
            context.fill();
            context.restore();

            context.save();
            context.translate(this.endX, this.endY);
            var expresss = (this.endX - this.startX) / (this.endY - this.startY);
            if (this.startY - this.endY > 0) {
                context.rotate(-Math.atan(expresss));
            }
            else {
                context.rotate(Math.PI - Math.atan(expresss));
            }
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(-5, 7);
            context.lineTo(5, 7);
            context.lineTo(0, 0);
            context.closePath();
            context.fill();
            context.restore();
        }
        if (this.type == lineState.curve_line_single) {
            context.save();
            context.beginPath();
            context.translate(this.startX, this.startY);
            var expresss = (this.endX - this.startX) / (this.endY - this.startY);
            if (this.startY <= this.endY) {
                context.rotate(Math.PI / 2 - Math.atan(expresss));
            }
            else {
                context.rotate(3 * Math.PI / 2 - Math.atan(expresss));
            }
            var px = this.endX - this.startX, py = this.endY - this.startY;
            for (var index = 0, len = Math.sqrt(px * px + py * py) - 15; index < len; index++) {
                context.lineTo(index, -5 * Math.sin((20 * index) * Math.PI / 180));
            }
            context.lineTo(Math.sqrt(px * px + py * py), 0);
            context.stroke();
            context.closePath();
            context.restore();

            context.save();
            context.translate(this.endX, this.endY);
            var expresss = (this.endX - this.startX) / (this.endY - this.startY);
            if (this.startY - this.endY > 0) {
                context.rotate(-Math.atan(expresss));
            }
            else {
                context.rotate(Math.PI - Math.atan(expresss));
            }
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(-5, 7);
            context.lineTo(5, 7);
            context.lineTo(0, 0);
            context.closePath();
            context.fill();
            context.restore();
        }
        if (this.type == lineState.curve_line_double) {
            context.save();
            context.beginPath();
            context.translate(this.startX, this.startY);
            var expresss = (this.endX - this.startX) / (this.endY - this.startY);
            if (this.startY <= this.endY) {
                context.rotate(Math.PI / 2 - Math.atan(expresss));
            }
            else {
                context.rotate(3 * Math.PI / 2 - Math.atan(expresss));
            }
            context.moveTo(0, 0);
            context.lineTo(15, 0);
            var px = this.endX - this.startX, py = this.endY - this.startY;
            for (var index = 15, len = Math.sqrt(px * px + py * py) - 15; index < len; index++) {
                context.lineTo(index, -5 * Math.sin((20 * index) * Math.PI / 180));
            }
            context.lineTo(Math.sqrt(px * px + py * py), 0);
            context.stroke();
            context.closePath();
            context.restore();

            context.save();
            context.translate(this.startX, this.startY);
            var expresss = (this.endX - this.startX) / (this.endY - this.startY);
            if (this.startY - this.endY < 0) {
                context.rotate(-Math.atan(expresss));
            }
            else {
                context.rotate(Math.PI - Math.atan(expresss));
            }
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(-5, 7);
            context.lineTo(5, 7);
            context.lineTo(0, 0);
            context.closePath();
            context.fill();
            context.restore();

            context.save();
            context.translate(this.endX, this.endY);
            var expresss = (this.endX - this.startX) / (this.endY - this.startY);
            if (this.startY - this.endY > 0) {
                context.rotate(-Math.atan(expresss));
            }
            else {
                context.rotate(Math.PI - Math.atan(expresss));
            }
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(-5, 7);
            context.lineTo(5, 7);
            context.lineTo(0, 0);
            context.closePath();
            context.fill();
            context.restore();
        }
        if (this.type == lineState.property_line) {
            context.save();
            context.beginPath();
            context.moveTo(this.startX, this.startY);
            context.lineTo(this.endX, this.endY);
            context.stroke();
            context.closePath();
            context.restore();
        }
    }

    drawDisplay() {
        this.clear();
        this.drawLine();
    }

    draw() {
        this.createContext();
        this.drawLine();
    }

    reDraw() {
        this.clear();
        this.drawLine();
    }

    refresh(config) {
        this.startX = config.startX || this.startX;
        this.startY = config.startY || this.startY;
        this.endX = config.endX || this.endX;
        this.endY = config.endY || this.endY;
        this.type = config.type || this.type;
    }

    highLight() {
        this.clear();
        var canvas = document.getElementById(this.guid);
        var context = canvas.getContext("2d");
        context.lineWidth = 1;
        context.fillStyle = "#FF0000";
        context.strokeStyle = "#FF0000";
        if (this.type == lineState.full_line_single) {
            context.save();
            context.beginPath();
            context.moveTo(this.startX, this.startY);
            context.lineTo(this.endX, this.endY);
            context.stroke();
            context.closePath();
            context.restore();

            context.save();
            context.translate(this.endX, this.endY);
            var expresss = (this.endX - this.startX) / (this.endY - this.startY);
            if (this.startY - this.endY > 0) {
                context.rotate(-Math.atan(expresss));
            }
            else {
                context.rotate(Math.PI - Math.atan(expresss));
            }
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(-5, 7);
            context.lineTo(5, 7);
            context.lineTo(0, 0);
            context.closePath();
            context.fill();
            context.restore();
        }
        if (this.type == lineState.full_line_double) {
            context.save();
            context.beginPath();
            context.moveTo(this.startX, this.startY);
            context.lineTo(this.endX, this.endY);
            context.stroke();
            context.closePath();
            context.restore();

            context.save();
            context.translate(this.startX, this.startY);
            var expresss = (this.endX - this.startX) / (this.endY - this.startY);
            if (this.startY - this.endY < 0) {
                context.rotate(-Math.atan(expresss));
            }
            else {
                context.rotate(Math.PI - Math.atan(expresss));
            }
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(-5, 7);
            context.lineTo(5, 7);
            context.lineTo(0, 0);
            context.closePath();
            context.fill();
            context.restore();

            context.save();
            context.translate(this.endX, this.endY);
            var expresss = (this.endX - this.startX) / (this.endY - this.startY);
            if (this.startY - this.endY > 0) {
                context.rotate(-Math.atan(expresss));
            }
            else {
                context.rotate(Math.PI - Math.atan(expresss));
            }
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(-5, 7);
            context.lineTo(5, 7);
            context.lineTo(0, 0);
            context.closePath();
            context.fill();
            context.restore();
        }
        if (this.type == lineState.dotted_line_single) {
            context.save();
            context.beginPath();
            context.moveTo(this.startX, this.startY);
            context.dottedLine(this.startX, this.startY, this.endX, this.endY);
            context.stroke();
            context.closePath();
            context.restore();

            context.save();
            context.translate(this.endX, this.endY);
            var expresss = (this.endX - this.startX) / (this.endY - this.startY);
            if (this.startY - this.endY > 0) {
                context.rotate(-Math.atan(expresss));
            }
            else {
                context.rotate(Math.PI - Math.atan(expresss));
            }
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(-5, 7);
            context.lineTo(5, 7);
            context.lineTo(0, 0);
            context.closePath();
            context.fill();
            context.restore();
        }
        if (this.type == lineState.dotted_line_double) {
            context.save();
            context.beginPath();
            context.moveTo(this.startX, this.startY);
            context.dottedLine(this.startX, this.startY, this.endX, this.endY);
            context.stroke();
            context.closePath();
            context.restore();

            context.save();
            context.translate(this.startX, this.startY);
            var expresss = (this.endX - this.startX) / (this.endY - this.startY);
            if (this.startY - this.endY < 0) {
                context.rotate(-Math.atan(expresss));
            }
            else {
                context.rotate(Math.PI - Math.atan(expresss));
            }
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(-5, 7);
            context.lineTo(5, 7);
            context.lineTo(0, 0);
            context.closePath();
            context.fill();
            context.restore();

            context.save();
            context.translate(this.endX, this.endY);
            var expresss = (this.endX - this.startX) / (this.endY - this.startY);
            if (this.startY - this.endY > 0) {
                context.rotate(-Math.atan(expresss));
            }
            else {
                context.rotate(Math.PI - Math.atan(expresss));
            }
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(-5, 7);
            context.lineTo(5, 7);
            context.lineTo(0, 0);
            context.closePath();
            context.fill();
            context.restore();
        }
        if (this.type == lineState.curve_line_single) {
            context.save();
            context.beginPath();
            context.translate(this.startX, this.startY);
            var expresss = (this.endX - this.startX) / (this.endY - this.startY);
            if (this.startY <= this.endY) {
                context.rotate(Math.PI / 2 - Math.atan(expresss));
            }
            else {
                context.rotate(3 * Math.PI / 2 - Math.atan(expresss));
            }
            var px = this.endX - this.startX, py = this.endY - this.startY;
            for (var index = 0, len = Math.sqrt(px * px + py * py) - 15; index < len; index++) {
                context.lineTo(index, -5 * Math.sin((20 * index) * Math.PI / 180));
            }
            context.lineTo(Math.sqrt(px * px + py * py), 0);
            context.stroke();
            context.closePath();
            context.restore();

            context.save();
            context.translate(this.endX, this.endY);
            var expresss = (this.endX - this.startX) / (this.endY - this.startY);
            if (this.startY - this.endY > 0) {
                context.rotate(-Math.atan(expresss));
            }
            else {
                context.rotate(Math.PI - Math.atan(expresss));
            }
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(-5, 7);
            context.lineTo(5, 7);
            context.lineTo(0, 0);
            context.closePath();
            context.fill();
            context.restore();
        }
        if (this.type == lineState.curve_line_double) {
            context.save();
            context.beginPath();
            context.translate(this.startX, this.startY);
            var expresss = (this.endX - this.startX) / (this.endY - this.startY);
            if (this.startY <= this.endY) {
                context.rotate(Math.PI / 2 - Math.atan(expresss));
            }
            else {
                context.rotate(3 * Math.PI / 2 - Math.atan(expresss));
            }
            context.moveTo(0, 0);
            context.lineTo(15, 0);
            var px = this.endX - this.startX, py = this.endY - this.startY;
            for (var index = 15, len = Math.sqrt(px * px + py * py) - 15; index < len; index++) {
                context.lineTo(index, -5 * Math.sin((20 * index) * Math.PI / 180));
            }
            context.lineTo(Math.sqrt(px * px + py * py), 0);
            context.stroke();
            context.closePath();
            context.restore();

            context.save();
            context.translate(this.startX, this.startY);
            var expresss = (this.endX - this.startX) / (this.endY - this.startY);
            if (this.startY - this.endY < 0) {
                context.rotate(-Math.atan(expresss));
            }
            else {
                context.rotate(Math.PI - Math.atan(expresss));
            }
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(-5, 7);
            context.lineTo(5, 7);
            context.lineTo(0, 0);
            context.closePath();
            context.fill();
            context.restore();

            context.save();
            context.translate(this.endX, this.endY);
            var expresss = (this.endX - this.startX) / (this.endY - this.startY);
            if (this.startY - this.endY > 0) {
                context.rotate(-Math.atan(expresss));
            }
            else {
                context.rotate(Math.PI - Math.atan(expresss));
            }
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(-5, 7);
            context.lineTo(5, 7);
            context.lineTo(0, 0);
            context.closePath();
            context.fill();
            context.restore();
        }
        if (this.type == lineState.property_line) {
            context.save();
            context.beginPath();
            context.moveTo(this.startX, this.startY);
            context.lineTo(this.endX, this.endY);
            context.stroke();
            context.closePath();
            context.restore();
        }
    }

    resume() {
        this.reDraw();
    }

    isOnLine(point) {
        if (this.type == lineState.default || this.type == lineState.property_line) {
            return false;
        }
        var check_width = 5;
        var smallX = Math.min(this.startX, this.endX), largeX = Math.max(this.startX, this.endX);
        var smallY = Math.min(this.startY, this.endY), largeY = Math.max(this.startY, this.endY);
        if (smallX == largeX || (largeX - smallX) <= 10) {
            if ((smallX - check_width) <= point.x && point.x <= (largeX + check_width)) {
                if (smallY <= point.y && point.y <= largeY) {
                    return true;
                }
            }
        }
        if (smallX <= point.x && point.x <= largeX) {
            var rate = Math.abs((this.startY - this.endY) / (this.startX - this.endX));
            if (rate > 4) {
                if (smallY <= point.y && point.y <= largeY) {
                    return true;
                }
            }
            var absolute = point.x * (this.startY - this.endY) / (this.startX - this.endX) +
                (this.startX * this.endY - this.endX * this.startY) / (this.startX - this.endX);
            var range = rate > 1 ? rate : 1;
            if ((absolute - check_width * range) <= point.y && point.y <= (absolute + check_width * range)) {
                return true;
            }
        }
        return false;
    }

    ToJson() {
        var lineJson = {
            ID: this.guid, Type: this.type, StartNodeID: this.startNode.guid,
            EndNodeID: this.endNode.guid, StartType: this.startType, EndType: this.endType, StartX: this.startX,
            EndX: this.endX, StartY: this.startY, EndY: this.endY
        };
        return lineJson;
    }
}

