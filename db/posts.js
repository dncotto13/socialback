const { getConnection } = require('./db');
const { generateError } = require('../helpers');

const deletePostById = async (id) => {
  let connection;

  try {
    connection = await getConnection();

    await connection.query(
      `
            DELETE FROM posts WHERE id = ?
        `,
      [id]
    );

    return;
  } finally {
    if (connection) connection.release();
  }
};

const getPostById = async (id) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
            SELECT * FROM posts WHERE id = ?
        `,
      [id]
    );

    if (result.length === 0) {
      throw generateError(`El post con id: ${id} no existe`, 404);
    }

    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

const getAllPosts = async () => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(`
        SELECT posts.*, users.email FROM posts LEFT JOIN users on posts.user_id = users.id ORDER BY created_at DESC
        `);

    return result;
  } finally {
    if (connection) connection.release();
  }
};

const createPost = async (userId, text, image = '') => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
            INSERT INTO posts (user_id, text, image) 
            VALUES(?,?,?)
        `,
      [userId, text, image]
    );

    return result.insertId;
  } finally {
    if (connection) connection.release();
  }
};

const getPostsByUserId = async (id) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
            SELECT posts.*, users.email FROM posts LEFT JOIN users on posts.user_id = users.id WHERE posts.user_id = ?
    `,
      [id]
    );

    return result;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  deletePostById,
  getPostsByUserId,
};
