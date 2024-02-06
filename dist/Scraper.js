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
const axios_1 = require("axios");
const cheerio = require("cheerio");
function scrapeWebsite(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let start = Date.now();
            const response = yield axios_1.default.get(url);
            console.log('Response data:', response.data); // Log response data to verify HTML content
            const $ = cheerio.load(response.data);
            const $selected = $('tbody.b-fight-details__table-body');
            $selected.find('tr').each((index, element) => {
                const $columns = $(element).find('.b-fight-details__table-col');
                const fighter1 = $columns.eq(0).text().trim();
                const fighter2 = $columns.eq(1).text().trim();
                const sigStr1 = $columns.eq(2).text().trim();
                const sigStr2 = $columns.eq(3).text().trim();
                const sigStrPercent1 = $columns.eq(4).text().trim();
                const sigStrPercent2 = $columns.eq(5).text().trim();
                console.log('Fighter 1:', fighter1);
                console.log('Fighter 2:', fighter2);
                console.log('Significant Strikes 1:', sigStr1);
                console.log('Significant Strikes 2:', sigStr2);
                console.log('Significant Strikes % 1:', sigStrPercent1);
                console.log('Significant Strikes % 2:', sigStrPercent2);
                console.log(''); // Separate each fighter's details with an empty line
            });
        }
        catch (error) {
            console.error('Error:', error.message); // Note: 'any' used for simplicity
        }
    });
}
// Replace 'https://example.com' with the URL you want to scrape
const targetUrl = 'http://ufcstats.com/fight-details/a74a8c1e0a49070d';
scrapeWebsite(targetUrl)
    .then(() => {
    console.log('Scraping complete.');
})
    .catch((error) => {
    console.error('Error:', error.message);
});
