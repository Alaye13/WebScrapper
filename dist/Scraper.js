"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Ifenna Ekwenem
 * Web Scraper Logic
 */
const axios_1 = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
class WebScraper {
    constructor(urls) {
        this.urls = urls;
    }
    //     Scraping Logic for "significant strikes"
    // ...
    // private async scrapeWebsite(url: string): Promise<{ details: string }> {
    //     try {
    //       const response = await axios.get(url);
    //       const $ = cheerio.load(response.data);
    //       // Scraping Logic for "Decision Details which includes the judges scorecard"
    //       const detailsParagraphs = $('p').filter((index, element) =>
    //         $(element).text().toLowerCase().includes('UFC')
    //       );
    //       let detailsContent = '';
    //       detailsParagraphs.each((index, element) => {
    //         const paragraphText = $(element).text().trim();
    //         const formattedParagraph = paragraphText
    //           .replace(/\s+/g, ' ')
    //           .replace(/\n+/g, '\n')
    //           .replace(/^\s+|\s+$/g, '');
    //         if (formattedParagraph.trim() !== '') {
    //           detailsContent += formattedParagraph + '\n\n';
    //         }
    //       });
    //       return { details: detailsContent };
    //     } catch (error) {
    //       console.error(`Error scraping ${url}:`, (error as Error).message);
    //       return { details: '' };
    //     }
    //   }
    scrapeWebsite(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(url);
                const $ = cheerio.load(response.data);
                // Log the full HTML content
                const htmlContent = response.data;
                console.log('Full HTML Content:', htmlContent);
                // Scraping Logic for all content on the page (text only)
                const allContentText = $('body').text();
                // Log the extracted content (text only)
                console.log('All Content (Text Only):', allContentText);
                // Check if any content is found
                if (allContentText.trim() !== '') {
                    return { details: allContentText };
                }
                else {
                    console.log(`No content found on ${url}`);
                    return { details: '' };
                }
            }
            catch (error) {
                console.error(`Error scraping ${url}:`, error.message);
                return { details: '' };
            }
        });
    }
    scrapeWebsites() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const promises = this.urls.map((url) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        return yield this.scrapeWebsite(url);
                    }
                    catch (error) {
                        console.error(`Error scraping ${url}:`, error.message);
                        return { details: '' };
                    }
                }));
                const contents = yield Promise.all(promises);
                return contents;
            }
            catch (error) {
                console.error('Error:', error.message);
                return [];
            }
        });
    }
    // ...
    // Save contents from the terminal (Parsed Information) into a CSV data file
    // Will Add Additional Implementation Features such that Files are properly structured in CSV File
    saveToCsv(data, fileName) {
        const csvContent = data.map((content) => content.details).join('\n\n');
        try {
            fs.writeFileSync(fileName, csvContent);
            console.log('Data saved to Output CSV file.');
        }
        catch (error) {
            console.error('Error writing to CSV:', error);
        }
    }
    // Run Logic
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contents = yield this.scrapeWebsites();
                contents.forEach((content, index) => {
                    console.log(`Page Content for ${this.urls[index]}:\n`, content);
                });
                // Add this line to check if contents is non-empty
                console.log('Contents:', contents);
                this.saveToCsv(contents, 'output.csv');
                console.log('Data saved to Output CSV file.');
            }
            catch (error) {
                console.error('Error:', error.message);
            }
        });
    }
}
// Usage with multiple URLs
const targetUrls = [
    'http://ufcstats.com/fighter-details/45f0cc9d18f35137',
];
const scraper = new WebScraper(targetUrls);
scraper.run();
