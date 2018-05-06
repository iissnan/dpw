const path = require('path');

module.exports = {
  title: 'Recollection',
  description: 'Working Notes @RC',
  head: [
    ['link', { rel: 'shortcut icon', type: 'image/x-icon', href: `favicon.ico` }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=IBM+Plex+Mono|IBM+Plex+Sans' }]
  ],
  configureWebpack: {
    resolve: {
      alias: {
        '@static': path.resolve(__dirname, '../static'),
        '@uploads': path.resolve(__dirname, '../uploads')
      }
    }
  },
  themeConfig: {
    nav: [
      { text: 'DPW UI 单元测试', link: '/dpw-unit-testing/' },
      { text: 'DPW 相关组件简称', link: '/rc-components-abbreviations/' }
    ]
  }
};
