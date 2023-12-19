/**
 * Ifenna Ekwenem
 * Webscraper Logic
 */
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as createCsvWriter from 'csv-writer';


async function scrapeWebsite(url: string): Promise<string> {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Scraping logic
    const paragraphs = $('p'); 
    // Select all paragraphs, adjust the selector as needed
   
    let pageContent = '';
    paragraphs.each((index, element) => {
      pageContent += $(element).text() + '\n';
    });

    return pageContent.trim(); // Return the contents as a string, as well as removing whitespace
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

const targetUrl = 'http://ufcstats.com/fight-details/f9ec8bedc15ece93';
scrapeWebsite(targetUrl)
  .then((content) => {
    console.log('Page Content:\n', content);
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });
