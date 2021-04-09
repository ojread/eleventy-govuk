module.exports = {
  pagination: {
    data: "esd.needs",
    size: 1000,
    alias: "needs",
    before: (data) => data.filter((entry) => {
      const isLive = entry["Status"] == "Live";
      const isTop = entry["Parent identifiers"] == "";
      return isLive && isTop;
    }),
  },
};
