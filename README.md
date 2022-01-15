<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
<h3 align="center">Authentication Server</h3>

  <p align="center">
    Authentication server using JSON Web Tokens for rest APIs
    <br />
    <a href="https://github.com/codebarbarian/authentication-server"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/codebarbarian/authentication-server/issues">Report Bug</a>
    ·
    <a href="https://github.com/codebarbarian/authentication-server/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

The authentication server is written as a micro service following the mvc design pattern. You should easily be able to implement this into your own project.
Before use, make sure to read this readme file and find out what you will be needing to get everything up and running. 

The most important part is the .env file which must contain the following: 

```text
TOKEN_SERVER_PORT = 4000
REFRESH_TOKEN_SECRET = REFRESH_TOKEN_SECRET_GOES_HERE
ACCESS_TOKEN_SECRET = ACCESS_TOKEN_SECRET_GOES_HERE

DB_HOSTNAME = database.example.com
DB_USERNAME = exampledb
DB_PASSWORD = examplepassword
DB_DATABASE = exampledatabase
```

To generate the Refresh Token Secret and the Access Token Secret: 
```js
$ node
$ require("crypto").randomBytes(64).toString("hex")
```

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

* [NodeJs](https://nodejs.org/)
* [Sequelize](https://sequelize.org/)
* [ExpressJS](https://expressjs.com/)
* [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)
* [dotenv](https://github.com/motdotla/dotenv)
* [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
* [MySQL](https://github.com/mysqljs/mysql)
* [Validator](https://github.com/validatorjs/validator.js)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started
Add a .env file in the src directory with the following information: 
```text
TOKEN_SERVER_PORT = 4000
REFRESH_TOKEN_SECRET = REFRESH_TOKEN_SECRET_GOES_HERE
ACCESS_TOKEN_SECRET = ACCESS_TOKEN_SECRET_GOES_HERE

DB_HOSTNAME = database.example.com
DB_USERNAME = exampledb
DB_PASSWORD = examplepassword
DB_DATABASE = exampledatabase
```

### Prerequisites
- NodeJS Dependencies:

```json
"dependencies": {
    "bcrypt": "^5.0.1",
    "dotenv": "^11.0.0",
    "express": "^4.17.2",
    "jsonwebtoken": "^8.5.1",
    "mysql": "^2.18.1",
    "validator": "^13.7.0"
  }
```
- Access to a MySQL Database

### Installation
This is the SQL Table that needs to be added to the database

```SQL
CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `active` tinyint(4) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage
Add the ACCESS_TOKEN_SECRET to the application environment on you rest api or web application and use the tokenModel.js to validate the token for access.
- The .env file must have the same ACCESS_TOKEN_SECRET as your authentication server.

- To create a user:
Send to http://yoursite.org/api/v1/user/create

```json
{
  "username":"your_username",
  "password":"your_password",
  "claim":"your_claim"
}
```
- To login (This will give you a refresh token, and a access token)
Send to http://yoursite.org/api/v1/user/login
```json
{
  "username":"your_username",
  "password":"password"
}
```

- To refresh a token
send to http://yoursite.org/api/v1/user/refresh

```json
{
  "token":"your_refresh_token"
}
```

- To logout
Send to http://yoursite.org/api/v1/user/logout

```json
{
  "token":"your_refresh_token"
}
```


Test Application using the validateToken script
```js
/**
 * Use the same environment configuration
 */
require("dotenv").config()

/**
 * Include express, jwt and the tokenValidator
 */
const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.TEST_APP_PORT || 8080;

function validateToken (req, res, next) {
  if (!req.headers["authorization"]) {
      res.status(400);
      res.json({
          "message":"requires authorization header to be set"
      });
  } else {
      // Get Token from request header
      const authorization = req.headers["authorization"];
      const token = authorization.split(" ")[1];

      if (token == null) {
          res.status(400).send({
              "message":"token not Present"
          });
      }

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
          if (error) {
              res.status(403).send({
                  "message":"token invalid"
              });
          } else {
              req.user = user;
              next();
          }
      });
  }
}

app.use (express.json())

app.listen(port, ()=> {
    console.log(`Validation server running on ${port}`)
});

app.get("/secret", tokenValidator.validateToken, (req, res)=>{
    console.log("Token is valid")
    console.log(req.user.user)
    res.send(`${req.user.user} successfully accessed the secret place`)
})
``` 

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [X] Basic POC up and running
- [X] Based on Claims 
- [X] Should be able to work with rest API's as long as they have a token shared. 

See the [open issues](https://github.com/codebarbarian/authentication-server/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Morten Haugstad - [@codebarbarian](https://twitter.com/codebarbarian)

Project Link: [https://github.com/codebarbarian/authentication-server](https://github.com/codebarbarian/authentication-server)

<p align="right">(<a href="#top">back to top</a>)</p>

## Acknowledgements
- Built upon [Authenticate REST APIs in Node JS using JWT (Json Web Tokens)](https://medium.com/@prashantramnyc/authenticate-rest-apis-in-node-js-using-jwt-json-web-tokens-f0e97669aad3) - By Prashant Ram

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/codebarbarian/authentication-server.svg?style=for-the-badge
[contributors-url]: https://github.com/codebarbarian/authentication-server/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/codebarbarian/authentication-server.svg?style=for-the-badge
[forks-url]: https://github.com/codebarbarian/authentication-server/network/members
[stars-shield]: https://img.shields.io/github/stars/codebarbarian/authentication-server.svg?style=for-the-badge
[stars-url]: https://github.com/codebarbarian/authentication-server/stargazers
[issues-shield]: https://img.shields.io/github/issues/codebarbarian/authentication-server.svg?style=for-the-badge
[issues-url]: https://github.com/codebarbarian/authentication-server/issues
[license-shield]: https://img.shields.io/github/license/codebarbarian/authentication-server.svg?style=for-the-badge
[license-url]: https://github.com/codebarbarian/authentication-server/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/mortenhaugstad
[product-screenshot]: images/screenshot.png
