const connection = require('../config/db');

const User = {
    findByEmail: (email) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE LOWER(email) = LOWER(?)';
            connection.query(query, [email], (err, results) => {
                if (err) {
                    console.error('❌ Database Error (findByEmail):', err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    },

    create: (email, hashedPassword, firstName, lastName) => {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO users (email, password, firstname, lastname) VALUES (?, ?, ?, ?)';
            connection.query(query, [email, hashedPassword, firstName, lastName], (err, result) => {
                if (err) {
                    console.error('❌ Database Error (create):', err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
};

module.exports = User;
