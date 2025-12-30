import icons from '../../img/icons.svg?url';

export default class View {
  _data;

  // rwite jsdoc documentation
  /**
   * Render the received object to the DOM
   * @param {Object|Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined|string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Stuart Chen
   */

  render(data, render = true) {
    // check if data is null, undefine, not array, array length = 0, than render error
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generalMarkup();

    // to get markup string from _generalMarkup method in bookmarkView.js.
    if (!render) return markup;

    this._clear();
    this._insertMarkup(markup);
  }
  // only update changed part not re-render all for recipe ingredients update: DOM select (UI diffing)
  update(data) {
    this._data = data;
    // generate new markup with new data
    const newMarkup = this._generalMarkup();
    // transfrom new markup string to real DOM object
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // transfrom recipe(new, current) attribute node list to array
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // compare newElements and curElements two array node by node
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      // change text if node、text different for only update ingredients text content
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== '' &&
        curEl
      ) {
        curEl.textContent = newEl.textContent;
        // console.log(newEl.firstChild.nodeValue.trim());
      }

      // change attribute if node different for servings update from new servings data attribute
      if (!newEl.isEqualNode(curEl) && curEl) {
        Array.from(newEl.attributes).forEach(attr => {
          // replace attribute newEl to curEl
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  _insertMarkup(markup) {
    // console.log('insert', this._parentElement);
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderSpinner() {
    const markup = `
            <div class="spinner">
                <svg>
                    <use href="${icons}#icon-loader"></use>
                </svg>
            </div>
        `;
    this._clear();
    this._insertMarkup(markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
            <div class="error">
                <div>
                  <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                  </svg>
                </div>
                <p>${message}</p>
            </div>`;
    this._clear();
    this._insertMarkup(markup);
  }
  // for success message
  renderMessage(message = this._message) {
    const markup = `
            <div class="recipe">
            <div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>`;
    this._clear();
    this._insertMarkup(markup);
  }
}
