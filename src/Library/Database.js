/**
 * Including required modules
 */
const Helper = require('./haugstad');
let mysql = require('mysql');
const Validator = require('validator');
const sqlstring = require('sqlstring');

/**
 * Let us just connect to the mysql database
 */
let connection = mysql.createConnection({
    host: process.env.DB_HOSTNAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

/**
 * Retrieves all rows in a given table in the database
 * 
 * @param {string} table 
 * @returns Promise
 */
async function getAll(table) {
    return new Promise((resolve, reject) => {
        if (Helper.isEmpty(table)) {
            reject(false)
        }
        
        let stmt = `SELECT * FROM ${table}`;

        connection.query(stmt, (error, results, fields) => {
            if (error) {
                reject(console.error(error.message));
            }

            resolve(results);
        });
    });
}

/**
 * Retrieves a given entry by id in the database
 * 
 * @param {string} table 
 * @param {integer} id 
 * @returns Promise()
 */
async function getEntryByID(table, id) {
    return new Promise((resolve, reject) => {
        if (Helper.isEmpty(table) || Helper.isEmpty(id)) {
            reject(false);
        }

        let stmt = `SELECT * FROM ${table} WHERE id = ?`;
        let stmtvalues = [id];

        connection.query(stmt, stmtvalues, (error, results, fields) => {
            if (error) {
                reject(console.error(error.message));
            }

            resolve(results);
        });
    });
}

/**
 * get entry in database based on field and value
 * 
 * @param {*} table 
 * @param {*} data 
 * @param {*} field 
 * @returns 
 */
async function getEntryByField(table, data, field) {
    // Check if table, data and field is provided
    if (Helper.isEmpty(table) || Helper.isEmpty(data) || Helper.isEmpty(field)) {
        return false;
    }

    // Extract the data field from the data entry

    return new Promise((resolve, reject) => {
        let stmt = `SELECT * FROM ${table} WHERE ${field} = ?`;
        let stmtvalues = [data];

        connection.query(stmt, stmtvalues, (error, results, fields) => {
            if (error) {
                reject(console.error(error.message));
            }

            resolve(results);
        });
    });
}

/**
 * Get entry in database by field
 * 
 * @param {*} table 
 * @param {*} field 
 * @returns 
 */
async function getAllByField(table, field) {
    if (Helper.isEmpty(table) || Helper.isEmpty(field)) {
        return false;
    }

    return new Promise((resolve,reject) => {
        let stmt = `SELECT distinct ${field} FROM ${table}`;
        //let stmtvalues = [field];

        connection.query(stmt, (error, results, field) => {
            if (error) {
                reject(console.error(error.message));
            }

            resolve(results);
        });
    });
}

/**
 * Get Entry in database by id and field
 * 
 * @param {*} table 
 * @param {*} id 
 * @param {*} field 
 * @returns 
 */
async function getEntryByIdField(table, id, field) {
    if (Helper.isEmpty(table) || Helper.isEmpty(id) || Helper.isEmpty(field)) {
        return false;
    }

    return new Promise((resolve,reject) => {
        let stmt = `SELECT ${field} FROM ${table} WHERE id = ?`;
        let stmtvalues = [id];

        connection.query(stmt, stmtvalues, (error, results, field) => {
            if (error) {
                reject(console.error(error.message));
            }

            resolve(results);
        });
    });
}

/**
 * Update entry in database given data and id
 * 
 * @param {*} table 
 * @param {*} id 
 * @param {*} data 
 * @returns 
 */
async function updateEntryByID(table, id, data) {
    var MediaData = [];
    var FieldName = data[0].field;
    var FieldValue = data[0].value;

    // Check if all the fields are present and accounted for
    if (Helper.isEmpty(table) || Helper.isEmpty(id) || Helper.isEmpty(data)) {
        return false;
    } 
    
    // Check if data contains the correct fields
    if (Helper.isEmpty(FieldName) || Helper.isEmpty(FieldValue)) {
        return false;
    }

    // Check if id exists in the database
    await getEntryByID(table, id).then((result) => {
        MediaData = result;
    });

    if (Helper.isEmpty(MediaData)) {
        return false;
    }

    // Validate check if the Fieldname and the fieldname value is accepted
    if (!Validator.matches(FieldName, "^[a-zA-Z0-9_\.\-\\s]*$")) {
        return false;
    } 

    if (!Validator.matches(FieldValue, "^[a-zA-Z0-9_\.\-\\s]*$")) {
        return false;
    }

    FieldValue = FieldValue.toLowerCase();

    return new Promise((resolve, reject) => {
        let stmt = `UPDATE ${table} SET ${FieldName} = ? WHERE id = ?`;
        let stmtvalue = [FieldValue, id];

        console.log(`Statement: ${stmt} - Values: ${stmtvalue}`);
        console.log(`UPDATE ${table} SET ${FieldName} = ${FieldValue} WHERE id = ${id}`)

        connection.query(stmt, stmtvalue, (error, results, fields) => {
            if (error) {
                reject(console.error(error.message));
            }

            resolve(results);
        });
    });
}

/**
 * Delete entry from database given a specific id
 * 
 * @param {*} table 
 * @param {*} id 
 * @returns 
 */
async function deleteEntryByID(table, id) {
    var EntryData = [];

    if (Helper.isEmpty(table) || Helper.isEmpty(id)) {
        return false;
    }

    await getEntryByID(table, id).then((result) => {
        EntryData = result;
    });

    if (Helper.isEmpty(EntryData)) {
        return false;
    }

    return new Promise((resolve, reject) => {
        let stmt = `DELETE FROM ${table} WHERE id = ?`;
        let stmtvalues = [id];

        connection.query(stmt, stmtvalues, (error, results, fields) => {
            if (error) {
                reject(console.error(error.message));
            }

            resolve(results);
        });
    });
}

/**
 * Insert New Entry into database, table with data
 * 
 * @param {} table 
 * @param {*} data 
 * @returns 
 */
async function newEntry(table, data) {
    var RequestBody = data;
    var fieldnames = RequestBody[0].fieldnames;
    var fieldvalues = RequestBody[0].fieldvalues;
    console.log(fieldvalues);
    if (Helper.isEmpty(table) || Helper.isEmpty(RequestBody)) {
        return false;
    }

    // Check if fieldnames and fieldvalues have the same number of items in thme
    if (fieldnames.length !== fieldvalues.length) {
        return false;
    }

    // Check if all the fieldnames pass validation
    for(let i=0; i < fieldnames.length; i++) {
        if (!Validator.matches(fieldnames[i], "^[a-zA-Z0-9_\.\-\\s]*$")) {
            return false;
        }

        if (!Validator.matches(fieldvalues[i], "^[a-zA-Z0-9_\.\-\\s]*$")) {
            return false;
        }
    }

    const lower = fieldvalues.map(element => {
        if (typeof(element) === "string") {
            return element.toLowerCase();
        } else {
            return element;
        }
    });

    return new Promise((resolve, reject) => {
        let stmt = `INSERT INTO ${table} (${fieldnames}) VALUES (?)`;
        let stmtvalues = [lower]
        console.log(sqlstring.format(stmt, stmtvalues));
        connection.query(stmt, stmtvalues, (error, results, fields) => {

            if (error) {
                reject(console.error(error.message));
            }

            resolve(results);
        });
    });
}

async function createUser(table, username, password) {
    return new Promise((resolve, reject) => {
        let stmt = `INSERT INTO ${table} (username, password, active, claim) VALUES (?, ?, ?, ?)`;
        let stmtvalues = [username, password, 0, ''];

        connection.query(stmt, stmtvalues, (error, results, fields) => {
            if (error) {
                reject(console.error(error.message));
            }

            resolve(results);
        });
    });
}




module.exports = {
    connection,

    getAll,
    getEntryByID,
    getEntryByField,
    getAllByField,
    getEntryByIdField,
    updateEntryByID,
    deleteEntryByID,
    newEntry,

    // Function for this app only
    createUser
}