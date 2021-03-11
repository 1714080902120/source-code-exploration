module.exports = {
  entry: './src/index.js',
  output: {
    publicPath: 'xuni',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: "public",
    open: true,
    hot: true,
    port: 9999
  }
}