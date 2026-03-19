const fs = require('fs');

const file = 'src/App.tsx';
const content = fs.readFileSync(file, 'utf8');

// Replace fetch('${API_BASE_URL} with fetch(`${API_BASE_URL}
let fixed = content.replace(/fetch\('(\$\{API_BASE_URL\})/g, "fetch(`$1");

// Replace other patterns like : '${API_BASE_URL} with : `${API_BASE_URL}
fixed = fixed.replace(/:\s*'(\$\{API_BASE_URL\})/g, ": `$1");

fs.writeFileSync(file, fixed, 'utf8');
console.log('✅ Todas as URLs foram corrigidas!');
