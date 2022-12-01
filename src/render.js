import { m4 } from "math";
import Perlin from "./perlinnoise";

import Terrain from "./surfaceMesh";
import ChunkLoader from "./chunkLoader";

import {
  ProgramInfo,
  Drawer,
  PrimitiveRenderer,
  GLcontextWrapper,
} from "graphics";
import shader from "./shader";

const programInfo = new ProgramInfo(shader.vert, shader.frag);

const context = new GLcontextWrapper("canvas");
const gl = context.getContext();

context.resizeCanvasToDisplaySize().setViewport();

const drawer = new Drawer();
drawer.setContext(context).update3DProjectionMatrix();

programInfo.setContext(context).compileShaders().createUniformSetters();

const chunkPrimitive = new PrimitiveRenderer({});

chunkPrimitive
  .setContext(context)
  .createVAO()
  .setDrawer(drawer)
  .setProgramInfo(programInfo)
  .createBufferAttribData("POSITION", "vec3", { location: 0 })
  .setOwnAttribute("POSITION")
  .createBufferAttribData("NORMAL", "vec3", { location: 1 })
  .setOwnAttribute("NORMAL")
  .setMode(1);

const draw = (cameraPosition, cameraRotation, chunkLoader) => {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  let cameraMatrix = m4.translation(...cameraPosition);
  cameraMatrix = m4.yRotate(cameraMatrix, cameraRotation[1]);
  cameraMatrix = m4.xRotate(cameraMatrix, cameraRotation[0]);

  chunkLoader.tick(cameraPosition[0], cameraPosition[2]);

  for (const chunk of chunkLoader.active) {
    chunkPrimitive
      .bufferData(
        "POSITION",
        new Float32Array(chunk.positions),
        null,
        gl.DYNAMIC_DRAW
      )
      .bufferData(
        "NORMAL",
        new Float32Array(chunk.normals),
        null,
        gl.DYNAMIC_DRAW
      )
      .draw(
        {
          u_matrix: m4.translation(0, 0, 0),
          u_worldViewPosition: cameraMatrix,
        },
        cameraMatrix
      );
  }
};

const updateTerrainGenerator = ({
  amplitude,
  octaveSize,
  discretization,
  chunkSize,
}) => {
  const noise = new Perlin(octaveSize);
  const func = (x, z) => (noise.getValue(x, z) * 0.5 + 0.5) * amplitude;

  const terrain = new Terrain(func, chunkSize, discretization);
  const chunk = terrain.getChunk(0, 0);

  chunkPrimitive.setIndices(chunk.indices);

  const chunkLoader = new ChunkLoader(terrain);

  return chunkLoader;
};

export { draw, updateTerrainGenerator };
