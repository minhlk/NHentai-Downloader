# NHentai Image Downloader

A simple Node.js app using [Express 4](http://expressjs.com/) to download images in NHentai

## Running Locally

Make sure you have [Node.js](http://nodejs.org/)  installed.

```
npm install
npm start
```

Your app should now be running on [localhost:3000](http://localhost:3000/).

## NPM Install

```
$ npm i nhentai-image-getter
```

## Usage

```js
const nHentai = require("nhentai-image-getter");

nHentai("manga-url").then(images => console.log(images));

```

## Contributors

For more information about me

- [GitHub](https://github.com/minhlk)
- [MKProduction-Youtube]( https://www.youtube.com/mkproductionpresent)