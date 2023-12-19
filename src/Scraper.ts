// src/Scraper.ts
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as createCsvWriter from 'csv-writer';


async function scrapeWebsite(url: string): Promise<string> {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Scraping logic
    const paragraphs = $('p'); // Select all paragraphs, adjust the selector as needed

    let pageContent = '';
    paragraphs.each((index, element) => {
      pageContent += $(element).text() + '\n';
    });

    return pageContent.trim(); // Return the contents as a string, as well as removing leading/trailing whitespace
  } catch (error) {
    console.error('Error:', (error as any).message); // Note: 'any' used for simplicity
    return ''; // Return an empty string in case of an error
  }
}

function saveToCsv(data: string, fileName: string): void {
  const csvWriter = createCsvWriter.createObjectCsvWriter({
    path: fileName,
    header: [{ id: 'content', title: 'Content' }],
  });

  csvWriter.writeRecords([{ content: data }]);
}

const targetUrl = 'http://ufcstats.com/fighter-details/45f0cc9d18f35137';
scrapeWebsite(targetUrl)
  .then((content) => {
    console.log('Page Content:\n', content);
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });
