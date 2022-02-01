const Validator = require('validator');
let mysql = require('mysql');

let connection = mysql.createConnection({
    host: process.env.DB_HOSTNAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

/**
 * Get all the users in the database 
 * 
 * @returns {object}
 */
function getAllUsers() {
    return new Promise((resolve, reject) => {
        let SQL = `SELECT username FROM users`;

        connection.query(SQL, (error, results, fields) => {
          if (error) {
              reject(console.error(error.message));
        }
        
        resolve(results)
      });
    })
}

/**
 * Check if a user exist in the database (Function has been replaced)
 * 
 * @param {string} username 
 * @returns {boolean}
 */
async function userExist(username) {
    return new Promise((resolve, reject) => {
        let stmt = `SELECT * FROM users WHERE username = ?`;
        let stmtvalues = [username];

        connection.query(stmt, stmtvalues, (error, results, fields) => {
            if (error) {
                reject(error);
            }

            if (!results) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

/**
 * Create a user if it does not exist
 * 
 * @param {string} username 
 * @param {string} password 
 */
async function createUser(username, password) {
    UserData = await userExist(username).then((result) => {
        // If user does not exist
        if (!result) {
            // Return new promise
            return new Promise((resolve, reject) =>{
                // Prepare SQL statement
                let stmt = `INSERT INTO users (username, password, active, claim) VALUES (?, ?, ?, ?)`;
                let stmtvalues = [username, password, 0, ''];
    
                // Run Query
                connection.query(stmt, stmtvalues, (error, results, fields) => {
                    if (error) {
                        // Return rejection
                        reject(console.log(error));
                    }

                    // Return resolve
                    resolve(results);
                });
            });
        }
    })
}

async function getUser(username) {
    return new Promise((resolve, reject) => {
        let stmt = `SELECT * FROM users WHERE username = ?`;
        let stmtvalues = [username];

        // Run Query
        connection.query(stmt, stmtvalues, (error, results, fields) => {
            if (error) {
                // return rejection
                reject(console.log(error)); 
            }

            // return promise
            resolve(results);
        });
    });
}

/**
 * Validates the username
 * 
 * @param {string} username 
 * @returns {boolean}
 */
function validateUsername(username) {
    if (!Validator.matches(username,"^[a-zA-Z0-9_\.\-]*$")) {
        return false;
    } else {
        return true;
    }
}

 

module.exports = {
    getAllUsers,
    createUser,
    userExist,
    validateUsername,
    getUser
}