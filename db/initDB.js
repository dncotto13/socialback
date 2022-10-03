require('dotenv').config();

const {getConnection} = require('./db');

async function main() {
    let connection;

    try {
        connection = await getConnection();

        console.log('Eliminando tablas existentes');
        await connection.query('SET FOREIGN_KEY_CHECKS = 0')
        await connection.query('DROP TABLE IF EXISTS users');
        await connection.query('DROP TABLE IF EXISTS posts');
        await connection.query('DROP TABLE IF EXISTS likes');
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('Creando tablas')

        await connection.query(`
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTO_INCREMENT,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await connection.query(`
            CREATE TABLE posts (
                id INTEGER PRIMARY KEY AUTO_INCREMENT,
                user_id INTEGER,
                image VARCHAR(200) NOT NULL,
                text VARCHAR(2200),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
                );
            `);

            await connection.query(`
            CREATE TABLE likes (
                id INTEGER UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
                user_id INTEGER,
                post_id INTEGER,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (post_id) REFERENCES posts(id)
                )
            `);


    } catch(error) {
        console.error(error);

    } finally {
        if(connection) connection.release();
        process.exit();
    }
}

main().catch((error) => console.error(error));