import express from 'express'

const app = express();

app.get('/', function(req, res) {
    res.send('Hello from server')
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server started at ${port}`))