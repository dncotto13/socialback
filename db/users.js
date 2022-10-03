const {getConnection} = require('./db');
const {generateError} = require('../helpers');
const bcrypt = require('bcrypt');

const getUserByEmail = async (email) => {
    let connection;

    try {
        connection = await getConnection();

        const [result] = await connection.query(
            `
            SELECT * FROM users WHERE email=?
            `,
            [email]
        );

        if (result.length === 0) {
            throw generateError('No existe usuario con este email', 404);
        }

        return result[0];
    } finally {
        if(connection) connection.release();
    }
}




const getUserById = async (id) => {
    let connection;

    try {
        connection = await getConnection();

        const [result] = await connection.query(
            `
            SELECT id, email, created_at FROM users WHERE id=?
            `,
            [id]
        );

        if (result.length === 0) {
            throw generateError('No existe usuario con este id', 404);
        }

        return result[0];
    } finally {
        if(connection) connection.release();
    }
}

const createUser = async (email, password) => {
    let connection;

    try {
        connection = await getConnection();

        const [user] = await connection.query(
            `
            SELECT id FROM users WHERE email = ?
            `,
            [email]
        );

        if (user.length > 0) {
            throw generateError(
                'Este email ya existe',
                409
            );
        }

        const passwordHash = await bcrypt.hash(password, 8);

        const [newUser] = await connection.query(
            `
            INSERT INTO users (email, password) VALUES(?, ?)
            `,
            [email, passwordHash]
        );

        return newUser.insertId;
    } finally {
    if (connection) connection.release();
    }
}


module.exports = {
    createUser,
    getUserById,
    getUserByEmail
};