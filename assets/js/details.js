import { pokeApi } from "./poke-api.js";

function getPokemonNameFromUrl() {
  const params = new URLSearchParams(window.location.hash.split("?")[1]);
  return params.get("name");
}

function convertPokemonDetailToHtml(pokemon) {
  return `
        <div class="pokemon-details ${pokemon.type}">
        <div class="details-content">
          <div class="wrap-text-head">
            <div class="text-type">
              <h2 class="details-name">${pokemon.name}</h2>
              <div class="details-info">
                  <ul class="details-types">
                      ${pokemon.types
                        .map((type) => `<li class=${type}>${type}</li>`)
                        .join("")}
                  </ul>
              </div>
            </div>
            <span class="details-number">#${pokemon.number}</span>
          </div>
              <img src="${pokemon.photo}" alt="${
    pokemon.name
  }" class="details-image">
            </div>
        </div>
    `;
}

function setupTabs(pokemonType) {
  const buttons = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".tab-content");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-tab");

      contents.forEach((content) => {
        content.style.display = "none";
      });

      buttons.forEach((btn) => btn.classList.remove("active-tab", pokemonType));

      const activeTab = document.getElementById(target);
      if (activeTab) {
        activeTab.style.display = "block";
      }

      button.classList.add("active-tab", pokemonType);
    });
  });

  if (buttons.length > 0) {
    buttons[0].classList.add("active-tab", pokemonType);
  }
}

function generateStatBar(label, value, maxValue = 100) {
  const percent = Math.min((value / maxValue) * 100, 100);
  const lightness = 100 - Math.floor((percent / 100) * 60);
  const backgroundColor = `hsl(120, 70%, ${lightness}%)`;

  return `
    <li class="stat-line">
      <span class="stat-label">${label}:</span>
      <span>${value}</span>
      <div class="bar-container">
        <div class="bar-fill" style="width: ${percent}%; background-color: ${backgroundColor};"></div>
        <span class="bar-value">${value}</span>
      </div>
    </li>
  `;
}

function pokemonAttributesAbout(pokemon) {
  return `
  <div class="attributes-list">
    <ul>
      <li><span>Specie name: </span> ${pokemon.speciesName}</li>
      <li><span>Weight: </span> ${pokemon.weight} kg</li>
      <li><span>Height: </span> ${pokemon.height} cm</li>
      <li><span>Abilities: </span> ${pokemon.abilities
        .map((h) => h.charAt(0).toUpperCase() + h.slice(1))
        .join(", ")}</li>
    </ul>

    <h2>Breeding</h2>

    <ul>
      <li><span>Egg Groups:</span> ${pokemon.eggGroups
        .map((eg) => eg.charAt(0).toUpperCase() + eg.slice(1))
        .join(", ")}</li>
      <li><span>Egg Cycles:</span> ${pokemon.eggCycle}</li>
    </ul>
  </div>
  `;
}

function pokemonAttributesBaseStats(pokemon) {
  return `
  <div class="attributes-list">
     <ul>
      ${generateStatBar("HP", pokemon.hp)}
      ${generateStatBar("Attack", pokemon.attack)}
      ${generateStatBar("Defense", pokemon.defense)}
      ${generateStatBar("Sp. Atk", pokemon.specialAttack)}
      ${generateStatBar("Sp. Def", pokemon.specialDefense)}
      ${generateStatBar("Speed", pokemon.speed)}
      ${generateStatBar("Total", pokemon.totalStats, 1000)}
    </ul>
  </div>
  `;
}

function pokemonAttributesEvolution(pokemon) {
  return `
  <div class="attributes-list">
    <ul>
      <li><span>Name: </span> ${pokemon.evolution.evolution_details[0].trigger.name}</li>
      <li><span>Is baby: </span> ${pokemon.evolution.is_baby}</li>
      <li><span>Min level: </span> ${pokemon.evolution.evolution_details[0].min_level}</li>
      <li><span>Needs over world rain: </span> ${pokemon.evolution.evolution_details[0].needs_overworld_rain}</li>
    </ul>

    <h2>Evolves to</h2>

    <ul>
      <li><span>Species:</span> ${pokemon.evolution.evolves_to[0].species.name}</li>
      <li><span>Turn upside down:</span> ${pokemon.evolution.evolves_to[0].evolution_details[0].turn_upside_down}</li>
    </ul>
  </div>
  `;
}

function pokemonAttributesMoves(pokemon) {
  return `
  <div class="attributes-list">
    <ul>
      <li><span>All moves:</span> ${pokemon.moves
        .map((move) => move.charAt(0).toUpperCase() + move.slice(1))
        .join(", ")}.</li>
    </ul>
  </div>
  `;
}

export function loadPokemonDetails() {
  const pokemonName = getPokemonNameFromUrl();
  const pokemonDetailCard = document.querySelector(".pokemon-detail-card");

  if (pokemonName && pokemonDetailCard) {
    pokeApi
      .getPokemonByName(pokemonName)
      .then((pokemon) => {
        pokemonDetailCard.innerHTML = convertPokemonDetailToHtml(pokemon);

        const aboutTab = document.getElementById("about");
        const baseStatsTab = document.getElementById("base-stats");
        const evolutionTab = document.getElementById("evolution");
        const movesTab = document.getElementById("moves");

        if (aboutTab) {
          aboutTab.innerHTML = pokemonAttributesAbout(pokemon);
        }

        if (baseStatsTab) {
          baseStatsTab.innerHTML = pokemonAttributesBaseStats(pokemon);
        }

        if (evolutionTab) {
          evolutionTab.innerHTML = pokemonAttributesEvolution(pokemon);
        }

        if (movesTab) {
          movesTab.innerHTML = pokemonAttributesMoves(pokemon);
        }

        setupTabs(pokemon.type);
      })
      .catch((error) => {
        console.error("Erro ao carregar detalhes do Pokémon:", error);
        pokemonDetailCard.innerHTML =
          "<p>Não foi possível carregar os detalhes do Pokémon.</p>";
      });
  } else if (!pokemonDetailCard) {
    console.warn(
      "Elemento .pokemon-detail-card não encontrado no DOM. Verifique details.html."
    );
  } else {
    pokemonDetailCard.innerHTML = "<p>Nenhum Pokémon especificado na URL.</p>";
  }
}
