/**
 * Ifenna Ekwenem
 * Webscraper Logic
 */
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as createCsvWriter from 'csv-writer';

class WebScraper {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  private async scrapeWebsite(): Promise<string> {
    try {
      const response = await axios.get(this.url);
      const $ = cheerio.load(response.data);

      //Scraping Logic
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

  // Save comtents from the terminal (PArsed Information) into a csv data file
  private saveToCsv(data: string, fileName: string): void {
    const csvWriter = createCsvWriter.createObjectCsvWriter({
      path: fileName,
      header: [{ id: 'content', title: 'Content' }],
    });

    csvWriter.writeRecords([{ content: data }]);
  }

  // Run Logic
  public async run(): Promise<void> {
    try {
      const content = await this.scrapeWebsite();
      console.log('Page Content:\n', content);
  
      // Replace 'output.csv' with your desired CSV file name and path
      this.saveToCsv(content, 'output.csv');
      console.log('Data saved to CSV file.');
    } catch (error: any) {
      console.error('Error:', error.message);
    }
  }
  
}

// Usage
const targetUrl = 'http://ufcstats.com/fight-details/f9ec8bedc15ece93';
const scraper = new WebScraper(targetUrl);
scraper.run();
