import axios from 'axios';
import * as cheerio from 'cheerio';

async function scrapeWebsite(url: string): Promise<string> {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Your scraping logic goes here
    const paragraphs = $('p'); // Select all paragraphs, adjust the selector as needed

    let pageContent = '';
    paragraphs.each((index, element) => {
      pageContent += $(element).text() + '\n';
    });

    return pageContent.trim(); // Return the contents as a string, removing leading/trailing whitespace
  } catch (error) {
    console.error('Error:', (error as any).message); // Note: 'any' used for simplicity
    return ''; // Return an empty string in case of an error
  }
}

// Replace 'https://example.com' with the URL you want to scrape
const targetUrl = 'http://ufcstats.com/fighter-details/45f0cc9d18f35137';
scrapeWebsite(targetUrl)
  .then((content) => {
    console.log('Page Content:\n', content);
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });