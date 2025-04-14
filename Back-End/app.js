const express = require('express')
const {ObjectId} = require('mongodb')
const { connectToDb, getDb } = require('./db')

// init app && middleware
const app = express()
app.use(express.json())

// db connection
let db
connectToDb((err) => {
    if (!err) {
        app.listen(3000, () => {
        console.log('app listening on port 3000')
    })
    db = getDb()
    }
})

// routes
app.get('/todos', (req, res) => {
    let todos = []

    db.collection('todos')
        .find()
        .sort({title: 1})
        .forEach(todo=> todos.push(todo))
        .then(() => {
            res.status(200).json(todos)
        })
        .catch(() => {
            res.status(500).json({error: 'Could not fetch the documents'})
        })
})

app.get('/todos/:id', (req, res) => {
    
    if (ObjectId.isValid(req.params.id)) {
        db.collection('todos')
    .findOne({_id: new ObjectId(req.params.id)})
    .then(doc => {
        res.status(200).json(doc)
    })
    .catch(err => {
        res.status(500).json({error: 'Could not fetch the document'})
    })
    } else {
        res.status(500).json({error: 'Not a valid doc id'})
    }
    
})

app.post('/todos', (req, res) => {
    const todo = req.body

    db.collection('todos')
    .insertOne(todo)
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json({err: 'Could not create a new doc'})
    })
})

app.delete('/todos/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)) {
        db.collection('todos')
    .deleteOne({_id: new ObjectId(req.params.id)})
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json({error: 'Could not delete the document'})
    })
    } else {
        res.status(500).json({error: 'Not a valid doc id'})
    }
})
app.patch('/todos/:id', (req, res) => {
    const updates = req.body

    if (ObjectId.isValid(req.params.id)) {
        db.collection('todos')
    .updateOne({_id: new ObjectId(req.params.id)}, {$set: updates})
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json({error: 'Could not update the document'})
    })
    } else {
        res.status(500).json({error: 'Not a valid doc id'})
    }
})
