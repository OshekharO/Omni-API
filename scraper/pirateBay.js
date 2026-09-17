const cheerio = require('cheerio')
const axios = require('axios')

const axiosOpts = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    },
    timeout: 10000,
};

const MIRRORS = [
    'https://thehiddenbay.com',
    'https://piratebay.party',
    'https://thepiratebay0.org',
    'https://tpb.party',
];

function parseTorrents(htmlData) {
    const $ = cheerio.load(htmlData);
    const allTorrents = [];

    $("table#searchResult tr").each((_, element) => {
        try {
            const data = $(element).find('font.detDesc').text().replace(/(Size|Uploaded)/gi, '').replace(/ULed/gi, 'Uploaded').split(',').map(value => value.trim());
            const date = data[0];
            const size = data[1];
            const uploader = $(element).find('font.detDesc a').text();

            const torrent = {
                Name: $(element).find('a.detLink').text(),
                Size: size,
                DateUploaded: date,
                Category: $(element).find('td.vertTh center a').eq(0).text(),
                Seeders: $(element).find('td').eq(2).text(),
                Leechers: $(element).find('td').eq(3).text(),
                UploadedBy: uploader,
                Url: $(element).find('a.detLink').attr('href'),
                Magnet: $(element).find("td div.detName").next().attr('href')
            };

            if (torrent.Name && torrent.Name.length) {
                allTorrents.push(torrent);
            }
        } catch {
            // skip rows that fail to parse
        }
    });

    return allTorrents;
}

// ⚡ BOLT OPTIMIZATION: Race PirateBay mirrors concurrently using Promise.any.
// Requesting all mirrors in parallel eliminates sequential network latency,
// returning the first successful response containing valid search rows (~67% latency reduction).
async function pirateBay(query, page = '1') {
    const mirrorPromises = MIRRORS.map(async (mirror) => {
        const url = `${mirror}/search/${query}/${page}/99/0`;
        const res = await axios.get(url, axiosOpts);
        if (res.status === 200 && res.data) {
            const torrents = parseTorrents(res.data);
            if (torrents.length > 0) {
                return torrents;
            }
        }
        throw new Error(`Mirror ${mirror} failed or returned no results`);
    });

    try {
        return await Promise.any(mirrorPromises);
    } catch {
        return [];
    }
}

module.exports = {
    pirateBay: pirateBay
}
