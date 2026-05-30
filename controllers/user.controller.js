const userService = require('../services/user.service');

// GET /users
async function getUsers(req, res) {
    const users = await userService.getAllUsers();
    res.json(users);
}

// POST /users
async function createUser(req, res) {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
}

// GET /users/:id
async function getUserById(req, res) {
    const user = await userService.getUserById(req.params.id);

    if (!user) {
        return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    res.json(user);
}

// PUT /users/:id
async function updateUser(req, res) {
    const updatedUser = await userService.updateUser(req.params.id, req.body);

    if (!updatedUser) {
        return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    res.json(updatedUser);
}

// DELETE /users/:id
async function deleteUser(req, res) {
    const deleted = await userService.deleteUser(req.params.id);

    if (!deleted) {
        return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    res.status(204).send();
}

module.exports = {
    getUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
};