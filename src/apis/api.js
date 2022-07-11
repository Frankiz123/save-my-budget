import { BASE_URL } from './urls';
class XHR {
  static defaultHeaders() {
    return {
      Accept: 'application/json',
      'x-api-key': 'X_API_KEY',
      'Content-Type': 'application/json',
    };
  }
  static get(url, headers = null) {
    return this.xhr(url, null, 'GET', headers);
  }

  static post(url, params, headers = null) {
    return this.xhr(url, params, 'POST', headers);
  }

  static xhr(url, params, verb, headers) {
    let options = Object.assign(
      { method: verb },
      params ? { body: params } : null,
    );
    options.headers = headers ? headers : XHR.defaultHeaders();

    let finalUrl = BASE_URL + url;
    console.log(BASE_URL, url, params);

    return fetch(finalUrl, options)
      .then((res) => res.json())
      .then((json) => {
        // console.log(url, 'header', headers, 'body', json);r
        return json;
      })
      .catch((e) => {
        console.log(e);
        return e;
      });
  }
}
export default XHR;
