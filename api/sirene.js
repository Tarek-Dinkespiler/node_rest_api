'use strict';

const request = require('request');
const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(require('bluebird'));

module.exports.check = (event, context, callback) => {
  // example: "53208310200022"
  var siretParam = JSON.parse(event.pathParameters.siret);
  const siret = siretParam.toString(10)

  if (siret.length != 14) {
    const response = {
      statusCode: 500,
      body: JSON.stringify({
        statusCode: "500",
        message: "invalid siret parameter",
      }),
    };

  callback(null, response);
  return;
  }

  const url = "https://entreprise.data.gouv.fr/api/sirene/v1/siret/"
  const requestUrl = url + siret

  request(requestUrl, { json: true }, (err, res, body) => {
    if (err) {
      const response = {
        statusCode: 500,
        body: JSON.stringify({
          statusCode: "500",
          message: "Couldn\'t reach the SIRENE API",
        }),
      };

    callback(null, response);
    return;
    }
    else if (typeof body.etablissement == "undefined") {
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          statusCode: "200",
          message: "Établissement introuvé",
        }),
      };

    callback(null, response);
    return;
    }
    else {
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          statusCode: "200",
          request_url: requestUrl,
          validity: "true",
        }),
      };

    callback(null, response);
    return;
    }
  });
}
