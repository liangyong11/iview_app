<template>
    <div id="application_society" @mouseup="shapeMouseUp">
        <div id="container" class="container" style="margin-top: 10px;">
            <div id="iconContainer" class="icon_container" @click="iconClick">
                <div id="node_common_node" class="icon_common_node" draggable="true" title="社会系统">
                </div>
                <div id="icon_full_line_single" class="icon_full_line_single" title="强的(一般的、正向的)关系">
                </div>
                <div id="icon_full_line_double" class="icon_full_line_double" title="双向强的(一般的、正向的)关系">
                </div>
                <div id="icon_dotted_line_single" class="icon_dotted_line_single" title="薄弱的关系">
                </div>
                <div id="icon_dotted_line_double" class="icon_dotted_line_double" title="双向薄弱的关系">
                </div>
                <div id="icon_curve_line_single" class="icon_curve_line_single" title="有压力的或较紧张的关系">
                </div>
                <div id="icon_curve_line_double" class="icon_curve_line_double" title="双向有压力的或较紧张的关系">
                </div>
            </div>
            <div id="work_container" class="society_container" @mousedown="containerMouseDown"
                 @mousemove="containerMouseMove" @mouseup="containerMouseUp" @click="containerClick"
                 @dblclick="containerDoubleClick">
                <textarea id="txtTitle"
                          style="position: absolute; display: none; z-index: 10000; resize:none; font-size: 16px; line-height:21px; vertical-align:middle;"></textarea>
                <input id="txtProperty"
                       style="position: absolute; display: none; z-index: 10000; font-size: 14px; border:0px;"/>
                <div id="div_text"
                     style="position: absolute; display: none; font-size: 14px; width: 248px; line-height: 26px; padding-left: 5px; border: 1px solid gray;">
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    @import "./society.less";
</style>

<script>
    import {Init} from './javascript/init.js';
    import {Shape} from './javascript/shape.js';
    import {Common} from './javascript/tool.js';
    export default {
        name: "society",
        data: function () {
            return {
                selectedIconId: '',
                shape: null
            };
        },
        methods: {
            init: function () {
                var common = new Common();
                new Init().init();
                var dragSource = document.getElementById("node_common_node");
                var dragTarget = document.getElementById("work_container");
                common.dragDrop(dragSource, dragTarget, "common", (event, data) => {
                    var left = event.pageX - common.getOffset(this.shape.workContainer).left;
                    var top = event.pageY - common.getOffset(this.shape.workContainer).top;
                    var config = {
                        zIndex: this.shape.zIndex++,
                        type: data,
                        left: left,
                        top: top,
                        width: 100,
                        height: 60,
                        text: "社会系统"
                    };
                    this.shape.addNode(config);
                    this.shape.hasupdated = true;
                });
                this.shape.loadDefaultNode();
                document.body.onselectstart = function () {
                    return false;
                };
                document.onkeyup = this.containerKeyUp;
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
                this.shape.onKeyUp(event);
            },
            shapeMouseUp: function (event) {
                this.shape.onDocumentUp();
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
            this.shape = new Shape({name: "test"});
            this.init();
        }
    };
</script>
