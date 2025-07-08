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
                    console.log('User Inserted:', result.insertId); // Debugging
                    resolve(result);
                }
            });
        });
    },

    findById: (id) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT id, email, firstname, lastname FROM users WHERE id = ?';
        connection.query(query, [id], (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
}

};

module.exports = User;
