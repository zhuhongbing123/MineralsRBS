import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as THREE from '../../../../assets/js/three.module.js';

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
  mouse = new THREE.Vector2();
  cube;
  selectedObjects = [];
  outlinePass;
  objects= [];
  constructor() { }
  ngOnInit() {
   
    this.init();
    this.animate();
  }
  init() {
 
    this.container = document.getElementById( 'container' );
    this.container.innerHTML = "";

    
    this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 5000 );
    this.camera.position.z = 1000;

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
        

        var geometry = new THREE.BoxBufferGeometry( 40, 40, 40 );

				for ( var i = 0; i < 200; i ++ ) {

					var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

					object.position.x = Math.random() * 1000 - 500;
					object.position.y = Math.random() * 600 - 300;
					object.position.z = Math.random() * 800 - 400;

					object.rotation.x = Math.random() * 2 * Math.PI;
					object.rotation.y = Math.random() * 2 * Math.PI;
					object.rotation.z = Math.random() * 2 * Math.PI;

					object.scale.x = Math.random() * 2 + 1;
					object.scale.y = Math.random() * 2 + 1;
					object.scale.z = Math.random() * 2 + 1;

					object.castShadow = true;
					object.receiveShadow = true;

					this.scene.add( object );

					this.objects.push( object );

        }
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

   var geometry = new THREE.PlaneBufferGeometry( 7500, 7500, this.worldWidth - 1, this.worldDepth - 1 );
   geometry.rotateX( - Math.PI / 2 );

   let vertices = geometry.attributes.position.array;

   for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {

    vertices[ j + 1 ] = data[ i ] * 10;

   }

   geometry.computeFaceNormals(); // needed for helper

   //

   this.texture = new THREE.CanvasTexture( this.generateTexture( data, this.worldWidth, this.worldDepth ) );
   this.texture.wrapS = THREE.ClampToEdgeWrapping;
   this.texture.wrapT = THREE.ClampToEdgeWrapping;

   this.mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: this.texture } ) );
   this.scene.add( this.mesh );

   var geometrys = new THREE.ConeBufferGeometry( 20, 100, 3 );
   geometrys.translate( 0, 50, 0 );
   geometrys.rotateX( Math.PI / 2 );
   this.helper = new THREE.Mesh( geometrys, new THREE.MeshNormalMaterial() );
   //this.scene.add( this.helper );
   var skyBoxGeometry = new THREE.BoxGeometry( 150, 150, 150 );  
   var texture = new THREE.TextureLoader().load("../../../../assets/img/location_icon/icon8.jpg");  
//设置颜色线框显示否
var cubeMaterial = new THREE.MeshBasicMaterial({ map:texture });
 this.cube = new THREE.Mesh(skyBoxGeometry,cubeMaterial);
 
//设置cube的位置 
this.cube.position.x=140;
this.cube.position.y = 920;
this.cube.position.z=1000;
 
//cube添加到场景中

     
   this.scene.add(this.cube);  

   /* var x = 0, y = 0;
   var triangleShape = new THREE.Shape()
					.moveTo( 100, 20 )
					.lineTo( 40, 80 )
					.lineTo( 120, 80 )
					.lineTo( 80, 20 ); // close path
   var geometry = new THREE.ShapeBufferGeometry( triangleShape );

   var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: 0xff0000, side: THREE.DoubleSide } ) );
   mesh.position.set( 150, 900, 1000 );
   mesh.rotation.set( 0, 0, 0 );
   mesh.scale.set( 2, 2, 2 );
   this.scene.add( mesh );
   
   //三角形
var vertice = new Float32Array( [
  // 三角形1 - 三个顶点 
  -10 ,10, 0,
  -10 ,-10, 0,
  10 , -10, 0,
] );
var geometry = new THREE.BufferGeometry();
//增加坐标点，坐标点是X,Y,Z的布局，可以自己任意设置
geometry.addAttribute( 'position', new THREE.BufferAttribute( vertice, 3 ) );
//材质
var material = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.DoubleSide } );

var mesh = new THREE.Mesh( geometry, material );
mesh.position.set( 1050, 900, 1000 );
mesh.scale.set( 8, 8, 8 );
this.scene.add(mesh);


this.outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), this.scene, this.camera );
   let that = this;
   this.container.addEventListener( 'mousemove', function(){
     that.onMouseMove(event)
   }, false );
   this.stats = new Stats();
   //this.container.appendChild( this.stats.dom );

   //

   window.addEventListener( 'resize', this.onWindowResize, false );
   document.addEventListener("mousedown", (event) => {

     let aa = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
   });
   window.addEventListener( 'mousemove', function(){
     that.onTouchMove(event)
    } );
    window.addEventListener( 'touchmove', function(){
      that.onTouchMove(event) 

    });  */
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


}
