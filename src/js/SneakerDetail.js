import { formatDate, money } from "./utils.js";

export class SneakerDetail {
  constructor(container) {
    this.container = container;
    this.timer = null;
  }

  render(sneaker) {
    clearInterval(this.timer);

    this.container.innerHTML = `
      <div class="detail-image">
        <img
          src="${sneaker.image}"
          alt="${sneaker.name}"
          loading="lazy"
        />
      </div>
      <h3>${sneaker.name}</h3>
      <p class="muted">${sneaker.colorway}</p>
      <dl class="detail-list">
        <div>
          <dt>Launch</dt>
          <dd>${formatDate(sneaker.releaseDate)}</dd>
        </div>
        <div>
          <dt>Retail</dt>
          <dd>${money(sneaker.retailPrice)}</dd>
        </div>
      </dl>
      <div id="countdown" class="countdown"></div>
      <label class="field">
        <span>Select Size</span>
        <select id="size-select">
          ${Object.entries(sneaker.sizes)
            .map(([size, price]) => `<option value="${price}">US ${size}</option>`)
            .join("")}
        </select>
      </label>
      <p id="market-value" class="market-value"></p>
    `;

    const sizeSelect = this.container.querySelector("#size-select");
    const marketValue = this.container.querySelector("#market-value");

    const updateValue = () => {
      const estimate = Number(sizeSelect.value);
      const status = estimate > sneaker.retailPrice * 1.5 ? "hot" : "steady";
      marketValue.className = `market-value ${status}`;
      marketValue.textContent = `Estimated resale value: ${money(estimate)}`;
    };

    sizeSelect.addEventListener("change", updateValue);
    updateValue();
    this.startCountdown(sneaker.releaseDate);
  }

  startCountdown(releaseDate) {
    const countdown = this.container.querySelector("#countdown");

    const update = () => {
      const remaining = new Date(releaseDate) - new Date();

      if (remaining <= 0) {
        countdown.innerHTML = "<strong>Drop is live</strong>";
        clearInterval(this.timer);
        return;
      }

      const days = Math.floor(remaining / 86400000);
      const hours = Math.floor((remaining % 86400000) / 3600000);
      const minutes = Math.floor((remaining % 3600000) / 60000);

      countdown.innerHTML = `
        <span><strong>${days}</strong> days</span>
        <span><strong>${hours}</strong> hours</span>
        <span><strong>${minutes}</strong> min</span>
      `;
    };

    update();
    this.timer = setInterval(update, 60000);
  }
}
