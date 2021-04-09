const Nunjucks = require("nunjucks");
const sassPlugin = require("eleventy-plugin-sass");
const navigationPlugin = require("@11ty/eleventy-navigation");
const csvParse = require("csv-parse/lib/sync");
// const XLSX = require("xlsx");
// const jsonld = require("jsonld");
// const N3 = require('n3'); // RDF parser.
// const jsonld = require("jsonld");
// const $rdf = require("rdflib");
// const rdfstore = require("rdfstore");
const taffy = require("taffy");

module.exports = function (eleventyConfig) {
  // Create custom nunjucks instance that can see the govuk templates.
  let nunjucksEnvironment = new Nunjucks.Environment(
    new Nunjucks.FileSystemLoader([
      "src/_includes",
      "node_modules/govuk-frontend",
    ])
  );

  // Use our custom nunjucks instance.
  eleventyConfig.setLibrary("njk", nunjucksEnvironment);

  // Add the 11ty SASS plugin.
  eleventyConfig.addPlugin(sassPlugin, {
    watch: ["src/assets/styles/**/*.{scss,sass}"],
    sourcemaps: true,
    outputDir: "dist/assets/styles",
  });

  // Add the 11ty navigation plugin.
  eleventyConfig.addPlugin(navigationPlugin);

  // Load Excel files as data.
  // eleventyConfig.addDataExtension("xlsx", (contents) => {
  //   // XLSX.utils.sheet_to_csv // generates CSV
  //   const workbook = XLSX.read(contents, { type: "buffer" });

  //   // workbook.SheetNames

  //   // const json = XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1);
  //   const csv = XLSX.utils.sheet_to_csv(workbook.Sheets.Sheet1);
  //   console.log(csv);
  //   return csv;
  // });

  // rdfstore
  // eleventyConfig.addDataExtension("ttl", (contents) => {
  //   const s = new rdfstore.Store(function(err, store) {
  //     store.load("text/turtle", contents, function(err, results) {});
  //   });
  //   // console.log(s);
  //   return s;
  // });

  // rdflib
  // eleventyConfig.addDataExtension("ttl", (contents) => {
  //   var store = $rdf.graph();
  //   var uri = "http://id.esd.org.uk";
  //   var mimeType = "text/turtle";

  //   try {
  //     $rdf.parse(contents, store, uri, mimeType);
  //     // console.log(store);
  //     return store;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // });

  eleventyConfig.addDataExtension("jsonld", (contents) => {
    const data = JSON.parse(contents);
    return data["@graph"] ? data["@graph"] : data;
  });

  // eleventyConfig.addDataExtension("jsonld", (contents) => {
  //   const data = JSON.parse(contents);
  //   const root = data["@graph"] ? data["@graph"] : data;
  //   const db = taffy(root);
  //   return db;
  // });

  // Load CSV files as data.
  eleventyConfig.addDataExtension("csv", (contents) => {
    const records = csvParse(contents, {
      skip_empty_lines: true,
      columns: true,
    });
    return records;
  });

  // Copy assets to the built site.
  eleventyConfig.addPassthroughCopy({
    "src/assets/images": "assets/images",
    "src/assets/scripts": "assets/scripts",
    "node_modules/govuk-frontend/govuk/assets/images": "assets/images",
    "node_modules/govuk-frontend/govuk/assets/fonts": "assets/fonts",
    "node_modules/govuk-frontend/govuk/all.js": "assets/scripts/all.js",
  });

  // Filter to format dates.
  eleventyConfig.addFilter("date", function (value) {
    return value.toLocaleDateString("en-gb", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "utc",
    });
  });

  eleventyConfig.addShortcode("separator", function () {
    return `<hr class="govuk-section-break govuk-section-break--visible">`;
  });

  eleventyConfig.addPairedShortcode("md", function (content) {
    return content;
  });

  eleventyConfig.addPairedShortcode("row", function (content) {
    return `<div class="govuk-grid-row">${content}</div>`;
  });

  eleventyConfig.addPairedShortcode("column", function (content, width) {
    width = width || "one-half";
    const classes = ["govuk-!-margin-bottom-8"];
    classes.push(`govuk-grid-column-${width}-from-desktop`);
    return `<div class="${classes.join(" ")}">${content}</div>`;
  });

  eleventyConfig.addPairedShortcode("markdown", function (content) {
    return md.render(content);
  });

  eleventyConfig.addFilter("toGovukBreadcrumbs", function (value) {
    return value.map((item) => {
      return { text: item.title, href: item.url };
    });
  });

  // When CSV is loaded as arrays.
  // eleventyConfig.addFilter("toGovukTable", function (records) {
  //   const head = records[0].map((key) => {
  //     return { text: key };
  //   });
  //   const rows = records.slice(1).map((record) =>
  //     record.map((key) => {
  //       return { text: key };
  //     })
  //   );
  //   return {
  //     head,
  //     rows,
  //   };
  // });

  // When CSV is loaded as column objects.
  eleventyConfig.addFilter("toGovukTable", function (records) {
    const columns = Object.keys(records[0]);
    const head = columns.map((column) => {
      return { text: column };
    });
    const rows = records.slice(1).map((record) =>
      columns.map((column) => {
        return { text: record[column] };
      })
    );
    return {
      head,
      rows,
    };
  });

  // Basic 11ty options.
  return {
    dir: {
      input: "src",
      output: "dist",
      data: "_data",
      includes: "_includes",
      layouts: "_layouts",
    },
  };
};
