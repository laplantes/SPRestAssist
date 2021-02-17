'use strict'

/**
 * Setup the initial axios config with headers required for all SharePoint CRUD operations 
 */
const axiosConfig = {
	headers: {
		'Accept': 'application/json;odata=verbose',
		'content-type': 'application/json;odata=verbose'
	},
};

/**
 * Promise to get the ListItemEntityFullName of the list provided 
 * @param {string} contextUrl weburl of the SharePoint site
 * @param {string} listName the SharePoint list
 */
const getListItemEntityTypeFullName = (contextUrl, listName) => {
	try {
		return axios.get(`${contextUrl}/_api/web/lists/getByTitle('${listName}')`);
	} catch(error) {console.log('There was an issue reading the listItemEntityTypeFullName. The error is: ', error);}
};

/**
 * Promise to get the Digest, where the FormDigestValue can be extracted from
 * @param {string} contextUrl weburl of the SharePoint site
 */
const getDigestValue = (contextUrl) => {
	try {
		return axios.post(`${contextUrl}/_api/contextinfo`);
	} catch (error) { console.log('There was an issue reading the listItemEntityTypeFullName. The error is: ', error);}
};


// GET ITEM(S)
/**
 * Promise to get items
 * @param {object} props object containing the options
 * @return {promise}
 */
export const getItems = (props) => {
	const { url, list, action, query = '' } = props;
	return axios.get(`${url}/_api/web/lists/getByTitle('${list}')/${action}?${query}`);
};


// CREATE ITEM
/**
 * Create a new SharePoint list item
 * @param {object} props object containing the options
 */
export const createItem = async (props) => {
	const { url, list, data } = props;
	let config = JSON.parse(JSON.stringify(axiosConfig));
	const entityNamePromise = await getListItemEntityTypeFullName(url, list);
	const digestValuePromise = await getDigestValue(url);
	const entityName = entityNamePromise.data.ListItemEntityTypeFullName;
	const dataString = `{ '__metadata': { 'type': '${entityName}' }, ${data} }`;
	config.headers['X-RequestDigest'] = digestValuePromise.data.FormDigestValue;
	return axios.post(`${url}/_api/web/lists/getByTitle('${list}')/items`, dataString, config);
};


// Update Item
/**
 * Update SharePoint list item
 * @param {object} props object containing the options
 */
export const updateItem = async (props) => {
	const { url, list, data, updateId, etag = "*" } = props;
	let config = JSON.parse(JSON.stringify(axiosConfig));
	const entityNamePromise = await getListItemEntityTypeFullName(url, list);
	const digestValuePromise = await getDigestValue(url);
	const entityName = entityNamePromise.data.ListItemEntityTypeFullName;
	const dataString = `{ '__metadata': { 'type': '${entityName}' }, ${data} }`;
	config.headers['X-RequestDigest'] = digestValuePromise.data.FormDigestValue;
	config.headers["IF-MATCH"] = `${etag}`;
	config.headers["X-HTTP-METHOD"] = "MERGE";
	return axios.post(`${url}/_api/web/lists/getByTitle('${list}')/items(${updateId})`, dataString, config);
};


// Delete Item
/**
 * Delete SharePoint list item
 * @param {object} props object containing the options
 */
export const deleteItem = async (props) => {
	const { url, list, itemId, etag = "*" } = props;
	let config = JSON.parse(JSON.stringify(axiosConfig));
	const digestValuePromise = await getDigestValue(url);
	config.headers['X-RequestDigest'] = digestValuePromise.data.FormDigestValue;
	config.headers["IF-MATCH"] = `${etag}`;
	return axios.delete(`${url}/_api/web/lists/getByTitle('${list}')/items(${itemId})`, config);
};


// Get Current User Properties
/**
 * Get the current users properties
 * @param {object} props object containing the options
 */
export const getCurrentUserProps = (props) => {
	const { url, selectedProperty } = props;
	return axios.get(`${url}/_api/SP.UserProfiles.PeopleManager/GetMyProperties/${selectedProperty}`);
};


//  Get current users SP group memberships
/**
 * Get the current users group memberships
 * @param {object} props object containing the options
 */
export const getCurrentUserGroups = async (props) => {
	const groups = await axios.get(`${props.url}/_api/web/currentuser/?$expand=Groups&$select=Groups`);
	return groups.data.Groups;
};


// Is current user a member of the specified group
/**
 * 
 * @param {object} props object containing the options
 */
export const verifyCurrentUserGroupMembership = async (props) => {
	const groups = await axios.get(`${props.url}/_api/web/currentuser/?$expand=Groups&$select=Groups`);
	let groupsArray = [];
	groups.data.Groups.forEach((group) => groupsArray.push(group.Title));
	return groupsArray.includes(`${props.groupName}`);
};