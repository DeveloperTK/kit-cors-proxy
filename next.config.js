module.exports = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:tag*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
    ]
  },
}
