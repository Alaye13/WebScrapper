import axios from 'axios';
import * as cheerio from 'cheerio';

async function scrapeWebsite(url: string): Promise<void> {
  try {
    const response = await axios.get(url);
    console.log('Response data:', response.data); // Log response data to verify HTML content
    const $ = cheerio.load(response.data);
    const $selected = $('tbody.b-fight-details');
    console.log($selected);
  } catch (error) {
    console.error('Error:', (error as any).message); // Note: 'any' used for simplicity
  }
}

// Replace 'https://example.com' with the URL you want to scrape
const targetUrl = 'http://ufcstats.com/fight-details/a74a8c1e0a49070d';
scrapeWebsite(targetUrl)
  .then(() => {
    console.log('Scraping complete.');
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });
