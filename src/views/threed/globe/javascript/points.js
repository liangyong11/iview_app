/**
 * Created by liangyong on 2017/11/18.
 */

import * as THREE from "three";

var pointGeometry = new THREE.Geometry();
var pointMeshArray = new Array();
var needsUpdateGeometryArray = new Array();
var pointMaterialArray = new Array();
var landCount = 0, chinaCount = 0, totalCount = 0;
var rotationY = 0.01;
var scenePosition = new THREE.Vector3(0, 0, 0);
var bannerInstance = null;

export function BannerPoint() {
    return {
        getGeometry: function () {
            return pointGeometry;
        },
        setGeometry: function (geometry) {
            pointGeometry = geometry;
            return this;
        },
        meshArray: function () {
            return pointMeshArray;
        },
        setMeshArray: function (_pointMeshArray) {
            pointMeshArray = _pointMeshArray;
            return this;
        },
        needsUpdateArray: function () {
            return needsUpdateGeometryArray;
        },
        setNeedsUpdateArray: function (_needsUpdateGeometryArray) {
            needsUpdateGeometryArray = _needsUpdateGeometryArray;
            landCount = _needsUpdateGeometryArray[0].vertices.length;
            chinaCount = _needsUpdateGeometryArray[1].vertices.length;
            totalCount = landCount + chinaCount;
            return this;
        },
        landCount: function () {
            return landCount;
        },
        chinaCount: function () {
            return chinaCount;
        },
        totalCount: function () {
            return totalCount;
        },
        materialArray: function () {
            return pointMaterialArray;
        },
        setMaterialArray: function (_pointMaterialArray) {
            pointMaterialArray = _pointMaterialArray;
            return this;
        },
        getRotationY: function () {
            return rotationY;
        },
        setRotationY: function (_rotationY) {
            rotationY = _rotationY;
        },
        getScenePosition: function () {
            return scenePosition;
        },
        setScenePosition: function (_scenePosition) {
            scenePosition = _scenePosition;
        },
        getBannerInstance: function () {
            return bannerInstance;
        },
        setBannerInstance: function (_bannerInstance) {
            bannerInstance = _bannerInstance;
        }
    }
}