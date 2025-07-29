import dotenv from 'dotenv';
import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

dotenv.config();

if (process.env.SKIP_TRANSLATIONS === 'true') {
  console.log('⚠️ SKIP_TRANSLATIONS is set — skipping translation step.');
  process.exit(0);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Verify environment
if (!process.env.DEEPL_AUTH_KEY) {
  console.error('❌ DEEPL_AUTH_KEY is missing');
  process.exit(1);
}

// Configuration
const DEEPL_KEY = process.env.DEEPL_AUTH_KEY;
const DEEPL_API_URL = process.env.DEEPL_API_URL || 'https://api.deepl.com/v2/translate';
const srcPath = path.resolve(__dirname, '../public/locales/en/translation.json');
const outDir = path.resolve(__dirname, '../public/locales');
const TARGET_LANGS = ['ar', 'fr', 'es', 'de', 'it', 'ru', 'ja', 'tr', 'zh'];

// Translate with retry/backoff
async function translateText(text, target, attempt = 1) {
  const MAX_ATTEMPTS = 3;
  const BACKOFF_DELAY = 500; // ms

  try {
    const res = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `DeepL-Auth-Key ${DEEPL_KEY}`
      },
      body: new URLSearchParams({
        text,
        target_lang: target.toUpperCase(),
        tag_handling: 'html',
        preserve_formatting: '1',
        split_sentences: 'nonewlines'
      })
    });

    if (!res.ok) {
      const errBody = await res.json();
      throw new Error(`API Error ${res.status}: ${errBody.message || res.statusText}`);
    }

    const data = await res.json();
    return data.translations?.[0]?.text || text;
  } catch (err) {
    if (attempt < MAX_ATTEMPTS) {
      console.log(`Retrying (${attempt}/${MAX_ATTEMPTS})...`);
      await new Promise(r => setTimeout(r, BACKOFF_DELAY * attempt));
      return translateText(text, target, attempt + 1);
    }
    console.error(`Failed after ${MAX_ATTEMPTS} attempts: "${text.substring(0, 50)}..."`);
    return text;
  }
}

/**
 * Recursively translate every string in an object tree
 */
async function translateObjectTree(obj, lang) {
  if (typeof obj === 'string') {
    return await translateText(obj, lang);
  }
  if (Array.isArray(obj)) {
    const arr = [];
    for (const item of obj) {
      arr.push(await translateObjectTree(item, lang));
    }
    return arr;
  }
  if (obj && typeof obj === 'object') {
    const out = {};
    for (const [key, value] of Object.entries(obj)) {
      out[key] = await translateObjectTree(value, lang);
    }
    return out;
  }
  return obj;
}

async function main() {
  try {
    const en = JSON.parse(fs.readFileSync(srcPath, 'utf8'));

    for (const lang of TARGET_LANGS) {
      console.log(`\n🌐 Translating to ${lang.toUpperCase()}...`);

      // Recursively translate entire JSON tree
      const translatedTree = await translateObjectTree(en, lang);

      // Write out the translation JSON
      const langDir = path.join(outDir, lang);
      fs.mkdirSync(langDir, { recursive: true });
      const targetFile = path.join(langDir, 'translation.json');
      fs.writeFileSync(targetFile, JSON.stringify(translatedTree, null, 2), 'utf8');
      console.log(`✅ ${lang.toUpperCase()} complete!`);

      // Apply any per-locale overrides
      const overridePath = path.resolve(__dirname, 'overrides', `${lang}.json`);
      if (fs.existsSync(overridePath)) {
        const override = JSON.parse(fs.readFileSync(overridePath, 'utf8'));
        const base = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
        const merged = { ...base, ...override };
        fs.writeFileSync(targetFile, JSON.stringify(merged, null, 2), 'utf8');
        console.log(`🔧 Overrides applied for ${lang.toUpperCase()}`);
      }
    }
  } catch (error) {
    console.error('\n❌ Critical error:', error);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
