# School Rest API
___
### But first... [^1]
___
## Summary
___

The School Rest API app can be best described in two parts: models and routes.

- The app will pass requests along their routes to return, create, replace, or delete a model instance as defined in the models folder. The app is built around User and Course models. Sequelize's Model and DataTypes are imported into a class named for their respective model, User or Course. Each instance will be stored based on the DataTypes assigned to the model's properties. Several properties for each model are required and validated using Sequelize's native validate property. The model instances are setup for storage in the 'fsjstd-restapi.db' file by the config file 'config.json'. Each request for data will draw existing model instances from this database file.

- The app handles routes based on the the index file of the routes folder. Here each route is defined and followed by a chain of methods based on the request type ('GET', 'POST', etc...). Sequelize getter and setter methods are employed using the request object data to manipulate the data stored in the database. Routes also include Sequelize validation and constraint error handling to ensure specific error messages are returned upon a validate or constraint error. General error handling is present on the root app file and the route passes off errors that do not match a validation or constraint error. In addition to basic routing, the express router filters some requests requiring authorization through a 'validateUser' function which ensures the user is authorized to make the request before it completes the request. The 'validateUser' function is defined at the top of the index file.

Thank you for taking the time to read me!



[^1]: This project makes use of NodeJS modules to function properly. Please run "npm start" in your console and point Postman or another API testing application to "localhost:5000"
