/** @type {import('next').NextConfig} */
const TerserPlugin = require("terser-webpack-plugin");
const ObfuscatorPlugin = require("webpack-obfuscator");

const nextConfig = {
  output: "export",
  webpack(config, options) {
    config.optimization.minimizer = [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true, // 移除 console.log
            passes: 3, // 多次压缩以提高压缩率
          },
          output: {
            comments: false, // 移除注释
          },
        },
      }),
      new ObfuscatorPlugin({
        // 压缩代码
        compact: true,
        debugProtection: true,
        debugProtectionInterval: 0.55,
        // 标识符的混淆方式 hexadecimal(十六进制) mangled(短标识符)
        identifierNamesGenerator: "mangled",
        log: false,
        // 是否启用全局变量和函数名称的混淆
        renameGlobals: true,
        // 通过固定和随机（在代码混淆时生成）的位置移动数组。这使得将删除的字符串的顺序与其原始位置相匹配变得更加困难。如果原始源代码不小，建议使用此选项，因为辅助函数可以引起注意。
        rotateStringArray: true,
        // 混淆后的代码,不能使用代码美化,同时需要配置 cpmpat:true;
        selfDefending: true,
        // 删除字符串文字并将它们放在一个特殊的数组中
        stringArray: true,
        stringArrayEncoding: ["rc4"],
        stringArrayThreshold: 0.15,
      }),
    ];

    return config;
  },
};

module.exports = nextConfig;
