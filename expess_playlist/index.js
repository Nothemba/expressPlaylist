const musicians = require('./sever');
const fs = require('fs');
const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());
const port = process.env.PORT || 3090;

app.get('/', (req, res) => res.sendFile('../public/index.html', {
    root: __dirname
}));
app.get('/api/musicians', (req, res) => {
    musicians.sort((a, b) => (a.Artist > b.Artist) ? 1 : -1);
    return res.send(musicians);
});
app.get('/api/musicians/:id', (req, res) => {
    let musician = musicians.find(el => el.id === parseInt(req.params.id));
    if (!musician) return res.status(404).send("Musician with that id was not found");
    res.send(musician);
});

app.post('/api/musicians/', (req, res) => {
    const schema = {
        Artist: Joi.string().min(3).required(),
        Song: Joi.string().min(3).required()
    };

    const result = Joi.validate(req.body, schema);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const musician = {
        id: musicians.length + 1,
        Artist: req.body.Artist,
        Song: req.body.Song
    };
    musicians.push(musician);
    res.send(musician);
});

app.put('/api/musicians/:id', (req, res) => {
    let musician = musicians.find(el => el.id === parseInt(req.params.id));
    if (!musician) return res.status(404).send("The musician with entered id was not found");
    const schema = {
        Artist: Joi.string().min(3).required(),
        Song: Joi.string().min(3).required()
    };
    const result = Joi.validate(req.body, schema);
    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }
    musician.Artist = req.body.Artist;
    musician.Song = req.body.Song;
    res.send(musician);
});

app.delete('/api/musicians/:id', (req, res) => {
    let musician = musicians.find(el => el.id === parseInt(req.params.id));
    const index = musicians.indexOf(musician);
    musicians.splice(index, 1);
    res.send(musician);
});

app.listen(port, () => console.log(`The app is listening on ${port}`));