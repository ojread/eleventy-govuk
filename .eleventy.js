const Nunjucks = require("nunjucks");
const sassPlugin = require("eleventy-plugin-sass");
const navigationPlugin = require("@11ty/eleventy-navigation");

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

  // Copy assets to the
  eleventyConfig.addPassthroughCopy({
    "src/assets/images": "assets/images",
  });

  // Copy assets from the govuk package to our site.
  eleventyConfig.addPassthroughCopy({
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

  // Basic 11ty options.
  return {
    dir: {
      input: "src",
      output: "dist",
      data: "_data",
      includes: "_includes",
      layouts: "_layouts",
      layout: "page.njk",
    },
  };
};
