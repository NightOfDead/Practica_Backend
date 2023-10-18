create table persona(
Dni INT PRIMARY KEY,
Nombre VARCHAR(30) NOT NULL,
Apellido VARCHAR(30) NOT NULL
);

create table usuario(
Mail VARCHAR(40) PRIMARY KEY,
Nickname VARCHAR(20) NOT NULL,
Password VARCHAR(20) NOT NULL
);

ALTER TABLE usuario 
ADD COLUMN persona INT;

ALTER TABLE usuario 
ADD CONSTRAINT fk_persona 
FOREIGN KEY (persona) REFERENCES persona(Dni);