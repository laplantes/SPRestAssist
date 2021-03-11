# sprestassist

[![install size](https://packagephobia.now.sh/badge?p=sprestassist)](https://packagephobia.now.sh/result?p=sprestassist)
[![npm downloads](https://img.shields.io/npm/dm/sprestassist.svg?style=flat-square)](http://npm-stat.com/charts.html?package=sprestassist)

sprestasssist is a modern, light weight, helper library for creating SharePoint 2019 on premises REST calls utilizing axios.js
sprestasssit is based on the REST architecture and the SharePoint 2019 on premises API. The library is not extensive, it was built with the purpose of being light weight while serving the most common SharePoint developer needs.
This document will not cover all of the possible query options such as filter, sort, expand, etc. For more details please see [Get to know the SharePoint REST service](https://docs.microsoft.com/en-us/sharepoint/dev/sp-add-ins/get-to-know-the-sharepoint-rest-service?tabs=csom)
At the time this file was written the current version of axios is 0.21.1, other versions have not been tested

>If you are used to using jQuery and SPServices, using sprestassist will likely feel fimiliar to you.

[axios is a promise based HTTP client for the browser and node.js](https://github.com/axios/axios)

## Table of Contents

- [Browser Support](#browser-support)
- [Promises](#promises)
- [Features](#features)
- [Get Started](#get-started)
  - [Installing](#installing)
  - [Using a CDN](#CDN)
- [Examples](#examples)
  - [Performing a GET request](#performing-a-get-request)
  - [Performing multiple concurrent requests](#Performing-multiple-concurrent-requests)
  - [Performing a POST request](#performing-a-post-request)
- [Response Schema](#response-schema)
- [Versioning](#versioning)
- [Credits](#credits)
- [License](#license)

## Browser Support

| ![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) |
|------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------|------------------------------------------------------------------------------------|
| Latest ✔                                                                                 | Latest ✔                                                                                    | Latest ✔                                                                                 | Latest ✔                                                                              | Latest ✔                                                                           |

> **NOTE**: This library uses `async/await` that is part of ECMAScript 2017.
> Older browsers not supporting ECMAScript 2017, and all versions of Internet Explorer are not supportted.

## Promises

sprestassist relies on ES6 Promises [Promise browser support](http://caniuse.com/promises)
If your environment doesn't support ES6 Promises, you can [polyfill](https://github.com/jakearchibald/es6-promise)

## Features

- Light weight
- ES2015 support
- Named feature imports supported
- Returns data in JSON format
- Small simplified method calls so you can focus on your code, and not writing lengthy requests

### List item methods

- Create get request to return list items
- Create get request to return attachment details for list items
- Create get request to return the choices from a list choice column
- Create get requests that will not return until all requests have completed
- Create post request to create a new list item
- Create post request to update list item, with or without using the eTag qualifier
- Create post request to delete a list item, with or without the eTag qualifier

### Library methods

- Create get request to return the details of a picture library
- Create get request to return the details of library files

### Currently logged in user methods

- Create get request to return one or all currently logged in users properties
- Create get request to return all of the SharePoint groups the currently logged in user is a member of
- Create request passing in a SharePoint group name and return a bolean value

## Get Started

### Installing

Currently sprestassist is available on NPM

Using npm:

``` CLI
<prompt> npm install sprestassist
```

### CDN

Using jsDelivr CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/sprestassist/dist/sprestassist.min.js"></script>
```

Using unpkg CDN:

```html
<script src="https://unpkg.com/sprestassist/dist/sprestassist.min.js"></script>
```

## Setup the environment

> **NOTE**: axios is required to use this library

- [Include axios in your project by preferred method (NPM, Bower, Yarn, etc.), or CND. See the axios documentation for more information](https://github.com/axios/axios)
- Import sprestassist.min.js as seen below

```js
import * from spreastassist as spra from <installed location/dist/sprestasssist.min.js>;
OR use feature imports
import { getItems, createItem, updateItem, deleteItem, getCurrentUserProps, getCurrentUserGroups, verifyCurrentUserGroupMembership } from <installed location/dist/sprestasssist.min.js>;
```

## Examples

Examples will not use named feature imports. Feature imports are supported & recommended in production

### Performing a `GET` request

>Parameters required for the getItems method:
>
>Pass the method an object containing the following
>- url: [required] the url of the base SharePoint site
>- list: [required] list or library name
>- action: [required] items or fields (items when dealing with list or library items, fields when dealing with columns)
>- query: [optional] query string to include, such as sort, orderby, filter, etc

```js
// Pass in an object with the following paramerters {url:<base url>, list:<list name>, action<see note below>, query:<querystring to be added to the REST call>}
// The action is either 'items' OR 'fields' - for list items it will be 'items', for getting column information it will be 'fields'

// requests all list items
spra.getItems(
		{
			url:'https://domain.com/', // base location of list
			list:'MyList',
			action:'items',
			// query: optional // this is where a custom query string can be passed to sprestassist for filtering, sorting, etc.
		}
	)
	// then - Do something with the returned list items
	.then( (response) => {
		// payload is returned as response.data.value. See axios documentation for available response properties
		console.log('%cThe list items for Example 1 are: ', 'color: green; font-size: 20px', response.data.value);
	})
	.catch( (error) => {
		// should there be an error, do something with it
		alert(`An error occurred. The error is as follows:\n\n ${error}`);
	});


// requests all list items and returns the array of attachment details for each list item, each containing an array of Attachment Files
spra.getItems(
		{
			url:'https://domain.com/', // base location of list
			list:'MyList',
			action:'items',
			query:'$select=AttachmentFiles&$expand=AttachmentFiles'
		}
	)
	// then - Do something with the returned list items
	.then( (response) => {
		// payload is returned as response.data.value
		console.log('%cThe list of attachments for each file are: ', 'color: green; font-size: 20px', response.data.value);
	})
	.catch( (error) => {
		// should there be an error, do something with it
		alert(`An error occurred. The error is as follows:\n\n ${error}`);
	});

// requests all the choices from a provided choice column
spra.getItems({url:'https://domain.com/', list:'MyList', action:'fields', query:`$filter=EntityPropertyName eq '<column name>'`})
	.then( (response) => {
		// do something with the response data
		console.log('%cThe choices for this column are: ', 'color: green; font-size: 20px', response.data.value[0].Choices);
	})
	.catch((error) => {
		// should there be an error, do something with it
		alert(`An error occurred. The error is as follows:\n\n ${error}`);
	});

// requests all the picture details for each picture in the library - Returns an array of objects containing an object for each picture
spra.getItems({url:'https://domain.com/', list:'Pictures', action:'items', query:'select=Title,File/ServerRelativeUrl,AlternateText,imageLink&$expand=file'})
	.then( (response) => {
		// Do something with the returned data
		console.log('%cThe picture details are: ', 'color: green; font-size: 20px', response.data.value);
	})
	.catch((error) => {
		// should there be an error, do something with it
		alert(`An error occurred. The error is as follows:\n\n ${error}`);
	});

// requests all the file details for each file in the library
spra.getItems({url:'https://domain.com/', list:'Documents', action:'items', query:'select=Title,File/ServerRelativeUrl&$expand=file'})
	.then( (response) => {
		// Do something with the returned data
		console.log('%cThe files details are: ', 'color: green; font-size: 20px', response.data.value);
	})
	.catch((error) => {
		// should there be an error, do something with it
		alert(`An error occurred. The error is as follows:\n\n ${error}`);
	});

// requests Current User Details
// common properties requested include: AccountName, DisplayName, Email, Title
// to request all properties omit the property parameter from the passed in object
const property = <'property to request'> ;
spra.getCurrentUserProps( { url:'https://domain.com/', selectedProperty:`${property}` })
.then( (response) => {
	// Do something with the returned data
	property ? console.log('%cThe user property requested is: ', 'color: green; font-size: 20px', response.data.value) : console.log('%cThe properties are: ', 'color: green; font-size: 20px', response.data);
})
.catch((error) => {
	alert(`An error occurred. The error is as follows:\n\n ${error}`);
});

// request Current User SharePoint Group Memberships
spra.getCurrentUserGroups( { url:'https://domain.com/' } )
	.then( (response) => {
		// Do something with the returned data
		let groupNames = response.map((item) => {return `'${item.Title}' `}).reduce( (accumulator ,next) => { return accumulator += next; });
		console.log('%cThe users group memberships are: ', 'color: green; font-size: 20px', groupNames);
	})
	.catch( (error) => {
		// should there be an error, do something with it
		console.log('%cThere was an error', 'color: red; font-size: 20px', error);
	})

// check if current user is a member of specified SharePoint group - returns boolean value
spra.verifyCurrentUserGroupMembership( { url:'https://domain.com/', groupName: `<group name>` } )
	.then( (response) => {
		// Do something with the returned boolean value
		response ? console.log(`%cThe response is ${response}, which means the current logged in user is a member of the group.`, 'color: green; font-size: 20px') : console.log(`%cThe response is ${response}, which means the current logged in user is NOT a member of the group!`, 'color: red; font-size: 20px');
	})
	.catch( (error) => {
		// should there be an error, do something with it
		console.log('%cThere was an error', 'color: red; font-size: 20px', error);
	})

```

#### Performing multiple concurrent requests

Requesting multiple REST calls and waiting for all promises to resolve before proceeding

>**CAUTION**: The method below has been deprecated. Please see the axios documentation for more information.
>Instead please us Promise.all, or manage this with custom code.

<del>This is an axios method, this examples shows how this can be  done utilizing sprestassist</del>

```js
axios.all( [spra.getItems({url:'https://domain.com/', list:'MyList', action:'items'}), spra.getItems({url:'https://domain.com/', list:'MyList', action:'fields', query:`$filter=EntityPropertyName eq '<column name>'`}) ])
	.then(axios.spread( (listItems, columnChoices) => {
		// do something with the data from both promises once both have resolve
		console.log('%cThis is the result of two promises resolving. Both must resolve before any action can be taken. Here the list items are: ', 'color: green; font-size: 20px', listItems.data.value);
		console.log('%cand the column choices are: ', 'color: green; font-size: 20px', columnChoices.data.value[0].Choices);
	}))
	.catch((error) => {
		// should there be an error, do something with it
		alert(`An error occurred. The error is as follows:\n\n ${error}`);
	});
```

### Performing a `POST` request

>**NOTE**: eTag is a version tracking system used by SharePoint

>Parameters required for the createItem method:
>
>Pass the method an object containing the following
>- url: [required] the url of the base SharePoint site
>- list: [required] list or library name
>- data: [required] object containing column names and values stringified

[For information about eTags see the Microsoft Documentation](https://docs.microsoft.com/en-us/sharepoint/dev/sp-add-ins/complete-basic-operations-using-sharepoint-rest-endpoints)

#### Creating a new list item

```js
// creates a new list item
// Pass in an object containing the required properties - url, list name, data (the payload formated as a string)
const title = 'This is going to be used to fill the title field',
	choice = 'seven'; // this will be used to fill in a column field that is a column type of choice
// These are example fields, your list and your data will determine which fields you assign
// the data parameter must be a string, all properties and keys must be wrapped in quotes or single quotes
spra.createItem({url:'https://domain.com/', list:'My List', data:`'Title': '${title}', 'choose': '${choice}'`})
	.then( (response) => {
		// Do something with the response
		console.log('%cThe item has been created with a Title of', 'color: green; font-size: 20px', response.data.d.Title);
		console.log('%cyour choice of ', 'color: green; font-size: 20px', response.data.d.choose);
		console.log('%cand an ID of ', 'color: green; font-size: 20px', response.data.d.ID);
	})
	.catch( (error) => {
		// should there be an error, do something with it
		alert(`An error occurred. Please note the following:\n\n ${error.response.data.error.message.value}`);
	})
```

#### Updating an existing list item

>Parameters required for the createItem method:
>
>Pass the method an object containing the following
>- url: [required] the url of the base SharePoint site
>- list: [required] list or library name
>- data: [required] object containing column names and values stringified
>- etag: [optional] eTag of the item to be updated (omit this field if you wish to overwrite the item without verifying version)

```js
const id = 27, 
	title = 'Title of my item',
	field2 = 'field2 info';
spra.updateItem({url:'https://domain.com/', list:'My List', data:`'Title': '${title}', 'field2': '${field2}'`, updateId:`${id}`})
	.then( () => {
		// There is no response data for an update
		console.log('%cThe Item has been updated. There is no response to an update. Check the item to verifiy.', 'color: green; font-size: 20px',);
	})
	.catch( (error) => {
		// should there be an error, do something with it
		console.log('%cThere was an error', 'color: red; font-size: 20px', error.response.data.error.message.value);
		})
```

#### Deleting a list item

Parameters required for the deleteItem method:

>Pass the method an object containing the following
>- url: the url of the base SharePoint site
>- list: list or library name
>- data: object containing column names and values stringified
>- etag: eTag of the item to be updated (omit this field if you wish to delete the item without verifying version)

```js
const id = 27,
	etag = 2;
let deleteObject = {};
	if (etag) { deleteObject = {url:'https://domain.com/', list:'My List', itemId:`${id}`, etag:`"${etag}"`}; }
	else { deleteObject = {url:'https://domain.com/', list:'My List', itemId:`${id}`}; }
spra.deleteItem(deleteObject)
	// delete the specified item
	.then( () => {
		console.log('%cThere is no response to an update. Check the list to verifiy.', 'color: green; font-size: 20px',);
	})
	.catch( (error) => {
		// should there be an error, do something with it
		console.log('%cThere was an error', 'color: red; font-size: 20px', error.response.data.error.message.value);
		alert(`An error occurred. Please try again, if this issue continues please call the help desk with the following:\n\n ${error.response.data.error.message.value}`);
	})
```

## Response Schema

> **NOTE**: The following is the Response Schema provided by axios and is still exposed while using sprestasssist

The response for a request contains the following information

```js
{
  // `data` is the response that was provided by the server
  data: {},

  // `status` is the HTTP status code from the server response
  status: 200,

  // `statusText` is the HTTP status message from the server response
  statusText: 'OK',

  // `headers` the HTTP headers that the server responded with
  // All header names are lower cased and can be accessed using the bracket notation.
  // Example: `response.headers['content-type']`
  headers: {},

  // `config` is the config that was provided to `axios` for the request
  config: {},

  // `request` is the request that generated this response
  // It is the last ClientRequest instance in node.js (in redirects)
  // and an XMLHttpRequest instance in the browser
  request: {}
}
```

> **NOTE**: The response is provided via axios, and is still exposed directly using sprestassist

When using `then`, you will receive the response as follows:

```js
spra.method(<object>)
  .then(function (response) {
    console.log(response.data);
    console.log(response.status);
    console.log(response.statusText);
    console.log(response.headers);
    console.log(response.config);
  });
```

## Versioning

Breaking changes may be released with a new minor version until sprestassist extends to release `1.0.0`

For example, `0.1.1`, and `0.1.4` will not have any breaking changes, but `0.2.0` may have breaking changes

## Credits

A huge shoutout goes to the those who created and maintain [axios](https://www.npmjs.com/package/axios)! Without all of their hard work this would not have been possible

## License

[MIT](LICENSE)