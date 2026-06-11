# The Sneaker Drop Tracker

A WDD330 final project that tracks upcoming sneaker releases, lets users save favorite drops, estimates resale value by size, and displays streetwear news by brand.

## Features

- Professional dashboard-style user interface
- Local sneaker product catalog
- Real product image URLs for each sneaker
- NewsAPI integration with fallback news
- Search by sneaker name, brand, colorway, or athlete
- Brand filtering
- Persistent "My Grails" watchlist using `localStorage`
- Sneaker detail panel
- Countdown timer
- Size-based resale estimate
- Header and footer partials loaded with JavaScript

## API Plan

The app uses a local JSON sneaker catalog as the primary product source so the project works reliably on localhost and GitHub Pages.

NewsAPI.org is supported through the `VITE_NEWS_API_KEY` environment variable. If no key is provided or the request fails, the app displays fallback news content.

## Run Locally

```bash
npm install
npm start
```

Then open the localhost URL shown in the terminal.

## Optional NewsAPI Setup

Create a `.env` file in the project root:

```text
VITE_NEWS_API_KEY=your_newsapi_key_here
```

Restart the dev server after adding the key.
