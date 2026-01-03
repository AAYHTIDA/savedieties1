// Simple startup script to ensure proper path resolution
const path = require('path');
const fs = require('fs');

// Change to the correct directory
process.chdir(__dirname);

// Verify server.js exists
const serverPath = path.join(__dirname, 'server.js');
if (!fs.existsSync(serverPath)) {
  console.error('server.js not found at:', serverPath);
  process.exit(1);
}

console.log('Starting server from:', __dirname);
console.log('Server file exists:', fs.existsSync(serverPath));

// Start the server
require('./server.js');