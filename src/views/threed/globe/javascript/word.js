/**
 * Created by liangyong on 2017/11/11.
 */

export class Word {
    constructor(config) {
        config = config || new Object();
        this.type = config.type || "globe";
        this.current_frame = 0;
        this.total_frames = config.total_frames || 50;
        this.canShow = false;

        this.addAnimationFuncArray = [];
        this.removeAnimationFuncArray = [];
    }

    showGroup(isShow) {
        if (isShow) {
            this.group.style.display = "block";
            if (this.type !== "globe") {
                var group = document.getElementById("svg_" + this.type);
                group.style.display = "block";
            }
        }
        else {
            this.hideIcon();

            this.group.style.display = "none";
            this.hideElement();
            this.current_frame = 0;
            this.wordStringList.forEach(item => {
                item.loaded = false;
            });
            this.dataStringList.forEach(item => {
                item.loaded = false;
            });
            this.englishStringList.forEach(item => {
                item.loaded = false;
            });
        }
        this.canShow = isShow;
    }

    //隐藏元素,为下一次动画做准备
    hideElement() {
        this.path_word.setAttribute("d", "");
        this.path_line.style.strokeDasharray = this.pathLineLength;
        this.path_line.style.strokeDashoffset = this.pathLineLength;
        this.circle.style.display = "none";
        this.path_data.setAttribute("d", "");
        this.path_english.setAttribute("d", "");
    }

    initElement() {
        this.group = document.querySelector("#" + this.type);
        this.path_word = document.querySelector("#path_word_" + this.type);
        this.path_line = document.querySelector("#path_line_" + this.type);
        this.circle = document.querySelector("#circle_" + this.type);
        this.path_data = document.querySelector("#path_data_" + this.type);
        this.path_english = document.querySelector("#path_english_" + this.type);
    }

    initWord() {
        this.wordStringList = new Array();
        /*if (this.type === "globe") {
         var wordParameter = [0, 4, 9, 16, 19, 22, 26];
         var path_d = this.path_word.getAttribute("d");
         var path_d_array = path_d.split("Z");
         for (var index = 0, len = wordParameter.length; index < len - 1; index++) {
         var start = wordParameter[index];
         var end = wordParameter[index + 1];
         var str = path_d_array.slice(start, end).join("Z") + "Z";
         this.wordStringList.push({str: str, loaded: false});
         }
         this.path_word.setAttribute("d", "");
         }*/
        var path_d = this.path_word.getAttribute("d");
        path_d = path_d.replace(/z/g, "Z");
        var path_d_array = path_d.split("Z");
        for (var index = 0, len = path_d_array.length; index < len - 1; index++) {
            var str = path_d_array[index] + "Z";
            this.wordStringList.push({str: str, loaded: false});
        }
        this.path_word.setAttribute("d", "");
    }

    initLine() {
        this.pathLineLength = this.path_line.getTotalLength();
        this.path_line.style.strokeDasharray = this.pathLineLength;
        this.path_line.style.strokeDashoffset = this.pathLineLength;
        this.circle.style.display = "none";
    }

    initLetter() {
        this.dataStringList = new Array();
        this.englishStringList = new Array();
        var path_d = this.path_data.getAttribute("d");
        path_d = path_d.replace(/z/g, "Z");
        var path_d_array = path_d.split("Z");
        for (var index = 0, len = path_d_array.length; index < len - 1; index++) {
            var str = path_d_array.slice(index, index + 1).join("Z") + "Z";
            this.dataStringList.push({str: str, loaded: false});
        }
        path_d = this.path_english.getAttribute("d");
        path_d = path_d.replace(/z/g, "Z");
        path_d_array = path_d.split("Z");
        for (var index = 0, len = path_d_array.length; index < len - 1; index++) {
            var str = path_d_array.slice(index, index + 1).join("Z") + "Z";
            this.englishStringList.push({str: str, loaded: false});
        }
        this.letterStringLength = this.dataStringList.length + this.englishStringList.length;
        this.path_data.setAttribute("d", "");
        this.path_english.setAttribute("d", "");
    }

