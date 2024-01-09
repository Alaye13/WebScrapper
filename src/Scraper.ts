import { existsSync, mkdir, mkdirSync, read } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import axios, { AxiosError } from "axios";
import { JSDOM } from 'jsdom';
/**
 * @param url 
 * @returns HTML data from a url
 */
function fetchPage(url:string): Promise<string | undefined> {
    const HTMLData = axios.get(url).then(res => res.data).catch((error: AxiosError) => {
        console.error(`There was an error with ${error}`);
        console.error(error.toJSON());
    });

    return HTMLData;
}

/**
 * Determines whether to get data from the cache or web.
 * If from web it will save the html file to cache. 
 * @param url 
 * @param ignoreCache 
 * @returns 
 */
async function fetchFromWebOrCache(url: string, ignoreCache = false) {
    
    // if no cache folder, create it.
    if(!existsSync(resolve(__dirname, '.cache'))) {
        mkdirSync('.cache');
    }

    console.log(`Getting data for ${url}...`);
    if(!ignoreCache && existsSync(
        resolve(__dirname, `.cache/${Buffer.from(url).toString('base64')}.html`),
      )){
        console.log(`${url} read from cache`);
        const HTMLData = await readFile(
            resolve(__dirname, `.cache/${Buffer.from(url).toString('base64')}.html`),
            { encoding: 'utf8' },
          );
        const dom = new JSDOM(HTMLData);
        return dom.window.document
    }else {
        console.log(`fetching url from web`);
        const HTMLData = await fetchPage(url);

        if (!ignoreCache && HTMLData) {
            writeFile(
              resolve(
                __dirname,
                `.cache/${Buffer.from(url).toString('base64')}.html`,
              ),
              HTMLData,
              { encoding: 'utf8' },
            );
        }
        const dom = new JSDOM(HTMLData);
        return dom.window.document
    }                                                                               
}

/**
 * Extract all the data from the main page table and also the sub-pages
 * @param document 
 * @returns an array of objects  
 */
async function extractData(document: Document) {
  try {
    //Main page details
    const baseURL = 'https://www.gardenate.com';
    const plantListDiv = document.querySelector('.plant-list');
    const table = plantListDiv?.querySelector('.table.table-striped.table-hover');
    const rows = table?.querySelectorAll('tbody tr');

    const extractedData: extractData[] = [];
    if (rows) {
      const promises = Array.from(rows).map(async (row) => {
        const columns = row.querySelectorAll('td');
        if (columns.length >= 2) {
          const title = columns[0].querySelector('a')?.textContent || '';
          const urlPath = columns[0].querySelector('a')?.href || '';
          const url = new URL(urlPath, baseURL).toString();
          const instructions = columns[1]?.textContent || '';

          // Fetch the secondary page data for the url
          const pageDocument = await fetchFromWebOrCache(url);
          const infoDiv = pageDocument.querySelector('.info');
          const sowingData = infoDiv?.querySelector('.sowing')?.textContent || '';
          const spacing = infoDiv?.querySelector('.spacing')?.textContent || '';
          const harvest = infoDiv?.querySelector('.harvest')?.textContent || '';

          const sowing = sowingData.replace('(Show °F/in)', '');

          extractedData.push({ title, url, instructions, sowing, spacing, harvest });
        }
      });
      await Promise.all(promises);
    }

    const cleanData = cleanedExtractedData(extractedData);
    return cleanData.map(data => {
      return {
        ...data
      }
    })

  } catch (error) {
    console.error('Error:', error)
  };
}

/**
 * Saves data to files
 * @param filename 
 * @param data 
 */
function saveData(filename: string, data: any) {
  if (!existsSync(resolve(__dirname, 'data'))) {
    mkdirSync('data');
  }
  writeFile(resolve(__dirname, `data/${filename}.json`), JSON.stringify(data), {
    encoding: 'utf8',
  });
}

/**
 * Main function that determines url and months for data extraction
 */
export async function getData() {
  const months = 12;
  for (let i = 0; i < months; i++) {
    const document = await fetchFromWebOrCache(
      `http://ufcstats.com/fight-details/a74a8c1e0a49070d=${i + 1}`,
      true
    );
    const data = await extractData(document); // Add await here
    saveData(`gardenate ${i + 1}`, data);
  }
}

/**
 * Cleanup data to remove tabulation and spaces
 * @param extractedData 
 * @returns 
 */
function cleanedExtractedData(extractedData: extractData[]): extractData[]{  
    return extractedData.map(data => {
        return {
        ...data,
        instructions: data.instructions.replace(/\t/g, '').replace(/\n/g, ''),
        sowing: data.sowing.replace(/\t/g, '').replace(/\n/g, ''),
        spacing: data.spacing.replace(/\t/g, '').replace(/\n/g, ''),
        harvest: data.harvest.replace(/\t/g, '').replace(/\n/g, ''), // Remove all \t occurrences
        };
    })
};

type extractData = {
    title: string,
    url: string,
    instructions: string,
    sowing: string,
    spacing: string ,
    harvest: string ,

}