const express = require('express');
const app = express();

app.use('/static', express.static('public'));

app.listen('3000', () => {
    console.log('Frontend de citas medicas - Activo');
})