    initIcon() {
        this.iconLineArray = [];
        this.iconArray = [];
        this.rotateArray = [];
        this.animationArray = [];

        //整体内容的起伏控制,只适用于海浪
        this.contentArray = [];
        if (this.type === "wave") {
            var lineIdArray = ["path-17w", "path-13w", "path-9w", "path-5w", "path-55w", "path-1w"];
            lineIdArray.forEach(lineId => {
                var line = document.getElementById(lineId);
                var line_copy = document.getElementById(lineId + "_copy");
                var lineStr = line_copy.getAttribute("d");
                var start = lineStr.split("L")[0];
                var lineLength = line_copy.getTotalLength();
                this.iconLineArray.push({line: line, line_copy: line_copy, len: lineLength, start: start});
            })
            this.iconArray = [{icon: document.getElementById("wave_ico1"), end: 0, x: 0},
                {icon: document.getElementById("wave_ico2"), end: 0, x: 0},
                {icon: document.getElementById("wave_ico3"), end: 0, x: 0},
                {icon: document.getElementById("wave_ico4"), end: 0, x: 0},
                {icon: document.getElementById("wave_ico5"), end: 0, x: 0},
                {icon: document.getElementById("wave_ico6"), end: 0, x: 0}];
            for (var index = 0; index < this.iconArray.length; index++) {
                this.iconArray[index].start = this.iconLineArray[index].len;
                this.animationArray.push(this.iconArray[index].icon);
            }

            for (var index = 1; index <= 6; index++) {
                var content = document.getElementById("content_wave_" + index);
                this.contentArray.push(content);
            }
        }
        if (this.type === "tree") {
            var lineIdArray = ["path-51t"];
            lineIdArray.forEach(lineId => {
                var line = document.getElementById(lineId);
                var line_copy = document.getElementById(lineId + "_copy");
                var lineStr = line_copy.getAttribute("d");
                var start = lineStr.split("L")[0];
                var lineLength = line_copy.getTotalLength();
                this.iconLineArray.push({line: line, line_copy: line_copy, len: lineLength, start: start});
            });
            this.iconArray = [{icon: document.getElementById("tree_ico1_inner"), start: 350, end: 200, x: 100},
                {icon: document.getElementById("tree_ico2_inner"), start: 350, end: 200, x: 400},
                {icon: document.getElementById("tree_ico3_inner"), start: 350, end: 200, x: 700}];
            this.animationArray = [document.getElementById("tree_ico1"),
                document.getElementById("tree_ico2"), document.getElementById("tree_ico3")];
        }
        if (this.type === "city") {
            this.rotateArray = [{id: "city_ico1"},
                {id: "city_ico2"},
                {id: "city_ico3"},
                {id: "city_ico4"}];
            this.rotateArray.forEach(rotate => {
                var inner = document.getElementById(rotate.id + "_inner");
                var bbox = inner.getBBox();
                rotate.center = " " + (bbox.x + bbox.width / 2) + " " + ( bbox.y + bbox.height / 2);
                rotate.inner = inner;
                rotate.transform = inner.getAttribute("transform");

                this.animationArray.push(document.getElementById(rotate.id));
            });
        }
        var svg_container = document.getElementById("svg_" + this.type);
        if (svg_container) {
            svg_container.style.display = "none";
        }
    }

    showIconText(isShow) {
        if (this.type === "globe") {
            return;
        }
        var displayValue = isShow ? "block" : "none";
        var len = 0;
        if (this.type === "wave") {
            len = 6;
        }
        if (this.type === "tree") {
            len = 3;
        }
        if (this.type === "city") {
            len = 4;
        }
        for (var index = 1; index <= len; index++) {
            document.getElementById(this.type + "_text" + index).style.display = displayValue;
        }
    }

    hideIcon() {
        if (this.type !== "globe") {
            this.iconLineArray.forEach(line => {
                line.line.setAttribute("d", "");
            });
            this.iconArray.forEach(icon => {
                icon.icon.setAttribute("transform", "translate(" + icon.x + "," + icon.start + ")");
            });
            this.rotateArray.forEach(rotate => {
                rotate.inner.setAttribute("transform", rotate.transform);
            });
            this.contentArray.forEach(content => {
                content.setAttribute("transform", "translate(0 0)");
            });
            this.showIconText(false);
            this.animationArray.forEach((element, index) => {
                var addFunc = this.addAnimationFuncArray[index];
                var removeFunc = this.removeAnimationFuncArray[index];
                element.removeEventListener("mouseenter", addFunc, false);
                element.removeEventListener("mouseleave", removeFunc, false);
            });
            this.addAnimationFuncArray = [];
            this.removeAnimationFuncArray = [];
            var group = document.getElementById("svg_" + this.type);
            group.style.display = "none";
        }
    }

