'use strict';

/**
 * Module dependencies
 */

/* eslint-disable import/no-unresolved */
/* eslint-disable prefer-template */
// Public node modules.
const _ = require('lodash');
const postmark = require("postmark");
const strapi = require('strapi');

/* eslint-disable no-unused-vars */
module.exports = {
  provider: 'postmark',
  name: 'Postmark',
  auth: {
    postmark_default_from: {
      label: 'Default From',
      type: 'text'
    },
    postmark_default_replyto: {
      label: 'Default Reply-To',
      type: 'text'
    },
    postmark_api_token: {
      label: 'Server API Token',
      type: 'text'
    }
  },

  init: (config) => {

    var client = new postmark.Client(config.postmark_api_token);

    return {
      send: (options, cb) => {
        return new Promise((resolve, reject) => {
          // Default values.
          options = _.isObject(options) ? options : {};
          options.from = options.from || config.postmark_default_from;
          options.replyTo = options.replyTo || config.postmark_default_replyto;
          options.text = options.text || options.html;
          options.html = options.html || options.text;

          const msg = {
            "From": options.from,
            "To": options.to,
            "ReplyTo": options.replyTo,
            "Subject": options.subject,
            "TextBody": options.text,
            "HtmlBody": options.html
          };

          client.sendEmail(msg, function (err) {
            if (err) {
              strapi.log.error('Could not send using Postmark: ', err.message);
              reject([{ messages: [{ id: 'Auth.form.error.email.invalid' }] }]);
            } else {
              resolve();
            }
          });
        });
      }
    };
  }
};
