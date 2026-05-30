const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',   // vide par défaut avec XAMPP
    database: 'projetexpress'
});

module.exports = db;