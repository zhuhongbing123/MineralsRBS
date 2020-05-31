import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';

import Stats from '../../../../assets/js/stats.module.js';

import { OrbitControls } from '../../../../assets/js/OrbitControls.js';
import { ImprovedNoise } from '../../../../assets/js/ImprovedNoise.js';
import { OutlinePass } from '../../../../assets/js/OutlinePass.js';
import { DragControls  } from '../../../../assets/js/DragControls.js';
import { deLocale } from 'ngx-bootstrap';
declare let requestAnimationFrame;
@Component({
  selector: 'app-three-map',
  templateUrl: './three-map.component.html',
  styleUrls: ['./three-map.component.scss']
})
export class ThreeMapComponent implements OnInit{

  container;stats;

 camera; controls; scene; 
 public renderer = new THREE.WebGLRenderer( { antialias: true } );

  mesh;texture;

  worldWidth = 256; worldDepth = 256;
   worldHalfWidth = this.worldWidth / 2; worldHalfDepth = this.worldDepth / 2;

  helper;

  raycaster = new THREE.Raycaster();
  mouse;
  cube;
  selectedObjects = [];
  outlinePass;
  rollOverMaterial;
  objects= [];
  isShiftDown = false;
  plane; cubeGeo; cubeMaterial;
   clock = new THREE.Clock();//声明一个时钟对象
  mixer; rollOverMesh;
  constructor() { }
  ngOnInit() {
   
    this.init();
    this.animate();
  }
  init() {
 
    this.container = document.getElementById( 'container' );
    this.container.innerHTML = "";

    
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.set(500, 800, 1300);
    this.camera.lookAt(0, 0, 0);
    //this.camera.position.z = 1000;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xbfd1e5 );

    var light = new THREE.SpotLight( 0xffffff, 1.5 );
				light.position.set( 0, 500, 2000 );
				light.angle = Math.PI / 9;

				light.castShadow = true;
				light.shadow.camera.near = 1000;
				light.shadow.camera.far = 4000;
				light.shadow.mapSize.width = 1024;
				light.shadow.mapSize.height = 1024;

        this.scene.add( light );
        
    //加载JSON模型
    var loaderss = new THREE.ObjectLoader();
    let that = this;
    loaderss.load("./assets/json/test/scene.json", function (obj) {
      obj.position.x = 140;
      obj.position.y = 920;
      obj.position.z = 100;
      obj.scale.x = 20.0;
      obj.scale.y = 20.0;
      obj.scale.z = 20.0;
      that.scene.add(obj);
    });
    

    var skyBoxGeometry = new THREE.BoxGeometry(5, 20, 32);  
    var texture = new THREE.TextureLoader().load("./assets/img/location_icon/camera.png");

    var skyBoxMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });

    var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
    skyBox.position.x = 240;
    skyBox.position.y = 920;
    skyBox.position.z = 250;
    skyBox.scale.x = 10.0;
    skyBox.scale.y = 10.0;
    skyBox.scale.z = 10.0;
   // this.scene.add(skyBox); 



    var people = new THREE.ObjectLoader();
    people.load("./assets/json/test/people.json", function (obj) {
      obj.position.x = 520;
      obj.position.y = 920;
      obj.position.z = -1000;
      obj.scale.x = 20.0;
      obj.scale.y = 20.0;
      obj.scale.z = 20.0;
      that.rollOverMesh = obj;
      that.scene.add(obj);
      that.start();
    });
    var rollOverGeo = new THREE.BoxBufferGeometry(50, 50, 50);
    this.rollOverMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.5, transparent: true });
    this.rollOverMesh = new THREE.Mesh(rollOverGeo, this.rollOverMaterial);
    this.rollOverMesh.position.x = 840;
    this.rollOverMesh.position.y = 980;
    this.rollOverMesh.position.z = -350;
    //this.scene.add(this.rollOverMesh);
    //this.start();


    
   
    

  





        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.container.appendChild( this.renderer.domElement );
        
				var controls = new DragControls( this.objects, this.camera, this.renderer.domElement );
        controls.addEventListener( 'dragend', function ( event ) {

					event.object.material.emissive.set( 0x000000 );

        } );
        controls.addEventListener( 'dragstart', function ( event ) {

					event.object.material.emissive.set( 0xaaaaaa );

        } );
        this.stats = new Stats();
      //  this.container.appendChild( this.stats.dom );
        window.addEventListener( 'resize', this.onWindowResize, false );

  //this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 10, 20000 );

    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.minDistance = 1000;
    this.controls.maxDistance = 10000;
    this.controls.maxPolarAngle = Math.PI / 2;

   //

   var data = this.generateHeight( this.worldWidth, this.worldDepth );

   this.controls.target.y = data[ this.worldHalfWidth + this.worldHalfDepth * this.worldWidth ] + 500;
   this.camera.position.y = this.controls.target.y + 2000;
   this.camera.position.x = 2000;
   this.controls.update();


    this.mouse = new THREE.Vector2();
    var geometry = new THREE.PlaneBufferGeometry(100, 100);
    geometry.rotateX(- Math.PI / 2);

    this.plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
    this.scene.add(this.plane);

    this.objects.push(this.plane);
    /* document.addEventListener('mousedown', function (event){
      that.onDocumentMouseDown(event)
    } , false); */
    
    //document.addEventListener('mousemove', this.onMouseMove, false);

 }

 onTouchMove( event ) {

  var x, y;

  if ( event.changedTouches ) {

    x = event.changedTouches[ 0 ].pageX;
    y = event.changedTouches[ 0 ].pageY;

  } else {

    x = event.clientX;
    y = event.clientY;

  }

  this.mouse.x = ( x / window.innerWidth ) * 2 - 1;
  this.mouse.y = - ( y / window.innerHeight ) * 2 + 1;

  this.checkIntersection();

}

 checkIntersection() {

  this.raycaster.setFromCamera( this.mouse, this.camera );

  var intersects = this.raycaster.intersectObjects( [ this.scene ], true );

  if ( intersects.length > 0 ) {

    var selectedObject = intersects[ 0 ].object;
    this.addSelectedObject( selectedObject );
    this.outlinePass.selectedObjects = this.selectedObjects;

  } else {

    // outlinePass.selectedObjects = [];

  }

}

