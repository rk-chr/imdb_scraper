import request from 'request-promise';
import redis from './redis/config';
import getDetail from './helpers';

/* eslint-disable */
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
/* eslint-enable */
const autoComplete = async (req, res) => {
  const {
    query: { q, limit },
  } = req;
  const search = q.replace(/ /gi, '_').toLowerCase();
  const isCached = await redis.get(search);
  console.log(search);
  try {
    if (isCached) return res.status(200).json(JSON.parse(isCached));
    const data = await request(
      `https://v2.sg.media-imdb.com/suggestion/${search.charAt(
        0,
      )}/${search}.json`,
      {
        json: true,
      },
    );
    if (data && data.d) {
      const getTitles = data.d.filter((title) => title.id.indexOf('tt') === 0);
      if (getTitles && getTitles.length > 0) {
        const results = [];
        await asyncForEach(getTitles.slice(0, limit || 5), async (dat) => {
          const movieDetail = await getDetail(dat.id);
          return results.push(movieDetail);
        });
        const filterMovies = (results && results.filter((titles) => titles['@type'] === 'Movie'))
          || [];
        const sortedResults = filterMovies && filterMovies.length > 0
          ? results.sort(
            (a, b) => (b && b.aggregateRating && b.aggregateRating.ratingValue) - (a && a.aggregateRating && a.aggregateRating.ratingValue),
          )
          : [];
        redis.set(search, JSON.stringify(sortedResults));
        return res.status(200).json(sortedResults);
      }
    }
    return res.status(200).json([]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Internal Server error' });
  }
};

export default autoComplete;
