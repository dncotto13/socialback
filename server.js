require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const {
    newUserController,
    getUserController,
    getUserPostsController,
    getMeController,
    loginController,
} = require('./controllers/users');

const {
    getPostsController,
    newPostController,
    getSinglePostController,
    deletePostController,
} = require('./controllers/posts');

const {authUser} = require('./middlewares/auth');


const app = express();

app.use(fileUpload());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static('./uploads'));
app.use(cors());


// Rutas
app.post('/user', newUserController);
app.get('/user/:id', getUserController);
app.post('/login', loginController);
app.get('/user/:id/posts', getUserPostsController);
app.get('/user', authUser, getMeController);


app.post('/', authUser, newPostController);
app.get('/', getPostsController);
app.get('/post/:id', getSinglePostController);
app.delete('/post/:id', authUser, deletePostController);


// Middlewares
app.use((req, res) => {
    res.status(404).send({
        status: 'ERROR',
        message: 'Not found',
    });
});

app.use((error, req, res, next) => {
    console.error(error);

    res.status(error.httpStatus || 500).send({
        status: 'error',
        message: error.message,
    });
});


// Servidor
app.listen(3000, () => {
    console.log('Marchando servidor...');
});