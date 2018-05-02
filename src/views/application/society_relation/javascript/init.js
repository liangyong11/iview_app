/**
 * Created by liangyong on 2018/4/19.
 */
import {Common} from "./tool.js";
export class Init {
    constructor() {
        var ctx = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
        if (ctx && ctx.lineTo) {
            ctx.dottedLine = function (x, y, x2, y2, dotArray) {
                if (!dotArray) dotArray = [10, 5];
                var context = this,
                    dashCount = dotArray.length,
                    dx = (x2 - x), dy = (y2 - y),
                    xSlope = dx > dy,
                    slope = (xSlope) ? dy / dx : dx / dy;
                if (slope > 9999) {
                    slope = 9999;
                }
                else if (slope < -9999) {
                    slope = -9999;
                }
                var distRemaining = Math.sqrt(dx * dx + dy * dy);
                var dashIndex = 0, draw = true;
                while (distRemaining >= 0.1 && dashIndex < 10000) {
                    var dashLength = dotArray[dashIndex++ % dashCount];
                    if (dashLength === 0) {
                        dashLength = 0.001;
                    }
                    if (dashLength > distRemaining) {
                        dashLength = distRemaining;
                    }
                    var step = Math.sqrt(dashLength * dashLength / (1 + slope * slope));
                    if (xSlope) {
                        x += dx < 0 && dy < 0 ? step * -1 : step;
                        y += dx < 0 && dy < 0 ? slope * step * -1 : slope * step;
                    }
                    else {
                        x += dx < 0 && dy < 0 ? slope * step * -1 : slope * step;
                        y += dx < 0 && dy < 0 ? step * -1 : step;
                    }
                    context[draw ? 'lineTo' : 'moveTo'](x, y);
                    distRemaining -= dashLength;
                    draw = !draw;
                }
                context.moveTo(x2, y2);
            }
        }
    }

    createCanvasContext() {
        var canvas = document.createElement("canvas");
        canvas.id = new Common().guid();
        canvas.width = 80;
        canvas.height = 40;
        canvas.style.cssText = "position: absolute; left: 0px; top: 0px;";
        var context = canvas.getContext("2d");
        context.lineWidth = 1;
        context.fillStyle = "#808080";
        context.strokeStyle = "#808080";
        return context;
    }

    full_line_single_init() {
        var context = this.createCanvasContext();

        context.save();
        context.beginPath();
        context.moveTo(10, 20);
        context.lineTo(70, 20);
        context.stroke();
        context.closePath();
        context.restore();

        context.save();
        context.translate(70, 20);
        context.rotate(90 * Math.PI / 180);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(-5, 7);
        context.lineTo(5, 7);
        context.lineTo(0, 0);
        context.closePath();
        context.fill();
        context.restore();

        document.getElementById("icon_full_line_single").appendChild(context.canvas);
    }

    full_line_double_init() {
        var context = this.createCanvasContext();

        context.save();
        context.beginPath();
        context.moveTo(10, 20);
        context.lineTo(70, 20);
        context.stroke();
        context.closePath();
        context.restore();

        context.save();
        context.translate(10, 20);
        context.rotate(270 * Math.PI / 180);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(-5, 7);
        context.lineTo(5, 7);
        context.lineTo(0, 0);
        context.closePath();
        context.fill();
        context.restore();

        context.save();
        context.translate(70, 20);
        context.rotate(90 * Math.PI / 180);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(-5, 7);
        context.lineTo(5, 7);
        context.lineTo(0, 0);
        context.closePath();
        context.fill();
        context.restore();

        document.getElementById("icon_full_line_double").appendChild(context.canvas);
    }

    dotted_line_single_init() {
        var context = this.createCanvasContext();

        context.save();
        context.beginPath();
        context.moveTo(10, 20);
        context.dottedLine(10, 20, 70, 20);
        context.stroke();
        context.closePath();
        context.restore();

        context.save();
        context.translate(70, 20);
        context.rotate(90 * Math.PI / 180);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(-5, 7);
        context.lineTo(5, 7);
        context.lineTo(0, 0);
        context.closePath();
        context.fill();
        context.restore();

        document.getElementById("icon_dotted_line_single").appendChild(context.canvas);
    }

    dotted_line_double_init() {
        var context = this.createCanvasContext();

        context.save();
        context.beginPath();
        context.moveTo(10, 20);
        context.dottedLine(10, 20, 70, 20);
        context.stroke();
        context.closePath();
        context.restore();

        context.save();
        context.translate(10, 20);
        context.rotate(270 * Math.PI / 180);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(-5, 7);
        context.lineTo(5, 7);
        context.lineTo(0, 0);
        context.closePath();
        context.fill();
        context.restore();

        context.save();
        context.translate(70, 20);
        context.rotate(90 * Math.PI / 180);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(-5, 7);
        context.lineTo(5, 7);
        context.lineTo(0, 0);
        context.closePath();
        context.fill();
        context.restore();

        document.getElementById("icon_dotted_line_double").appendChild(context.canvas);
    }

    curve_line_single_init() {
        var context = this.createCanvasContext();

        context.save();
        context.beginPath();
        context.moveTo(10, 20);
        for (var index = 10; index < 55; index++) {
            context.lineTo(index, -5 * Math.sin((20 * index) * Math.PI / 180) + 20);
        }
        context.lineTo(70, 20);
        context.stroke();
        context.closePath();
        context.restore();

        context.save();
        context.translate(70, 20);
        context.rotate(90 * Math.PI / 180);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(-5, 7);
        context.lineTo(5, 7);
        context.lineTo(0, 0);
        context.closePath();
        context.fill();
        context.restore();

        document.getElementById("icon_curve_line_single").appendChild(context.canvas);
    }

    curve_line_double_init() {
        var context = this.createCanvasContext();

        context.save();
        context.beginPath();
        context.moveTo(10, 20);
        context.lineTo(25, 20);
        for (var index = 27; index < 55; index++) {
            context.lineTo(index, -5 * Math.sin((20 * index) * Math.PI / 180) + 20);
        }
        context.lineTo(70, 20);
        context.stroke();
        context.closePath();
        context.restore();

        context.save();
        context.translate(10, 20);
        context.rotate(270 * Math.PI / 180);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(-5, 7);
        context.lineTo(5, 7);
        context.lineTo(0, 0);
        context.closePath();
        context.fill();
        context.restore();

        context.save();
        context.translate(70, 20);
        context.rotate(90 * Math.PI / 180);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(-5, 7);
        context.lineTo(5, 7);
        context.lineTo(0, 0);
        context.closePath();
        context.fill();
        context.restore();

        document.getElementById("icon_curve_line_double").appendChild(context.canvas);
    }

    canvas_display_init() {
        var canvas = document.createElement("canvas");
        canvas.id = "canvas_display";
        canvas.width = 1000;
        canvas.height = 500;
        canvas.style.cssText = "position: absolute; left: 0px; top: 0px;";
        document.getElementById("work_container").appendChild(canvas);
    }

    init() {
        this.full_line_single_init();
        this.full_line_double_init();
        this.dotted_line_single_init();
        this.dotted_line_double_init();
        this.curve_line_single_init();
        this.curve_line_double_init();
        this.canvas_display_init();
    }
}

