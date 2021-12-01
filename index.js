/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

// import request from "requests";
const request = require('request');
const xml2js = require('xml2js').parseString;

const ENDPOINT = "http://classify.oclc.org/classify2/Classify?summary=true&isbn=";
const sec_ep = "http://classify.oclc.org/classify2/Classify?summary=true&owi=";

function getRequest(identifier, endpoint, callback) {
  request({
    url: endpoint + identifier,
    json: true,
    headers: {
      'User-Agent': 'npm-classify2'
    }
  },
  function (error, response, body) {
    if (error) {
      callback(null);
    }

    xml2js(body, function (err, result) {
      let code = result.classify.response[0]["$"].code;
      if (code == 4) {
        let owi = result.classify.works[0].work[0]["$"].owi;
        getRequest(owi, sec_ep, callback);
      }
      
      else {
        result = result.classify;

        let response = {};
        try {
          response.status = result.response[0]['$'].code,
          response.owi = result.work[0]["$"].owi
          response.author = result.work[0]["$"].author;
          response.title = result.work[0]["$"].title;
          response.dewey = result.recommendations[0].ddc[0].mostPopular[0]['$'].sfa,
          response.congress = result.recommendations[0].lcc[0].mostPopular[0]['$'].sfa
        } catch (e) {
          console.log("Encountered an Error");
        }
        callback(response)
      }
    })
  }
  )
}

export function classify(identifier) {
  let response = getRequest(identifier, ENDPOINT, function (data) {
    return data;
  });

  console.log("Response: ", response);
  return response;
}

// Module Test Code
getRequest("0380807343", ENDPOINT, function (data) {
  console.log(data);
});
