/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _src_perlinnoise__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/perlinnoise */ \"./src/perlinnoise.js\");\n\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_src_perlinnoise__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\r\n\n\n//# sourceURL=webpack://perlinnoise/./index.js?");

/***/ }),

/***/ "./src/perlinnoise.js":
/*!****************************!*\
  !*** ./src/perlinnoise.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Perlin)\n/* harmony export */ });\n\r\nconst dot = (v1, v2) => v1[0] * v2[0] + v1[1] * v2[1]\r\nconst interpolate = (a0, a1, w) => (a1 - a0) * ((w * (w * 6.0 - 15.0) + 10.0) * w * w * w) + a0\r\nconst randomGradient = (x, y) =>{\r\n   \r\n    const random = Math.random()* Math.PI  //((x * 10156) ^ (y * 15464)) & 255\r\n    return [Math.cos(random), Math.sin(random)]\r\n}\r\n\r\n\r\nconst quintic = t => t * t * t * (t * (t * 6 - 15) + 10)\r\nclass Perlin{\r\n    constructor(sizeX, sizeY,cellSize = 8){\r\n        this.sizeX = sizeX\r\n        this.sizeY = sizeY\r\n        this.numCellsX = sizeX / cellSize\r\n        this.numCellsY = sizeY / cellSize\r\n        this.cellSize = cellSize\r\n      \r\n    }\r\n    generateGradient(){\r\n        this.gradients = []\r\n        for(let i = 0; i < this.numCellsY + 1; i++){\r\n            for(let j = 0; j < this.numCellsX + 1; j++){\r\n                this.gradients.push(randomGradient())\r\n            }\r\n        }\r\n       \r\n    }\r\n   \r\n    noise(x, y){\r\n        const {cellSize, gradients, numCellsX, numCellsY} = this\r\n        const i = Math.floor(y / cellSize)\r\n        const j = Math.floor(x / cellSize)\r\n\r\n        const gradientTopLeft = gradients[i * numCellsX + j]\r\n        const gradientTopRight =  gradients[i * numCellsX + j + 1]\r\n        const gradientBottomLeft =  gradients[i * numCellsX + numCellsX + j]\r\n        const gradientBottomRight =  gradients[i * numCellsX + numCellsX + j + 1]\r\n        \r\n        let localX = (x % cellSize)/cellSize\r\n        let localY = (y % cellSize)/cellSize\r\n        \r\n        const fromTopLeft = [localX , localY]\r\n        const fromTopRight = [localX - 1, localY]\r\n        const fromBottomLeft = [localX, localY - 1]\r\n        const fromBottomRight = [localX - 1, localY - 1] \r\n        \r\n        const tx1 = dot(gradientTopLeft, fromTopLeft)\r\n        const tx2 = dot(gradientTopRight, fromTopRight)\r\n        const bx1 = dot(gradientBottomLeft, fromBottomLeft)\r\n        const bx2 = dot(gradientBottomRight, fromBottomRight)\r\n\r\n        \r\n        localX = quintic(localX)\r\n        localY = quintic(localY)\r\n        const tx = interpolate(tx1, tx2, localX)\r\n        const bx = interpolate(bx1, bx2, localX)\r\n        const p = interpolate(tx, bx, localY)\r\n        return (p )\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack://perlinnoise/./src/perlinnoise.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./index.js");
/******/ 	
/******/ })()
;