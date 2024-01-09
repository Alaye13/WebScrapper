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
    scrapeWebsite(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(url);
                const $ = cheerio.load(response.data);
                // Scraping Logic
                const detailsParagraphs = $('p').filter((index, element) => $(element).text().toLowerCase().includes('details'));
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
            }
            catch (error) {
                console.error(`Error for ${url}:`, error.message);
                return ''; // Return an empty string in case of an error
            }
        });
    }
    scrapeWebsites() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const promises = this.urls.map((url) => this.scrapeWebsite(url));
                const contents = yield Promise.all(promises);
                return contents;
            }
            catch (error) {
                console.error('Error:', error.message);
                return [];
            }
        });
    }
    // Save contents from the terminal (Parsed Information) into a CSV data file
    // Will Add Additional Implementation Features such that Files are properly structured in CSV File
    // ...
    saveToCsv(data, fileName) {
        const csvContent = data.join('\n\n'); // Join paragraphs with two line breaks
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
    'http://ufcstats.com/fight-details/a74a8c1e0a49070d',
];
const scraper = new WebScraper(targetUrls);
scraper.run();
