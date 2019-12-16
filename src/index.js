import "./pages/index.css";

(function () {
  class Card {
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

  class CardList {
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

  class Popup {
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
  class Api {
    constructor(options) {
      this.url = options.baseUrl;
      this.method = options.method;
      this.headers = options.headers;
    }

    getResponseJson(res) {
      if (res.ok) {
        return res.json();
      }
      return new Promise.reject(console.log(res.status));
    }

    getInitialCards() {
      return fetch(this.url, {
        method: this.method,
        headers: this.headers,
      }).then((res) => this.getResponseJson(res));
    }

    loadUserData() {
      return fetch(this.url, {
        method: this.method,
        headers: this.headers,
      }).then((res) => this.getResponseJson(res));
    }

    patchPromise(name, job) {
      return fetch(this.url, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify({
          name: name,
          about: job,
        })
      })
        .then((res) => this.getResponseJson(res))
        .then((data) => { return data });
    }

  }

  const listContainer = document.querySelector('.places-list');
  const openFormAdd = document.querySelector('.user-info__button');
  const popupWindow = document.querySelector('.popup');
  const popupProfile = document.querySelector('.popup-profile');
  const popupImage = document.querySelector('.popup-img');
  const openFormEdit = document.querySelector('.user-info__button-edit');
  const buttonAddImage = document.querySelector('.popup__button');
  const buttonEditProfile = document.querySelector('.popup-profile__button');
  const form = document.forms.new;
  const formProfile = document.forms.profile;
  const userName = document.querySelector('.user-info__name');
  const userJob = document.querySelector('.user-info__job');
  const userPhoto = document.querySelector('.user-info__photo');
  const popupAdd = new Popup(popupWindow, 'popup_is-opened', 'popup__close');
  const popupEdit = new Popup(popupProfile, 'popup-profile_is-opened', 'popup-profile__close');
  const imagePopup = new Popup(popupImage, 'popup-img_is-opened', 'popup-img__close');
  const serverUrl = NODE_ENV === 'development' ? 'http://praktikum.tk/cohort5' : 'https://praktikum.tk/cohort5'
  const objCard = {
    baseUrl: `${serverUrl}/cards`,
    method: 'GET',
    headers: {
      authorization: 'f93e5a1f-53a9-46f2-833c-6422e2d7f73e',
      'Content-Type': 'application/json'
    }
  };
  const objUser = {
    baseUrl: `${serverUrl}/users/me`,
    method: 'GET',
    headers: {
      authorization: 'f93e5a1f-53a9-46f2-833c-6422e2d7f73e',
      'Content-Type': 'application/json'
    }
  }
  const apiCard = new Api(objCard);
  const apiUser = new Api(objUser);

  function addCard(event) {
    event.preventDefault();

    const { name, link } = form.elements;
    const cardList = new CardList(listContainer, [], openImagePopup);

    cardList.addCard(name.value, link.value);
    buttonAddImage.disabled = true;
    buttonAddImage.classList.add('popup__button_disabled');
    form.reset();
    popupAdd.close();
  }

  function openImagePopup() {
    const imgContent = this.cardElement.parentNode.parentNode.querySelector('.popup-img__image');
    imgContent.src = this.link;
    imagePopup.open();
  }

  function editProfile(event) {
    event.preventDefault();

    buttonEditProfile.textContent = 'Загрузка...';

    const { name, job } = formProfile.elements;

    apiUser.patchPromise(name.value, job.value).then((data) => {
      userName.textContent = data.name;
      userJob.textContent = data.about;
    }, (err) => console.log(err));

    formProfile.reset();
    popupEdit.close();
    buttonEditProfile.textContent = 'Сохранить';
  }

  function inputCheckPlace() {
    const { name, link } = event.currentTarget.elements;
    const invalidFields = name.value.length === 0 || link.value.length === 0

    if (invalidFields) {
      buttonAddImage.disabled = true;
      buttonAddImage.classList.add('popup__button_disabled');
    } else {
      buttonAddImage.removeAttribute('disabled');
      buttonAddImage.classList.remove('popup__button_disabled');
      buttonAddImage.disabled = false;
    }
  }

  function inputCheckProfile() {
    const name = event.currentTarget.elements.name;
    const job = event.currentTarget.elements.job;
    const errorMessage = event.target.nextElementSibling;

    if (name.value.length === 0 || job.value.length === 0) {
      buttonEditProfile.disabled = true;
      buttonEditProfile.classList.add('popup-profile__button_disabled');
      errorMessage.innerText = 'Это обязательное поле';
      errorMessage.style.display = 'block';
    } else if (!name.validity.valid || !job.validity.valid) {
      buttonEditProfile.disabled = true;
      buttonEditProfile.classList.add('popup-profile__button_disabled');
      errorMessage.innerText = 'Должно быть от 2 до 30 символов'
      errorMessage.style.display = 'block';
    } else {
      buttonEditProfile.removeAttribute('disabled');
      buttonEditProfile.classList.remove('popup-profile__button_disabled');
      errorMessage.style.display = 'none';
    }
  }

  openFormAdd.addEventListener('click', popupAdd.open);

  openFormEdit.addEventListener('click', function () {
    formProfile.elements.name.value = document.querySelector('.user-info__name').innerText;
    formProfile.elements.job.value = document.querySelector('.user-info__job').innerText;
    popupEdit.open();
  });

  form.addEventListener('input', inputCheckPlace);
  form.addEventListener('submit', addCard);
  formProfile.addEventListener('input', inputCheckProfile);
  formProfile.addEventListener('submit', editProfile);

  apiUser.loadUserData().then((data) => {
    userPhoto.style.backgroundImage = `url(${data.avatar})`;
    userName.textContent = data.name;
    userJob.textContent = data.about;
  }, (err) => console.log(err));

  apiCard.getInitialCards().then((initialCards) => {
    const cardList = new CardList(listContainer, initialCards, openImagePopup);
    cardList.render();
  }, (err) => console.log(err));

})();
