// import { result } from "lodash-es";
import {
  API_URL,
  API_KEY,
  RES_PER_PAGE,
  SORT_OPTION_CTA,
  SORT_OPTION_CTD,
  SORT_OPTION_SA,
  SORT_OPTION_SD,
} from './config';
// import { getJson, sendJson } from "./view/helpers";
import { AJAX } from './view/helpers';
// import recipeView from "./view/recipeView";

// state: store all data we need
export const state = {
  // store recipe data
  recipe: {},
  // store search data
  search: {
    // query for future if we need to analyze what query search most
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
    enriched: null,
  },
  bookmarks: [],

  filters: {
    cookingTime: {
      min: null,
      max: null,
    },
  },
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };

  // tricky way to conditionally add object property
  // ...(recipe.key && {key: recipe.key})
};

// this model not will return anything keep it private
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);

    // const res = await fetch(`${API_URL}/${id}`);
    // const data = await res.json();
    // console.log(data);
    // // make better error message
    // if(!res.ok) throw new Error(`${data.message} (${res.status})`);

    // set recipe object with createRecipeObject function
    state.recipe = createRecipeObject(data);

    // check if current recipe is bookmarked from bookmark array we stored after click bookmark button
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    // temp error handling
    // console.log(`${error}!!!!!!!!!!`);

    // to make error come from view part
    throw error;
  }
};

// implementing the search functionality
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    // serarch when API call
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    // to reciving recipes from data create obj, store in the state
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    // init state.search.page to page 1 when everytime new search query
    state.search.page = 1;

    // console.log(state.search.results);
  } catch (error) {
    // temp error handling
    // console.log(`${error}!!!!!!!!!!`);
    // to make error come from view part
    throw error;
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  // store value to make we control page easier, default is page 1
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9

  return state.search.results.slice(start, end); // 1 page per 10 results
};

// Done: sort enrich currpage search results by cookingtime
// NOTE:
// Data: all search result, currpage result, resultsPerPage
// flow:
// sort option chnage -> result Spinner -> get currOption -> get currpage
// -> enrich currpage cookingtime & servings data
// -> sort enriched currpage -> re-render page
export const setEnrichedSearchResult = async function (currPageSearchResults) {
  // return all Promise resolve to promise then await get value
  state.search.enriched = await Promise.all(
    currPageSearchResults.map(async recipe => {
      const data = await AJAX(`${API_URL}/${recipe.id}?key=${API_KEY}`);
      //async return promise
      return {
        ...recipe,
        servings: data.data.recipe.servings,
        cookingTime: data.data.recipe.cooking_time,
      };
    })
  );
};

export const filterByCookingTime = function (recipes, { min, max }) {
  return recipes.filter(r => {
    if (min !== null && r.cookingTime < min) return false;
    if (max !== null && r.cookingTime >= max) return false;
    return true;
  });
};

export const deriveCookingTimeRange = function (activeValue) {
  if (activeValue.length === 0) {
    return { min: null, max: null };
  }

  const sorted = activeValue.sort((a, b) => a - b);

  return {
    min: sorted[0],
    max: sorted[1] ?? null,
  };
};

export const updateCookingTimeState = function (CookingTimeRange) {
  state.filters.cookingTime = CookingTimeRange;
};

export const sortSearchResult = function (enrichedResults, sortOption) {
  const results = enrichedResults.slice(); // copy array to avoid mutate original array
  if (sortOption === SORT_OPTION_CTA) {
    results.sort((a, b) => a.cookingTime - b.cookingTime);
  }
  if (sortOption === SORT_OPTION_CTD) {
    results.sort((a, b) => b.cookingTime - a.cookingTime);
  }
  if (sortOption === SORT_OPTION_SA) {
    results.sort((a, b) => a.servings - b.servings);
  }
  if (sortOption === SORT_OPTION_SD) {
    results.sort((a, b) => b.servings - a.servings);
  }
  return results;
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    // newQt = oldQt * newServing / oldServing // 2 * 8 / 4 = 4
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  // update new Serving
  state.recipe.servings = newServings;
};
// when bookmark add or delete, we persist data in localStorage
export const persistBookmarks = function () {
  // object => string
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookMark = function (recipe) {
  // add bookmark
  state.bookmarks.push(recipe);

  // Marck current recipe as bookmark
  // UI: this._data.bookmarked ? '-fill': '';
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookMark = function (id) {
  // remove bookmark in state.bookmarks array
  const index = state.bookmarks.findIndex(recipe => recipe.id === id);
  state.bookmarks.splice(index, 1);

  // Marck current recipe as NOT bookmark
  // UI: this._data.bookmarked ? '-fill': '';
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  // string => object
  if (storage) state.bookmarks = JSON.parse(storage);
};
// call once to set bookmark from localStorage when load page
init();

// debug checking localStrorage working fine
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    // use filter convert obj to arr
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // covert ingredient string to array by split with ','
        const ingArr = ing[1].trim().split(',');
        const [quantity, unit, description] = ingArr;
        // arry length checking
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)'
          );
        // empty quantity string convert to null, convert arry to object with property
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    // reconstruct recipe object to match API requirement
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients: ingredients,
    };

    // send recipe data to API
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    // set recipe object with createRecipeObject function
    // to fix {key, bookmark} not exsit in recipe object issue
    state.recipe = createRecipeObject(data);
    addBookMark(state.recipe);
  } catch (error) {
    throw error;
  }
};
