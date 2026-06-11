export async function loadPartial(selector, path) {
  const element = document.querySelector(selector);
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Unable to load partial: ${path}`);
  }

  element.innerHTML = await response.text();
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(date));
}

export function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}
