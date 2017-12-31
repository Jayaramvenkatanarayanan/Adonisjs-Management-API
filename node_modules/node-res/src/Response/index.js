'use strict'

/*
 * node-res
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/
const mime = require('mime-types')
const etag = require('etag')
const contentDisposition = require('content-disposition')
const contentType = require('content-type')
const vary = require('vary')
const send = require('send')
const methods = require('./methods')

const returnContentAndType = function (body) {
  /**
   * Return the body and it's type when
   * body is a string.
   */
  if (typeof (body) === 'string') {
    return {
      body,
      type: /^\s*</.test(body) ? 'text/html' : 'text/plain'
    }
  }

  /**
   * If body is a buffer, return the exact copy
   * and type as bin.
   */
  if (Buffer.isBuffer(body)) {
    return { body, type: 'application/octet-stream' }
  }

  /**
   * If body is a number or boolean. Convert it to
   * a string and return the type as text.
   */
  if (typeof (body) === 'number' || typeof (body) === 'boolean') {
    return { body: String(body), type: 'text/plain' }
  }

  /**
   * Otherwise check whether body is an object or not. If yes
   * stringify it and otherwise return the exact copy.
   */
  return typeof (body) === 'object' ? { body: JSON.stringify(body), type: 'application/json' } : { body }
}

/**
 * This is a static utility class to make HTTP response
 * in Node.js. It works like a facade over HTTP res
 * object but without side-effects.
 *
 * @class Response
 * @static
 */
const Response = exports = module.exports = {}

Response.descriptiveMethods = Object.keys(methods).map((method) => {
  const methodName = method.toLowerCase().replace(/_\w/g, function (index, match) {
    return index.replace('_', '').toUpperCase()
  })
  Response[methodName] = function (req, res, body) {
    Response.status(res, methods[method])
    Response.send(req, res, body)
  }
  return methodName
})

/**
 * Returns the value of an existing header on
 * the response object
 *
 * @method getHeader
 *
 * @param  {Object}  res
 * @param  {String}  key
 *
 * @return {Array}
 *
 * @example
 * ```js
 * nodeRes.getHeader(res, 'Content-type')
 * ```
 */
Response.getHeader = function (res, key) {
  return res.getHeader(key)
}

/**
 * Sets header on the response object
 *
 * @method header
 *
 * @param  {Object} res
 * @param  {String} key
 * @param  {String} value
 *
 * @return {void}
 *
 * @example
 * ```js
 * nodeRes.header(res, 'Content-type', 'application/json')
 *
 * // or set an array of headers
 * nodeRes.header(res, 'Link', ['<http://localhost/>', '<http://localhost:3000/>'])
 * ```
 */
Response.header = function (res, key, value) {
  value = Array.isArray(value) ? value : [value]

  /**
   * Fetch existing headers, so that we can append
   * to them
   */
  const previousHeader = Response.getHeader(res, key)
  if (!previousHeader) {
    res.setHeader(key, value.map(String))
    return
  }

  const headers = Array.isArray(previousHeader) ? previousHeader.concat(value) : [previousHeader].concat(value)
  res.setHeader(key, headers.map(String))
}

/**
 * Set status on the HTTP res object
 *
 * @method status
 *
 * @param  {Object} res
 * @param  {Number} code
 *
 * @return {void}
 *
 * @example
 * ```js
 * nodeRes.status(200)
 * ```
 */
Response.status = function (res, code) {
  res.statusCode = code
}

/**
 * Sets the header on response object, only if it
 * does not exists.
 *
 * @method safeHeader
 *
 * @param  {Object}   res
 * @param  {String}   key
 * @param  {String}   value
 *
 * @return {void}
 *
 * @example
 * ```js
 * nodeRes.safeHeader(res, 'Content-type', 'application/json')
 * ```
 */
Response.safeHeader = function (res, key, value) {
  if (!res.getHeader(key)) {
    Response.header(res, key, value)
  }
}