    init() {
        this.initElement();
        this.initWord();
        this.initLine();
        this.initLetter();
        this.initIcon();
    }

    playWord(progress) {
        var len = this.wordStringList.length;
        var number = Math.floor(len * progress) - 1;
        if (number >= 0 && this.wordStringList[number].loaded === false) {
            var oldPathString = this.path_word.getAttribute("d");
            var newPathString = oldPathString + this.wordStringList[number].str;
            this.path_word.setAttribute("d", newPathString);
            this.wordStringList[number].loaded = true;
        }
    }

    playLine(progress) {
        this.path_line.style.strokeDashoffset = (1 - progress) * this.pathLineLength;
    }

    playLetter(progress) {
        var number = Math.floor(this.letterStringLength * progress) - 1;
        if (number >= 0) {
            if (this.dataStringList[number]) {
                if (this.dataStringList[number].loaded === false) {
                    var oldPathString = this.path_data.getAttribute("d");
                    var newPathString = oldPathString + this.dataStringList[number].str;
                    this.path_data.setAttribute("d", newPathString);
                    this.dataStringList[number].loaded = true;
                }
            }
            else {
                number = number - this.dataStringList.length;
                if (this.englishStringList[number].loaded === false) {
                    var oldPathString = this.path_english.getAttribute("d");
                    var newPathString = oldPathString + this.englishStringList[number].str;
                    this.path_english.setAttribute("d", newPathString);
                    this.englishStringList[number].loaded = true;
                }
            }
        }
    }

    playIcon(progress) {
        this.iconLineArray.forEach(line => {
            var length = line.len * progress;
            var point = line.line_copy.getPointAtLength(length);
            var path_str = line.start + "L" + point.x + "," + point.y;
            line.line.setAttribute("d", path_str);
        });
        this.iconArray.forEach(icon => {
            var target = icon.start - (icon.start - icon.end) * progress;
            var transform_str = "translate(" + icon.x + "," + target + ")";
            icon.icon.setAttribute("transform", transform_str);
        });
        this.rotateArray.forEach(rotate => {
            var inner = rotate.inner;
            var deg = progress * 360;
            var transform_add = " rotate(" + deg + rotate.center + ")";
            inner.setAttribute("transform", rotate.transform + transform_add);
        });
    }

    play() {
        var progress = this.current_frame / this.total_frames;
        if (progress <= 1) {
            this.current_frame++;
            this.playWord(progress);
            this.playLine(progress);
            this.playLetter(progress);
            this.playIcon(progress);
            if (progress === 1) {
                this.circle.style.display = "block";
                this.showIconText(true);

                this.animationArray.forEach(element => {
                    var bbox = element.getBBox();
                    var center = " " + (bbox.x + bbox.width / 2) + " " + ( bbox.y + bbox.height / 2);

                    var addFunc = () => {
                        this.addAnimation(element, center);
                    };
                    var removeFunc = () => {
                        this.removeAnimation(element);
                    };
                    this.addAnimationFuncArray.push(addFunc);
                    this.removeAnimationFuncArray.push(removeFunc);
                    element.addEventListener("mouseenter", addFunc, false);
                    element.addEventListener("mouseleave", removeFunc, false);
                });
            }
        }
    }

    addAnimation(element, center) {
        var animateId = element.id + "_animate";
        var animateTransform = document.getElementById(animateId);
        if (animateTransform) {
            return;
        }
        animateTransform = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
        animateTransform.setAttribute("id", animateId);
        animateTransform.setAttribute("attributeName", "transform");
        animateTransform.setAttribute("begin", "0s");
        animateTransform.setAttribute("dur", "2s");
        animateTransform.setAttribute("repeatCount", "indefinite");
        animateTransform.setAttribute("type", "rotate");
        animateTransform.setAttribute("from", "0" + center);
        animateTransform.setAttribute("to", "360" + center);
        element.appendChild(animateTransform);
    }

    removeAnimation(element) {
        var animate = document.getElementById(element.id + "_animate");
        if (animate) {
            element.removeChild(animate);
        }
    }
}