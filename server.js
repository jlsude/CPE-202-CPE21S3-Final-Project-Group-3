const express = require('express');


const app = express();


const clientRoutes = require('./routes/api/client_table.js');
const appointmentRoutes = require('./routes/api/appointment_table.js');
const paidappointmentRoutes = require('./routes/api/paid_appointment_table.js');
const ackappointmentRoutes = require('./routes/api/acknowledged_appointment_table.js');
const photographerRoutes = require('./routes/api/photographer_table.js');
const photosessionscheduleRoutes = require('./routes/api/photosession_schedule_table.js');

// init Middleware
app.use(express.json({ extended: false }));


app.use('/client_table', clientRoutes);
app.use('/appointment_table', appointmentRoutes);
app.use('/paid_appointment_table', paidappointmentRoutes);
app.use('/acked_appointment_table', ackappointmentRoutes);
app.use('/photographer_table', photographerRoutes);
app.use('/photosession_schedule_table', photosessionscheduleRoutes);


app.get('/', (req, res) => res.send('ALAS API Running'));

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

