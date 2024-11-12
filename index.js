// Importar las librerías necesarias
import express from 'express'; // Importar Express para el servidor
import fs from "fs"; // Importar el módulo fs para leer/escribir archivos
import bodyParser from "body-parser"; // Importar bodyParser para parsear el cuerpo de las solicitudes

// Crear la aplicación del servidor
const app = express();
app.use(bodyParser.json()); // Usar bodyParser para parsear el cuerpo de las solicitudes como JSON

// Función para leer los datos del archivo JSON
const readData = () => {
    try {
        const data = fs.readFileSync("./db.json"); // Leer el archivo db.json
        return JSON.parse(data); // Devolver los datos parseados como objeto JavaScript
    } catch (error) {
        console.log(error); // Manejar errores de lectura del archivo
    }
};

// Función para escribir los datos en el archivo JSON
const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data, null, 2)); // Escribir los datos en el archivo db.json
    } catch (error) {
        console.log(error); // Manejar errores de escritura en el archivo
    }
};

// Endpoint para la ruta raíz
app.get("/", (req, res) => {
    res.send("Bienvenido a mi primera API Rest!"); // Devolver un mensaje de bienvenida
});

// Endpoint para obtener todos los vehículos
app.get("/vehiculos", (req, res) => {
    const data = readData(); // Leer los datos del archivo JSON
    res.json(data.vehiculos); // Devolver todos los vehículos en formato JSON
});

// Endpoint para obtener un vehículo por ID
app.get("/vehiculos/id/:id", (req, res) => {
    const data = readData(); // Leer los datos del archivo JSON
    const vehiculoId = parseInt(req.params.id);
    const vehiculo = data.vehiculos.find((v) => v.id === vehiculoId); // Encontrar el vehículo por ID
    if (vehiculo) {
        res.json(vehiculo); // Devolver el vehículo encontrado en formato JSON
    } else {
        res.status(404).json({ error: 'Vehículo no encontrado.' }); // Manejar errores de vehículo no encontrado
    }
});

// Endpoint para agregar un nuevo vehículo
app.post("/vehiculos", (req, res) => {
    const data = readData(); // Leer los datos del archivo JSON
    const body = req.body; // Obtener el cuerpo de la solicitud
    const nuevoVehiculo = {
        id: data.vehiculos.length > 0 ? data.vehiculos[data.vehiculos.length - 1].id + 1 : 1, // Generar un nuevo ID único para el vehículo
        ...body, // Incluir los demás datos del cuerpo de la solicitud
    };
    data.vehiculos.push(nuevoVehiculo); // Agregar el nuevo vehículo al array de vehículos
    try {
        writeData(data); // Escribir los datos actualizados en el archivo JSON
        res.json(nuevoVehiculo); // Devolver el nuevo vehículo en formato JSON
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar los datos en el archivo.' }); // Manejar errores de escritura
    }
});

// Endpoint actualizado para actualizar un vehículo por ID
app.put("/vehiculos/id/:id", (req, res) => {
    const data = readData(); // Leer los datos del archivo JSON
    const vehiculoId = parseInt(req.params.id);
    const vehiculo = data.vehiculos.find((v) => v.id === vehiculoId); // Encontrar el vehículo por ID

    if (vehiculo) {
        const body = req.body; // Obtener el cuerpo de la solicitud
        Object.assign(vehiculo, body); // Actualizar los datos del vehículo con los datos del cuerpo de la solicitud
        writeData(data); // Escribir los datos actualizados en el archivo JSON
        res.json(vehiculo); // Devolver el vehículo actualizado en formato JSON
    } else {
        res.status(404).json({ error: 'Vehículo no encontrado.' }); // Manejar errores de vehículo no encontrado
    }
});

// Endpoint para eliminar un vehículo por ID
app.delete("/vehiculos/id/:id", (req, res) => {
    const data = readData(); // Leer los datos del archivo JSON
    const vehiculoId = parseInt(req.params.id);
    const vehiculoIndex = data.vehiculos.findIndex((v) => v.id === vehiculoId); // Encontrar el index del vehículo por ID
    if (vehiculoIndex !== -1) {
        data.vehiculos.splice(vehiculoIndex, 1); // Eliminar el vehículo del array de vehículos
        writeData(data); // Escribir los datos actualizados en el archivo JSON
        res.json({ message: 'Vehículo eliminado correctamente.' }); // Devolver un mensaje de confirmación
    } else {
        res.status(404).json({ error: 'Vehículo no encontrado.' }); // Manejar errores de vehículo no encontrado
    }
});


// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('El servidor está escuchando en el puerto 3000'); // Imprimir mensaje de inicio del servidor
});