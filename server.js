const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS

const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.json({ limit: '50mb' })); // Increase payload size limit
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // Increase payload size limit for URL-encoded data
app.use(cors()); // Use CORS

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/excelData', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define a schema and model
const excelSchema = new mongoose.Schema({}, { strict: false });
const ExcelModel = mongoose.model('ExcelData', excelSchema);

// Route to handle Excel data (POST)
app.post('/save-excel', async (req, res) => {
    try {
        console.log('Received data:', req.body); // Log the received data
        const excelData = new ExcelModel(req.body);
        await excelData.save();
        console.log('Data saved successfully:', req.body); // Log the saved data
        res.status(200).send({ message: 'Data saved successfully' });
    } catch (error) {
        console.error('Error saving data:', error); // Log the error
        res.status(500).send({ message: 'Error saving data', error });
    }
});

// Route to fetch Excel data (GET)
app.get('/get-excel', async (req, res) => {
    try {
        const data = await ExcelModel.find({});
        res.status(200).send(data);
    } catch (error) {
        console.error('Error fetching data:', error); // Log the error
        res.status(500).send({ message: 'Error fetching data', error });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});