import { Component, OnInit } from '@angular/core';
import {mqttAddress,serverAddress} from '../../../../assets/js/ZK.config';


import * as THREE from 'three';
import * as Stats from 'stats.js';
import {
  OrbitControls
} from 'three-full';
declare let HG3DMap: any;
declare let CONFIG_3D: any;
declare let $;
@Component({
  selector: 'app-three-dmap',
  templateUrl: './three-dmap.component.html',
  styleUrls: ['./three-dmap.component.css']
})
export class ThreeDmapComponent implements OnInit {
  TRACK_RECORD_POINTS = 100;
  MOVING_CACHE_TIME = 1.5;
  ANIMATION_SWITCH = true;
  renderer;
  camera;
  scene;
  light;
  stats;
  controls;
  container;
  gui;
  MY_MAP; //地图场景对象,SDK基本都在MY_MAP对象上进行操作
  constructor() { }

  ngOnInit() {
    this.draw();
  }

  
    initRender() {
      this.renderer = new THREE.WebGLRenderer({antialias:true});
      this.renderer.setSize(window.innerWidth, window.innerHeight);
        //告诉渲染器需要阴影效果
        this.renderer.shadowMap.enabled = true;
        this. renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 默认的是，没有设置的这个清晰 THREE.PCFShadowMap
        this.renderer.setClearColor(0xffffff);
        document.body.appendChild(this.renderer.domElement);
    }


     initCamera() {
      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
      this.camera.position.set(0, 4, 5);
      this.camera.lookAt(new THREE.Vector3(0,0,0));
    }


     initScene() {
      this.scene = new THREE.Scene();
    }



     


     initLight() {
      this.scene.add(new THREE.AmbientLight(0x444444));

      this.light = new THREE.PointLight(0xffffff);
      this.light.position.set(0,10,10);

        //告诉平行光需要开启阴影投射
        this.light.castShadow = true;

        this.scene.add(this.light);
    }

     initModel() {

        //辅助工具
        var helper = new THREE.AxesHelper(50);
        this.scene.add(helper);

        //加载JSON模型
        var loader = new THREE.ObjectLoader();
        let that = this;
       loader.load("./assets/json/test/scene.json",function (obj) {
          that.scene.add(obj);
        });
    }

    //初始化性能插件

     initStats() {
      this.stats = new Stats();
        document.body.appendChild(this.stats.dom);
    }

    //用户交互插件 鼠标左键按住旋转，右键按住平移，滚轮缩放

     initControls() {

      this.controls = new OrbitControls( this.camera, this.renderer.domElement );

        // 如果使用animate方法时，将此函数删除
        //this.controls.addEventListener( 'change', this.render );
        // 使动画循环使用时阻尼或自转 意思是否有惯性
        this.controls.enableDamping = true;
        //动态阻尼系数 就是鼠标拖拽旋转灵敏度
        //controls.dampingFactor = 0.25;
        //是否可以缩放
        this.controls.enableZoom = true;
        //是否自动旋转
        this.controls.autoRotate = true;
        //设置相机距离原点的最远距离
        this.controls.minDistance  = 1;
        //设置相机距离原点的最远距离
        this.controls.maxDistance  = 200;
        //是否开启右键拖拽
        this.controls.enablePan = true;
    }

     render(){
       if (!this.renderer){
        return;
      }
      this.renderer.render( this.scene, this.camera );
    }

    //窗口变动触发的函数
     onWindowResize() {
       let that = this;
      setTimeout(()=>{
        that.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.render();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      },100)
      

    }

     animate() {
        //更新控制器
        this.render();

        //更新性能插件
        this.stats.update();

        this.controls.update();
        setTimeout(() => {
          this.animate()
        }, 1000);
        //requestAnimationFrame(this.animate);
    }


     draw() {
        
      this.initRender();
      this.initScene();
      this.initCamera();
      this.initLight();
      this.initModel();
      this.initControls();
      this.initStats();

      this.animate();
        window.onresize = this.onWindowResize;
    }

}
