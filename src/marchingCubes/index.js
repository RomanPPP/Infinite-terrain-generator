import cases from "./cases";
import settings from "../settings";
const { XMIN, XMAX, YMIN, YMAX, ZMIN, ZMAX } = settings;

console.log(settings);

const EDGES = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

const VERTICES = [
  [0, 0, 0],
  [1, 0, 0],
  [1, 1, 0],
  [0, 1, 0],
  [0, 0, 1],
  [1, 0, 1],
  [1, 1, 1],
  [0, 1, 1],
];

const ADAPTIVE = true;

const adapt = (v0, v1) => {
  if (ADAPTIVE) return (0 - v0) / (v1 - v0);
  return 0.5;
};

const edgeToBoudnary = (edge, x, y, z, fEval) => {
  const [v0, v1] = EDGES[edge];
  const f0 = fEval[v0];
  const f1 = fEval[v1];

  const t0 = 1 - adapt(f0, f1);
  const t1 = 1 - t0;
  const vertPos0 = VERTICES[v0];
  const vertPos1 = VERTICES[v1];
  return [
    x + vertPos0[0] * t0 + vertPos1[0] * t1,
    y + vertPos0[1] * t0 + vertPos1[1] * t1,
    z + vertPos0[2] * t0 + vertPos1[2] * t1,
  ];
};

const singleCell = (f, x, y, z, size = 1) => {
  const fEval = [];
  for (let v = 0; v < 8; v++) {
    const vPos = VERTICES[v];
    fEval.push(f(x + vPos[0] * size, y + vPos[1] * size, z + vPos[2] * size));
  }
  let caseIndex = 0;
  for (let i = 0; i < 8; i++) {
    if (fEval[i] >= 0) caseIndex += 2 ** i;
  }
  const faces = cases[caseIndex];
  const positions = [];
  const indices = [];
  const normals = [];
  for (const face of faces) {
    const verts = []; //face.reduce((acc,edge) => acc = [...acc, ...edgeToBoudnary(edge,x,y,z, fEval)], []);
    for (const edge of face) {
      const [v0, v1] = EDGES[edge];
      const f0 = fEval[v0];
      const f1 = fEval[v1];

      const t0 = 1 - adapt(f0, f1);
      const t1 = 1 - t0;
      const vertPos0 = VERTICES[v0];
      const vertPos1 = VERTICES[v1];
      verts.push(
        x + vertPos0[0] * size * t0 + vertPos1[0] * size * t1,
        y + vertPos0[1] * size * t0 + vertPos1[1] * size * t1,
        z + vertPos0[2] * size * t0 + vertPos1[2] * size * t1
      );
    }
    const index = positions.length / 3 - 1;
    indices.push(index, index + 1, index + 2);
    positions.push(...verts);
  }
  return { positions, indices };
};

const marchingCubes = (
  f,
  xmin = XMIN,
  xmax = XMAX,
  ymin = YMIN,
  ymax = YMAX,
  zmin = ZMIN,
  zmax = ZMAX,
  size = 1
) => {
  const positions = [];
  const indices = [];
  for (let x = xmin; x < xmax; x += size)
    for (let y = ymin; y < ymax; y += size)
      for (let z = zmin; z < zmax; z += size) {
        const cell = singleCell(f, x, y, z, size);
        const offset = indices.length;
        positions.push(...cell.positions);
        indices.push(
          cell.indices[0] + offset,
          cell.indices[1] + offset,
          cell.indices[2] + offset
        );
      }
  return { positions, indices };
};

export default marchingCubes;
