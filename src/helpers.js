import request from 'request-promise';
import cheerio from 'cheerio';

const getDetail = async (id) => {
  const html = await request(`https://www.imdb.com/title/${id}`, {
    transform: (body) => cheerio.load(body),
  });
  const json = html('script[type="application/ld+json"]').html();
  return JSON.parse(json);
};

export default getDetail;
