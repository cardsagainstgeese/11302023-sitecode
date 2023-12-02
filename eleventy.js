const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {

  eleventyConfig.addFilter("toLuxonDateTime", (dateString) => {
		const date = DateTime.fromISO(dateString, { zone: "est" });
		if (!date.isValid) {
			throw new Error(`date value "${dateString}" is invalid`);
		}
		return date.toJSDate();
	});

	eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
		return DateTime.fromJSDate(dateObj, { zone: zone || "est" }).toFormat(
			format || "LLL dd yyyy"
		);
	});
  
  eleventyConfig.addShortcode('excerpt', article => extractExcerpt(article));

  eleventyConfig.addPassthroughCopy('src/css');
  
  return {
    dir: {
      input: "src",
      data: "_data",
      output: "_site"
    }
  };
}

  function extractExcerpt(article) {
    if (!article.hasOwnProperty('templateContent')) {
      console.warn('Failed to extract excerpt: Document has no property "templateContent".');
      return null;
    }
   
    let excerpt = null;
    const content = article.templateContent;
   
    // The start and end separators to try and match to extract the excerpt
    const separatorsList = [
      { start: '<!-- Excerpt Start -->', end: '<!-- Excerpt End -->' },
      { start: '<p>', end: '</p>' }
    ];
   
    separatorsList.some(separators => {
      const startPosition = content.indexOf(separators.start);
      const endPosition = content.indexOf(separators.end);
   
      if (startPosition !== -1 && endPosition !== -1) {
        excerpt = content.substring(startPosition + separators.start.length, endPosition).trim();
        return true; // Exit out of array loop on first match
      }
    });
   
    return excerpt;
  }