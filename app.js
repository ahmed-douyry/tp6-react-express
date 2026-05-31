const express = require('express');
const app = express();

const userRoutes = require('./routes/user.routes');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});

app.use(express.json());

// Routes
app.use('/api', userRoutes); //enregistrer un groupe de routes dans l’application Express avec un préfixe commun

app.listen(4000, () => {
    console.log('Serveur démarré sur http://localhost:4000');
});

