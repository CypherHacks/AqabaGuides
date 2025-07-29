#!/usr/bin/env node
import { execSync } from 'child_process';

const isProd = process.env.NODE_ENV === 'production';

// 1️⃣ Always run your count script
console.log('🔢 Running build:counts…');
execSync('npm run build:counts', { stdio: 'inherit' });

// 2️⃣ Only generate translations when NOT in production
if (!isProd) {
  console.log('🌐 Generating translations (dev mode)…');
  execSync('npm run generate-translations', { stdio: 'inherit' });
} else {
  console.log('🚫 Skipping generate-translations in production build.');
}

// 3️⃣ Finally, run Vite’s build
console.log('🚀 Running Vite build…');
execSync('vite build', { stdio: 'inherit' });
