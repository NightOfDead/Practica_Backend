require('rootpath')();

let persona_db = {};

const { query } = require('express'); //conexión con express
const mysql = require('mysql'); //conexión con MySQL
const configuracion = require("config.json");

var connection = mysql.createConnection(configuracion.database);
connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Base de datos conectada.");
    }
});

persona_db.getAll = function (funCallback) { //Realiza el pedido  de persona controller y devuelve "error o resultado"
    let consulta = 'SELECT * FROM persona'; 
    connection.query(consulta, function (err, rows) {
        if (err) {
            funCallback(err);
            return;
        } else {
            funCallback(undefined, rows); 
        }
    });
}

persona_db.create = function(persona, funcallback) { //Realiza el pedido  de persona controller y devuelve "error o resultado"
    const consulta = "INSERT INTO persona (Dni, Nombre, Apellido) VALUES (?, ?, ?)"; //crea un nuevo elemento en la tabla con las siguientes variables
    const params = [persona.Dni, persona.Nombre, persona.Apellido];

    connection.query(consulta, params, (err, resultado) => {
        if (err) {
            funcallback(err);
        } else {
            funcallback(null, resultado.insertId); // Pasa el ID del nuevo usuario como resultado.
        }
    });
};

persona_db.update = function(persona, funcallback) { //Realiza el pedido  de persona controller y devuelve "error o resultado"
    const consulta = "UPDATE persona SET Nombre = ?, Apellido = ? WHERE Dni = ?"; //crea un nuevo elemento en la tabla con las siguientes variables
    const params = [persona.Nombre, persona.Apellido, persona.Dni];

    connection.query(consulta, params, (err, resultado) => {
        if (err) {
            funcallback(err);
        } else {
            funcallback(null, resultado); // (Pasar "null" como primer parámetro indica que no hay error). Muestra el nuevo valor como resultado.
        }
    });
};

persona_db.delete = function (id_p_e, retorno) { //Realiza el pedido  de persona controller y devuelve "error o resultado"
    consulta = "DELETE FROM persona WHERE Dni = ?"; //Borra un elemento en la tabla persona que coincida con el parámetro Dni
    parametro = id_p_e; //id para eliminar (primary key)

    connection.query(consulta, parametro, (err, resultado) => {
        if(err) {
            retorno({message: err.code, detail: err}, undefined);
        }else{
            retorno(undefined, {message: `La persona ${id_p_e} fue eliminada correctamente.`,
            detail: resultado});
        }
    })
};

persona_db.getByApellido = function(Apellido, funcallback) { //Realiza el pedido  de persona controller y devuelve "error o resultado"
    const consulta = "SELECT Apellido FROM persona"; //selecciona un elemento de la columna Apellido
    const params = Apellido;

    connection.query(consulta, params, (err, resultado) => {
        if (err) {
            funcallback(err);
        } else {
            funcallback(null, resultado); // Pasa el resultado de la consulta, como información de las personas, con el Apellido especificado.
        }
    });
};

persona_db.getUserByPersona = function(Dni,funcallback) {
    connection.query("SELECT * FROM persona WHERE Dni = ?",Dni,(err,respuesta) => {
        if (err) {
            funcallback({
                mensaje : "Ha ocurrido algún error, probablemente de sintaxis al buscar la persona.",
                detalle : err
            })
        } else if (respuesta.length == 0) {
            funcallback(undefined, {
                mensaje: "No se encontró la persona buscada.",
                detalle : respuesta
            })
        } else {
            consulta = "SELECT Nickname from usuario INNER JOIN persona on usuario.persona = persona.Dni and usuario.persona = ?";
            connection.query(consulta,Dni,(err,r)=>{
                if (err) {
                    funcallback({
                        mensaje: "Ha ocurrido algún error, posiblemente de sintaxis al buscar el Nickname.",
                        detalle: err
                    });
                }else if (r.length == 0) {
                    funcallback(undefined, {
                        mensaje: "La persona seleccionada no posee un usuario registrado en la base de datos.",
                        detalle : r
                    })
                } else {
                    funcallback(undefined, {
                        mensaje: `El Nickname de la persona seleccionada es ${r[0]["Nickname"]}.`,
                        detalle : r 
                    })
                }
            })
        }
    })
}

module.exports = persona_db;