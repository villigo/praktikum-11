export class Popup {
    constructor(element, openClassName, closeButtonClassName) {
      this.element = element;
      this.openClassName = openClassName;
      this.closeButtonClassName = closeButtonClassName;
      this.close = this.close.bind(this);
      this.open = this.open.bind(this);

      if (closeButtonClassName) {
        const closeButton = this.element.querySelector(`.${this.closeButtonClassName}`);
        closeButton.addEventListener('click', this.close);
      }
    }

    open() {
      this.element.classList.add(this.openClassName);
    }

    close() {
      this.element.classList.remove(this.openClassName);
    }
  }