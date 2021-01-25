module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          browsers: ["last 2 versions", "safari >= 7"],
        },
      },
    ],
  ],
  plugins: ["@babel/plugin-transform-react-jsx"],
};