const { generateError } = require('../helpers');
const { createUser, getUserById, getUserByEmail } = require('../db/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getPostsByUserId } = require('../db/posts');

const newUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw generateError(
        'Para registrarte es necesario un email y una contraseña',
        400
      );
    }

    const id = await createUser(email, password);

    res.send({
      status: 'OK',
      message: `Usuario creado con id: ${id}`,
    });
  } catch (error) {
    next(error);
  }
};

const getUserController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await getUserById(id);

    res.send({
      status: 'OK',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const getUserPostsController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await getPostsByUserId(id);

    res.send({
      status: 'ok',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const getMeController = async (req, res, next) => {
  try {
    const user = await getUserById(req.auth, false);

    res.send({
      status: 'ok',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw generateError('Debes enviar un email y una contraseña', 400);
    }

    // Recogemos datos de la base de datos del usuario con ese email
    const user = await getUserByEmail(email);

    // Comprobamos que la contraseña sea correcta
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw generateError('La contraseña no es correcta', 401);
    }

    // Creamos el payload del token
    const payload = { id: user.id };

    // Firma del token
    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: '30d',
    });

    // Enviamos el token
    res.send({
      status: 'OK',
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  newUserController,
  getUserController,
  loginController,
  getUserPostsController,
  getMeController,
};
