export class Api {
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