/**
 * @description removing header using it's key
 * @method removeHeader
 * @param  {Object}     res
 * @param  {String}     key
 * @return {void}
 */
Response.removeHeader = function (res, key) {
  res.removeHeader(key)
}

/**
 * Write string or buffer to the response object.
 *
 * @method write
 *
 * @param  {Object} res
 * @param  {String|Buffer} body
 *
 * @return {void}
 *
 * @example
 * ```js
 * nodeRes.write(res, 'Hello world')
 * ```
 */
Response.write = function (res, body) {
  res.write(body)
}

/**
 * Explictly end HTTP response
 *
 * @method end
 *
 * @param  {Object} res
 *
 * @return {void}
 */
Response.end = function (res) {
  res.end()
}

/**
 * Send body as the HTTP response and end it. Also
 * this method will set the appropriate `Content-type`
 * and `Content-length`.
 *
 * If body is set to null, this method will end the response
 * as 204.
 *
 * @method send
 *
 * @param  {Object} req
 * @param  {Object} res
 * @param  {Mixed} body
 * @param  {Object} options [ignoreEtag = false]
 *
 * @return {void}
 *
 * @example
 * ```js
 * nodeRes.send(req, res, 'Hello world')
 *
 * // or html
 * nodeRes.send(req, res, '<h2> Hello world </h2>')
 *
 * // or JSON
 * nodeRes.send(req, res, { greeting: 'Hello world' })
 *
 * // or Buffer
 * nodeRes.send(req, res, Buffer.from('Hello world', 'utf-8'))
 * ```
 */
Response.send = function (req, res, body = null, options) {
  const clonedOptions = Object.assign({ ignoreEtag: false }, options)

  if (body === null) {
    Response.status(res, 204)
    Response.removeHeader(res, 'Content-Type')
    Response.removeHeader(res, 'Content-Length')
    Response.removeHeader(res, 'Transfer-Encoding')
    Response.end(res)
    return
  }

  let { body: chunk, type } = returnContentAndType(body)

  /**
   * Setting content type. Ideally we can use `Response.type`, which
   * sets the right charset too. But we will be doing extra
   * processing for no reasons.
   */
  if (type) {
    Response.safeHeader(res, 'Content-Type', `${type}; charset=utf-8`)
  }

  /**
   * setting up content length as response header
   */
  if (chunk) {
    Response.header(res, 'Content-Length', Buffer.byteLength(chunk))
  }

  /**
   * generating and setting etag only when ignoreEtag
   * is not true
   */
  if (!clonedOptions.ignoreEtag) {
    Response.safeHeader(res, 'ETag', etag(chunk))
  }

  /**
   * removing unneccessary headers if response
   * has certain statusCode
   */
  if (res.statusCode === 204 || res.statusCode === 304) {
    Response.removeHeader(res, 'Content-Type')
    Response.removeHeader(res, 'Content-Length')
    Response.removeHeader(res, 'Transfer-Encoding')
  }

  if (req.method !== 'HEAD') {
    Response.write(res, chunk)
  }

  setImmediate(function () {
    Response.end(res)
  })
}

/**
 * Returns the HTTP response with `Content-type`
 * set to `application/json`.
 *
 * @method json
 *
 * @param  {Object} req
 * @param  {Object} res
 * @param  {Object} body
 * @param  {Object} options [ignoreEtag = false]
 *
 * @return {void}
 *
 * @example
 * ```js
 * nodeRes.json(req, res, { name: 'virk' })
 * nodeRes.json(req, res, [ 'virk', 'joe' ])
 * ```
 */
Response.json = function (req, res, body, options) {
  Response.safeHeader(res, 'Content-Type', 'application/json; charset=utf-8')
  Response.send(req, res, body, options)
}

/**
 * Make JSONP response with `Content-type` set to
 * `text/javascript`.
 *
 * @method jsonp
 *
 * @param  {Object}   req
 * @param  {Object}   res
 * @param  {Object}   body
 * @param  {String}   [callbackFn = 'callback']
 * @param  {Object}   options [ignoreEtag = false]
 *
 * @return {void}
 *
 * @example
 * ```js
 * nodeRes.jsonp(req, res, { name: 'virk' }, 'callback')
 * ```
 */
