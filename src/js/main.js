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
const watchlistToggle = document.querySelector("#watchlist-toggle");
const watchlistCount = document.querySelector("#watchlist-count");
const watchlistLabel = document.querySelector("#watchlist-label");
const detailPanelLabel = document.querySelector("#detail-panel-label");
const statusMessage = document.querySelector("#status-message");
const detail = new SneakerDetail(document.querySelector("#detail-content"));
const news = new NewsStream(document.querySelector("#news-content"), services);

let sneakerData;
let selectedBrand = "all";
let selectedSneakerId;
let showSavedOnly = false;

async function init() {
  try {
    statusMessage.textContent = "Loading sneaker drops...";

    await Promise.all([
      loadPartial("#site-header", "./src/partials/header.html"),
      loadPartial("#site-footer", "./src/partials/footer.html")
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
  if (!sneakerData) {
    return;
  }

  const availableSneakers = showSavedOnly
    ? sneakerData.findByIds(watchList.ids())
    : sneakerData.getAll();

  const filteredSneakers = availableSneakers.filter((sneaker) => {
    const matchesBrand = selectedBrand === "all" || sneaker.brand === selectedBrand;
    const normalizedQuery = searchInput.value.trim().toLowerCase();
    const searchableText = [
      sneaker.name,
      sneaker.brand,
      sneaker.colorway,
      sneaker.athlete
    ]
      .join(" ")
      .toLowerCase();

    return matchesBrand && searchableText.includes(normalizedQuery);
  });

  const emptyMessage = showSavedOnly
    ? "No saved grails yet. Save a sneaker to see it here."
    : "No sneaker drops match your search.";

  const selectedSneakerIdBefore = selectedSneakerId;

  detailPanelLabel.textContent = showSavedOnly ? "Saved Grails" : "Selected Sneaker";

  const activeFilterButton = [...filterButtons].find((button) => button.dataset.brand === selectedBrand);
  if (activeFilterButton) {
    filterButtons.forEach((item) => item.classList.remove("active"));
    activeFilterButton.classList.add("active");
  }

  const count = watchList.count();
  watchlistCount.textContent = count;
  watchlistLabel.textContent = "Saved Grails";
  watchlistToggle.setAttribute("aria-pressed", String(showSavedOnly));
  watchlistToggle.dataset.mode = showSavedOnly ? "saved" : "all";

  statusMessage.textContent = showSavedOnly
    ? "Showing your saved grails."
    : "";

  grid.innerHTML = "";

  if (filteredSneakers.length === 0) {
    grid.innerHTML = `<p class="empty-state">${emptyMessage}</p>`;
    if (showSavedOnly) {
      const selectedSneaker = sneakerData.findById(selectedSneakerIdBefore);
      if (selectedSneaker) {
        detail.render(selectedSneaker);
        news.render(selectedSneaker.brand);
      }
    }
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

watchlistToggle.addEventListener("click", () => {
  showSavedOnly = !showSavedOnly;
  watchlistToggle.classList.toggle("active", showSavedOnly);
  render();
});

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
  if (showSavedOnly && !watchList.has(sneakerId)) {
    showSavedOnly = false;
    watchlistToggle.classList.remove("active");
  }
  render();
});

init();
