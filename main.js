import { m4, vec3 } from "math";
const cPos = [0, 50, 5];
const cRot = [0, 0, 0];
const controls = {
  ArrowDown: () => (cRot[0] -= 0.1),
  ArrowUp: () => (cRot[0] += 0.1),
  ArrowLeft: () => (cRot[1] += 0.1),
  ArrowRight: () => (cRot[1] -= 0.1),
  w: () => {
    const delta = m4.transformPoint(
      m4.xRotate(m4.yRotation(cRot[1]), cRot[0]),
      [0, 0, -1]
    );
    cPos[0] += delta[0];
    cPos[1] += delta[1];
    cPos[2] += delta[2];
  },
  s: () => {
    const delta = m4.transformPoint(
      m4.xRotate(m4.yRotation(cRot[1]), cRot[0]),
      [0, 0, 1]
    );
    cPos[0] += delta[0];
    cPos[1] += delta[1];
    cPos[2] += delta[2];
  },
  a: () => {
    const delta = m4.transformPoint(
      m4.xRotate(m4.yRotation(cRot[1]), cRot[0]),
      [-1, 0, 0]
    );
    cPos[0] += delta[0];
    cPos[1] += delta[1];
    cPos[2] += delta[2];
  },
  d: () => {
    const delta = m4.transformPoint(
      m4.xRotate(m4.yRotation(cRot[1]), cRot[0]),
      [1, 0, 0]
    );
    cPos[0] += delta[0];
    cPos[1] += delta[1];
    cPos[2] += delta[2];
  },
};
const mouseControls = {
  lastX: 0,
  lastY: 0,
  mousemove: function (e) {
    const deltaX = e.offsetX - this.lastX;
    this.lastX = e.offsetX;
    const deltaY = e.offsetY - this.lastY;
    this.lastY = e.offsetY;

    cRot[1] -= deltaX * 0.005;
    cRot[0] -= deltaY * 0.005;
  },
};
document.onkeydown = (e) => {
  if (!controls[e.key]) return;
  controls[e.key]();
};
document.onmousedown = (e) => {
  mouseControls.lastY = e.offsetY;
  mouseControls.lastX = e.offsetX;
  document.onmousemove = mouseControls.mousemove.bind(mouseControls);
  document.onmouseup = () => {
    document.onmousemove = null;
  };
};
let cameraMatrix = m4.translation(...cPos);
cameraMatrix = m4.yRotate(cameraMatrix, cRot[1]);
cameraMatrix = m4.xRotate(cameraMatrix, cRot[0]);
import {
  ArrayDataFromGltf,
  PrimitiveRenderInfoFromArrayData,
  EntityDataFromGltf,
  getGlContext,
  resizeCanvasToDisplaySize,
  ProgramInfo,
  MeshRenderer,
  Drawer,
  createBox,
  PrimitiveRenderer,
  Texture,
  makeImgFromSvgXml,
  makeStripeImg,
  Entity,
  GLTF,
  GLcontextWrapper,
  createCone,
  createCircle,
  defaultShaders,
  pointLightShaders,
  createSphere,
  createTruncatedCone,
} from "graphics";
import shader from "./src/shader";

import Perlin from "./src/perlinnoise";
import marchingCubes from "./src/marchingCubes";
import dual_contour_3d from "./src/dualContour";
import Terrain from "./src/surfaceMesh";
import ChunkLoader from "./src/chunkLoader";
const circleFunc = (x, y, z) =>{
  return 2 - Math.sqrt(x*x + y*y + z*z)
}
const circleNormal = (x, y, z) =>{
  const l = Math.sqrt(x*x + y*y + z*z)
  return [-x / l, -y / l, -z / l]
}
const lol = (x, y, z) =>{
  return 48- Math.sqrt(x*x + y*y + z*z)
}


const noise128 = new Perlin(128)
const noise32 = new Perlin(126)
const f = (x,z) => (noise128.getValue(x, z)*0.5 +0.5) *60 
const terrain = new Terrain(f, 256, 3)
const chunk = terrain.getChunk(0,0)

const chunkLoader = new ChunkLoader(terrain)
chunkLoader.update(0,0)
console.log(chunkLoader.active)

//console.log(positions, indices)
const context = new GLcontextWrapper("canvas");
const gl = context.getContext();
context.resizeCanvasToDisplaySize();
const drawer = new Drawer();
drawer.setContext(context).update3DProjectionMatrix();

const defaultProgramInfo = new ProgramInfo(
  defaultShaders.vert,
  defaultShaders.frag
);

const programInfo = new ProgramInfo(
  shader.vert,
  shader.frag
)
const pointLightProgramInfo = new ProgramInfo(pointLightShaders.vert, pointLightShaders.frag)
pointLightProgramInfo.setContext(context).compileShaders().createUniformSetters();

defaultProgramInfo.setContext(context).compileShaders().createUniformSetters();
programInfo.setContext(context).compileShaders().createUniformSetters();

const primitive = new PrimitiveRenderer({
  mode: gl.POINTS,
  
  offset: 0,
  attributes : {
    POSITION : {
      location : 0,
      numComponents : 3,
      type : 5126,
      data : new Float32Array(chunk.positions ),
      count : chunk.positions.length 
    },
    NORMAL : {
      location : 1,
      numComponents : 3,
      type : 5126,
      data : new Float32Array(chunk.normals),
      count :  chunk.normals.length 
    }
  },
  componentType: 5123,
  numElements: chunk.indices.length,
  indices : new Uint16Array(chunk.indices)
});

primitive.setContext(context)
  .createVAO()
  .setDrawer(drawer)
  .setProgramInfo(pointLightProgramInfo)
  .createGeometryBuffers()
  .setAttributes()
  .setMode(4)

console.log(primitive)
const uniforms = {
  u_lightWorldPosition: [1, 20, 10],
  u_ambientLight: [1, 1, 0.3, 0.11],
  u_reverseLightDirection: [1, 0, 0],
  u_shininess: 300,
};

let lastCall = Date.now();
const fps = document.querySelector("#fps");
const pos = document.querySelector("#pos");

const loop = () => {
  const curentTime = Date.now();
  const delta = curentTime - lastCall;
  fps.textContent = (1 / delta) * 1000;
  pos.textContent = `${Math.floor(cPos[0])}; ${Math.floor(cPos[1])}; ${Math.floor(cPos[2])}`
  lastCall = curentTime;
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  cameraMatrix = m4.translation(...cPos);
  cameraMatrix = m4.yRotate(cameraMatrix, cRot[1]);
  cameraMatrix = m4.xRotate(cameraMatrix, cRot[0]);
  
  uniforms.u_lightWorldPosition = [ 0,50,0]
  chunkLoader.tick(cPos[0], cPos[2])
  
  for(const chunk of chunkLoader.active){

    primitive.bufferSubData('POSITION', new Float32Array(chunk.positions), null, gl.DYNAMIC_DRAW)
    .bufferSubData('NORMAL', new Float32Array(chunk.normals), null, gl.DYNAMIC_DRAW)
    .draw(
      {
        ...uniforms,
        u_matrix: m4.translation(0, 0, 0),
        u_color: [0.5, 0.3, 0.01, 1],
        u_worldViewPosition: cameraMatrix,
      },
      cameraMatrix
    );
  }
  
  
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  requestAnimationFrame(loop);
};
loop();