/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "export",
  env: {
    ShuanQ_Host: process.env.ShuanQ_Host,
    ShuanQ_AppKey: process.env.ShuanQ_AppKey,
    ShuanQ_AesKey: process.env.ShuanQ_AesKey,
    SUPABASE_KEY: process.env.SUPABASE_KEY,
  },
};

module.exports = nextConfig;
