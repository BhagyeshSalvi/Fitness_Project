const connection = require('../config/db');

const User = {
    findByEmail: (email, callback) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        connection.query(query, [email], callback);
    },
    create: (email, hashedPassword, firstName, lastName, callback) => {
        const query = 'INSERT INTO users (email, password, firstname, lastname) VALUES (?, ?, ?, ?)';
        connection.query(query, [email, hashedPassword, firstName, lastName], callback);
    },
};

module.exports = User;
