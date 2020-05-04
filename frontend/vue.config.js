module.exports = {
  "devServer": {
    "proxy": {
      "^/api/": {
        "target": "http://localhost:3000",
        "ws": true,
        "changeOrigin": true
      },
      "^/auth/": {
        "target": "http://localhost:3000",
        "ws": true,
        "changeOrigin": true
      },
      "^/rest/": {
        "target": "http://localhost:3000",
        "ws": true,
        "changeOrigin": true
      }
    }
  },
  "transpileDependencies": [
    "vuetify"
  ]
}