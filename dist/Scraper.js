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
const createCsvWriter = require("csv-writer");
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
                const paragraphs = $('p'); // Select all paragraphs, adjust the selector as needed
                let pageContent = '';
                paragraphs.each((index, element) => {
                    pageContent += $(element).text() + '\n';
                });
                return pageContent.trim(); // Return the contents as a string, removing leading/trailing whitespace
            }
            catch (error) {
                console.error(`Error for ${url}:`, error.message); // Note: 'any' used for simplicity
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
    // Will Add Addditional Implementation Features such that Files are properly structured in CSV File
    saveToCsv(data, fileName) {
        const csvWriter = createCsvWriter.createObjectCsvWriter({
            path: fileName,
            header: [
                { id: 'content', title: 'Content' },
                { id: 'fighter', title: 'Fighter' },
                { id: 'decision', title: 'Decision' }
            ],
        });
        const records = data.map((content) => ({ content }));
        csvWriter.writeRecords(records);
    }
    // Run Logic
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contents = yield this.scrapeWebsites();
                contents.forEach((content, index) => {
                    console.log(`Page Content for ${this.urls[index]}:\n`, content);
                });
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
    'http://ufcstats.com/fight-details/f9ec8bedc15ece93',
    'http://ufcstats.com/fight-details/09afa6ce4747a1a2',
    'http://ufcstats.com/fight-details/6101249c2cdd1493',
];
const scraper = new WebScraper(targetUrls);
scraper.run();
