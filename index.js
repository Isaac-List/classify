/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
const request = require('request');
const xml2js = require('xml2js').parseString;
const isbn_ep = "http://classify.oclc.org/classify2/Classify?summary=true&isbn=";
const owi_ep = "http://classify.oclc.org/classify2/Classify?summary=true&owi=";
const title_ep = "http://classify.oclc.org/classify2/Classify?summary=true&title=";
function getRequest(identifier, endpoint, callback) {
    let combined_endpoint = "";
    if (typeof (identifier) == "string") {
        combined_endpoint = endpoint + identifier;
    }
    else if (Array.isArray(identifier)) {
        combined_endpoint = endpoint + identifier[0] + "&author=" + identifier[1];
    }
    request({
        url: combined_endpoint,
        json: true,
        headers: {
            'User-Agent': 'npm-classify2'
        }
    }, function (error, response, body) {
        if (error) {
            callback(error);
        }
        /** @param result is json of xml body */
        xml2js(body, function (err, result) {
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
                    };
                    callback(response);
                }
                catch (e) {
                    console.log("Encountered an Error:", e);
                }
            }
        });
    });
}
exports.classify = function (identifier, type, callback) {
    if (type == "isbn") {
        getRequest(identifier, isbn_ep, (data) => {
            callback(data);
        });
    }
    else if (type == "title-author") {
        getRequest(identifier, title_ep, (data) => {
            callback(data);
        });
    }
    else {
        callback("please provide a supported type: isbn or title-author");
    }
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztHQUlHO0FBRUgsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ25DLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxXQUFXLENBQUM7QUFFN0MsTUFBTSxPQUFPLEdBQUcsZ0VBQWdFLENBQUM7QUFDakYsTUFBTSxNQUFNLEdBQUcsK0RBQStELENBQUM7QUFDL0UsTUFBTSxRQUFRLEdBQUcsaUVBQWlFLENBQUM7QUFZbkYsU0FBUyxVQUFVLENBQUMsVUFBa0IsRUFBRSxRQUFnQixFQUFFLFFBQWtCO0lBQzFFLElBQUksaUJBQWlCLEdBQUcsRUFBRSxDQUFDO0lBRTNCLElBQUksT0FBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLFFBQVEsRUFBRTtRQUNuQyxpQkFBaUIsR0FBRyxRQUFRLEdBQUcsVUFBVSxDQUFDO0tBQzFDO1NBRUksSUFBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQ2xDLGlCQUFpQixHQUFHLFFBQVEsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMxRTtJQUVELE9BQU8sQ0FBQztRQUNOLEdBQUcsRUFBRSxpQkFBaUI7UUFDdEIsSUFBSSxFQUFFLElBQUk7UUFDVixPQUFPLEVBQUU7WUFDUCxZQUFZLEVBQUUsZUFBZTtTQUM5QjtLQUNGLEVBQ0QsVUFBVSxLQUFVLEVBQUUsUUFBYSxFQUFFLElBQVM7UUFDNUMsSUFBSSxLQUFLLEVBQUU7WUFDVCxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDakI7UUFFRCx3Q0FBd0M7UUFDeEMsTUFBTSxDQUFDLElBQUksRUFBRSxVQUFVLEdBQVEsRUFBRSxNQUFXO1lBQzFDLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNqRCxJQUFJLElBQUksSUFBSSxDQUFDLEVBQUU7Z0JBQ2IsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQztnQkFDcEQsVUFBVSxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7YUFDbkM7aUJBRUk7Z0JBQ0gsTUFBTSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7Z0JBRXpCLElBQUk7b0JBQ0YsSUFBSSxRQUFRLEdBQUc7d0JBQ2IsTUFBTSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSTt3QkFDcEMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRzt3QkFDNUIsTUFBTSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTTt3QkFDbEMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSzt3QkFDaEMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHO3dCQUMvRCxRQUFRLEVBQUUsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUc7cUJBQ25FLENBQUE7b0JBQ0QsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO2lCQUNuQjtnQkFBQyxPQUFPLENBQUMsRUFBRTtvQkFDVixPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUN6QzthQUNGO1FBQ0gsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQ0EsQ0FBQTtBQUNILENBQUM7QUFFRCxPQUFPLENBQUMsUUFBUSxHQUFHLFVBQVUsVUFBa0IsRUFBRSxJQUFZLEVBQUUsUUFBa0I7SUFDL0UsSUFBSSxJQUFJLElBQUksTUFBTSxFQUFFO1FBQ2xCLFVBQVUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLENBQUMsSUFBUyxFQUFFLEVBQUU7WUFDNUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pCLENBQUMsQ0FBQyxDQUFDO0tBQ0o7U0FFSSxJQUFJLElBQUksSUFBSSxjQUFjLEVBQUU7UUFDaEMsVUFBVSxDQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxJQUFTLEVBQUUsRUFBRTtZQUM3QyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakIsQ0FBQyxDQUFDLENBQUM7S0FDSDtTQUVJO1FBQ0osUUFBUSxDQUFDLHVEQUF1RCxDQUFDLENBQUM7S0FDbEU7QUFDSCxDQUFDLENBQUE7QUFFRDs7R0FFRztBQUVILHVCQUF1QjtBQUN2QiwyREFBMkQ7QUFDM0QsNEJBQTRCO0FBQzVCLDhCQUE4QjtBQUU5Qix1Q0FBdUM7QUFDdkMsa0NBQWtDO0FBQ2xDLE1BQU07QUFFTixXQUFXO0FBQ1gsc0RBQXNEO0FBQ3RELDRCQUE0QjtBQUM1Qiw4QkFBOEI7QUFFOUIsdUNBQXVDO0FBQ3ZDLGtDQUFrQztBQUNsQyxvQ0FBb0M7QUFDcEMsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhpcyBTb3VyY2UgQ29kZSBGb3JtIGlzIHN1YmplY3QgdG8gdGhlIHRlcm1zIG9mIHRoZSBNb3ppbGxhIFB1YmxpY1xuICogTGljZW5zZSwgdi4gMi4wLiBJZiBhIGNvcHkgb2YgdGhlIE1QTCB3YXMgbm90IGRpc3RyaWJ1dGVkIHdpdGggdGhpc1xuICogZmlsZSwgWW91IGNhbiBvYnRhaW4gb25lIGF0IGh0dHBzOi8vbW96aWxsYS5vcmcvTVBMLzIuMC8uXG4gKi9cblxuY29uc3QgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QnKTtcbmNvbnN0IHhtbDJqcyA9IHJlcXVpcmUoJ3htbDJqcycpLnBhcnNlU3RyaW5nO1xuXG5jb25zdCBpc2JuX2VwID0gXCJodHRwOi8vY2xhc3NpZnkub2NsYy5vcmcvY2xhc3NpZnkyL0NsYXNzaWZ5P3N1bW1hcnk9dHJ1ZSZpc2JuPVwiO1xuY29uc3Qgb3dpX2VwID0gXCJodHRwOi8vY2xhc3NpZnkub2NsYy5vcmcvY2xhc3NpZnkyL0NsYXNzaWZ5P3N1bW1hcnk9dHJ1ZSZvd2k9XCI7XG5jb25zdCB0aXRsZV9lcCA9IFwiaHR0cDovL2NsYXNzaWZ5Lm9jbGMub3JnL2NsYXNzaWZ5Mi9DbGFzc2lmeT9zdW1tYXJ5PXRydWUmdGl0bGU9XCI7XG5cbnR5cGUgY2FsbGJhY2sgPSAocmVzcG9uc2U6IGFueSkgPT4gdm9pZDtcbnR5cGUgcmVzcG9uc2UgPSB7XG4gIHN0YXR1czogc3RyaW5nO1xuICBvd2k6IHN0cmluZztcbiAgYXV0aG9yOiBzdHJpbmdcbiAgdGl0bGU6IHN0cmluZztcbiAgZGV3ZXk6IHN0cmluZztcbiAgY29uZ3Jlc3M6IHN0cmluZztcbn07XG5cbmZ1bmN0aW9uIGdldFJlcXVlc3QoaWRlbnRpZmllcjogc3RyaW5nLCBlbmRwb2ludDogc3RyaW5nLCBjYWxsYmFjazogY2FsbGJhY2spIHtcbiAgbGV0IGNvbWJpbmVkX2VuZHBvaW50ID0gXCJcIjtcblxuICBpZiAodHlwZW9mKGlkZW50aWZpZXIpID09IFwic3RyaW5nXCIpIHtcbiAgXHRjb21iaW5lZF9lbmRwb2ludCA9IGVuZHBvaW50ICsgaWRlbnRpZmllcjtcbiAgfVxuICBcbiAgZWxzZSBpZihBcnJheS5pc0FycmF5KGlkZW50aWZpZXIpKSB7XG4gIFx0Y29tYmluZWRfZW5kcG9pbnQgPSBlbmRwb2ludCArIGlkZW50aWZpZXJbMF0gKyBcIiZhdXRob3I9XCIgKyBpZGVudGlmaWVyWzFdO1xuICB9XG4gIFxuICByZXF1ZXN0KHtcbiAgICB1cmw6IGNvbWJpbmVkX2VuZHBvaW50LFxuICAgIGpzb246IHRydWUsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ1VzZXItQWdlbnQnOiAnbnBtLWNsYXNzaWZ5MidcbiAgICB9XG4gIH0sXG4gIGZ1bmN0aW9uIChlcnJvcjogYW55LCByZXNwb25zZTogYW55LCBib2R5OiBhbnkpIHtcbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIGNhbGxiYWNrKGVycm9yKTtcbiAgICB9XG5cbiAgICAvKiogQHBhcmFtIHJlc3VsdCBpcyBqc29uIG9mIHhtbCBib2R5ICovXG4gICAgeG1sMmpzKGJvZHksIGZ1bmN0aW9uIChlcnI6IGFueSwgcmVzdWx0OiBhbnkpIHtcbiAgICAgIGxldCBjb2RlID0gcmVzdWx0LmNsYXNzaWZ5LnJlc3BvbnNlWzBdW1wiJFwiXS5jb2RlO1xuICAgICAgaWYgKGNvZGUgPT0gNCkge1xuICAgICAgICBsZXQgb3dpID0gcmVzdWx0LmNsYXNzaWZ5LndvcmtzWzBdLndvcmtbMF1bXCIkXCJdLm93aTtcbiAgICAgICAgZ2V0UmVxdWVzdChvd2ksIG93aV9lcCwgY2FsbGJhY2spO1xuICAgICAgfVxuICAgICAgXG4gICAgICBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0LmNsYXNzaWZ5O1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgbGV0IHJlc3BvbnNlID0ge1xuICAgICAgICAgICAgc3RhdHVzOiByZXN1bHQucmVzcG9uc2VbMF1bJyQnXS5jb2RlLFxuICAgICAgICAgICAgb3dpOiByZXN1bHQud29ya1swXVtcIiRcIl0ub3dpLFxuICAgICAgICAgICAgYXV0aG9yOiByZXN1bHQud29ya1swXVtcIiRcIl0uYXV0aG9yLFxuICAgICAgICAgICAgdGl0bGU6IHJlc3VsdC53b3JrWzBdW1wiJFwiXS50aXRsZSxcbiAgICAgICAgICAgIGRld2V5OiByZXN1bHQucmVjb21tZW5kYXRpb25zWzBdLmRkY1swXS5tb3N0UG9wdWxhclswXVsnJCddLnNmYSxcbiAgICAgICAgICAgIGNvbmdyZXNzOiByZXN1bHQucmVjb21tZW5kYXRpb25zWzBdLmxjY1swXS5tb3N0UG9wdWxhclswXVsnJCddLnNmYVxuICAgICAgICAgIH1cbiAgICAgICAgICBjYWxsYmFjayhyZXNwb25zZSlcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiRW5jb3VudGVyZWQgYW4gRXJyb3I6XCIsIGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxuICApXG59XG5cbmV4cG9ydHMuY2xhc3NpZnkgPSBmdW5jdGlvbiAoaWRlbnRpZmllcjogc3RyaW5nLCB0eXBlOiBzdHJpbmcsIGNhbGxiYWNrOiBjYWxsYmFjaykge1xuICBpZiAodHlwZSA9PSBcImlzYm5cIikge1xuICAgIGdldFJlcXVlc3QoaWRlbnRpZmllciwgaXNibl9lcCwgKGRhdGE6IGFueSkgPT4ge1xuICAgICAgY2FsbGJhY2soZGF0YSk7XG4gICAgfSk7XG4gIH1cblxuICBlbHNlIGlmICh0eXBlID09IFwidGl0bGUtYXV0aG9yXCIpIHtcbiAgXHRnZXRSZXF1ZXN0KGlkZW50aWZpZXIsIHRpdGxlX2VwLCAoZGF0YTogYW55KSA9PiB7XG4gIFx0ICBjYWxsYmFjayhkYXRhKTtcdFxuICBcdH0pO1xuICB9XG5cbiAgZWxzZSB7XG4gIFx0Y2FsbGJhY2soXCJwbGVhc2UgcHJvdmlkZSBhIHN1cHBvcnRlZCB0eXBlOiBpc2JuIG9yIHRpdGxlLWF1dGhvclwiKTtcbiAgfVxufVxuXG4vKipcbiAqIE1vZHVsZSBUZXN0IENvZGVcbiAqL1xuXG4vKiogVGl0bGUgYW5kIEF1dGhvciAqL1xuLy8gZ2V0UmVxdWVzdChbXCJDb3JhbGluZVwiLCBcIlwiXSwgdGl0bGVfZXAsIGZ1bmN0aW9uIChkYXRhKSB7XG4vLyAgIGxldCB0aXRsZSA9IGRhdGEudGl0bGU7XG4vLyAgIGxldCBhdXRob3IgPSBkYXRhLmF1dGhvcjtcblxuLy8gICBjb25zb2xlLmxvZyhcIlJlcXVlc3Qgd2l0aCBUaXRsZTpcIilcbi8vICAgY29uc29sZS5sb2coXCJUaXRsZTpcIiwgdGl0bGUpO1xuLy8gfSk7XG5cbi8qKiBJU0JOICovXG4vLyBnZXRSZXF1ZXN0KFwiMDM4MDgwNzM0M1wiLCBpc2JuX2VwLCBmdW5jdGlvbiAoZGF0YSkge1xuLy8gICBsZXQgdGl0bGUgPSBkYXRhLnRpdGxlO1xuLy8gICBsZXQgYXV0aG9yID0gZGF0YS5hdXRob3I7XG5cbi8vICAgY29uc29sZS5sb2coXCJSZXF1ZXN0IHdpdGggSVNCTjpcIik7XG4vLyAgIGNvbnNvbGUubG9nKFwiVGl0bGU6XCIsIHRpdGxlKTtcbi8vICAgY29uc29sZS5sb2coXCJBdXRob3I6XCIsIGF1dGhvcik7XG4vLyB9KTtcbiJdfQ==