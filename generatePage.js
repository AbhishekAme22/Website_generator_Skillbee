// Using ES6 module syntax
import fs from 'fs';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import ejs from 'ejs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Render a template

const NUM_PAGES = 100;
const API_URL = 'https://www.boredapi.com/api/activity';

async function fetchData() {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    return null;
  }
}

async function generatePages() {
  const template = fs.readFileSync('template.ejs', 'utf8');

  for (let i = 1; i <= NUM_PAGES; i++) {
    const data = await fetchData();
    if (!data) break;

    const renderedHtml = ejs.render(template, data);

    fs.writeFile(join(__dirname, `pages/page${i}.html`), renderedHtml, (err) => {
      if (err) console.error(`Error writing page ${i}:`, err);
      else console.log(`Page ${i} generated successfully!`);
    });
  }
}

generatePages();
