/**
 * Ifenna Ekwenem
 * Web Scraper Logic
 */
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as createCsvWriter from 'csv-writer';
import * as fs from 'fs';
import * as puppeteer from 'puppeteer';


class WebScraper {
  private urls: string[];

  constructor(urls: string[]) {
    this.urls = urls;
  }


private async scrapeWebsite(url: string): Promise<{ details: string }> {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Wait for the table content to load using a mutation observer (you might need to adjust the selector)
    await page.waitForSelector('table');

    const tableContent = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tr'));
      const headers = rows[0].querySelectorAll('th');
      const headerText = Array.from(headers).map((header) => header.textContent.trim());
      const fightDetails = [];

      for (let i = 1; i < rows.length; i++) {
        const columns = rows[i].querySelectorAll('td');
        const rowData = Array.from(columns).map((column) => column.textContent.trim());
        const fight = {};
        
        for (let j = 0; j < headerText.length; j++) {
          fight[headerText[j]] = rowData[j];
        }

        fightDetails.push(fight);
      }

      return JSON.stringify(fightDetails, null, 2);
    });

    await browser.close();

    return { details: tableContent || '' };
  } catch (error) {
    console.error(`Error scraping ${url}:`, (error as Error).message);
    return { details: '' };
  }
}


  

  private async scrapeWebsites(): Promise<{ details: string }[]> {
    try {
      const promises = this.urls.map(async (url) => {
        try {
          return await this.scrapeWebsite(url);
        } catch (error) {
          console.error(`Error scraping ${url}:`, (error as Error).message);
          return { details: '' };
        }
      });

      const contents = await Promise.all(promises);
      return contents;
    } catch (error) {
      console.error('Error:', (error as Error).message);
      return [];
    }
  }

  // ...


  // Save contents from the terminal (Parsed Information) into a CSV data file
  // Will Add Additional Implementation Features such that Files are properly structured in CSV File
  private saveToCsv(data: { details: string }[], fileName: string): void {
    const csvContent = data.map((content) => content.details).join('\n\n');
  
    try {
      fs.writeFileSync(fileName, csvContent);
      console.log('Data saved to Output CSV file.');
    } catch (error) {
      console.error('Error writing to CSV:', error);
    }
  }
  
  // Run Logic
  public async run(): Promise<void> {
    try {
      const contents = await this.scrapeWebsites();
      contents.forEach((content, index) => {
        console.log(`Page Content for ${this.urls[index]}:\n`, content);
      });

      // Add this line to check if contents is non-empty
      console.log('Contents:', contents);

      this.saveToCsv(contents, 'output.csv');
      console.log('Data saved to Output CSV file.');
    } catch (error: any) {
      console.error('Error:', error.message);
    }
  }

}

// Usage with multiple URLs
const targetUrls = [
  'http://mmadecisions.com/event/1436/UFC-297-Strickland-vs-du-Plessis',
];

const scraper = new WebScraper(targetUrls);
scraper.run();
