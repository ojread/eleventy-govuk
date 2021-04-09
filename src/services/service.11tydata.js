module.exports = {
  pagination: {
    data: "esd.services",
    size: 1,
    alias: "service",
    addAllPagesToCollections: true,
    before: (data) => data.filter((entry) => entry["Status"] == "Live"),
  },

  eleventyComputed: {
    title: (data) => data.service.Label,
    // eleventyNavigation: {
    //   key: (data) => `${data.service.Identifier}:${data.service.Label}`,
    //   parent: "Services",
    // },

    needs: (data) =>
      data.esd.services_needs.filter(
        (need) => need.Identifier === data.service.Identifier
      ),
  },
};
