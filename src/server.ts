import express, { Application } from 'express';
import { UsersRoutes } from './routes/users.routes';
import multer from 'multer';
import { upload } from './config/multer';
import { SchedulesRoutes } from './routes/schedules.routes';
import cors from 'cors';

const app:Application = express()
app.use(cors())

app.use(express.json()) // for parsing application/json
 
app.use(express.urlencoded({ extended: true })) 

const usersRoutes = new UsersRoutes().getRoutes()
const schedulesRoutes = new SchedulesRoutes().getRoutes()

app.use('/users',(usersRoutes))
app.use('/schedules',(schedulesRoutes))

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