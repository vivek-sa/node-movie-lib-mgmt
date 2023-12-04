const fs = require('fs');
const path = require('path');

function camelCaseToDashed(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function registerRoutes(app, routePath = '', dir = __dirname) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const isDirectory = fs.statSync(filePath).isDirectory();

    if (isDirectory) {
      const newRoutePath = path.join(routePath, camelCaseToDashed(file));
      registerRoutes(app, newRoutePath, filePath);
    } else if (file.endsWith('.route.js')) {
      const route = require(filePath);
      if (typeof route === 'function') {
        const routeName = camelCaseToDashed(file.replace('.route.js', ''));
        const routeEndpoint = path.join(routePath, routeName);
        console.log(`Registering route for => /api/${routeEndpoint}`);
        app.use(`/api/${routeEndpoint}`, route);
      }
    }
  });
}

module.exports = {
  registerRoutes,
};
