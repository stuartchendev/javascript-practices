class filterView {
  _buttonElement = document.querySelectorAll('.filter-tag');
  addHandlerTagClick(controlFilterTagClick) {
    this._buttonElement.forEach(tagBtn =>
      tagBtn.addEventListener('click', () => {
        this.toggleTagActive(tagBtn);
        controlFilterTagClick();
      })
    );
  }
  disableFilterTagActive() {
    this._buttonElement.forEach(btn => btn.classList.remove('active'));
  }
  toggleTagActive(btn) {
    btn.classList.toggle('active');
  }
  getActiveCookingTimeValue() {
    return [...document.querySelectorAll('.filter-tag.active')].map(btn =>
      Number(btn.dataset.ct)
    );
  }
}

export default new filterView();
