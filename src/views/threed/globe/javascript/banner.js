/**
 * Created by liangyong on 2017/11/16.
 */
import * as THREE from "three";
import * as d3 from 'd3';
import TWEEN from "@tweenjs/tween.js";
import {BannerPoint} from "./points.js";
import {China} from "./china.js";
import {Wave} from "./wave.js";
import {City} from "./city.js";
import {Tree} from "./tree.js";

export class Banner {
    constructor(containerId) {
        BannerPoint().setBannerInstance(this);
        BannerPoint().setScenePosition(new THREE.Vector3(0, 0, 0));

        this.container = document.getElementById(containerId);
        this.boundBox = this.container.getBoundingClientRect();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, this.boundBox.width / this.boundBox.height, 1, 10000);
        this.group = new THREE.Group();
        this.scene.add(this.group);

        this.globe = new China();
        this.wave = new Wave();
        this.city = new City();
        this.tree = new Tree();

        this.currentBanner = this.globe;

        this.initRender();
    }

    initRender() {
        var svg_word = document.querySelector("#svg_word");
        svg_word.setAttribute("width", this.boundBox.width);
        svg_word.setAttribute("height", this.boundBox.height);

        this.camera.position.copy(this.currentBanner.cameraPosition);
        this.camera.lookAt(this.currentBanner.scenePosition);

        var render = new THREE.WebGLRenderer({antialias: true});
        render.setPixelRatio(window.devicePixelRatio);
        render.setSize(this.boundBox.width, this.boundBox.height);
        render.setClearColor(0x000202, 0.3);
        render.domElement.style.position = "absolute";
        this.container.appendChild(render.domElement);
        this.render = render;
    }

    hideLoading() {
        d3.select("#loading").remove();
    }

    initScene() {
        this.wave.initPointMesh();
        var meshAndGeometryAndMaterial = this.globe.initPointMesh();

        var bannerPoint = BannerPoint();
        bannerPoint.setMeshArray(meshAndGeometryAndMaterial.meshArray)
            .setNeedsUpdateArray(meshAndGeometryAndMaterial.needsUpdateArray)
            .setMaterialArray(meshAndGeometryAndMaterial.materialArray);

        bannerPoint.meshArray().forEach(mesh => {
            this.group.add(mesh);
        });
    }

    changeBanner(banner) {
        if (this.currentBanner === banner) {
            return;
        }
        this.currentBanner.wordHelper.showGroup(false);
        this.currentBanner.cancelPointAnimation();
        this.currentBanner = banner;
        if (this.currentBanner !== this.wave) {
            this.wave.canAnimation = false;
        }
        this.currentBanner.addPointAnimation();
    }

    animation() {
        if (this.currentBanner.wordHelper.canShow) {
            this.currentBanner.wordHelper.play();
        }
        TWEEN.update();
        if (this.currentBanner.canAnimation) {
            this.currentBanner.animation();
        }
        var bannerPoint = BannerPoint();
        if (this.currentBanner === this.city || this.currentBanner === this.tree) {
            this.group.rotation.set(0, 0, 0);
        }
        else {
            this.group.rotation.y += bannerPoint.getRotationY();
        }
        this.camera.lookAt(bannerPoint.getScenePosition());
        bannerPoint.needsUpdateArray().forEach(geometry => {
            geometry.verticesNeedUpdate = true;
        });
        this.render.render(this.scene, this.camera);
        requestAnimationFrame(n => {
            this.animation();
        });
    }

    confirmSvgPosition(targetBanner) {
        var type = targetBanner.wordHelper.type;
        var svg_content = document.getElementById("svg_" + type);
        if (type === "tree" || type === "city") {
            var left = 10000, top = 10000, right = 0, bottom = 0;
            var halfWidth = this.boundBox.width / 2;
            var halfHeight = this.boundBox.height / 2;
            for (var index = 0, len = targetBanner.geometry.vertices.length; index < len; index++) {
                var world_coor = targetBanner.geometry.vertices[index];
                var pos = world_coor.clone();
                pos.project(this.camera);
                var result = {
                    x: Math.round((pos.x * halfWidth) + halfWidth),
                    y: Math.round(-(pos.y * halfHeight) + halfHeight)
                }
                if (result.x < left) {
                    left = result.x;
                }
                if (result.x > right) {
                    right = result.x;
                }
                if (result.y < top) {
                    top = result.y;
                }
                if (result.y > bottom) {
                    bottom = result.y;
                }
            }
            var width = right - left, height = bottom - top;
            if (type === "city") {
                left = left + Math.round(width * 0.095);
                top = top - Math.round(height * 0.174);
            }
            svg_content.style.left = left + "px";
            svg_content.style.top = top + "px";
            svg_content.setAttribute("width", width);
            svg_content.setAttribute("height", height);
        }
        if (type === "wave") {
            var left = Math.round(this.boundBox.width * 0.2), top = Math.round(this.boundBox.height * 0.025),
                width = Math.round(this.boundBox.width * 0.6), height = Math.round(this.boundBox.height * 0.95);
            svg_content.style.left = left + "px";
            svg_content.style.top = top + "px";
            svg_content.setAttribute("width", width);
            svg_content.setAttribute("height", height);
        }
    }
}
