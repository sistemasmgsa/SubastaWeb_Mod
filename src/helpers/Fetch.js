import { store } from '../store';

//const _apiHost = 'http://localhost:4000';
const _apiHost = `${SERVICE_URL}`;

// console.log("SERVICE_URL", SERVICE_URL);
// console.log("_apiHost", _apiHost);


async function request(url, params = {}, method = 'GET', options) {
  const { currentPortalID = 0, activeTabID = 0 } = store.getState();
  // const _options = { method, credentials: 'include', ...options };
  const _options = { method, credentials: 'same-origin', ...options };

  let _portalID = params.portalID || currentPortalID;
  let _tabID = params.tabID || activeTabID;

  url += '?' +  objectToQueryString({...params});

  return await fetch(_apiHost + url, _options);
}




function objectToQueryString(obj) {
  return Object.keys(obj)
    .map((key) => key + '=' + obj[key])
    .join('&');
}

function get(url, params, options) {
  return request(url, params, 'GET', options);
}

function post(url, params, options) {
  return request(url, params, 'POST', options);
}

function update(url, params, options) {
  return request(url, params, 'PUT', options);
}

function remove(url, params, options) {
  return request(url, params, 'DELETE', options);
}

export default {
  get,
  post,
  update,
  remove,
};
