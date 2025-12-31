import * as model from './model.js';
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import resultView from './view/resultView.js';
import paginationView from './view/paginationView.js';
import bookmarksView from './view/bookmarkView.js';
import addRecipeView from './view/addRecipeView.js';
import sortView from './view/sortView.js';
import { MODAL_CLOSE_SEC } from './config.js';
import filterView from './view/filterView.js';

// import icons from '../img/icons.svg'; // parcel 1
// import icons from 'url:../img/icons.svg'; // parcel 2
// console.log(icons); // path of icons.svg
// console.log('loaded controller.js');

// polyfilling for old browser vite no needy, vite use ES modules, when bundling rollup it will choice add polyfill for needy
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

// const recipeContainer = document.querySelector('.recipe');

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// hot reloading
// if(module.hot){
//   module.hot.accept
// }

// get one single recipe
const controlRecipe = async function () {
  try {
    // set sort default option
    sortView.setDefultOption();
    // console.log('controlRecipe fired');
    // get hash id then we could fetch by id, MVC: not it is application itself
    const id = window.location.hash.slice(1);
    // console.log(id);
    // if id not exist or null return
    if (!id) return;

    // 0) upate result view to mark selected search result, not re-render all
    resultView.update(model.getSearchResultPage());
    // 0) update bookmark panel view when we render add or delete bookmark of recipe
    // debugger; debug mode to check error
    bookmarksView.update(model.state.bookmarks);

    // 1) loading recipe MVC: v
    //// Spinner
    recipeView.renderSpinner();

    //// model of load recipe, await to make sure model is working
    await model.loadRecipe(id);

    // 2) Render recipte
    recipeView.render(model.state.recipe);
  } catch (error) {
    // redner error from view part
    recipeView.renderError(error);
  }
};

// controlSearch event
// view(Handler) -> control(fuction call) -> view(getQuery) -> model(load、render)
const controlSearchResults = async function () {
  try {
    // set sort default option and disable tag
    filterView.disableFilterTagActive();
    sortView.setDefultOption();

    resultView.renderSpinner();

    // 1) Get search input query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) load search results from API call and store
    await model.loadSearchResults(query);

    // 3) Get 10 SearchResult
    const currPageSearchResults = model.getSearchResultPage();

    // 4) Enrich 10 search result and store
    await model.setEnrichedSearchResult(currPageSearchResults);

    // 5) Render results side bar, use getSearchResultPage() to control, and Pagination control
    // depends on how many recipes result show in one page
    // default page 1
    // console.log(model.state.search.results);
    resultView.render(currPageSearchResults);

    // 6) Render initial pagination button
    paginationView.render(model.state.search);
  } catch (error) {
    resultView.renderError(error);
  }
};

const controlSearchResultsSorted = async function () {
  try {
    // disable tag
    filterView.disableFilterTagActive();
    resultView.renderSpinner();
    // 1) Get sort input option
    const sortOption = sortView.getSortOption();
    if (!sortOption) return;

    // 2) Get enriched search result
    const enrichedResults = model.state.search.enriched;

    // 3)  check if search result is exist
    if (!enrichedResults) {
      sortView.setDefultOption();
      throw new Error('No result to sort, Please try Search something first!!');
    }
    // 4) sort currpage search results by enrichResults and sort option
    const sortedResults = model.sortSearchResult(enrichedResults, sortOption);

    // 5) update page with sorted results
    resultView.render(sortedResults);
  } catch (error) {
    resultView.renderError(error);
  }
};

const controlFilterTagClick = async function () {
  try {
    // 0) spinner
    resultView.renderSpinner();
    // 1) get CookingTime value from click button
    const value = filterView.getActiveCookingTimeValue();
    // 2) set mix/max value state
    const cookingTimeRange = model.deriveCookingTimeRange(value);
    // 3) update cookingTimeRange state
    model.updateCookingTimeState(cookingTimeRange);

    // 4) Get enriched search result
    const enrichedResults = model.state.search.enriched;

    // 5) check if search result is exist
    if (!enrichedResults) {
      filterView.disableFilterTagActive();
      sortView.setDefultOption();
      throw new Error(
        'No result to filter, Please try Search something first!!'
      );
    }

    // 6) filter enrichedResults by cookingtime
    const filtered = model.filterByCookingTime(
      enrichedResults,
      model.state.filters.cookingTime
    );
    // 7) redner currpage filtered
    resultView.render(filtered);
  } catch (error) {
    resultView.renderError(error);
  }
};

const controlPagination = async function (gotoPage) {
  // 1) set sort default option
  filterView.disableFilterTagActive();
  sortView.setDefultOption();

  // 2) get currnet search results
  const currPageSearchResults = model.getSearchResultPage(gotoPage);

  // 3) Enrich 10 search result and store
  await model.setEnrichedSearchResult(currPageSearchResults);

  // 4) Render new results side bar, by Pagination control
  resultView.render(currPageSearchResults);

  // 5) Render new initial pagination button
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Store update: update the recipe servings (in state)
  model.updateServings(newServings);
  // update all render the recipe view
  // recipeView.render(model.state.recipe)

  // UI update: only update the changed servings part attribute
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // set sort default option
  sortView.setDefultOption();
  // add/remove bookmark depends on bookmarked state
  if (!model.state.recipe.bookmarked) {
    // 1) add bookmark
    model.addBookMark(model.state.recipe);
  } else {
    // 1) remove bookmark
    model.deleteBookMark(model.state.recipe.id);
  }
  // 2) update recipe view mark bookmark after change
  recipeView.update(model.state.recipe);

  // 3) render bookmark view
  bookmarksView.render(model.state.bookmarks);
};

// to fix when update)() newEL and curEL length different, compare error when loading bookmark from localStorage by re-render bookmarkView
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// update new recipe data
const controlAddRecipe = async function (newRecipe) {
  try {
    // set sort default option
    sortView.setDefultOption();
    // show loading spinner
    addRecipeView.renderSpinner();

    // because we have async operation, so need await to make reject error from model to catch here
    // upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // render recipe view
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderMessage();

    // render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // window history API change without reloading page
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
      // reset form after upload
      addRecipeView.restForm();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error('💥', error);
    addRecipeView.renderError(error.message);
  }
};

// use foreach to let difference event could call in one event listener
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

// depends on ssub-pub pattern move this to view part, recipeVew.js
// Array.from(['hashchange', 'load']).forEach(element => {
//   // listener for hashchange, load event when recipe click, page load
//   window.addEventListener(element, controlRecipe);
// });

// create addHandlerRender to handle eventlistener to more close to MVC Architecture view part using sub-pub pattern
// keep controller do controll part mission not dom view part
const init = function () {
  recipeView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  sortView.addHandlerSort(controlSearchResultsSorted);
  paginationView.addHandlerPageButtonClick(controlPagination);
  addRecipeView.addHandlerUploadRecipe(controlAddRecipe);
  filterView.addHandlerTagClick(controlFilterTagClick);
};

init();
