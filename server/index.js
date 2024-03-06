const express = require('express');
const app = express();
app.use(express.json());

const { client, 
    createTables,
    createUser,
    createPlace, 
    fetchUsers,
    fetchPlaces,
    createVacation,
    fetchVacations,
    destroyVacation} = require('./db');

app.get('/api/users', async(req, res, next) => {
    try {
        res.send(await fetchUsers());
    } catch(ex) {
        next(ex);
    }
});

app.get('/api/places', async(req, res, next) => {
    try {
        res.send(await fetchPlaces());
    } catch(ex) {
        next(ex);
    }
});

app.get('/api/vacations', async(req, res, next) => {
    try{
        res.send(await fetchVacations());
    } catch(ex) {
        next(ex);
    }
});

app.delete('/api/vacations/:id', async(req, res, next) => {
    try {
        await destroyVacation(req.params.id);
        res.sendStatus(204);
    } catch(ex) {
        next(ex);
    }
});

app.post('/api/vacations', async(req, res, next) => {
    try {
        const { user_id, place_id, departure_date } = req.body;
        res.send(await createVacation(user_id, place_id, departure_date));
    } catch(ex) {
        next(ex);
    }
});

const init = async() => {
    await client.connect();
    console.log('connected to database');
    await createTables();
    console.log('tables created');
    const [moe, lucy, ethyl, tim, barbara, tokyo, sydney, rome, nyc, la, paris] = await Promise.all([
        createUser('moe'),
        createUser('lucy'),
        createUser('ethyl'),
        createUser('tim'),
        createUser('barbara'),
        createPlace('tokyo'),
        createPlace('sydney'),
        createPlace('rome'),
        createPlace('nyc'),
        createPlace('la'),
        createPlace('paris')
    ]);
    // console.log(`moe has an id of ${moe.id}`);
    // console.log(`rome has an id of ${rome.id}`);
    console.log(await fetchUsers());
    console.log(await fetchPlaces());
    const [vacay1, vacay2, vacay3] = await Promise.all([
        createVacation( moe.id, paris.id, '04/15/2024'),
        createVacation( moe.id, nyc.id, '04/02/2024'),
        createVacation( lucy.id, la.id, '07/07/2024'),
        createVacation( lucy.id, rome.id, '10/31/2024'),
    ]);
    const vacations = await fetchVacations();
    console.log(vacations);
    await destroyVacation(vacay1.id);
    console.log(await fetchVacations());
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`listening on port ${PORT}`));
};

init();