/**
 * Created by liangyong on 2017/11/29.
 */

import * as THREE from "three";
import {BannerPoint} from "./points.js";
import * as TWEEN from "@tweenjs/tween.js";
import {Word} from "./word.js";

export class Tree {
    constructor() {
        this.geometry = null;
        this.material = null;

        this.cameraPosition = new THREE.Vector3(0, 200, 600);
        this.scenePosition = new THREE.Vector3(0, 200, 0);

        this.wordHelper = new Word({type: "tree"});
        this.wordHelper.init();

        this.points = [];
        this.pointCount = 0;

        this.tweenList = [];
        this.tweenFallList = [];
        this.tweenRiseList = [];

        this.isNotConfirmPosition = true;
    }

    loadImage(url) {
        var promise = new Promise((resolve, reject) => {
            var img = new Image();
            img.src = url;
            img.onload = () => {
                var canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                var points = [];
                var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                for (var x = 0; x < imageData.width; x += 2) {
                    for (var y = 0; y < imageData.height; y += 2) {
                        var i = (y * imageData.width + x) * 4;
                        if (imageData.data[i + 3] > 0) {
                            points.push({x: x - 250, y: 184 - y});
                        }
                    }
                }

                this.points = points;
                this.initPointMesh();

                resolve(img);
            };
        });
        return promise;
    }

    initPointMesh() {
        this.material = new THREE.PointsMaterial({
            color: 0x03D4D6,
            size: 3,
            transparent: true,
            opacity: 1.0
        });
        this.geometry = new THREE.Geometry();
        for (var index = 0, len = this.points.length; index < len; index++) {
            var point = this.points[index];
            this.geometry.vertices.push(new THREE.Vector3(point.x + 20, point.y + 200, 125));
        }
        this.pointCount = this.geometry.vertices.length;
    }

    addPointAnimation() {
        var completedCounter = 0;
        var bannerPoint = BannerPoint();
        var needsUpdateArray = bannerPoint.needsUpdateArray();
        var materialArray = bannerPoint.materialArray();
        var totalCount = bannerPoint.totalCount(), landCount = bannerPoint.landCount();

        var fromPosition = bannerPoint.getScenePosition();
        var toPosition = this.scenePosition;
        var delayTime = 500;
        new TWEEN.Tween(fromPosition)
            .to({
                x: toPosition.x, y: toPosition.y, z: toPosition.z
            }, 1500)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .delay(delayTime)
            .onComplete(function () {
            })
            .start();

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
                .to({x: to.x, y: to.y, z: to.z,}, 1500)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .delay(delayTime)
                .onComplete(() => {
                    completedCounter++;
                    if (completedCounter >= totalCount) {
                        if (this.isNotConfirmPosition === true) {
                            var bannerInstance = BannerPoint().getBannerInstance();
                            bannerInstance.confirmSvgPosition(this);
                            this.isNotConfirmPosition = false;
                        }
                        this.wordHelper.showGroup(true);
                        //this.addPointFall();
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

    }

    addPointFall() {
        var completedCounter = 0;
        var bannerPoint = BannerPoint();
        var needsUpdateArray = bannerPoint.needsUpdateArray();
        var materialArray = bannerPoint.materialArray();
        var totalCount = bannerPoint.totalCount(), landCount = bannerPoint.landCount();
        for (var index = 0; index < totalCount; index++) {
            if (index < landCount) {
                var _from = needsUpdateArray[0].vertices[index];
                var _to = {x: _from.x, y: 18 + 10 * Math.random(), z: _from.z * (1 - Math.random())};
            }
            else {
                var number = index - landCount;
                var _from = needsUpdateArray[1].vertices[number];
                var _to = {x: _from.x, y: 18 + 10 * Math.random(), z: _from.z * (1 - Math.random())};
            }

            var delayTime = 1000 * Math.random() + 1000;
            var tweenFall = new TWEEN.Tween(_from)
                .to({x: _to.x, y: _to.y, z: _to.z,}, 1000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .delay(delayTime)
                .onComplete(() => {
                    completedCounter++;
                    if (completedCounter >= totalCount) {
                        this.addPointRise();
                    }
                });
            tweenFall.start();
            this.tweenFallList.push(tweenFall);
        }
    }

    addPointRise() {
        var bannerPoint = BannerPoint();
        var needsUpdateArray = bannerPoint.needsUpdateArray();
        var materialArray = bannerPoint.materialArray();
        var totalCount = bannerPoint.totalCount(), landCount = bannerPoint.landCount();
        for (var index = 0; index < totalCount; index++) {
            if (index < landCount) {
                var from = needsUpdateArray[0].vertices[index];
                var to = this.geometry.vertices[this.pointCount - 1 - ( index % this.pointCount)];
            }
            else {
                var number = index - landCount;
                var from = needsUpdateArray[1].vertices[number];
                var to = this.geometry.vertices[number % this.pointCount];
            }

            var delayTime = 500 * Math.random() + 500;
            var tweenRise = new TWEEN.Tween(from)
                .to({x: to.x, y: to.y, z: to.z,}, 1000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .delay(delayTime);
            tweenRise.start();
            this.tweenRiseList.push(tweenRise);
        }
    }

    cancelPointAnimation() {
        if (this.tweenList.length > 0) {
            this.tweenList.forEach(tween => {
                tween.stop();
            });
        }
        this.tweenList = [];
        if (this.tweenFallList.length > 0) {
            this.tweenFallList.forEach(tween => {
                tween.stop();
            });
        }
        this.tweenFallList = [];
        if (this.tweenRiseList.length > 0) {
            this.tweenRiseList.forEach(tween => {
                tween.stop();
            });
        }
        this.tweenRiseList = [];
    }
}