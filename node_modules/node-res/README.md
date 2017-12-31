# Node Res

> A facade over Node.js HTTP `res` object with no side-effects.

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Appveyor][appveyor-image]][appveyor-url]
[![Coveralls][coveralls-image]][coveralls-url]

<a href="http://res.cloudinary.com/adonisjs/image/upload/q_100/v1502279403/poppinss_z8uk2j.png">
<img src="http://res.cloudinary.com/adonisjs/image/upload/q_100/v1502279403/poppinss_z8uk2j.png" width="300px" align="right" vspace="20px" />
</a>

`node-res` is a simple module to make HTTP response in Node.js. In offers helpers to make it easier to set `headers`, define response statuses and properly parse response type to set appropriate headers.

For example:

```js
// content-type: plain/text
nodeRes.send(req, res, 'Hello world')

// content-type: application/json
nodeRes.send(req, res, { greeting: 'hello world' })
    
// content-type: text/html
nodeRes.send(req, res, '<h2> Hello world </h2>')
```

## See also

1. [node-req](https://npmjs.org/package/node-req)
2. [node-cookie](https://npmjs.org/package/node-cookie)

## Responding to requests.

```javascript
const http = require('http')
const nodeRes = require('node-res')

http.createServer(function (req, res) {
  
  // plain text
  nodeRes.send(req, res, "Hello world")

  // json
  nodeRes.json(req, res, {time:"now"})

  // jsonp
  nodeRes.jsonp(req, res, {time:"now"}, "callback")

}).listen(3000)

```

nodeRes takes http server `res` object as first argument to perform any operations.

## Methods

### getHeader
Returns the value of an existing header on
the response object

**Params**

| Param | Type | Required | Description |
|-----|-------|------|------|
| res | Object | Yes | &nbsp; |
| key | String | Yes | &nbsp; |

**Returns**
Array

**Example**
```js
nodeRes.getHeader(res, 'Content-type')
```

----
### header
Sets header on the response object

**Params**

| Param | Type | Required | Description |
|-----|-------|------|------|
| res | Object | Yes | &nbsp; |
| key | String | Yes | &nbsp; |
| value | String | Yes | &nbsp; |

**Returns**
Void

**Example**
```js
nodeRes.header(res, 'Content-type', 'application/json')

// or set an array of headers
nodeRes.header(res, 'Link', ['<http://localhost/>', '<http://localhost:3000/>'])
```

----
### status
Set status on the HTTP res object

**Params**

| Param | Type | Required | Description |
|-----|-------|------|------|
| res | Object | Yes | &nbsp; |
| code | Number | Yes | &nbsp; |

**Returns**
Void

**Example**
```js
nodeRes.status(200)
```

----
### safeHeader
Sets the header on response object, only if it
does not exists.

**Params**

| Param | Type | Required | Description |
|-----|-------|------|------|
| res | Object | Yes | &nbsp; |
| key | String | Yes | &nbsp; |
| value | String | Yes | &nbsp; |

**Returns**
Void

**Example**
```js
nodeRes.safeHeader(res, 'Content-type', 'application/json')
```

----
### removeHeader
removing header using it's key

**Params**

| Param | Type | Required | Description |
|-----|-------|------|------|
| res | Object | Yes | &nbsp; |
| key | String | Yes | &nbsp; |

**Returns**
Void

----
### write
Write string or buffer to the response object.

**Params**

| Param | Type | Required | Description |
|-----|-------|------|------|
| res | Object | Yes | &nbsp; |
| body | String|Buffer | Yes | &nbsp; |

**Returns**
Void

**Example**
```js
nodeRes.write(res, 'Hello world')
```

----
### end
Explictly end HTTP response

**Params**

| Param | Type | Required | Description |
|-----|-------|------|------|
| res | Object | Yes | &nbsp; |

**Returns**
Void

----
### send
Send body as the HTTP response and end it. Also
this method will set the appropriate `Content-type`
and `Content-length`.

If body is set to null, this method will end the response
as 204.

**Params**

| Param | Type | Required | Description |
|-----|-------|------|------|
| req | Object | Yes | &nbsp; |
| res | Object | Yes | &nbsp; |
| body | Mixed | Yes | &nbsp; |
| options | Object | No | An object of options, only option for now is to define whether or not set the `Etag` header. |

**Returns**
Void

**Example**
```js
nodeRes.send(req, res, 'Hello world')

// or html
nodeRes.send(req, res, '<h2> Hello world </h2>')

// or JSON
nodeRes.send(req, res, { greeting: 'Hello world' })

// or Buffer
nodeRes.send(req, res, Buffer.from('Hello world', 'utf-8'))

// Ignore etag
nodeRes.send(req, res, 'Hello world', {
  ignoreEtag: true
})
```

----
### json
Returns the HTTP response with `Content-type`
set to `application/json`.

**Params**

| Param | Type | Required | Description |
|-----|-------|------|------|
| req | Object | Yes | &nbsp; |
| res | Object | Yes | &nbsp; |
| body | Object | Yes | &nbsp; |
| options | Object | No | An object of options, only option for now is to define whether or not set the `Etag` header. |

**Returns**
Void

**Example**
```js
nodeRes.json(req, res, { name: 'virk' })
nodeRes.json(req, res, [ 'virk', 'joe' ])

// Ignore etag
nodeRes.json(req, res, {name: 'virk'}, {
  ignoreEtag: true
})
```

----
### jsonp
Make JSONP response with `Content-type` set to
`text/javascript`.

**Params**

| Param | Type | Required | Description |
|-----|-------|------|------|
| req | Object | Yes | &nbsp; |
| res | Object | Yes | &nbsp; |
| body | Object | Yes | &nbsp; |
| callbackFn  | String | No | &nbsp; |
| options | Object | No | An object of options, only option for now is to define whether or not set the `Etag` header. |

**Returns**
Void

**Example**
```js
nodeRes.jsonp(req, res, { name: 'virk' }, 'callback')


// Ignore etag
nodeRes.jsonp(req, res, {name: 'virk'}, 'callback', {
  ignoreEtag: true
})
```

----
### download
Download file as a stream. Stream will be closed once
download is finished.

Options are passed directly to [send](https://www.npmjs.com/package/send)

**Params**

| Param | Type | Required | Description |
|-----|-------|------|------|
| req | Object | Yes | &nbsp; |
| res | Object | Yes | &nbsp; |
| filePath | String | Yes | &nbsp; |
| options  | Object | No | &nbsp; |

**Returns**
Void

**Example**
```js
nodeRes.download(req, res, '/storage/data.txt')
```

----
### attachment
Send file as a stream with Content-Disposition of attachment
which forces the download of the file.

**Params**

| Param | Type | Required | Description |
|-----|-------|------|------|
| req | Object | Yes | &nbsp; |
| res | Object | Yes | &nbsp; |
| filePath | String | Yes | &nbsp; |
| name  | String | No | &nbsp; |
| disposition  | String | No | &nbsp; |
| options | Object | No | &nbsp; |

**Returns**
Void

**Example**
```js
nodeRes.attachment(req, res, '/storage/data.txt', 'data.txt')
```

----
### location
Set `Location` header on the HTTP response.

**Params**

| Param | Type | Required | Description |
|-----|-------|------|------|
| res | Object | Yes | &nbsp; |
| url | String | Yes | &nbsp; |

**Returns**
Void

----
### redirect
Redirect the HTTP request to the given url.

**Params**

| Param | Type | Required | Description |
|-----|-------|------|------|
| req | Object | Yes | &nbsp; |
| res | Object | Yes | &nbsp; |
| url | String | Yes | &nbsp; |
| status  | Number | No | &nbsp; |

**Returns**
Void

**Example**
```js
nodeRes.redirect(req, res, '/')
```

----
### vary
Add vary header to the HTTP response.

**Params**

| Param | Type | Required | Description |
|-----|-------|------|------|
| res | Object | Yes | &nbsp; |
| field | String | Yes | &nbsp; |

**Returns**
Void

----
### type
Set content type header by looking up the actual
type and setting charset to utf8

**Params**

| Param | Type | Required | Description |
|-----|-------|------|------|
| res | Object | Yes | &nbsp; |
| type | String | Yes | &nbsp; |
| charset  | String | No | &nbsp; |

**Returns**
Void

**Example**
```js
nodeRes.type(res, 'html')
nodeRes.type(res, 'json')
nodeRes.type(res, 'application/json')
```

----


## Descriptive methods
Node res also has support for descriptive methods, they set the status itself without calling the `status` method.

```javascript
nodeRes.ok(req, res, 'Hello world') // will set 200 as status
nodeRes.unauthorized(req, res, 'You must login first') // will set 401 as status
```

| method | http response status |
|--------|-------------|
| continue | 100 |
| switchingProtocols | 101 |
| ok | 200 |
| created | 201 |
| accepted | 202 |
| nonAuthoritativeInformation | 203 |
| noContent | 204 |
| resetContent | 205 |
| partialContent | 206 |
| multipleChoices | 300 |
| movedPermanently | 301 |
| found | 302 |
| seeOther | 303 |
| notModified | 304 |
| useProxy | 305 |
| temporaryRedirect | 307 |
| badRequest | 400 |
| unauthorized | 401 |
| paymentRequired | 402 |
| forbidden | 403 |
| notFound | 404 |
| methodNotAllowed | 405 |
| notAcceptable | 406 |
| proxyAuthenticationRequired | 407 |
| requestTimeout | 408 |
| conflict | 409 |
| gone | 410 |
| lengthRequired | 411 |
| preconditionFailed | 412 |
| requestEntityTooLarge | 413 |
| requestUriTooLong | 414 |
| unsupportedMediaType | 415 |
| requestedRangeNotSatisfiable | 416 |
| expectationFailed | 417 |
| unprocessableEntity | 422 |
| tooManyRequests | 429 |
| internalServerError | 500 |
| notImplemented | 501 |
| badGateway | 502 |
| serviceUnavailable | 503 |
| gatewayTimeout | 504 |
| httpVersionNotSupported | 505 |


[appveyor-image]: https://img.shields.io/appveyor/ci/thetutlage/node-res/master.svg?style=flat-square

[appveyor-url]: https://ci.appveyor.com/project/thetutlage/node-res

[npm-image]: https://img.shields.io/npm/v/node-res.svg?style=flat-square
[npm-url]: https://npmjs.org/package/node-res

[travis-image]: https://img.shields.io/travis/poppinss/node-res/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/poppinss/node-res

[coveralls-image]: https://img.shields.io/coveralls/poppinss/node-res/develop.svg?style=flat-square

[coveralls-url]: https://coveralls.io/github/poppinss/node-res
