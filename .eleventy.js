const Nunjucks = require("nunjucks");
const sassPlugin = require("eleventy-plugin-sass");
const navigationPlugin = require("@11ty/eleventy-navigation");
const csvParse = require("csv-parse/lib/sync");
// const XLSX = require("xlsx");

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

  // Load CSV files as data.
  eleventyConfig.addDataExtension("csv", (contents) => {
    const records = csvParse(contents, {
      skip_empty_lines: true,
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

  eleventyConfig.addFilter("log", (value) => {
    console.log(value);
  });

  eleventyConfig.addFilter("toGovukBreadcrumbs", function (value) {
    return value.map((item) => {
      return { text: item.title, href: item.url };
    });
  });

  eleventyConfig.addFilter("toGovukTable", function (records) {
    const head = records[0].map((key) => {
      return { text: key };
    });
    const rows = records.slice(1).map((record) =>
      record.map((key) => {
        return { text: key };
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
