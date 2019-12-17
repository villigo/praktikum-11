export class Card {
    constructor(name, link, openImageCallback) {
      this.name = name;
      this.link = link;
      this.openImageCallback = openImageCallback;
      this.cardElement = this.create();
      this.like = this.like.bind(this);
      this.remove = this.remove.bind(this);
      this.openImg = this.openImg.bind(this);
      this.cardElement.querySelector('.place-card__like-icon').addEventListener('click', this.like);
      this.cardElement.querySelector('.place-card__image').addEventListener('click', this.openImg);
      this.cardElement.querySelector('.place-card__delete-icon').addEventListener('click', this.remove);
    }

    create() {
      const imageContainer = document.createElement('div');
      const imageCard = document.createElement('div');
      const buttonDelete = document.createElement('button');

      const cardDescription = document.createElement('div');
      const cardName = document.createElement('h3');
      const cardButtonLike = document.createElement('button');

      imageContainer.classList.add('place-card');
      imageCard.classList.add('place-card__image');
      imageCard.style.backgroundImage = `url(${this.link})`;
      buttonDelete.classList.add('place-card__delete-icon');

      cardDescription.classList.add('place-card__description');
      cardName.classList.add('place-card__name');
      cardName.textContent = this.name;
      cardButtonLike.classList.add('place-card__like-icon');

      imageContainer.appendChild(imageCard);
      imageCard.appendChild(buttonDelete);
      imageContainer.appendChild(cardDescription);
      cardDescription.appendChild(cardName);
      cardDescription.appendChild(cardButtonLike);

      return imageContainer;
    }

    like() {
      this.cardElement.querySelector('.place-card__like-icon').classList.toggle('place-card__like-icon_liked');
    }

    remove() {
      this.cardElement.parentNode.removeChild(this.cardElement);
    }

    openImg() {
      this.openImageCallback(this.link);
    }
  }