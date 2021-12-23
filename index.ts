/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const node_fetch = require('node-fetch');
const xml2js = require('xml2js').parseString;


const isbn_ep = "http://classify.oclc.org/classify2/Classify?summary=true&isbn=";
const owi_ep = "http://classify.oclc.org/classify2/Classify?summary=true&owi=";
const title_ep = "http://classify.oclc.org/classify2/Classify?summary=true&title=";

type callback = (response: any) => void;

type response = {
  status: string;
  owi: string;
  author: string
  title: string;
  dewey: string;
  congress: string;
};

async function getRequest(identifier: string, endpoint: string, callback: callback) {
  let combined_endpoint = "";

  if (typeof(identifier) == "string") {
    combined_endpoint = endpoint + identifier;
  }

  else if(Array.isArray(identifier)) {
    combined_endpoint = endpoint + identifier[0] + "&author=" + identifier[1];
  }

  const response = await node_fetch(combined_endpoint);
  const xml_body = await response.text();

  xml2js(xml_body, function (err: any, result: any) {
    let code = result.classify.response[0]["$"].code;

    if (code == 4) {
      let owi = result.classify.works[0].work[0]["$"].owi;
      getRequest(owi, owi_ep, callback);
    }
    
    else {
      result = result.classify;

      try {
        let response = {
          status: result.response[0]['$'].code,
          owi: result.work[0]["$"].owi,
          author: result.work[0]["$"].author,
          title: result.work[0]["$"].title,
          dewey: result.recommendations[0].ddc[0].mostPopular[0]['$'].sfa,
          congress: result.recommendations[0].lcc[0].mostPopular[0]['$'].sfa
        }
        callback(response)
      } catch (e) {
        console.log("Encountered an Error:", e);
      }
    }
  });
}

exports.classify = (identifier: string, type: string, callback: callback) => {
  if (type == "isbn") {
    getRequest(identifier, isbn_ep, (data: any) => {
      callback(data);
    });
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
