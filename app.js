const express = require('express');
const app = express();

const userRoutes = require('./routes/user.routes');

app.use(express.json());

// Routes
app.use('/api', userRoutes); //enregistrer un groupe de routes dans l’application Express avec un préfixe commun

app.listen(4000, () => {
    console.log('Serveur démarré sur http://localhost:4000');
});

