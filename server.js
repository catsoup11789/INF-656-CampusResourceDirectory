const express = require('express');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk').default;
const { renderResource } = require('./modules/fillTemplate');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

/**
 * Loads the resources from the JSON file
 * @returns {any}
 */
function loadResources() {
  const resourcesPath = path.join(__dirname, 'data', 'resources.json');
  const resourcesData = fs.readFileSync(resourcesPath, 'utf8');
  return JSON.parse(resourcesData);
}

/**
 * Loads an HTML template from the templates directory
 * @param templateName
 * @returns {string}
 */
function loadTemplate(templateName) {
  const templatePath = path.join(__dirname, 'templates', `${templateName}.html`);
  return fs.readFileSync(templatePath, 'utf8');
}

/**
 * Converts the keys of a resource object to uppercase
 * @param resource
 * @returns {{}}
 */
function convertToUppercase(resource) {
  const upperResource = {};
  for (const key in resource) {
    if (resource.hasOwnProperty(key)) {
      upperResource[key.toUpperCase()] = resource[key];
    }
  }
  return upperResource;
}

/**
 *  Routes
 */

// Return all resources as HTML
app.get('/', (req, res) => {
  const resources = loadResources();
  const cardTemplate = loadTemplate('card');
  const indexTemplate = loadTemplate('index');

  let resourceCards = '';
  resources.forEach((resource) => {
    const upperResource = convertToUppercase(resource);
    const renderedCard = renderResource(cardTemplate, upperResource);
    resourceCards += renderedCard;
  });

  const pageData = {
    RESOURCE_CARDS: resourceCards
  };
  const html = renderResource(indexTemplate, pageData);

  res.send(html);
});

// Return an individual resource as HTML
app.get('/resource', (req, res) => {
  const resourceId = req.query.id;

  if (!resourceId) {
    return res.status(400).send('Resource ID is required');
  }

  const resources = loadResources();
  const resource = resources.find(r => r.id == resourceId);

  if (!resource) {
    return res.status(404).send('Resource not found');
  }

  const resourceTemplate = loadTemplate('resource');
  const upperResource = convertToUppercase(resource);
  const html = renderResource(resourceTemplate, upperResource);

  res.send(html);
});

// Return all resources as JSON
app.get('/api/resources', (req, res) => {
  const resources = loadResources();
  res.setHeader('Content-Type', 'application/json');
  res.json(resources);
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

/**
 *  Server started notice
 */
app.listen(PORT, () => {
  console.log(chalk.green('✓ Campus Resource Directory server running'));
  console.log(chalk.blue(`  URL: http://localhost:${PORT}`));
  console.log(chalk.yellow(`  Environment: ${process.env.NODE_ENV || 'development'}\n`));
});

