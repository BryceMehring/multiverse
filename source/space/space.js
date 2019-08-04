import * as THREE from 'three';
import ships from '../assets/images/ships.png';
import spaceStationNormal from '../assets/images/space-station-normal.png';
import spaceStation from '../assets/images/space-station.png';
import { Random } from '../utils/random';
import { MaterialManager } from './materialManager';
import { Ship } from './ship';
import { Sprite } from './sprite';


export class Space {
  constructor(params) {
    this.shipList = [];
    this.configureThreeJS()
        .configureInput()
        .loadTextures()
        .buildLights()
        .buildWorld();
  }

  run() {

    function updateIndex(sprite, min, max) {
    	let index = sprite.index + 1;
    	if(index > max) {
    		index = min;
    	}
    	sprite.setIndex(index);
    }

    this.spaceStationGroup.children.forEach(function(station) {
      window.setInterval(updateIndex, 2000, station, 1, 3);
    });

    this.clock = new THREE.Clock(true);
    this.animate();
  }

  animate() {
    let space = this;
    let delta = this.clock.getDelta();
    requestAnimationFrame(function() {
      space.animate();
    });
    this.render(delta);
  }

  render(delta) {
    this.raycaster.setFromCamera( this.mouse, this.camera );
    let intersects = this.raycaster.intersectObjects( this.scene.children, true);

    if(this.intersected) {
      this.intersected.forEach(function(intersectedObject) {
        intersectedObject.object.geometry.setColor({r: 1, g: 1, b: 1});
      });
      this.intersected = null;
    }

    if(this.mouseDown) {
      if(intersects.length > 0) {
        intersects.forEach(function(intersectedObject) {
          intersectedObject.object.geometry.setColor({r: 1, g: 0.2, b: 0.2});
        });
        this.intersected = intersects;
      }
    }

    this.spaceStationGroup.rotation.z += 0.1 * delta;
    this.spaceStationGroup.children.forEach(function(station) {
      station.rotation.z += station.userData.rotationSpeed * delta;
    });

    this.shipList.forEach(function(ship) {
      ship.update(delta);
    });

    this.renderer.render( this.scene, this.camera );
  }

  configureThreeJS() {
    this.WIDTH = window.innerWidth;
    this.HEIGHT = window.innerHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 90, this.WIDTH/this.HEIGHT, 0.1, 1000 );
    this.camera.position.z = 8;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( this.WIDTH, this.HEIGHT );

    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    this.gameElement = document.getElementById('game');
    this.gameElement.appendChild(this.renderer.domElement);

    return this;
  }

  configureInput() {
    let space = this;
    function onWheelEvent(event) {
      let deltaY = event.deltaY > 0 ? 1 : -1;
      space.camera.position.z += deltaY;
    }

    function onMouseDown(event) {
      event.preventDefault();
      space.mouseDown = true;
    }

    function onMouseUp(event) {
      event.preventDefault();
      space.mouseDown = false;
    }

    function onMouseMove( event ) {
    	event.preventDefault();

    	space.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    	space.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }

    function onWindowResize() {
    	space.camera.aspect = window.innerWidth / window.innerHeight;
    	space.camera.updateProjectionMatrix();
    	space.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    this.gameElement.addEventListener('wheel', onWheelEvent, false);
    this.gameElement.addEventListener('mousedown', onMouseDown, false);
    this.gameElement.addEventListener('mouseup', onMouseUp, false);
    this.gameElement.addEventListener( 'mousemove', onMouseMove, false );
    window.addEventListener( 'resize', onWindowResize, false );

    return this;
  }

  loadTextures() {
    MaterialManager.addTexture({
      key: 'ship',
    	texture: ships,
    	tilesHorizontal: 4,
    	tilesVerticle: 4
    });

    MaterialManager.addTexture({
      key: 'space-station',
      texture: spaceStation,
      normal: spaceStationNormal,
      tilesHorizontal: 2,
      tilesVerticle: 2,
      specular: 0x55555555,
      shininess: 40
    });

    return this;
  }

  buildLights() {
    let directionalLight = new THREE.DirectionalLight( 0xbbffff, 0.4 );
    directionalLight.position.set( 1, 1, 2 );
    this.scene.add( directionalLight );

    return this;
  }

  buildWorld() {
    this.spaceStationGroup = new THREE.Object3D();
    this.scene.add(this.spaceStationGroup);

    for(let i = 0; i < 3; ++i) {
      let spaceStation = new Sprite('space-station', THREE.Math.randInt(1, 3));
      let scale = THREE.Math.randFloat(2, 3);
      spaceStation.position.set(THREE.Math.randFloat(-8, 8), THREE.Math.randFloat(-8, 8), THREE.Math.randFloat(2, 4));
      spaceStation.scale.set(scale, scale, 1);
      spaceStation.rotation.z = Random.getRandAngle();
      spaceStation.userData.rotationSpeed = THREE.Math.randInt(0, 1) ? THREE.Math.randFloat(-1, 0.5) : THREE.Math.randFloat(0.5, 1)
      this.spaceStationGroup.add(spaceStation);
    }

    this.spaceStationGroup.children[0].position.set(0, 0, 5);

    for(let i = 0; i < 250; ++i) {
    	let ship = new Ship();
    	this.scene.add(ship);
    	this.shipList.push(ship);
    }

    return this;
  }

  static defaultSpace() {
    return new Space();
  }
}
