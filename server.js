const express = require('express');
const app = express();

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log('Server is running...', PORT));