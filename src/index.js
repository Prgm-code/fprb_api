
const express = require('express');
const fprbRouter = require('./routes/fprbRouter.js');
const morgan = require('morgan');



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(morgan('dev'));

app.use('/fprb', fprbRouter);


app.get('/', (req, res) => {
    res.send('Hello World!');
});






app.listen(7000, () => console.log('Listening on port 7000!'));

