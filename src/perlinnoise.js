
const dot = (v1, v2) => v1[0] * v2[0] + v1[1] * v2[1]
const interpolate = (a0, a1, w) => (a1 - a0) * ((w * (w * 6.0 - 15.0) + 10.0) * w * w * w) + a0
const randomGradient = (x, y) =>{
   
    const random = Math.random()* Math.PI  //((x * 10156) ^ (y * 15464)) & 255
    return [Math.cos(random), Math.sin(random)]
}


const quintic = t => t * t * t * (t * (t * 6 - 15) + 10)
export default class Perlin{
    constructor(sizeX, sizeY,cellSize = 8){
        this.sizeX = sizeX
        this.sizeY = sizeY
        this.numCellsX = sizeX / cellSize
        this.numCellsY = sizeY / cellSize
        this.cellSize = cellSize
      
    }
    generateGradient(){
        this.gradients = []
        for(let i = 0; i < this.numCellsY + 1; i++){
            for(let j = 0; j < this.numCellsX + 1; j++){
                this.gradients.push(randomGradient())
            }
        }
       
    }
   
    noise(x, y){
        const {cellSize, gradients, numCellsX, numCellsY} = this
        const i = Math.floor(y / cellSize)
        const j = Math.floor(x / cellSize)

        const gradientTopLeft = gradients[i * numCellsX + j]
        const gradientTopRight =  gradients[i * numCellsX + j + 1]
        const gradientBottomLeft =  gradients[i * numCellsX + numCellsX + j]
        const gradientBottomRight =  gradients[i * numCellsX + numCellsX + j + 1]
        
        let localX = (x % cellSize)/cellSize
        let localY = (y % cellSize)/cellSize
        
        const fromTopLeft = [localX , localY]
        const fromTopRight = [localX - 1, localY]
        const fromBottomLeft = [localX, localY - 1]
        const fromBottomRight = [localX - 1, localY - 1] 
        
        const tx1 = dot(gradientTopLeft, fromTopLeft)
        const tx2 = dot(gradientTopRight, fromTopRight)
        const bx1 = dot(gradientBottomLeft, fromBottomLeft)
        const bx2 = dot(gradientBottomRight, fromBottomRight)

        
        localX = quintic(localX)
        localY = quintic(localY)
        const tx = interpolate(tx1, tx2, localX)
        const bx = interpolate(bx1, bx2, localX)
        const p = interpolate(tx, bx, localY)
        return (p )
    }
}
