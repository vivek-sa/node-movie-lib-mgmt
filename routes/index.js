const fs = require('fs');
const path = require('path');

// function to convert camelCase strings to dashed strings.
function camelCaseToDashed(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

// recursive function to register routes based on the file structure in a given directory.
function registerRoutes(app, routePath = '', dir = __dirname) {
  // read the contents of the specified directory.
  const files = fs.readdirSync(dir);

  // iterate over each file in the directory.
  files.forEach((file) => {
    // create the full path of the current file.
    const filePath = path.join(dir, file);
    // check if the current file is a directory.
    const isDirectory = fs.statSync(filePath).isDirectory();

    if (isDirectory) {
      // if the current file is a directory, recursively register routes for its contents.
      const newRoutePath = path.join(routePath, camelCaseToDashed(file));
      registerRoutes(app, newRoutePath, filePath);
    } else if (file.endsWith('.route.js')) {
      // if the file is a route file (ends with '.route.js'), register it as a route.
      const route = require(filePath);
      if (typeof route === 'function') {
        // extract the route name from the file name and convert it to a dashed format.
        const routeName = camelCaseToDashed(file.replace('.route.js', ''));
        // construct the full endpoint path based on the routePath and routeName.
        const routeEndpoint = path.join(routePath, routeName);

        // log the registration information to the console.
        console.log(`Registering route for => /api/${routeEndpoint}`);

        // register the route with the Express app using the constructed endpoint.
        app.use(`/api/${routeEndpoint}`, route);
      }
    }
  });
}

module.exports = {
  registerRoutes,
};
