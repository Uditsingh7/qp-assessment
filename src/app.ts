// src/app.ts
import express from 'express';
import sequelize from './database/sequelize';

const app = express();

// Middleware, routes, and other configurations
// ...

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully');
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
