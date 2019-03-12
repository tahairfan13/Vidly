const helmet = require('helmet');
const config = require('config'); // used to create enviornments(Production, Development)
const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json()); // To get data in JSON form
app.use(express.urlencoded({extended: true})); // Use in URL encorded forms
// Custom Middleware
app.use(helmet()); // Security purpose use to add extra headers
//console.log(app.get('env'));

console.log(config.get('Vidly.dbConfig.host'));

const genres = [
    {id: 1, name: "Terminator"},
    {id: 2, name: "Warrior"}
]


app.get('/', (req, res) => {
    res.send("I am the index page");
})

//Index
app.get('/api/genres', (req, res) => {
   res.send(genres); 
})

//Create
app.post('/api/genres', (req, res)=>{
    const { error } = validateMovie(req.body);
    if (error)  {
      res.status(400).send({"error": error.details[0].message});
    }
    else {
        const genre = {
        id: genres.length + 1,
        name: req.body.name
        }
        genres.push(genre);
        res.send(genres);
    }
})

//Show
app.get('/api/genres/:id', (req, res)=> {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send("The genre with given ID does not exist!");
    res.send(genre);
})

app.put('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send("The genre with given ID does not exist!");

    const { error } = validateMovie(req.body);
    if (error)  {
      res.status(400).send({"error": error.details[0].message});
    }
    else {
        genre.name = req.body.name;
        res.send(genre);
    }
})


app.delete('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send("The genre with given ID does not exist!");
});

const validateMovie = (course) => {
    const schema = {
        name: Joi.string().min(4).max(8).required()
    }
    return Joi.validate(course, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server is running"));
