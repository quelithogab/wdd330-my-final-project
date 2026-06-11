import { ExternalServices } from "./ExternalServices.js";
import { SneakerData } from "./SneakerData.js";
import { createSneakerCard } from "./SneakerCard.js";
import { SneakerDetail } from "./SneakerDetail.js";
import { WatchList } from "./WatchList.js";
import { NewsStream } from "./NewsStream.js";
import { loadPartial } from "./utils.js";

const services = new ExternalServices();
const watchList = new WatchList();

const grid = document.querySelector("#sneaker-grid");
const searchInput = document.querySelector("#search-input");
const filterButtons = document.querySelectorAll(".brand-filter button");
const watchlistCount = document.querySelector("#watchlist-count");
const statusMessage = document.querySelector("#status-message");
const detail = new SneakerDetail(document.querySelector("#detail-content"));
const news = new NewsStream(document.querySelector("#news-content"), services);

let sneakerData;
let selectedBrand = "all";
let selectedSneakerId;

async function init() {
  try {
    await Promise.all([
      loadPartial("#site-header", "/src/partials/header.html"),
      loadPartial("#site-footer", "/src/partials/footer.html")
    ]);

    const sneakers = await services.getSneakers();
    sneakerData = new SneakerData(sneakers);
    selectedSneakerId = sneakerData.getAll()[0]?.id;
    render();
  } catch (error) {
    statusMessage.textContent = "The sneaker catalog could not be loaded.";
    console.error(error);
  }
}

function render() {
  const filteredSneakers = sneakerData.filter({
    brand: selectedBrand,
    query: searchInput.value
  });

  grid.innerHTML = "";
  statusMessage.textContent = "";
  watchlistCount.textContent = watchList.count();

  if (filteredSneakers.length === 0) {
    grid.innerHTML = `<p class="empty-state">No sneaker drops match your search.</p>`;
    return;
  }

  if (!filteredSneakers.some((sneaker) => sneaker.id === selectedSneakerId)) {
    selectedSneakerId = filteredSneakers[0].id;
  }

  filteredSneakers.forEach((sneaker) => {
    grid.append(
      createSneakerCard(sneaker, {
        selected: sneaker.id === selectedSneakerId,
        watched: watchList.has(sneaker.id)
      })
    );
  });

  const selectedSneaker = sneakerData.findById(selectedSneakerId);
  detail.render(selectedSneaker);
  news.render(selectedSneaker.brand);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedBrand = button.dataset.brand;
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    render();
  });
});

searchInput.addEventListener("input", render);

grid.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  const card = event.target.closest(".sneaker-card");

  if (!button || !card) {
    return;
  }

  const sneakerId = card.dataset.id;

  if (button.dataset.action === "watchlist") {
    watchList.toggle(sneakerId);
  }

  selectedSneakerId = sneakerId;
  render();
});

init();
