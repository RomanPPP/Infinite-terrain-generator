const path = require("path");

module.exports = {
  mode: "development",
  entry: "./main.js",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  module : {
    rules: [
      {
        test : /\.glsl/,
        type : 'asset/source'
      },
      {
        test: /\.jsx?$/, // определяем тип файлов
        exclude: /(node_modules)/,  // исключаем из обработки папку node_modules
        loader: "babel-loader",   // определяем загрузчик
        options:{
            presets:[ "@babel/preset-react"]    // используемые плагины
        }
    }
    ]
  }
};
