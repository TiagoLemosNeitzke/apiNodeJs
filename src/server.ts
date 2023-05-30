import express, { Application } from 'express';
import { UsersRoutes } from './routes/users.routes';
import multer from 'multer';
import { upload } from './config/multer';

const app:Application = express()

app.use(express.json()) // for parsing application/json
 
app.use(express.urlencoded({ extended: true })) 

const usersRoutes= new UsersRoutes().getRoutes()

app.use('/users',(usersRoutes))

app.use((err:Error, request:express.Request, response:express.Response, next:express.NextFunction) => {
    if (err instanceof Error) {
        return response.status(400).json({
            message: err.message
        })
    }

    return response.status(500).json({
        message: "Internal Server Error"
    })
 })


app.listen(3000, () => console.log('Server running on port 3000'))