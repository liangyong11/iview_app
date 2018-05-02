/**
 * Created by liangyong on 2017/11/18.
 */

import * as THREE from "three";
import {BannerPoint} from "./points.js";
import * as TWEEN from "@tweenjs/tween.js";
import {Word} from "./word.js";

export class Wave {
    constructor() {
        this.pointCount = 0;
        this.segmentCount = 61;
        this.geometry = null;
        this.material = null;

        this.cameraPosition = new THREE.Vector3(0, 200, 600);
        this.scenePosition = new THREE.Vector3(0, 0, 0);
        this.number = 0;

        this.wordHelper = new Word({type: "wave"});
        this.wordHelper.init();

        this.canAnimation = false;

        this.tweenList = []
        this.isNotConfirmPosition = true;
    }

    initPointMesh() {
        var geometry = new THREE.PlaneGeometry(10000, 10000, this.segmentCount - 1, this.segmentCount - 1);
        this.material = new THREE.PointsMaterial({
            color: 0x03D4D6,
            size: 12,
            transparent: true,
            opacity: 1.0
        });
        this.geometry = new THREE.Geometry();
        for (var index = 0, len = geometry.vertices.length; index < len; index++) {
            var ver = geometry.vertices[index];
            this.geometry.vertices.push(new THREE.Vector3(ver.x, -600, ver.y));
        }
        this.pointCount = this.geometry.vertices.length;
    }

    addPointAnimation() {
        var completedCounter = 0;
        var bannerPoint = BannerPoint();
        var needsUpdateArray = bannerPoint.needsUpdateArray();
        var materialArray = bannerPoint.materialArray();
        var totalCount = bannerPoint.totalCount(), landCount = bannerPoint.landCount();
        for (var index = 0; index < totalCount; index++) {
            if (index < landCount) {
                var from = needsUpdateArray[0].vertices[index];
                var to = this.geometry.vertices[index % this.pointCount];
            }
            else {
                var number = index - landCount;
                var from = needsUpdateArray[1].vertices[number];
                var to = this.geometry.vertices[number % this.pointCount];
            }

            var delayTime = 500 * Math.random() + 200;
            var tween = new TWEEN.Tween(from)
                .to({x: to.x, y: to.y, z: to.z,}, 1000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .delay(delayTime)
                .onComplete(() => {
                    completedCounter++;
                    if (completedCounter >= totalCount) {
                        this.canAnimation = true;
                        bannerPoint.setRotationY(-0.001);
                        if (this.isNotConfirmPosition === true) {
                            var bannerInstance = BannerPoint().getBannerInstance();
                            bannerInstance.confirmSvgPosition(this);
                            this.isNotConfirmPosition = false;
                        }
                        this.wordHelper.showGroup(true);
                    }
                });
            tween.start();
            this.tweenList.push(tween);
        }
        for (var m = 0; m < materialArray.length; m++) {
            var from = materialArray[m];
            var delayTime = 1000;
            new TWEEN.Tween(from)
                .to({
                    color: this.material.color, size: this.material.size,
                    opacity: this.material.opacity
                }, 200)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .delay(delayTime)
                .start();
        }

        var fromPosition = bannerPoint.getScenePosition();
        var toPosition = this.scenePosition;
        var delayTime = 500;
        new TWEEN.Tween(fromPosition)
            .to({
                x: toPosition.x, y: toPosition.y, z: toPosition.z
            }, 1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .delay(delayTime)
            .start();
    }

    animation() {
        var bannerPoint = BannerPoint();
        var needsUpdateArray = bannerPoint.needsUpdateArray();
        var totalCount = bannerPoint.totalCount(), landCount = bannerPoint.landCount(),
            chinaCount = bannerPoint.chinaCount();
        for (var ix = 0; ix < this.segmentCount; ix++) {
            for (var iy = 0; iy < this.segmentCount; iy++) {
                var index = ix * this.segmentCount + iy;
                //所属land的点的更新
                var vertice1 = needsUpdateArray[0].vertices[index];
                vertice1.y = this.calculatePisition(ix, iy);
                if (index + this.pointCount < landCount) {
                    var vertice2 = needsUpdateArray[0].vertices[index + this.pointCount];
                    vertice2.y = this.calculatePisition(ix, iy);
                }
                //所属china的点的更新
                if (index < chinaCount) {
                    var vertice3 = needsUpdateArray[1].vertices[index];
                    vertice3.y = this.calculatePisition(ix, iy);
                }
            }
        }
        this.number = this.number + 0.1;

        this.wordHelper.contentArray.forEach((content, index) => {
            var transform = content.getAttribute("transform");
            if (transform === undefined || transform === null) {
                transform = "translate(0 0)";
            }
            transform = transform.replace("translate(", "").replace(")", "");
            var xOldValue = transform.split(' ')[0], yOldValue = transform.split(' ')[1];
            var xAddValue = Math.sin(this.number * 0.3 * (index + 1));
            var yAddValue = Math.sin(this.number * 0.2 * (index + 2));
            var xNewValue = parseFloat(xOldValue) + xAddValue;
            var yNewValue = parseFloat(yOldValue) + yAddValue;
            var translate = "translate(0" + " " + yNewValue + ")";
            content.setAttribute("transform", translate);
        });
    }

    calculatePisition(ix, iy) {
        return (Math.sin((ix + this.number) * 0.5) * 60) + (Math.sin((iy + this.number) * 0.5) * 80) - 600;
    }

    cancelPointAnimation() {
        if (this.tweenList.length > 0) {
            this.tweenList.forEach(tween => {
                tween.stop();
            });
        }
        this.tweenList = [];
    }
}