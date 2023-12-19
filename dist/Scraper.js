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
 * Webscraper Logic
 */
const axios_1 = require("axios");
const cheerio = require("cheerio");
const createCsvWriter = require("csv-writer");
function scrapeWebsite(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(url);
            const $ = cheerio.load(response.data);
            // Scraping logic
            const paragraphs = $('p');
            // Select all paragraphs, adjust the selector as needed
            let pageContent = '';
            paragraphs.each((index, element) => {
                pageContent += $(element).text() + '\n';
            });
            return pageContent.trim(); // Return the contents as a string, as well as removing whitespace
        }
        catch (error) {
            console.error('Error:', error.message); // Note: 'any' used for simplicity
            return ''; // Return an empty string in case of an error
        }
    });
}
function saveToCsv(data, fileName) {
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
