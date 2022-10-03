const {
  createPost,
  getAllPosts,
  getPostById,
  deletePostById,
} = require('../db/posts');
const { generateError, createPathIfNotExists } = require('../helpers');
const path = require('path');
const sharp = require('sharp');
const { nanoid } = require('nanoid');

const getPostsController = async (req, res, next) => {
  try {
    const posts = await getAllPosts();
    res.send({
      status: 'OK',
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

const newPostController = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || text.length > 2200) {
      throw generateError(
        'El texto del post debe existir y ser menor de 2200 caracteres',
        400
      );
    }

    let imageFileName;

    if (req.files && req.files.image) {
      // Creación del path del directorio uploads
      const uploadsDir = path.join(__dirname, '../uploads');
      console.log(uploadsDir);
      // Creamos el directorio si no existe
      await createPathIfNotExists(uploadsDir);
      //Proceso de la imagen
      const image = sharp(req.files.image.data);
      image.resize(1000);
      // Guardado de la imagen con un nombre aleatorio en el directorio uploads
      imageFileName = `${nanoid(20)}.jpg`;

      await image.toFile(path.join(uploadsDir, imageFileName));
    }

    const id = await createPost(req.auth, text, imageFileName);

    const post = await getPostById(id);

    res.send({
      status: 'OK',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

const getSinglePostController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await getPostById(id);

    res.send({
      status: 'OK',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

const deletePostController = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Información de la publicación que vamos a borrar
    const post = await getPostById(id);
    // Saber si el usuario del token es el mismo que hizo la publicación
    if (req.auth !== post.user_id) {
      throw generateError(
        'No tienes autorización para eliminar esta publicación',
        401
      );
    }
    // Eliminar publicación
    await deletePostById(id);
    res.send({
      status: 'OK',
      message: `La publicación con id: ${id} se eliminó correctamente`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPostsController,
  newPostController,
  getSinglePostController,
  deletePostController,
};
