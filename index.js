// Importar las librerías necesarias
import express from 'express'; // Importar Express para el servidor
import fs from "fs"; // Importar el módulo fs para leer/escribir archivos
import bodyParser from "body-parser"; // Importar bodyParser para parsear el cuerpo de las solicitudes
import swaggerUi from 'swagger-ui-express'; // Importar swagger-ui-express para servir la documentación
import swaggerJsdoc from 'swagger-jsdoc'; // Importar swagger-jsdoc para generar la documentación

// Crear la aplicación del servidor
const app = express();
app.use(bodyParser.json()); // Usar bodyParser para parsear el cuerpo de las solicitudes como JSON

// Configuración de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API REST Node.js y Express.js',
      version: '1.0.0',
      description: 'Documentación de mi primera API utilizando NodeJS y ExpressJS',
      contact: {
        name: 'Luis Manuel De la Cruz Ledesma',
        email: 'ledesmadelacruzluismanuel@gmail.com'
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Servidor de desarrollo'
        }
      ]
    }
  },
  apis: ['./index.js']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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

/**
 * @swagger
 * /:
 *   get:
 *     summary: Bienvenida a la API
 *     responses:
 *       200:
 *         description: Mensaje de bienvenida
 */
app.get("/", (req, res) => {
  res.send("Bienvenido a mi primera API Rest!"); // Devolver un mensaje de bienvenida
});

/**
 * @swagger
 * /vehiculos:
 *   get:
 *     summary: Obtiene todos los vehículos
 *     responses:
 *       200:
 *         description: Lista de vehículos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
app.get("/vehiculos", (req, res) => {
  const data = readData(); // Leer los datos del archivo JSON
  res.json(data.vehiculos); // Devolver todos los vehículos en formato JSON
});

/**
 * @swagger
 * /vehiculos/id/{id}:
 *   get:
 *     summary: Obtiene un vehículo por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vehículo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Vehículo no encontrado
 */
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

/**
 * @swagger
 * /vehiculos:
 *   post:
 *     summary: Agrega un nuevo vehículo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Vehículo agregado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Error al guardar los datos
 */
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

/**
 * @swagger
 * /vehiculos/id/{id}:
 *   put:
 *     summary: Actualiza un vehículo por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Vehículo actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Vehículo no encontrado
 */
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

/**
 * @swagger
 * /vehiculos/id/{id}:
 *   delete:
 *     summary: Elimina un vehículo por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vehículo eliminado
 *       404:
 *         description: Vehículo no encontrado
 */
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