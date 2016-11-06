import express from 'express';
import fetch from 'isomorphic-fetch';
import canonize from './canonize';

const __DEV__ = true;

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

async function getPokemons(url, i = 0) {
  console.log('getPokemons ', url, i);
  const response = await fetch(url);
  const page = await response.json();
  const pokemons = page.results;
  if (__DEV__ && i > 3) {
    return pokemons;
  }

  if (page.next) {
    const pokemons2 = await getPokemons(page.next, i + 1);
    return [
      ...pokemons,
      ...pokemons2,
    ];
  }

  return pokemons;
}

const pokemonsUrl = `${baseUrl}/pokemon`;
getPokemons(pokemonsUrl).then(pokemons => {
  console.log(pokemons.length);
});

app.get('/', async function (req, res) {
  try {
    const pokemonsUrl = `${baseUrl}/pokemon`;
    const pokemons = await getPokemons(pokemonsUrl);

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
