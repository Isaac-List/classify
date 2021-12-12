/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const request = require('request');
const xml2js = require('xml2js').parseString;

const isbn_ep = "http://classify.oclc.org/classify2/Classify?summary=true&isbn=";
const owi_ep = "http://classify.oclc.org/classify2/Classify?summary=true&owi=";
const title_ep = "http://classify.oclc.org/classify2/Classify?summary=true&title="

function getRequest(identifier, endpoint, callback) {
  let combined_endpoint = "";

  if (typeof(identifier) == "string") {
  	combined_endpoint = endpoint + identifier;
  }
  
  else if(Array.isArray(identifier)) {
  	combined_endpoint = endpoint + identifier[0] + "&author=" + identifier[1];
  }
  
  request({
    url: combined_endpoint,
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
        getRequest(owi, owi_ep, callback);
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
          console.log("Encountered an Error:", e);
        }
        callback(response)
      }
    })
  }
  )
}

exports.classify = function (identifier, callback, type) {
  if (type == "isbn") {
    getRequest(identifier, isbn_ep, function (data) {
      callback(data);
    });
  }

  else if (type == "title-author") {
  	getRequest(identifier, title_ep, function (data) {
  	  callback(data);	
  	});
  }

  else {
  	callback("please provide a supported type: isbn or title-author");
  }
}

/**
 * Module Test Code
 */

/** Title and Author */
// getRequest(["Coraline", ""], title_ep, function (data) {
//   let title = data.title;
//   let author = data.author;

//   console.log("Request with Title:")
//   console.log("Title:", title);
// });

/** ISBN */
// getRequest("0380807343", isbn_ep, function (data) {
//   let title = data.title;
//   let author = data.author;

//   console.log("Request with ISBN:");
//   console.log("Title:", title);
//   console.log("Author:", author);
// });
