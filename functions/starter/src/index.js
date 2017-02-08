import 'babel-polyfill'
import rethink from 'rethinkdbdash';

//connection information
const r = rethink({
    host: '54.183.90.114',
    port: 28015,
    db: 'feathers',
    user: 'admin',
    password: 'admin'
});

// write your promise here
let getMarkets = new Promise((resolve, reject) => {
  r.table('markets').run((err, result) => {
    if (err) {
      resolve(err);
    } else {
      resolve(result);
    }
  })
});

// Vanilla Lambda function.
export default async function(e, ctx) {
  var responseCode = 200;
  console.log("request: " + JSON.stringify(e));
  if (e.queryStringParameters !== null && e.queryStringParameters !== undefined) {
      if (e.queryStringParameters.httpStatus !== undefined && e.queryStringParameters.httpStatus !== null && e.queryStringParameters.httpStatus !== "") {
          console.log("Received http status: " + e.queryStringParameters.httpStatus);
          responseCode = e.queryStringParameters.httpStatus;
      }
  }

// run the promise and return the succeed function
  getMarkets
  .then((result) => {
    console.log(result);
    ctx.succeed({
        statusCode: responseCode,
        headers: {
            "x-content-type" : "application/json"
        },
        body: JSON.stringify(result)
    });
  });

}

// AWS sample w/ Lambda proxy formatting
// https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html
//
// exports.handler = function(event, context) {
//     var name = "World";
//     var responseCode = 200;
//     console.log("request: " + JSON.stringify(event));
//     if (event.queryStringParameters !== null && event.queryStringParameters !== undefined) {
//         if (event.queryStringParameters.name !== undefined && event.queryStringParameters.name !== null && event.queryStringParameters.name !== "") {
//             console.log("Received name: " + event.queryStringParameters.name);
//             name = event.queryStringParameters.name;
//         }
//
//         if (event.queryStringParameters.httpStatus !== undefined && event.queryStringParameters.httpStatus !== null && event.queryStringParameters.httpStatus !== "") {
//             console.log("Received http status: " + event.queryStringParameters.httpStatus);
//             responseCode = event.queryStringParameters.httpStatus;
//         }
//     }
//
//     var responseBody = {
//         message: "Hello " + name + "!",
//         input: event
//     };
//     var response = {
//         statusCode: responseCode,
//         headers: {
//             "x-custom-header" : "my custom header value"
//         },
//         body: JSON.stringify(responseBody)
//     };
//     console.log("response: " + JSON.stringify(response))
//     context.succeed(response);
// };
