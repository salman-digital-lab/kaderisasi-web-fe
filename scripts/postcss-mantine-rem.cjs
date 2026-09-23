// eslint-disable-next-line @typescript-eslint/no-require-imports -- PostCSS loads this CommonJS plugin directly.
const preset = require("postcss-preset-mantine");

// Individual core styles ship in px; the full bundle is compiled with autoRem.
module.exports = () => {
  const autoRem = preset({ autoRem: true }).plugins.find(
    (plugin) => plugin.postcssPlugin === "postcss-auto-rem",
  );
  if (!autoRem) throw new Error("Mantine autoRem plugin is unavailable");
  return {
    postcssPlugin: "mantine-core-rem",
    Declaration(declaration) {
      const file = declaration.source?.input.file?.replaceAll("\\", "/");
      if (file?.includes("/node_modules/@mantine/core/styles/")) {
        autoRem.Declaration(declaration);
      }
    },
  };
};
module.exports.postcss = true;
