const axios = require("axios");
const cheerio = require("cheerio");

function constructFilmPoster(filmId, filmSlug) {
    const splitId = filmId.split('');
    return `https://a.ltrbxd.com/resized/film-poster/${splitId.join('/')}/${filmId}-${filmSlug}-0-250-0-375-crop.jpg`;
}

async function scrapeWatchList(username) {
    const url = `https://letterboxd.com/${username}/watchlist/`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const films = [];
    $('.poster-container').each((index, element) => {
        const title = $(element).find('.film-poster').find('img').attr('alt');
        const filmId = $(element).find('.film-poster').attr('data-film-id');
        const filmSlug = $(element).find('.film-poster').attr('data-film-slug');
        const posterUrl = constructFilmPoster(filmId, filmSlug);
        films.push({
            title,
            posterUrl,
            filmId,
        });
    });
    return films;
}
module.exports = scrapeWatchList;