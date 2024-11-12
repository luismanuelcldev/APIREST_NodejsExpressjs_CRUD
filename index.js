import express from 'express';
import fs from "fs";

//Creo el objeto de mi aplicacion de servidor 
const app = express();

const readData = () => {
    try {
        const data = fs.readFileSync("./db.json");
    return JSON.parse(data);
    } catch (error) {
        console.log(error);
    } 
};

const writeData = (data) => {
    try {
      fs.writeFileSync("./db", JSON.stringify(data));
    } catch (error) {
        console.log
    (error);
    } 
};

readData();

//Adicionamos un empoit
app.get("/", (req, res)   => {
    res.send("Bienvenido a mi primera API Rest!");
});

app.get("/vehiculos", (req, res)   => {
    const data = readData(); 
    res.json(data.vehiculos);
});
 
app.get("/vehiculos/:marca", (req, res)  => {
    const data = readData(); 
    const marca = parseInt(req.params.marca);
    const vehiculo = data.vehiculos.find((vehiculo) => vehiculo.marca === marca);
    res.json(vehiculo);
});

//De ese objeto utilizare la funcion listend para escuchar al servidor 
app.listen(3000, () => {
    console.log('El servidor esta escuchando en el puerto 3000');
});

