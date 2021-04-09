module.exports = {
  pagination: {
    data: "esd.needs",
    size: 1,
    alias: "need",
    addAllPagesToCollections: true,
    before: (data) => data.filter((entry) => entry["Status"] == "Live"),
  },

  eleventyComputed: {
    title: (data) => data.need.Label,
    // eleventyNavigation: {
    //   key: (data) => `${data.need.Identifier}-${data.need.Label}`,
    //   parent: "Needs",
    // },

    childNeeds: (data) => {
      return data.esd.needs.filter(
        (need) => need["Parent identifiers"].split("|").includes(data.need["Identifier"])
      );
    },

    services: (data) => {
      return data.esd.needs_services.filter(
        (service) => {
          return service["Identifier"] === data.need["Identifier"] &&
            service["Mapped identifier"]
        }
      );
    },
  },
};
