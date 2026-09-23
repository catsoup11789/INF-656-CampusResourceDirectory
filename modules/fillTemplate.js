/**
 * Template Fill Module
 * Replaces placeholders in HTML templates with resource data
 */

/**
 * Renders an HTML template by replacing placeholders with resource data
 * @param {string} template - The HTML template string with {{placeholder}} format
 * @param {object} resource - The resource object containing data to replace placeholders
 * @returns {string} - The completed HTML string with all placeholders replaced
 */
function renderResource(template, resource) {
  if (!template || typeof template !== 'string') {
    throw new Error('Template must be a non-empty string');
  }

  if (!resource || typeof resource !== 'object') {
    throw new Error('Resource must be a valid object');
  }

  let html = template;

  for (const key in resource) {
    if (resource.hasOwnProperty(key)) {
      const placeholder = `{{${key}}}`;
      const regex = new RegExp(placeholder, 'g');
      html = html.replace(regex, resource[key] || '');
    }
  }

  return html;
}

module.exports = {
  renderResource
};

