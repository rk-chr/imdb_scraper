import getDetail from './helpers';
import redis from './redis/config';

const getMovieDetails = async (req, res) => {
  const { params: { id } } = req;
  try {
    const isCached = await redis.get(id);
    if (isCached) return res.status(200).json(JSON.parse(isCached));
    const data = await getDetail(id);
    redis.set(id, JSON.stringify(data));
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({ msg: 'Movie not found' });
  }
};

export default getMovieDetails;
