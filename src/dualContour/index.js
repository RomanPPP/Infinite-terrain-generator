import settings from "../settings";
console.log(settings)
const { ADAPTIVE, XMIN, XMAX, YMIN, YMAX, ZMIN, ZMAX } = settings

const flip = (arr, swap = true) => {
  if (!swap) return arr;
  return arr.map((_, i) => arr.at(-i));
};
const isInside = (x,y,z, f) =>
  f(x,y,z) !=0 &&
  f(x,y,z+1) !=0 &&
  f(x,y+1, z+1) !=0
  
const dual_contour_3d_find_best_vertex = (f, f_normal, x, y, z, step = 1) => {

  if (!ADAPTIVE) {
    //if(f(x , y , z )<=0) return null
    return [x + step*0.5, y + step*0.5, z + step*0.5];
  
  }

  // Evaluate f at each corner
  v = [
    [[], []],
    [[], []],
    [[], []],
    [[], []],
  ];
  for (let dx = 0; dx < 1; dx++)
    for (let dy = 0; dy < 1; dy++)
      for (let dz = 0; dz < 1; dz++)
        v[(dx, dy, dz)] = f(x + dx, y + dy, z + dz);
  console.log(v)
  //# For each edge, identify where there is a sign change.
  //# There are 4 edges along each of the three axes
  changes = [];
  for (let dx = 0; dx < 1; dx++)
    for (let dy = 0; dy < 1; dy++)
      if (v[(dx, dy, 0)] > 0 != v[(dx, dy, 1)] > 0)
        changes.append(
          (x + dx, y + dy, z + adapt(v[(dx, dy, 0)], v[(dx, dy, 1)]))
        );

  for (let dx = 0; dx < 1; dx++)
    for (let dz = 0; dz < 1; dz++)
      if (v[(dx, 0, dz)] > 0 != v[(dx, 1, dz)] > 0)
        changes.append(
          (x + dx, y + adapt(v[(dx, 0, dz)], v[(dx, 1, dz)]), z + dz)
        );

  for (let dy = 0; dy < 1; dy++)
    for (let dz = 0; dz < 1; dz++)
      if (v[(0, dy, dz)] > 0 != v[(1, dy, dz)] > 0)
        changes.append(
          (x + adapt(v[(0, dy, dz)], v[(1, dy, dz)]), y + dy, z + dz)
        );

  if (changes.length <= 1) return null;

  //# For each sign change location v[i], we find the normal n[i].
  //# The error term we are trying to minimize is sum( dot(x-v[i], n[i]) ^ 2)

  //# In other words, minimize || A * x - b || ^2 where A and b are a matrix and vector
  //# derived from v and n

  normals = [];
  for (const v of changes) {
    n = f_normal(v[0], v[1], v[2]);
    normals.push([n.x, n.y, n.z]);
  }

  return solve_qef_3d(x, y, z, changes, normals);
};
const dual_contour_3d = (
  f,
  f_normal,
  
  xmin = XMIN,
  xmax = XMAX,
  ymin = YMIN,
  ymax = YMAX,
  zmin = ZMIN,
  zmax = ZMAX,
  step = 1
) => {
  /*Iterates over a cells of size one between the specified range, and evaluates f and f_normal to produce
    a boundary by Dual Contouring. Returns a Mesh object.*/
  //# For each cell, find the the best vertex for fitting f
  const positions = [];
  const vertIndicesMap = {};
  const normals = []
  for (let x = xmin; x < xmax; x+=step)
    for (let y = ymin; y < ymax; y+=step)
      for (let z = zmin; z < zmax; z+=step) {
        
        const vert = dual_contour_3d_find_best_vertex(f, f_normal, x, y, z, step);
        if (!vert) continue;
        positions.push(...vert);
        normals.push(...f_normal(x,y,z))
        vertIndicesMap[`${x}_${y}_${z}`] = positions.length/3-1;
      }

  //# For each cell edge, emit an face between the center of the adjacent cells if it is a sign changing edge
  const indices = [];
  for (let x = xmin; x < xmax; x+=step)
    for (let y = ymin; y < ymax; y+=step)
      for (let z = ymin; z < zmax; z+=step) {
        if (x > xmin && y > ymin) {
          const solid1 = f(x, y, z + 0) > 0;
          const solid2 = f(x, y, z +step) > 0;
          if (solid1 != solid2) {
            indices.push(
              ...flip(
                [
                  vertIndicesMap[`${x - step}_${y - step}_${z}`],
                  vertIndicesMap[`${x - 0}_${y - step}_${z}`],
                  vertIndicesMap[`${x - 0}_${y - 0}_${z}`],
                ],
                solid2
              ),
              ...flip(
                [
                  vertIndicesMap[`${x - step}_${y - step}_${z}`],
                  vertIndicesMap[`${x - 0}_${y - 0}_${z}`],
                  vertIndicesMap[`${x - step}_${y - 0}_${z}`],
                ],
                solid2
              )
            );
          }
        }

        if (x > xmin && z > zmin) {
          const solid1 = f(x, y + 0, z) > 0;
          const solid2 = f(x, y + step, z) > 0;
          if (solid1 != solid2)
            indices.push(
              ...flip(
                [
                  vertIndicesMap[`${x - step}_${y}_${z - step}`],
                  vertIndicesMap[`${x - 0}_${y}_${z - step}`],
                  vertIndicesMap[`${x - 0}_${y}_${z - 0}`],
                ],
                solid1
              ),
              ...flip(
                [
                  vertIndicesMap[`${x - step}_${y}_${z - step}`],
                  vertIndicesMap[`${x - 0}_${y}_${z - 0}`],
                  vertIndicesMap[`${x - step}_${y}_${z - 0}`],
                ],
                solid1
              )
            );
        }

        if (y > ymin && z > zmin) {
          const solid1 = f(x + 0, y, z) > 0;
          const solid2 = f(x + step, y, z) > 0;
          if (solid1 != solid2)
            indices.push(
              ...flip(
                [
                  vertIndicesMap[`${x}_${y - step}_${z - step}`],
                  vertIndicesMap[`${x}_${y - 0}_${z - step}`],
                  vertIndicesMap[`${x}_${y - 0}_${z - 0}`],
                ],
                solid2
              ),
              ...flip(
                [
                  vertIndicesMap[`${x}_${y - step}_${z - step}`],
                  vertIndicesMap[`${x}_${y - 0}_${z - 0}`],
                  vertIndicesMap[`${x}_${y - step}_${z - 0}`],
                ],
                solid2
              )
            );
        }
      }

  return {positions, indices, normals};
};
export default dual_contour_3d