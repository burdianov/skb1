import express from 'express';
import fetch from 'isomorphic-fetch';
import canonize from './canonize';

const app = express();

app.get('/canonize', function (req, res) {
  // console.log(req.query);
  const username = canonize(req.query.url);
  return res.json({
    url: req.query.url,
    username,
  });
});

const baseUrl = 'https://pokeapi.co/api/v2';

async function getAllPokemons() {
  const response = await fetch(`${baseUrl}/pokemon`);
  const page = await response.json();
  const pokemons = page.results;
}


app.get('/', async function (req, res) {
  try {
    const pokemons = await getAllPokemons();

    return res.json({
      qwe: 123,
      pokemons,
    });
  } catch (err) {
    console.log(err);
    return res.json({ err });
  }
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