Response.jsonp = function (req, res, body, callbackFn = 'callback', options) {
  Response.header(res, 'X-Content-Type-Options', 'nosniff')
  Response.safeHeader(res, 'Content-Type', 'text/javascript; charset=utf-8')

  body = JSON.stringify(body)

  /**
   * replacing non-allowed javascript characters from body
   */
  body = body
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')

  /**
   * setting up callbackFn on response body , typeof will make
   * sure not to throw error of client if callbackFn is not
   * a function
   */
  body = '/**/ typeof ' + callbackFn + " === 'function' && " + callbackFn + '(' + body + ');'
  Response.send(req, res, body, options)
}

/**
 * Download file as a stream. Stream will be closed once
 * download is finished.
 *
 * Options are passed directly to [send](https://www.npmjs.com/package/send)
 *
 * @method download
 *
 * @param  {Object} req
 * @param  {Object} res
 * @param  {String} filePath
 * @param  {Object} [options = {}]
 *
 * @return {void}
 *
 * @example
 * ```js
 * nodeRes.download(req, res, '/storage/data.txt')
 * ```
 */
Response.download = function (req, res, filePath, options = {}) {
  send(req, filePath, options).pipe(res)
}

/**
 * Send file as a stream with Content-Disposition of attachment
 * which forces the download of the file.
 *
 * @method attachment
 *
 * @param  {Object}   req
 * @param  {Object}   res
 * @param  {String}   filePath
 * @param  {String}   [name = filePath]
 * @param  {String}   [disposition = 'attachment']
 * @param  {Object}   [options]
 *
 * @return {void}
 *
 * @example
 * ```js
 * nodeRes.attachment(req, res, '/storage/data.txt', 'data.txt')
 * ```
 */
Response.attachment = function (req, res, filePath, name = filePath, disposition = 'attachment', options) {
  Response.header(res, 'Content-Disposition', contentDisposition(name, {type: disposition}))
  send(req, filePath, options).pipe(res)
}

/**
 * Set `Location` header on the HTTP response.
 *
 * @method location
 *
 * @param  {Object} res
 * @param  {String} url
 *
 * @return {void}
 */
Response.location = function (res, url) {
  Response.header(res, 'Location', url)
}

/**
 * Redirect the HTTP request to the given url.
 *
 * @method redirect
 *
 * @param  {Object} req
 * @param  {Object} res
 * @param  {String} url
 * @param  {Number} [status = 302]
 *
 * @return {void}
 *
 * @example
 * ```js
 * nodeRes.redirect(req, res, '/')
 * ```
 */
Response.redirect = function (req, res, url, status = 302) {
  const body = ''
  Response.status(res, status)
  Response.location(res, url)
  Response.header(res, 'Content-Length', Buffer.byteLength(body))
  Response.send(req, res, body)
}

/**
 * Add vary header to the HTTP response.
 *
 * @method vary
 *
 * @param  {Object} res
 * @param  {String} field
 *
 * @return {void}
 */
Response.vary = function (res, field) {
  vary(res, field)
}

/**
 * Set content type header by looking up the actual
 * type and setting charset to utf8
 *
 * @method type
 *
 * @param  {Object} res
 * @param  {String} type
 * @param  {String} [charset = 'utf-8']
 * @return {void}
 *
 * @example
 * ```js
 * nodeRes.type(res, 'html')
 * nodeRes.type(res, 'json')
 * nodeRes.type(res, 'application/json')
 * ```
 */
Response.type = function (res, type, charset = 'utf-8') {
  const ct = type.indexOf('/') === -1 ? mime.lookup(type) || 'text/html' : type
  const parsedType = contentType.parse(ct)
  parsedType.parameters.charset = charset
  Response.safeHeader(res, 'Content-Type', contentType.format(parsedType))
}
