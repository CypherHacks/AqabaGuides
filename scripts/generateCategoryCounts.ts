import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { 
  getCategories,
  getSubcategoryCounts, 
  getBusinessCounts 
} from '../src/lib/airtable';

(async () => {
  try {
    const [cats, subCounts, bizCounts] = await Promise.all([
      getCategories(),
      getSubcategoryCounts(),
      getBusinessCounts(),
    ]);

    const out = cats.map(c => ({
      id: c.id,
      name: c.name,
      description: c.description,
      icon: c.icon,
      subCount: subCounts[c.id] || 0,
      bizCount: bizCounts[c.id] || 0,
    }));

    const outDir = path.resolve(process.cwd(), 'src/data');
    fs.mkdirSync(outDir, { recursive: true });

    const outFile = path.join(outDir, 'categories.json');
    fs.writeFileSync(outFile, JSON.stringify(out, null, 2), 'utf-8');
    console.log('✅ src/data/categories.json written successfully');
  } catch (err) {
    console.error('❌ Failed to generate categories.json', err);
    process.exit(1);
  }
})();
