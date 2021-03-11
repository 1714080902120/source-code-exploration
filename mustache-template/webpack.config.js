const path = require('path')

module.exports = {
  // 入口文件
  entry: './src/index.js',
  // 输出
  output: {
    // 路径
    publicPath: 'xuni',
    // 文件名
    filename: 'bundle.js'
  },
  // 配置服务器
  devServer: {
    // 静态文件夹
    contentBase: "www",
    open: true,
    hot: true,
    port: 8081
  },
}