const db = require('../config/db');

// Récupérer tous les utilisateurs
async function getAllUsers() {
    const result = await db.query('SELECT * FROM users');
    const users = result[0];

    return users;
}

// Ajouter un utilisateur
async function createUser(user) {
    const name = user.name;
    const email = user.email;
    const [result] = await db.query(
        'INSERT INTO users (name, email) VALUES (?, ?)',
        [name, email]
    );

    return {
        id: result.insertId,
        name,
        email
    };
}

// Récupérer un utilisateur par id
async function getUserById(id) {
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return users[0] || null;
}

// Mettre à jour un utilisateur
async function updateUser(id, user) {
    const { name, email } = user;
    const [result] = await db.query(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        [name, email, id]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    return { id: Number(id), name, email };
}

// Supprimer un utilisateur
async function deleteUser(id) {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
}

module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
};