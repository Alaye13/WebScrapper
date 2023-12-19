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
// src/scraper.ts
const axios_1 = require("axios");
const cheerio = require("cheerio");
function scrapeWebsite(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(url);
            const $ = cheerio.load(response.data);
            // Your scraping logic goes here
            const title = $('title').text();
            console.log('Title:', title);
        }
        catch (error) {
            console.error('Error:', error.message);
        }
    });
}
// Replace 'https://example.com' with the URL you want to scrape
const targetUrl = 'https://example.com';
scrapeWebsite(targetUrl);
