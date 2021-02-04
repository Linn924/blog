module.exports = {
    chainWebpack: config => {
        config.set('externals', {
          'vue': 'Vue',
          'vue-router': 'VueRouter',
          'vuex': 'Vuex',
          'axios': 'axios',
          'element-ui': 'ELEMENT'
        })
      }
  }