/**
 * Ifenna Ekwenem
 * Web Scraper Logic
 */
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as createCsvWriter from 'csv-writer';

class WebScraper {
  private urls: string[];

  constructor(urls: string[]) {
    this.urls = urls;
  }

  private async scrapeWebsite(url: string): Promise<string> {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      // Scraping Logic
      const paragraphs = $('p'); // Select all paragraphs, adjust the selector as needed

      let pageContent = '';
      paragraphs.each((index, element) => {
        pageContent += $(element).text() + '\n';
      });

      return pageContent.trim(); // Return the contents as a string, removing leading/trailing whitespace
    } catch (error) {
      console.error(`Error for ${url}:`, (error as any).message); // Note: 'any' used for simplicity
      return ''; // Return an empty string in case of an error
    }
  }

  private async scrapeWebsites(): Promise<string[]> {
    try {
      const promises = this.urls.map((url) => this.scrapeWebsite(url));
      const contents = await Promise.all(promises);
      return contents;
    } catch (error) {
      console.error('Error:', (error as Error).message);
      return [];
    }
  }

  // Save contents from the terminal (Parsed Information) into a CSV data file
  private saveToCsv(data: string[], fileName: string): void {
    const csvWriter = createCsvWriter.createObjectCsvWriter({
      path: fileName,
      header: [{ id: 'content', title: 'Content' }],
    });

    const records = data.map((content, index) => ({ content, url: this.urls[index] }));
    csvWriter.writeRecords(records);
  }

  // Run Logic
  public async run(): Promise<void> {
    try {
      const contents = await this.scrapeWebsites();
      contents.forEach((content, index) => {
        console.log(`Page Content for ${this.urls[index]}:\n`, content);
      });

      // Replace 'output.csv' with your desired CSV file name and path
      this.saveToCsv(contents, 'output.csv');
      console.log('Data saved to Output CSV file.');
    } catch (error: any) {
      console.error('Error:', error.message);
    }
  }
}

// Usage with multiple URLs
const targetUrls = [
  'http://ufcstats.com/fight-details/f9ec8bedc15ece93',
  'http://ufcstats.com/fight-details/09afa6ce4747a1a2',
  'http://ufcstats.com/fight-details/6101249c2cdd1493',
];

const scraper = new WebScraper(targetUrls);
scraper.run();
