import Redis from 'ioredis';

/* Redis Config */
const redis = new Redis({
  port: 6379,
  host: '127.0.0.1',
  family: 4,
  db: 0,
});

redis.on('connect', () => {
  console.log('connected to redis....');
});

export default redis;
