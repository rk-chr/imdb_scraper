import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import autoComplete from './src';
import getMovieDetails from './src/detail';

const app = express();

app.use(cors());

// parsing the request bodys
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* link check endpoint */
app.get('/autocomplete', autoComplete);

app.get('/movies/:id', getMovieDetails);


/* health check */
app.get('/__health', (req, res) => {
  res.status(200).send('Imdb Scraper is running.....');
});

const port = 3002;

app.listen(
  port,
  () => console.log(`Imdb Scraper listening on port ${port}!`),
);


export default app;
