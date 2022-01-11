module.exports = {
  webpack5: true,
  images: {
    domains: ['images.pokemontcg.io'],
  },
  experimental: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
};

// const withCSS = require('@zeit/next-css');
// module.exports = withCSS({
// 	/* config options here */
// 	future: { webpack5: true },
// });
