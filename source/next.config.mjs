const nextConfig = {
  output: "standalone",
  basePath: "",
  images: { unoptimized: true },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: true,
};

export default nextConfig;
