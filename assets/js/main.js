import { pokeApi } from "./poke-api.js";

const pokemonList = document.getElementById("pokemonList");
const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
  return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <a href="#/details?name=${pokemon.name}" class="nameNav">${
    pokemon.name
  }</a>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join("")}
                </ol>

                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `;
}

export function loadPokemonItens(currentOffset, currentLimit) {
  pokeApi.getPokemons(currentOffset, currentLimit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    if (pokemonList) {
      pokemonList.innerHTML += newHtml;
    }
  });

  const newLoadMoreButton = document.getElementById("loadMoreButton");
  if (newLoadMoreButton) {
    newLoadMoreButton.removeEventListener("click", handleLoadMore);
    newLoadMoreButton.addEventListener("click", handleLoadMore);
  }
}

function handleLoadMore() {
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);
    const currentLoadMoreButton = document.getElementById("loadMoreButton");
    if (currentLoadMoreButton && currentLoadMoreButton.parentElement) {
      currentLoadMoreButton.parentElement.removeChild(currentLoadMoreButton);
    }
  } else {
    loadPokemonItens(offset, limit);
  }
}
