var CUBES_PER_AXIS = 3;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var matrix = new THREE.Matrix4();
var renderer = new THREE.WebGLRenderer();

var m1 = new THREE.Matrix4();
var m2 = new THREE.Matrix4();
var m3 = new THREE.Matrix4();

var cameraSpeed = {
  rate: 0.01,
  x: 0,
  y: 0,
  z: 0
};

camera.position.z = 5;
camera.position.x = 3;
camera.position.y = 3;
camera.lookAt(new THREE.Vector3(0, 0, 0));

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement);

var Rubik = function (cubesPerAxis) {
  this.cubesPerAxis = cubesPerAxis;
  this.cubes = this.createCubes();
};

/**
* Get the G series number at index i.
* @param {Number} i
* @return {Number}
*/
Rubik.prototype.indexToG = function (i) {
  var g = 0;

  if (i > 0) {
    g = Math.floor(i / 2);

    if (i % 2 === 0) {
      g *= -1;
    } else {
      g += 1;
    }
  }

  return g;
};

Rubik.prototype.createCubes = function () {

  var size = 0.8;
  var geometry = new THREE.BoxGeometry(size, size, size);

  var applyColorsToGeometry = function (geometry) {
    var colors = [
      // blue
      new THREE.Color(0, 0, 1),
      // green
      new THREE.Color(0x29dd00),
      // white
      new THREE.Color(1, 1, 1),
      // yellow
      new THREE.Color(0xffff00),
      // red
      new THREE.Color(1, 0, 0),
      // orange
      new THREE.Color(1, 0.5, 0),
    ];

    var i = 0;
    var max = geometry.faces.length / 2;

    for (; i < max; i++) {
      geometry.faces[i * 2].color = colors[i];
      geometry.faces[i * 2 + 1].color = colors[i];
    }
  };

  var material = new THREE.MeshBasicMaterial({
    // wireframe: true,
    vertexColors: THREE.VertexColors
  });

  var cubes = [];
  
  var makeItem = function (gx, gy, gz) {
    var item = new THREE.Mesh(geometry, material);

    var x = gx * spacing;
    var y = gy * spacing;
    var z = gz * spacing;

    item.cubeInfo = {
      x: gx,
      y: gy,
      z: gz
    };

    item.position.x = x;
    item.position.y = y;
    item.position.z = z;

    scene.add(item);

    cubes.push(item);
  };

  var x, y, z;
  var spacing = size * 1.2;
  var gx, gy, gz;

  applyColorsToGeometry(geometry);

  for (x = 0; x < CUBES_PER_AXIS; x++) {
    gx = this.indexToG(x);
    
    for (y = 0; y < CUBES_PER_AXIS; y++) {
      gy = this.indexToG(y);
      
      for (z = 0; z < CUBES_PER_AXIS; z++) {
        gz = this.indexToG(z);

        makeItem(gx, gy, gz);
      }  
    }  
  }

  return cubes;
};

Rubik.prototype.getPlane = function (rotationAxis, g) {
  var planeCubes = [];

  this.cubes.forEach(function (cube) {
    if (cube.cubeInfo[rotationAxis] === g) {
      planeCubes.push(cube);
    }
  });

  return new Plane(planeCubes, rotationAxis);
};

/**
* @param {Number} x
* @param {Number} y
* @param {Number} z
* @return {Cube}
*/
Rubik.prototype.getCubeByCoords = function (x, y, z) {
  var theCube;
  this.cubes.forEach(function (cube) {
    if (!theCube) {
      if (cube.cubeInfo.x === x &&
        cube.cubeInfo.y === y &&
        cube.cubeInfo.z === z) {
        theCube = cube;
      }
    }
  });

  return theCube;
};

Rubik.prototype.rotatePlane = function (rotationAxis, index, counter) {
  var plane = this.getPlane(rotationAxis, index);
  if (!this.turningPlane) {
    this.turningPlane = plane;
    plane.rotate(counter);
  }
};

Rubik.prototype.render = function () {
  if (this.turningPlane) {
    if (!this.turningPlane.applyRotation()) {
      this.turningPlane = null;
    }
  }
};

Rubik.prototype.R = function () {
  this.rotatePlane('x', this.indexToG(this.cubesPerAxis - 2), true);
};

Rubik.prototype.L = function () {
  this.rotatePlane('x', this.indexToG(this.cubesPerAxis - 1));
};

Rubik.prototype.U = function () {
  this.rotatePlane('y', this.indexToG(this.cubesPerAxis - 2), true);
};

