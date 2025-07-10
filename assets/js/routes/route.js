export class Router {
  routes = {};

  add(routeName, page) {
    this.routes[routeName] = page;
  }

  route(event) {
    event = event || window.event;
    event.preventDefault();

    const href = event.target.getAttribute("href");
    window.location.hash = href;
  }

  async handle() {
    const hash = window.location.hash || "#/";
    const path = hash.startsWith("#") ? hash.slice(1).split("?")[0] : "/";
    const route = this.routes[path] || this.routes[404];

    try {
      const response = await fetch(route);
      const html = await response.text();
      document.querySelector("#app").innerHTML = html;

      if (path === "/") {
        const { loadPokemonItens } = await import("../main.js");
        const pokemonList = document.getElementById("pokemonList");
        if (pokemonList) pokemonList.innerHTML = "";
        loadPokemonItens(0, 10);
      } else if (path === "/details") {
        const { loadPokemonDetails } = await import("../details.js");
        loadPokemonDetails();
      }
    } catch (error) {
      console.error("Erro ao carregar conteúdo:", error);
      document.querySelector("#app").innerHTML =
        "<h1>Página não encontrada ou erro ao carregar</h1>";
    }

    const anchor = hash.split("#")[2];
    if (anchor) {
      setTimeout(() => {
        const target = document.getElementById(anchor);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }
}
