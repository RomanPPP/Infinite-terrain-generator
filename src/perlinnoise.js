
const dot = (v1, v2) => v1[0] * v2[0] + v1[1] * v2[1]
const sum = (v1, v2) => [v1[0] + v2[0], v1[1] + v2[1]]
const diff = (v1, v2) => [v1[0] - v2[0], v1[1] - v2[1]]
const cross = (v1, v2) =>{

}
const scale = (v, fac) => [v[0] * fac, v[1] * fac] 
const interpolate = (a0, a1, w) => (a1 - a0) * ((w * (w * 6.0 - 15.0) + 10.0) * w * w * w) + a0
const randomGradient = (x, y) =>{
   
    const random = (Math.random())* Math.PI //((x * 10156) ^ (y * 15464)) & 255
    return [Math.cos(random), Math.sin(random)]
}


const quintic = t => t * t * t * (t * (t * 6 - 15) + 10)
export default class Perlin{
    constructor(cellSize){
       
        this.cellSize = cellSize

        this.gradientsMap = new Map()
        this.cache = new Map()
    }
  
    getGradient(x, y){
        const grad = this.gradientsMap.get(`${x}_${y}`)
        
        if(grad) return grad
        const _grad = randomGradient(x, y)
        this.gradientsMap.set(`${x}_${y}`, _grad)
        return _grad
    }
    getCell(x, y){
        const {cellSize} = this
        const v0 = [Math.floor(x/cellSize)* cellSize, Math.floor(y/cellSize)* cellSize]
        const v1 = sum(v0, [cellSize,0])
        const v2 = sum(v0, [cellSize,cellSize])
        const v3 = sum(v0, [0,cellSize])
        return [v0, v1, v2, v3]
    }
    getValue(x, y){
        const val = this.cache.get(`${x}_${y}`)
        if(val) return val
        const {cellSize, gradientsMap} = this
        const [topLeft,topRight, bottomRight, bottomLeft] = this.getCell(x, y)
        const gradientTopLeft = this.getGradient(...topLeft)
        const gradientTopRight =  this.getGradient(...topRight)
        const gradientBottomLeft = this.getGradient(...bottomLeft)
        const gradientBottomRight =  this.getGradient(...bottomRight)
        
        /*console.log(v0,v1,v2,v3)
        console.log(gradientTopLeft, gradientTopRight, gradientBottomLeft,gradientBottomRight  )
        throw 1*/
        const _v0 = [Math.floor(x/cellSize)* cellSize, Math.floor(y/cellSize)* cellSize]
        const v =[x, y ]
        let [localX, localY] = scale(diff(v, _v0), 1/cellSize)
        
        //console.log(localX, localY)
        //console.log(bottomLeft,bottomRight, topRight, topLeft)
       // console.log(this.gradientsMap)
        const fromTopLeft = scale(diff(v, topLeft), 1/cellSize)
        const fromTopRight = scale(diff(v, topRight),1/cellSize)
        const fromBottomLeft = scale(diff(v, bottomLeft),1/cellSize)
        const fromBottomRight = scale(diff(v, bottomRight),1/cellSize)
        
        const tx1 = dot(gradientTopLeft, fromTopLeft)
        const tx2 = dot(gradientTopRight, fromTopRight)
        const bx1 = dot(gradientBottomLeft, fromBottomLeft)
        const bx2 = dot(gradientBottomRight, fromBottomRight)

        
        //console.log(fromTopLeft, fromTopRight, fromBottomLeft, fromBottomRight)
        //console.log(tx1, tx2, bx1, bx2)

        //localX = quintic(localX)
        //localY = quintic(localY)
        const tx = interpolate(tx1, tx2, localX)
        const bx = interpolate(bx1, bx2, localX)
        const p = interpolate(tx, bx, localY)
        const normal = []
        this.cache.set(`${x}_${y}`)
        return p

    }
    
}
