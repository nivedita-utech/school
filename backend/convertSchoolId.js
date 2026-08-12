const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'routes');
const files = fs.readdirSync(routesDir);

files.forEach(file => {
  if (file === 'schoolRoutes.js') {
    fs.unlinkSync(path.join(routesDir, file));
    console.log('Deleted schoolRoutes.js');
    return;
  }
  
  const filePath = path.join(routesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace schoolId with schoolType everywhere in routes
  const updatedContent = content.replace(/schoolId/g, 'schoolType');
  
  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent);
    console.log(`Updated ${file}`);
  }
});

// Update updateRoutes.js
const updateScriptPath = path.join(__dirname, 'updateRoutes.js');
if (fs.existsSync(updateScriptPath)) {
  let content = fs.readFileSync(updateScriptPath, 'utf8');
  content = content.replace(/schoolId/g, 'schoolType');
  fs.writeFileSync(updateScriptPath, content);
  console.log('Updated updateRoutes.js');
}

// Also update server.js to remove schoolRoutes
const serverPath = path.join(__dirname, 'server.js');
if (fs.existsSync(serverPath)) {
  let content = fs.readFileSync(serverPath, 'utf8');
  content = content.replace(/import schoolRoutes from '\.\/routes\/schoolRoutes\.js';\n/g, '');
  content = content.replace(/app\.use\('\/api\/schools', protect, schoolRoutes\);\n/g, '');
  fs.writeFileSync(serverPath, content);
  console.log('Updated server.js');
}
