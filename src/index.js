import express from 'express';
import fetch from 'isomorphic-fetch';
import Promise from 'bluebird';
import _ from 'lodash';
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
const pokemonFields = ['id', 'name', 'base_experience', 'height', 'is_default', 'order', 'weight'];

async function getPokemons(url, i = 0) {
  console.log('getPokemons ', url, i);
  const response = await fetch(url);
  const page = await response.json();
  const pokemons = page.results;
  if (__DEV__ && i > 1) {
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

async function getPokemon(url) {
  console.log('getPokemon ', url);
  const response = await fetch(url);
  const pokemon = await response.json();
  return pokemon;
}

app.get('/', async function (req, res) {
  try {
    const pokemonsUrl = `${baseUrl}/pokemon`;
    const pokemonsInfo = await getPokemons(pokemonsUrl);
    const pokemonsPromises = pokemonsInfo.map(info => {
      return getPokemon(info.url);
    });

    const pokemonsFull = await Promise.all(pokemonsPromises);
    const pokemons = pokemonsFull.map(function (pokemon) {
      return _.pick(pokemon, pokemonFields);
    });

    const sortedPokemons = _.sortBy(pokemons, pokemon => pokemon.weight);
    return res.json(sortedPokemons);
  } catch (err) {
    console.log(err);
    return res.json({ err });
  }
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
