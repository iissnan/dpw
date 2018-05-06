module.exports = {
  title: 'Recollection',
  description: 'Working Notes @RC',
  head: [
    ['link', { rel: 'shortcut icon', type: 'image/x-icon', href: `favicon.ico` }]
  ],
  configureWebpack: {
    resolve: {
      alias: {
        '@static': './static'
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
