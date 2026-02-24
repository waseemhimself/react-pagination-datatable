# Artworks DataTable (Server-Side Pagination + Persistent Selection)

## Overview

This project is a React + TypeScript application built using Vite and PrimeReact.

It displays artwork data from the Art Institute of Chicago API with:

- Server-side pagination
- Persistent row selection across pages
- Custom "Select First N Rows" feature
- No prefetching of extra pages
- Memory-safe ID-based selection logic

---

## Tech Stack

- React (Vite)
- TypeScript
- PrimeReact DataTable
- Art Institute of Chicago Public API

---

## Features

### Server-Side Pagination
- Only the currently viewed page is fetched from the API.
- No preloading of additional pages.
- Pagination is handled via API query parameters.

### Persistent Row Selection
- Selected rows remain selected when navigating between pages.
- Selection is maintained using artwork IDs.
- No storage of full row objects from other pages.

### Custom Row Selection
- User can input a number (N).
- Automatically selects the first N artworks globally.
- Uses global index calculation.
- Does NOT fetch additional pages.
- Manual deselection inside the range is supported.
