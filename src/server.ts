import express, { Application } from 'express'

const app:Application = express()

app.use(express.json()) // for parsing application/json
 
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.listen(3000, () => console.log('Server running on port 3000'))