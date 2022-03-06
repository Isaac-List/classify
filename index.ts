/**
 * @license
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

async function getRequest(request_type: string, identifier: string[], callback: callback) {
  let combined_endpoint = "";

  if (request_type == "isbn") {
    combined_endpoint = isbn_ep + identifier[0];
  }

  else if (request_type == "title-author") {
    combined_endpoint = title_ep + identifier[0] + "&author=" + identifier[1];
  }

  else if (request_type == "owi") {
    combined_endpoint = owi_ep + identifier[0];
  }

  const response = await node_fetch(combined_endpoint);
  const xml_body = await response.text();

  xml2js(xml_body, function (err: any, result: any) {
    let code = result.classify.response[0]["$"].code;

    if (code == 4) {
      let owi = result.classify.works[0].work[0]["$"].owi;
      getRequest("owi", [owi], callback);
    }
    
    else if (code == 0) {
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

exports.classify = (request_type: string, identifier: string[], callback: callback) => {
  getRequest(request_type, identifier, (data: any) => {
    callback(data);
  });
}
