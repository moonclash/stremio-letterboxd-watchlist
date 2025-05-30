const { addonBuilder } = require('stremio-addon-sdk');
const scrapeWatchlist = require('./scraper');

const manifest = {
  id: 'org.you.letterboxd.watchlist',
  version: '1.0.0',
  name: 'Letterboxd Watchlist',
  description: 'Displays your Letterboxd watchlist in Stremio',
  resources: ['catalog'],
  types: ['movie'],
  catalogs: [
    {
      type: 'movie',
      id: 'letterboxd-watchlist'
    }
  ]
};

const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(async () => {
  const movies = await scrapeWatchlist('your_username');
  
  const metas = movies.map(movie => ({
    id: movie.imdbId,
    name: movie.title,
    type: 'movie',
    poster: movie.posterUrl,
  }));

  return { metas };
});

module.exports = builder.getInterface();
