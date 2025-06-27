// scripts/translate-locales.js
require('dotenv').config();

if (!process.env.DEEPL_AUTH_KEY) {
  console.error('❌  DEEPL_AUTH_KEY is missing. Please set it in your environment or in a .env file.');
  process.exit(1);
}

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const DEEPL_KEY = process.env.DEEPL_AUTH_KEY;
const srcPath = path.resolve(__dirname, '../public/locales/en/translation.json');
const outDir  = path.resolve(__dirname, '../public/locales');
const TARGET_LANGS = ['ar','fr','es'];

async function translateText(text, target) {
  const res = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      auth_key: DEEPL_KEY,
      text,
      target_lang: target.toUpperCase()
    })
  });
  const data = await res.json();
  return data.translations[0].text;
}

async function main() {
  const en = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
  for (const lang of TARGET_LANGS) {
    const result = {};
    for (const [key, text] of Object.entries(en)) {
      result[key] = await translateText(text, lang);
    }
    const dir = path.join(outDir, lang);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, 'translation.json'),
      JSON.stringify(result, null, 2),
      'utf8'
    );
    console.log(`✅ ${lang} translations written`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
