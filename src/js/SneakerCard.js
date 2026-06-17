import placeholderImage from "../assets/placeholder-shoe.svg?url";
import { formatDate, money } from "./utils.js";

export function createSneakerCard(sneaker, { selected, watched }) {
  const card = document.createElement("article");
  card.className = `sneaker-card${selected ? " selected" : ""}`;
  card.dataset.id = sneaker.id;

  card.innerHTML = `
    <div class="shoe-frame">
      <img
        src="${sneaker.image}"
        alt="${sneaker.name}"
        loading="lazy"
        referrerpolicy="no-referrer"
        onerror="this.onerror=null;this.src='${placeholderImage}'"
      />
    </div>

    <div>
      <p class="eyebrow">${sneaker.brand}</p>
      <h3>${sneaker.name}</h3>
      <p class="muted">${sneaker.colorway}</p>
      <p class="release-date">${formatDate(sneaker.releaseDate)}</p>
    </div>

    <div class="card-footer">
      <strong>${money(sneaker.retailPrice)}</strong>
      <div class="card-actions">
        <button type="button" data-action="details">Details</button>
        <button type="button" data-action="watchlist">
          ${watched ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  `;

  return card;
}
