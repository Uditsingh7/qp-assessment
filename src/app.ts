import express from 'express';
import { router as adminRouter } from './routes/adminRoutes';
import { router as userRouter } from './routes/userRoutes';
import bodyParser from 'body-parser';
import cors from 'cors';
import sequelize from './database/sequelize';


const app = express();

// Middleware setup
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies
// Use the admin router
app.use('/api/admin', adminRouter);

// User router
app.use('/api/user', userRouter);

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
