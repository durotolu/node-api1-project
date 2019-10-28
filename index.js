// implement your API here
const express = require('express')
const cors = require('cors')

const db = require('./data/db')

const app = express()

app.use(cors())
app.use(express.json())

app.post('/api/users', createNewUser)
app.get('/api/users', getAllUsers)
app.get('/api/users/:id', getUserById)
app.delete('/api/users/:id', deleteUserById)
app.put('/api/users/:id', updatesUserById)

function createNewUser(req, res) {
    const user = {
        name: req.body.name,
        bio: req.body.bio,
    }

    db.insert(user)
        .then(data => {
            if(!user.name || !user.bio) {
                res.status(400).json({
                    success: false,
                    errorMessage: "Please provide name and bio for the user."
                })
            } else {
                user.id = data.id;
                res.status(201).json({
                    success: true,
                    user,
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                success: false,
                error: "There was an error while saving the user to the database"
            })
            //console.log(error)
        })
}

function getAllUsers (req, res) {
    db.find()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                error: "The users information could not be retrieved.",
            })
        })
}

function getUserById (req, res) {
    const { id } = req.params
    db.findById(id)
        .then(user => {
            if(user) {
                res.status(200).json({
                    success: true,
                    user,
                }) 
            } else {
                res.status(404).json({
                    success: false,
                    message: 'The user with the specified ID does not exist.'
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                success: false,
                error: "The user information could not be retrieved.",
            })
        })
}

function deleteUserById (req, res) {
    db.remove(req.params.id)
        .then(user => {
            if(user) {
                res.status(200).json({
                    success: true,
                    user,
                })
            } else {
                res.status(404).json({
                    success: false,
                    message: 'The user with the specified ID does not exist.'
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                success: false,
                error: "The user could not be removed"
            })
        })
}

function updatesUserById (req, res) {
    const changes = req.body
    db.update(req.params.id, changes)
        .then(user => {
            if(!user) {
                res.status(404).json({
                    success: false,
                    message: "The user with the specified ID does not exist." 
                })
            } else if (!changes.name || !changes.bio) {
                res.status(400).json({
                    success: false,
                    errorMessage: "Please provide name and bio for the user."
                })
            } else if (user) {
                changes.id = req.params.id
                res.status(200).json({
                    success: true,
                    changes,
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                error: "The user information could not be modified."
            })
        })
}

app.listen(process.env.PORT || 3500, () => {
    console.log('listening on ' + (process.env.PORT || 3500));
})