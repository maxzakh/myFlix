const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.json([1,2,3]);
});

const port = process.env.PORT || 5500;

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});