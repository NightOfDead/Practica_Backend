require('rootpath')();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const persona_db = require("model/persona.js");

app.get('/', (req, res) => {
    if (req.query.Apellido) {
        console.log('Buscar por Apellido.');
        const apellidoBuscado = req.query.Apellido;
        persona_db.getByApellido(apellidoBuscado, (err, resultado) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(resultado);
            }
        });
    } else if (req.query.Nickname) {
        console.log('Buscar por Nickname.');
        const nicknameBuscado = req.query.Nickname;
        persona_db.getByUser(nicknameBuscado, (err, resultado) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(resultado);
            }
        })
    } else {
        persona_db.getPersona((err, resultado) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(resultado);
            }
        });
    }
})

app.post('/', (req, res) => {
    let crearUnaPersona = req.body;
    persona_db.createPersona(crearUnaPersona, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    })
})

app.put("/persona/:Dni", (req, res) => {
    let persona = req.body;
    let id = req.params.Dni;
    persona_db.modificarPersona(persona, id, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
})

app.delete('/persona/:Dni', (req, res) => {
    let idPersonaEliminar = req.params.Dni;
    persona_db.borrar(idPersonaEliminar, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (resultado.detail.affectedRows == 0) {
                res.status(404).send(resultado.message);
            } else {
                res.send(resultado.message);
            }
        }
    });
})

module.exports = app;