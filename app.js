const express = require("express")
const { sendError } = require('./utils')
const scrapper = require("./lib/scrapper")
const app = express()

var morgan = require('morgan')
app.use(morgan('dev'))

const defaultPath = '/api';

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`
            Initialized API!
            Acesss in port ${port}`)
});


// ----------------- ROUTES ------------------ //
app.get(`/musixmatch`, async (req, res) => {
    await scrapper.lyricsMusixMatch(req, req.query.q).then((response)=>{
        res.status(200).send(response)
    }).catch((err) => {
        error = sendError(req, err)
        res.status(error.statusCode).send(error)
    });
})

app.use((req, res) =>{
    error = sendError(req, {
        name: 'RouteNotFound',
        message: 'You tried to access a route that does not exist'
    })
    res.status(error.statusCode).send(error)
});





