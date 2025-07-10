import { Router } from "./route.js";

const router = new Router();

router.add("/", "./pages/home.html");
router.add("/details", "./pages/details.html");
router.add(404, "./pages/404.html");

function handleRoute() {
  router.handle();
}

window.addEventListener("hashchange", handleRoute);
window.addEventListener("load", handleRoute);

document.body.addEventListener("click", (event) => {
  if (event.target.tagName === "A" && event.target.hasAttribute("data-route")) {
    event.preventDefault();
    window.location.hash = event.target.getAttribute("href");
  }
});
