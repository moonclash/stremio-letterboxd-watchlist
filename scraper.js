const axios = require("axios");
const cheerio = require("cheerio");

function constructFilmPoster(filmId, filmSlug) {
    const splitId = filmId.split('');
    return `https://a.ltrbxd.com/resized/film-poster/${splitId.join('/')}/${filmId}-${filmSlug}-0-250-0-375-crop.jpg`;
}

async function getFilmIMDBId(filmSlug) {
    const { data } = await axios.get(`https://letterboxd.com/film/${filmSlug}/`);
    const $ = cheerio.load(data);
    const imdbLink = $('a[href*="imdb.com/title/"]').attr('href');
    const imdbId = imdbLink.match(/tt+\d{1,}/)[0];
    return imdbId;
}

async function scrapeWatchList(username) {
    const url = `https://letterboxd.com/${username}/watchlist/`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const elements = $('.poster-container').toArray();

    const films = await Promise.all(elements.map(async (element) => {
        const title = $(element).find('.film-poster').find('img').attr('alt');
        const filmId = $(element).find('.film-poster').attr('data-film-id');
        const filmSlug = $(element).find('.film-poster').attr('data-film-slug');
        const posterUrl = constructFilmPoster(filmId, filmSlug);
        const imdbId = await getFilmIMDBId(filmSlug);

        return {
            title,
            posterUrl,
            filmId,
            imdbId,
            filmSlug,
        };
    }));

    return films;
}

module.exports = scrapeWatchList;