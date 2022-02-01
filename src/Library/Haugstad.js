const Template = require('./template');

/**
 * A file where I keep all my good functions which I might wanna use
 */

/**
 * Helper function to check if the object is empty or not
 * 
 * @param {*} obj 
 * @returns 
 */
function isEmpty(obj) { 
    for (var x in obj) { 
        return false; 
    }

    return true;
}


function sendResponse(ResponseObject, HTTPCode, ObjectData = false) {
    // Send the header with the status code first
    ResponseObject.status(HTTPCode)

    // Then the response
    if (ObjectData) {
        ResponseObject.json(ObjectData);
    } else {
        ResponseObject.json(Template[HTTPCode]);
    }
}

module.exports = {
    isEmpty,
    sendResponse,
}