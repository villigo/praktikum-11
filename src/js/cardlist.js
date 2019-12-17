import {Card} from './card';

export class CardList {
    constructor(container, dataArray = [], openImagePopup) {
      this.container = container;
      this.dataArray = dataArray;
      this.openImagePopup = openImagePopup;
    }

    addCard(name, link) {
      this.card = new Card(name, link, this.openImagePopup);
      this.container.appendChild(this.card.cardElement);
    }

    render() {
      for (let i = 0; i < this.dataArray.length; i++) {
        this.addCard(this.dataArray[i].name, this.dataArray[i].link);
      }
    }
  }