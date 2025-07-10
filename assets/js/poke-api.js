// assets/js/poke-api.js
import { Pokemon } from "./pokemon-model.js";
import { PokemonDetailsAttributes } from "./pokemon-model.js";

export const pokeApi = {};

function convertPokeApiDetailToPokemon(pokeDetail) {
  const pokemon = new Pokemon();
  pokemon.number = pokeDetail.id;
  pokemon.name = pokeDetail.name;

  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;

  pokemon.types = types;
  pokemon.type = type;

  pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

  return pokemon;
}

async function convertPokeApiDetailsToPokemonAttributes(pokeDetail) {
  const pokemon = new PokemonDetailsAttributes();
  pokemon.number = pokeDetail.id;
  pokemon.name = pokeDetail.name;

  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
  pokemon.types = types;
  pokemon.type = types[0];

  pokemon.photo =
    pokeDetail.sprites.other.dream_world.front_default ||
    pokeDetail.sprites.front_default;

  pokemon.speciesName = pokeDetail.species.name;
  pokemon.height = pokeDetail.height;
  pokemon.weight = pokeDetail.weight;

  pokemon.abilities = pokeDetail.abilities.map(
    (abilitySlot) => abilitySlot.ability.name
  );

  try {
    const speciesResponse = await fetch(pokeDetail.species.url);
    const speciesDetail = await speciesResponse.json();

    if (speciesDetail.gender_rate === -1) {
      pokemon.genderRate = "Genderless";
    } else {
      pokemon.genderRate = speciesDetail.gender_rate;
    }

    pokemon.eggGroups = speciesDetail.egg_groups.map(
      (eggGroup) => eggGroup.name
    );
    pokemon.eggCycle = speciesDetail.hatch_counter;

    pokemon.evolutionChainUrl = speciesDetail.evolution_chain.url;
  } catch (speciesError) {
    console.warn("Não foi possível buscar detalhes da espécie:", speciesError);
    pokemon.genderRate = null;
    pokemon.eggGroups = [];
    pokemon.eggCycle = null;
    pokemon.evolutionChainUrl = null;
  }

  // Base Stats
  let totalStats = 0;
  pokeDetail.stats.forEach((statSlot) => {
    const statName = statSlot.stat.name;
    const baseStatValue = statSlot.base_stat;
    totalStats += baseStatValue;

    switch (statName) {
      case "hp":
        pokemon.hp = baseStatValue;
        break;
      case "attack":
        pokemon.attack = baseStatValue;
        break;
      case "defense":
        pokemon.defense = baseStatValue;
        break;
      case "special-attack":
        pokemon.specialAttack = baseStatValue;
        break;
      case "special-defense":
        pokemon.specialDefense = baseStatValue;
        break;
      case "speed":
        pokemon.speed = baseStatValue;
        break;
      default:
        break;
    }
  });
  pokemon.totalStats = totalStats;

  pokemon.moves = pokeDetail.moves.map((moveSlot) => moveSlot.move.name);

  const evolution = await fetch(pokemon.evolutionChainUrl).then((response) =>
    response.json()
  );

  pokemon.evolution = evolution.chain.evolves_to[0];

  return pokemon;
}

pokeApi.getPokemonDetail = (pokemon) => {
  return fetch(pokemon.url)
    .then((response) => response.json())
    .then(convertPokeApiDetailToPokemon);
};

pokeApi.getPokemons = (offset = 0, limit = 5) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  return fetch(url)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
    .then((detailRequests) => Promise.all(detailRequests))
    .then((pokemonsDetails) => pokemonsDetails);
};

pokeApi.getPokemonByName = (name) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`;
  return fetch(url)
    .then((response) => response.json())
    .then(convertPokeApiDetailsToPokemonAttributes);
};
