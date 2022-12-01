
const set1 = [
    [0, 0],
    [1,1],
    [0,1],
    [-1,1],
    [1,0],
    [1,-1],
    [0, -1],
    [-1,-1],
    [-1,0]
]

export default class ChunkLoader{
    constructor(surfaceMesh){
        this.surfaceMesh = surfaceMesh
        this.chunkSize = surfaceMesh.chunkSize
        this.active = new Set
        this.dist = 6
        this.lastX = 0
        this.lastZ = 0
        this.needToUpdate = false
    }
    update(x,z){

        const {active, dist, surfaceMesh, chunkSize} = this
        this.lastX = Math.floor(x)
        this.lastZ = Math.floor(z)
        for(const offset of set1){
  
            const chunk = surfaceMesh.getChunk(x + offset[0], z+ offset[1])
            active.add(chunk)
        }
        for(const chunk of active){
            
            if(Math.abs(chunk.x - x)> 2 || Math.abs(chunk.z - z) > 3 )
                active.delete(chunk)
        }
    }
    tick(x,z){
        const {chunkSize, lastX, lastZ} = this
       
        const _x = Math.floor(x/chunkSize) 
        const _z = Math.floor(z/chunkSize) 
        if(_x != lastX || _z !=lastZ)
        {
            this.update(_x, _z)
            this.needToUpdate = true
        }
            

    }   
}