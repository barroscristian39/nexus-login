import { readFileSync, writeFileSync } from 'fs';

const file = 'src/App.tsx';
const content = readFileSync(file, 'utf8');

// Replace fetch(`${API_BASE_URL}...' with fetch(`${API_BASE_URL}...`
let fixed = content.replace(/fetch\(`\$\{API_BASE_URL\}([^']*)'([,\s])/g, "fetch(`${API_BASE_URL}$1`$2");

// Replace : `${API_BASE_URL}...' with : `${API_BASE_URL}...`
fixed = fixed.replace(/:\s*`\$\{API_BASE_URL\}([^']*)'([;,\s])/g, ": `${API_BASE_URL}$1`$2");

writeFileSync(file, fixed, 'utf8');
console.log('✅ URLs corrigidas com backticks em ambas as extremidades!');
