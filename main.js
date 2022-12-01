import {m4} from 'math'
import { draw, updateTerrainGenerator } from './src/render';
import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './ui/App.jsx';
const cameraPosition = [0, 70, 5];
const cameraRotation = [0, 0, 0];
const controls = {
  ArrowDown: () => (cameraRotation[0] -= 0.1),
  ArrowUp: () => (cameraRotation[0] += 0.1),
  ArrowLeft: () => (cameraRotation[1] += 0.1),
  ArrowRight: () => (cameraRotation[1] -= 0.1),
  w: () => {
    const delta = m4.transformPoint(
      m4.xRotate(m4.yRotation(cameraRotation[1]), cameraRotation[0]),
      [0, 0, -1]
    );
    cameraPosition[0] += delta[0];
    cameraPosition[1] += delta[1];
    cameraPosition[2] += delta[2];
  },
  s: () => {
    const delta = m4.transformPoint(
      m4.xRotate(m4.yRotation(cameraRotation[1]), cameraRotation[0]),
      [0, 0, 1]
    );
    cameraPosition[0] += delta[0];
    cameraPosition[1] += delta[1];
    cameraPosition[2] += delta[2];
  },
  a: () => {
    const delta = m4.transformPoint(
      m4.xRotate(m4.yRotation(cameraRotation[1]), cameraRotation[0]),
      [-1, 0, 0]
    );
    cameraPosition[0] += delta[0];
    cameraPosition[1] += delta[1];
    cameraPosition[2] += delta[2];
  },
  d: () => {
    const delta = m4.transformPoint(
      m4.xRotate(m4.yRotation(cameraRotation[1]), cameraRotation[0]),
      [1, 0, 0]
    );
    cameraPosition[0] += delta[0];
    cameraPosition[1] += delta[1];
    cameraPosition[2] += delta[2];
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

    cameraRotation[1] -= deltaX * 0.005;
    cameraRotation[0] -= deltaY * 0.005;
  },
};
const canvas = document.getElementById('canvas')
document.onkeydown = (e) => {
  if (!controls[e.key]) return;
  controls[e.key]();
};
canvas.onmousedown = (e) => {
  mouseControls.lastY = e.offsetY;
  mouseControls.lastX = e.offsetX;
  canvas.onmousemove = mouseControls.mousemove.bind(mouseControls);
  canvas.onmouseup = () => {
    canvas.onmousemove = null;
  };
};

const defaultParams = {
    amplitude :10,
    octaveSize : 64,
    discretization : 10,
    chunkSize : 128
}
const paramsDescription = {
    amplitude : {
        max : 150,
        min : 1,
        step : 1,
        name : 'Amplitude'
    },
    octaveSize : {
        max : 256,
        min : 1,
        step : 1,
        name : 'Octave size'
    },
    discretization : {
        max : 100,
        min : 2,
        step : 1,
        name : 'Surface discretization'
    },
    chunkSize : {
        max : 256,
        min : 32,
        step : 16,
        name : 'Chunk size'
    }
}

let chunkLoader = updateTerrainGenerator(defaultParams)

chunkLoader.update(cameraPosition[0],cameraPosition[2])



const updateChunkLoader = (params) =>{
 
    chunkLoader = updateTerrainGenerator(params)
    chunkLoader.update(cameraPosition[0],cameraPosition[2])
}
const root = ReactDOM.createRoot(document.getElementById('ui'))


root.render(<App 
                updateMesh={updateChunkLoader}
                defaultMeshParams = {defaultParams}
                paramsDescription = {paramsDescription}
                >
            </App>)

const render = ()=>{
    draw(cameraPosition, cameraRotation, chunkLoader)
    requestAnimationFrame(render)
}
render()