Rubik.prototype.D = function () {
  this.rotatePlane('y', this.indexToG(this.cubesPerAxis - 1));
};

Rubik.prototype.F = function () {
  this.rotatePlane('z', this.indexToG(this.cubesPerAxis - 2), true);
};

Rubik.prototype.B = function () {
  this.rotatePlane('z', this.indexToG(this.cubesPerAxis - 1));
};

var Plane = function (cubes, rotationAxis) {
  this.cubes = cubes;
  this.rotationAxis = rotationAxis;
  this.rotation = {
    x: 0,
    y: 0,
    z: 0
  };
};

Plane.prototype.info = function () {
  var cubeInfo = [];
  this.cubes.forEach(function (cube) {
    cubeInfo.push(cubes.indexOf(cube));
    console.log(cube.cubeInfo.x, cube.cubeInfo.y, cube.cubeInfo.z);
  });
  console.log(cubeInfo);
};

Plane.prototype.quarterTurn = function (coords, axis, counter) {
  var negate;

  var turned = {};

  if (axis === 'z') {
    turned = {
      x: coords.y,
      y: coords.x,
      z: coords.z
    };

    negate = counter ? 'y' : 'x';

  } else if (axis === 'x') {
    turned = {
      x: coords.x,
      y: coords.z,
      z: coords.y
    };

    negate = counter ? 'z' : 'y';

  } else if (axis === 'y') {
    turned = {
      x: coords.z,
      y: coords.y,
      z: coords.x
    };

    negate = counter ? 'x' : 'z';

  }
  
  turned[negate] *= -1;

  return turned;
};

Plane.prototype.applyRotation = function () {
  var matrix = new THREE.Matrix4();
  var updateCubeInfo;
  var amount = this.rotationSpeed;
  var stillTurning = true;

  switch (this.rotationAxis) {
    case 'x':
      matrix.makeRotationX(amount);
      break;
    case 'y':
      matrix.makeRotationY(amount);
      break;
    case 'z':
      matrix.makeRotationZ(amount);
      break;
  }

  if (Math.abs(this.rotation[this.rotationAxis] + amount) >= Math.PI / 2) {
    matrix = this.snapRotation(matrix);
    stillTurning = false;
    updateCubeInfo = true;
  } else {
    this.rotation[this.rotationAxis] += amount;
  }

  this.cubes.forEach(function (cube) {
    cube.applyMatrix(matrix);
    if (updateCubeInfo && this.rotation[this.rotationAxis]!== 0) {
      cube.cubeInfo = this.quarterTurn(cube.cubeInfo, this.rotationAxis, this.counter);
    }
  }, this);

  return stillTurning;
};

Plane.prototype.snapRotation = function (matrix) {
  var rotation = this.rotation[this.rotationAxis];
  var distanceLeft = (Math.PI / 2) - Math.abs(rotation);
  var rotationDirection = rotation < 0 ? -1 : 1;

  return matrix['makeRotation' + this.rotationAxis.toUpperCase()](distanceLeft * rotationDirection);
};

Plane.prototype.rotate = function (counter) {
  var amount = 0.1;
  if (counter) {
    amount *=-1;
  }
  this.counter = counter;
  this.rotationSpeed = amount;
};

var rubik = new Rubik(CUBES_PER_AXIS);

(function render () {
  requestAnimationFrame(render);
  renderer.render(scene, camera);

  if (cameraSpeed.x || cameraSpeed.y) {
    m1.makeRotationX(cameraSpeed.x);
    m2.makeRotationY(cameraSpeed.y);
    matrix.multiplyMatrices(m1, m2);
    camera.applyMatrix(matrix);
  }

  rubik.render();
}());

// ================================================
$('body').on('keydown', function (e) {
  var axis;
  var direction;
  var speed;

  switch (e.which) {
    case 37:
    case 38:
      direction = -1;
      break;
    case 39:
    case 40:
      direction = 1;
      break;

    case 82:
      rubik.R();
      break;
    case 76:
      rubik.L();
      break;
    case 85:
      rubik.U();
      break;
    case 68:
      rubik.D();
        break;
    case 70:
      rubik.F();
        break;
    case 66:
      rubik.B();
        break;
  }

  switch (e.which) {
    case 37:
    case 39:
      axis = 'y';
      break;
    case 38:
    case 40:
      axis = 'x';
      break;
  }

  if (axis && direction) {
    speed = cameraSpeed.rate * direction;
    cameraSpeed[axis] += speed;
  }
});