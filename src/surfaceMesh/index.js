import { vec3 } from "math";

export default class Terrain {
  constructor(func, chunkSize = 4, faceSize = 4) {
    this.func = func;
    this.chunks = new Map();
    this.chunkSize = chunkSize;
    this.faceSize = faceSize;
    this.vertIndicesMap = new Map
    this.normalsIndicesMap = new Map()
  }
  generateChunk(xChunk, zChunk) {
    const { chunkSize, faceSize, func } = this;
    const positions = [];
    const normals = [];
    const xStart = xChunk * chunkSize;
    const zStart = zChunk * chunkSize;
    const vertIndicesMap = new Map()
    const normalsIndicesMap = new Map()
    const indices = []
    for (let xx = 0; xx < chunkSize + faceSize; xx += faceSize)
      for (let zz = 0; zz < chunkSize + faceSize; zz += faceSize)
      {
        const x = xx + xStart
        const z = zz + zStart
        const y = func(x, z)

        const x2 = x + faceSize
        const z2 = z + faceSize
        const y2 = func(x2,z2)
        const y3 = func(x,z2)
        const normal =  vec3.normalize(vec3.cross(vec3.diff([x,y,z], [x2,y2,z2]),vec3.diff([x,y,z], [x,y3,z2])));

        vertIndicesMap.set(`${xx}_${zz}`, positions.length/3)
        positions.push(x,y,z)
        normals.push(...normal)
      }
      for (let xx = 0; xx < chunkSize; xx += faceSize)
        for (let zz = 0; zz < chunkSize ; zz += faceSize) {
            const x = xx + xStart
            const z = zz + zStart
            const v1 = vertIndicesMap.get(`${xx}_${zz}`);
            const v2 = vertIndicesMap.get(`${xx + faceSize}_${zz}`);
            const v3 = vertIndicesMap.get(`${xx + faceSize}_${zz + faceSize}`);
            const v4 = vertIndicesMap.get(`${xx}_${zz + faceSize}`);
            
            indices.push(v3, v2, v1,  v1, v4, v3);
        
      }
    return { positions, normals, indices, x : xChunk, z : zChunk};
  }
  getChunk(x, z) {
    const key = `${x}_${z}`;
    let chunk = this.chunks.get(key);
    if (chunk) return chunk;
    chunk = this.generateChunk(x, z);
    this.chunks.set(key, chunk);
    return chunk;
  }
}
