/**
 * Created by liangyong on 2017/11/16.
 */

import * as THREE from "three";
import * as topojson from "topojson";
import * as d3 from 'd3';
import * as TWEEN from "@tweenjs/tween.js";
import {geo} from "./geo.js";
import {BannerPoint} from "./points.js";
import {Word} from "./word.js";

export class China {
    constructor() {
        this.geometry_land = new THREE.Geometry();
        this.geometry_china = new THREE.Geometry();
        this.material_land = null;
        this.material_china = null;

        this.cameraPosition = new THREE.Vector3(0, 200, 600);
        this.scenePosition = new THREE.Vector3(0, 0, 0);
        this.hasLoadComplete = false;

        this.tweenList = [];

        this.wordHelper = new Word({type: "globe"});
        this.wordHelper.init();
    }

    loadJson(jsonUrl) {
        return d3.json(jsonUrl);
    }

    //生成粒子的位置,并将所有随机粒子位置返回给banner
    generatePointsPosition(data) {
        var totalPointGeometry = new THREE.Geometry();

        var countries = topojson.feature(data, data.objects.countries);
        var geoFunc = geo(countries.features);
        var sphere = new THREE.SphereGeometry(230, 150, 150);
        var spherical = new THREE.Spherical();
        for (var index = 0, len = sphere.vertices.length; index < len; index++) {
            var vertice = sphere.vertices[index];
            spherical.setFromVector3(vertice);
            var lat = THREE.Math.radToDeg(Math.PI / 2 - spherical.phi);
            var lon = THREE.Math.radToDeg(spherical.theta);
            var country = geoFunc.search(lat, lon);
            if (country !== null) {
                if (country.code === "China") {
                    this.geometry_china.vertices.push(vertice);
                }
                else {
                    this.geometry_land.vertices.push(vertice);
                }

                var vertex = new THREE.Vector3();
                vertex.x = Math.random() * 1200 - 600;
                vertex.y = Math.random() * 1200 - 600;
                vertex.z = Math.random() * 1200 - 600;
                totalPointGeometry.vertices.push(vertex);
            }
        }
        BannerPoint().setGeometry(totalPointGeometry);
    }

    initPointMesh() {
        var totalPointGeometry = BannerPoint().getGeometry();
        var geometry_land = new THREE.Geometry();
        var geometry_china = new THREE.Geometry();
        var land_count = this.geometry_land.vertices.length, china_count = this.geometry_china.vertices.length;
        var all_count = land_count + china_count;
        for (var index = 0; index < all_count; index++) {
            if (index < land_count) {
                geometry_land.vertices.push(totalPointGeometry.vertices[index]);
            }
            else {
                geometry_china.vertices.push(totalPointGeometry.vertices[index]);
            }
        }
        this.material_land = new THREE.PointsMaterial({
            size: 4, color: 0x03D4D6, transparent: true, opacity: 0.4
        });
        this.material_china = new THREE.PointsMaterial({
            size: 4, color: 0x03D4D6, transparent: true, opacity: 1.0
        });
        var application_material_land = this.material_land.clone();
        var application_material_china = this.material_china.clone();
        var mesh_land = new THREE.Points(geometry_land, application_material_land);
        var mesh_china = new THREE.Points(geometry_china, application_material_china);
        var needsUpdateArray = new Array();
        var meshArray = new Array();
        var materialArray = new Array();
        needsUpdateArray.push(geometry_land);
        needsUpdateArray.push(geometry_china);
        meshArray.push(mesh_land);
        meshArray.push(mesh_china);
        materialArray.push(application_material_land);
        materialArray.push(application_material_china);

        //返回给banner使用(整个banner中的需要更新的geometry和对应的粒子mesh)
        return {needsUpdateArray: needsUpdateArray, meshArray: meshArray, materialArray: materialArray};
    }

    loadPointAnimation() {
        var completedCounter = 0;
        var bannerPoint = BannerPoint();
        var needsUpdateArray = bannerPoint.needsUpdateArray();
        var totalCount = bannerPoint.totalCount(), landCount = bannerPoint.landCount();
        for (var index = 0; index < totalCount; index++) {
            if (index < landCount) {
                var from = needsUpdateArray[0].vertices[index];
                var to = this.geometry_land.vertices[index];
            }
            else {
                var number = index - landCount;
                var from = needsUpdateArray[1].vertices[number];
                var to = this.geometry_china.vertices[number];
            }

            var delayTime = 1000 * Math.random() + 500;
            new TWEEN.Tween(from)
                .to({x: to.x, y: to.y, z: to.z,}, 1500)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .delay(delayTime)
                .onComplete(() => {
                    completedCounter++;
                    if (completedCounter >= totalCount) {
                        this.wordHelper.showGroup(true);
                        this.hasLoadComplete = true;
                    }
                })
                .start();
        }
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
                var to = this.geometry_land.vertices[index];
            }
            else {
                var number = index - landCount;
                var from = needsUpdateArray[1].vertices[number];
                var to = this.geometry_china.vertices[number];
            }

            var delayTime = 500 * Math.random() + 100;
            var tween = new TWEEN.Tween(from)
                .to({x: to.x, y: to.y, z: to.z,}, 1500)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .delay(delayTime)
                .onComplete(() => {
                    completedCounter++;
                    if (completedCounter >= totalCount * 0.8) {
                        bannerPoint.setRotationY(0.01);
                        this.wordHelper.showGroup(true);
                    }
                });
            tween.start();
            this.tweenList.push(tween);
        }
        for (var m = 0; m < materialArray.length; m++) {
            var from = materialArray[m];
            if (m === 0) {
                var to = this.material_land;
            }
            else {
                var to = this.material_china;
            }
            var delayTime = 500;
            new TWEEN.Tween(from)
                .to({
                    color: to.color, size: to.size,
                    opacity: to.opacity
                }, 1000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .delay(delayTime)
                .start();
        }

        //新增scenePosition的过渡变换
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

    cancelPointAnimation() {
        if (this.tweenList.length > 0) {
            this.tweenList.forEach(tween => {
                tween.stop();
            });
        }
        this.tweenList = [];
    }
}