addSelectedObject( object ) {

  this.selectedObjects = [];
  this.selectedObjects.push( object );

}

 onWindowResize() {

  this.camera.aspect = window.innerWidth/ window.innerHeight;
  this.camera.updateProjectionMatrix();

  this.renderer.setSize( window.innerWidth, window.innerHeight );

 }

  generateHeight( width, height ) {

   var size = width * height, data = new Uint8Array( size ),
     perlin = new ImprovedNoise(), quality = 1, z = Math.random() * 100;

   for ( var j = 0; j < 4; j ++ ) {

     for ( var i = 0; i < size; i ++ ) {

       var x = i % width, y = ~ ~ ( i / width );
       data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );

     }

     quality *= 5;

   }

   return data;

 }

  generateTexture( data, width, height ) {

   // bake lighting into texture

   var canvas, canvasScaled, context, image, imageData, vector3, sun, shade;

   vector3 = new THREE.Vector3( 0, 0, 0 );

   sun = new THREE.Vector3( 1, 1, 1 );
   sun.normalize();

   canvas = document.createElement( 'canvas' );
   canvas.width = width;
   canvas.height = height;

   context = canvas.getContext( '2d' );
   context.fillStyle = '#000';
   context.fillRect( 0, 0, width, height );

   image = context.getImageData( 0, 0, canvas.width, canvas.height );
   imageData = image.data;

   for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {

     vector3.x = data[ j - 2 ] - data[ j + 2 ];
     vector3.y = 2;
     vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
     vector3.normalize();

     shade = vector3.dot( sun );

     imageData[ i ] = ( 96 + shade * 128 ) * ( 0.5 + data[ j ] * 0.007 );
     imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
     imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );

   }

   context.putImageData( image, 0, 0 );

   // Scaled 4x

   canvasScaled = document.createElement( 'canvas' );
   canvasScaled.width = width * 4;
   canvasScaled.height = height * 4;

   context = canvasScaled.getContext( '2d' );
   context.scale( 4, 4 );
   context.drawImage( canvas, 0, 0 );

   image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
   imageData = image.data;

   for ( var i = 0, l = imageData.length; i < l; i += 4 ) {

     var v = ~ ~ ( Math.random() * 5 );

     imageData[ i ] += v;
     imageData[ i + 1 ] += v;
     imageData[ i + 2 ] += v;

   }

   context.putImageData( image, 0, 0 );

   return canvasScaled;

 }

 //

  animate() {
    requestAnimationFrame( this.animate.bind(this) );

    this.render();
    this.stats.update();
    /* requestAnimationFrame( this.animate.bind(this));
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.render();
    this.stats.update();
 */
  }

  render() {

    this.renderer.render( this.scene, this.camera );

  }

  onMouseMove( event ) {

    this.mouse.x = ( event.clientX  / this.renderer.domElement.clientWidth  ) * 2 - 1;
    this.mouse.y = - ( event.clientY / this.renderer.domElement.clientHeight ) * 2 + 1;
    this.raycaster.setFromCamera( this.mouse, this.camera );

   // See if the ray from the camera into the world hits one of our meshes
   var intersects = this.raycaster.intersectObject( this.mesh );

   // Toggle rotation bool for meshes that we clicked
   if ( intersects.length > 0 ) {

    this.helper.position.set( 0, 0, 0 );
    this.helper.lookAt( intersects[ 0 ].face.normal );

    this.helper.position.copy( intersects[ 0 ].point );

   }

  }
  onDocumentMouseDown(event) {

    event.preventDefault();

    this.mouse.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);

    this.raycaster.setFromCamera(this.mouse, this.camera);

    var intersects = this.raycaster.intersectObjects(this.objects);

    if (intersects.length == 0) {

      var intersect = intersects[0];

      // delete cube

      if (this.isShiftDown) {

        if (intersect.object !== this.plane) {

          this.scene.remove(intersect.object);

          this.objects.splice(this.objects.indexOf(intersect.object), 1);

        }

        // create cube

      } else {

        var voxel = new THREE.Mesh(this.cubeGeo, this.cubeMaterial);
        voxel.position.copy(intersect.point).add(intersect.face.normal);
        voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
        this.scene.add(voxel);

        this.objects.push(voxel);

      }

      this.render();

    }

     

  }
  renders() {
    //this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.renders.bind(this));
    // 更新帧动画的时间
    
    this.mixer.update(this.clock.getDelta());
  }

  start(type?) {
    let that = this;
    if (type){
      that.rollOverMesh.rotateY(Math.PI);//模型转向
    }
    
    let setInter = setInterval(function () {
      that.rollOverMesh.translateZ(5);
      if (that.rollOverMesh.position.z>10) {
        clearInterval(setInter);
        that.stop();
      }
    }, 200)
  }
  stop(){
    let that = this;
    that.rollOverMesh.rotateY(Math.PI);
    let setInter = setInterval(function () {
      that.rollOverMesh.translateZ(5);
      if (that.rollOverMesh.position.z < -1000) {
        clearInterval(setInter);
        
        that.start('AAA');
      }
    }, 200)
  }

}
