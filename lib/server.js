'use strict';

/** @module lib/server */

const express = require('express');
// const swaggify = require('./swaggify.js');

const app = express();

// const PORT = process.env.PORT || 8080;

let db = [];

/**
 * An object to represent a person
 * @constructor
 * @param {String} name - Name of person
 * @param {Number} id - Unique identifier for the Person object
 */

function Person(name, id) {
  if(typeof name === 'string'){ 
    this.name = name;

  } else {
    throw new Error('Invalid name');
  }

  id = Number(id);
  this.id = id ? id : this.id = db.length + 1;
}

app.use(express.json());

// swaggify(app);

/**
 * Middleware to log METHOD and PATH of request
 * @param {Object} req - Express Request Object
 * @param {Object} res - Express Response Object
 */

app.use( (req,res,next) => {
  console.log('LOG:', req.method, req.path);
  next();
});

/**
 * Get a list of records
 * @route GET /{categories}
 * @param {string} model.path.required - path
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { count: 2, results: [{}, {}]}
 */
app.get('/categories', (req,res) => {
  let count = db.length;
  let results = db;
  res.json({count,results});
});

/**
 * Get a records based on id
 * @route GET /{model}/:{id}
 * @param {string} model.path.required - path
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { count: 2, results: [{}, {}]}
 */
app.get('/categories/:id', (req,res) => {
  let id = req.params.id;
  let record = db.filter((record) => record.id === parseInt(id));
  res.json(record[0]);
});

/**
 * Add a record to database
 * @route POST /{model}
 * @param {string} model.path.required - path
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { count: 2, results: [{}, {}]}
 */

app.post('/categories', (req,res) => {
  if (!req.body.name || typeof req.body.name !== 'string') {
    console.error('Invalid name');
  } else {
    let person = new Person(req.body.name);
    db.push(person);
    res.json(db);
  }
});

/**
 * Modify a record in database
 * @route PUT /{model}/:{id}
 * @param {string} model.path.required - path
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { count: 2, results: [{}, {}]}
 */
app.put('/categories/:id', (req,res) => {
  let id = req.params.id;

  if (!req.body.name || typeof req.body.name !== 'string') {
    console.error('Invalid name');
  } else {  
    let person = new Person(req.body.name, id);
    let index = -1;

    for (let i = 0; i < db.length; i++) {
      if (db[i].id === Number(id)) {
        index = i;
        db.splice(index, 1, person);
        res.json(db);
      }
    }
  }
});

app.get('*', (req, res) => {
  res.status(404).send('404 not found');
});

app.use((err, req, res) => {
  res.status(500).send('Server error!');
});

/**
 * Delete a record from database
 * @route PUT /{model}/:{id}
 * @param {string} model.path.required - path
 * @returns {Object} 500 - Server error
 * @returns {Object} 200 - { count: 2, results: [{}, {}]}
 */

app.delete('/categories/:id', (req, res) => {
  let id = req.params.id;
  let index = -1;

  for (let i = 0; i < db.length; i++) {
    if (db[i].id === Number(id)) {
      index = i;

      db.splice(index, 1);
      res.json(db);
    }
  }
});

app.use((err, req, res) => {
  console.error(err);
  res.send(500).send('Internal server error encountered');
});

module.exports = {
  server: app,
  start: port => {
    let PORT = port || process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  },
};
