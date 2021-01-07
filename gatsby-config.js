module.exports = {
  siteMetadata: {
    title: 'Data Hub Frontend',
    description: '',
  },
  plugins: [
    'gatsby-plugin-preact',
    'gatsby-plugin-react-helmet-async',
    'gatsby-plugin-sass',
    {
      // keep as first gatsby-source-filesystem plugin for gatsby image support
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/assets/images`,
        name: 'uploads',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
  ],
}
