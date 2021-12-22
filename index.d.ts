/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
declare const request: any;
declare const xml2js: any;
declare const isbn_ep = "http://classify.oclc.org/classify2/Classify?summary=true&isbn=";
declare const owi_ep = "http://classify.oclc.org/classify2/Classify?summary=true&owi=";
declare const title_ep = "http://classify.oclc.org/classify2/Classify?summary=true&title=";
declare type callback = (response: any) => void;
declare type response = {
    status: string;
    owi: string;
    author: string;
    title: string;
    dewey: string;
    congress: string;
};
declare function getRequest(identifier: string, endpoint: string, callback: callback): void;
/**
 * Module Test Code
 */
/** Title and Author */
/** ISBN */
//# sourceMappingURL=index.d.ts.map