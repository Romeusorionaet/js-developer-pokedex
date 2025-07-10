export class Pokemon {
  number;
  name;
  type;
  types = [];
  photo;
}

export class PokemonDetailsAttributes {
  number;
  name;
  type;
  types = [];
  photo;

  // Detalhes Básicos
  speciesName;
  height;
  weight;
  abilities = [];

  // Breeding
  genderRate;
  eggGroups = [];
  eggCycle;

  // Base Stats
  hp;
  attack;
  defense;
  specialAttack;
  specialDefense;
  speed;
  totalStats;

  evolution;

  moves = [];
}
