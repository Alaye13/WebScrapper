/**
 * Ifenna Ekwenem
 * Web Scraper Logic
 */
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as createCsvWriter from 'csv-writer';
import * as fs from 'fs';


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
      const detailsParagraphs = $('p').filter((index, element) =>
        $(element).text().toLowerCase().includes('details')
      );
  
      let pageContent = '';
      detailsParagraphs.each((index, element) => {
        const paragraphText = $(element).text().trim(); // Remove leading/trailing white spaces
        const formattedParagraph = paragraphText
          .replace(/\s+/g, ' ') // Replace consecutive white spaces with a single space
          .replace(/\n+/g, '\n') // Replace multiple consecutive line breaks with a single line break
          .replace(/^\s+|\s+$/g, ''); // Remove leading/trailing line breaks
  
        if (formattedParagraph.trim() !== '') {
          pageContent += formattedParagraph + '\n\n'; // Add an extra line break for better separation
        }
      });
  
      return pageContent.trim(); // Return the contents as a string, removing leading/trailing whitespace
    } catch (error) {
      console.error(`Error for ${url}:`, (error as any).message);
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
// Will Add Additional Implementation Features such that Files are properly structured in CSV File

// ...

private saveToCsv(data: string[], fileName: string): void {
  const csvContent = data.join('\n\n'); // Join paragraphs with two line breaks

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
  'http://ufcstats.com/fight-details/a74a8c1e0a49070d',
];

const scraper = new WebScraper(targetUrls);
scraper.run();

