# Forkify Project

A dynamic recipe search and management application built while demonstrating modern JavaScript concepts. This project showcases API integration, MVC architecture, modular code organization, and DOM-driven UI updates.

## Repository

This repository contains the Forkify project, a modular JavaScript application following the MVC pattern.

- **Repository path:** `https://github.com/lit-cup/javascript-practices/tree/65b7caabf7b5df5850726c0c2ccbf4490bf76896/Project7_forkify/Guide-forkify`
- Update this section with the correct GitHub URL once known.

## Features

- Built with **MVC architecture** for clean separation of logic.
- Fetches recipes from a public API with **async/await**.
- Users can search recipes, view details, adjust servings, bookmark favorites, and sort search results within the current page.
- Clean modular structure: controllers, models, and views split by responsibility.
- Reusable UI components and update mechanisms.

## Architecture Overview (MVC)

- **Model**

  - Handles API calls, data transformation, bookmarking logic, sort logic, and application state.

- **View**

  - Responsible for rendering UI components (recipe view, search results, bookmarks, pagination, ingredients, etc.).
  - Includes reusable parent class with `render()`, `update()`, and error handling.

- **Controller**

  - Connects user actions with model updates and view rendering.
  - Controls recipe loading, search results, pagination, serving updates, bookmarks, sort search result.

## Project Structure

```
Guide-forkify/
 ├── controller.js       # Main orchestrator connecting Model & Views
 ├── model.js            # State management + API logic
 ├── config.js           # API URLs, timeout settings
 ├── views/
 │    ├── addRecipeView.js
 │    ├── bookmarksView.js
 │    ├── helpers.js          # AJAX abstraction, timeout wrapper
 │    ├── paginationView.js
 │    ├── previewView.js      # search result items ui
 │    ├── recipeView.js
 │    ├── resultsView.js      # connect all search result items ui
 │    ├── searchView.js
 │    ├── sortView.js
 │    ├── updateIconsView.js
 │    └── View.js        # Base class for all views
 ├── index.html
 └── ...
```

## Major Functionality & Effects

- **Load recipe**: Fetches recipe by ID → updates UI with spinner, error UI, or recipe content.
- **Search recipes**: API call → stores results → paginated display.
- **Pagination**: Navigates through pages without reloading data.
- **Update servings**: Adjust ingredient quantities based on new serving size.
- **Bookmarks**: Add/remove bookmarks + persist in localStorage.
- **Upload recipe**: Allows user to add custom recipes into the system.
- **Sort Search Result**: Allows user sort current result page by cooking time / servings. ensuring sorting occurs only after all asynchronous data has been resolved.

## Installation

```bash
git clone https://github.com/lit-cup/javascript-practices/tree/65b7caabf7b5df5850726c0c2ccbf4490bf76896/Project7_forkify/Guide-forkify
cd <project-folder>
```

## Usage

Provide instructions on how to run or build your project.

```bash
# Example command
npm install
npm run dev
```

## Project Structure

```
/project-root
 ├── src
 ├── public
 ├── README.md
 └── ...
```

## Deployment (Netlify)

This project is deployed on **Netlify**, allowing you to preview and interact with the live demo instantly.

### Live Demo

👉 **Demo URL:** `https://forkify-sturartchen.netlify.app/`

### How Deployment Works

- The project is built as a client-side JavaScript application.
- Netlify automatically detects the HTML/CSS/JS setup.
- No server configuration required — simply drag & drop your `dist` or project folder, or connect GitHub for auto‑deploy.

### Deployment Steps (if you want to redeploy)

1. Log into [Netlify](https://www.netlify.com/).
2. Choose **Add new site → Deploy manually** or **Import from GitHub**.
3. Upload your build folder or select your repository.
4. Wait for Netlify to finish processing.
5. Your site goes live immediately with a unique URL.

---

## License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 Chen Yi-Ting

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

This project is inspired by the course “The Complete JavaScript Course 2025”
by Jonas Schmedtmann.
```

## Author

Created by **Yi-Ting (Stuart) Chen** — Aiming to master JavaScript, build solid web applications, and prepare for remote frontend roles.

GitHub: [https://github.com/stuartchendev](https://github.com/stuartchendev)

# 📘 README ｜ Engineering Note

### ⚙️ Update vs Render Strategy (Filter / Sort Edge Case)

During development, I encountered an edge case related to the `update()` method after applying filters to the search results.

The `update()` method is designed to perform a DOM diff based on **index comparison**, assuming that the DOM structure remains stable between renders.

This assumption holds true for operations like **sorting**, where the number of items stays the same and only the order changes.

However, **filtering changes the DOM structure** by removing elements.

As a result, some existing DOM nodes no longer exist, which can cause `curEl` to be `undefined` during the update process.

To prevent unsafe DOM mutations, I added guard conditions to ensure that updates only occur when the corresponding DOM node exists:

```jsx
if (!newEl.isEqualNode(curEl) && curEl) {
  curEl.setAttribute(attr.name, attr.value);
}
```

This ensures that:

- `update()` safely becomes a no-op when the DOM structure is no longer compatible
- Filtered search results do not cause runtime errors
- Sorting behavior remains unaffected

This solution prioritizes **stability and minimal side effects**, while keeping the update logic lightweight and predictable.

> Note: For more complex UI state transformations, a key-based diff or centralized state management would be required. This was intentionally avoided to keep the project scope focused.
