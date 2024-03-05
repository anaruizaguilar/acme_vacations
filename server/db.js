const pg = require('pg');
const client = new pg.Client(precess.env.DATABASE_URL || 'postgress://localhost/acme_vacations_db');
module.exports = { 
    client,
    createTables
 };

const createTables = async() => {
    const SQL = `
    DROP TABLE IF EXISTS vacations;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS places;
    
    CREATE TABLE users(
        id UUID PRIMARY KEY,
        name VARCHAR(100)
    );
    CREATE TABLE places(
        id UUID PRIMARY KEY,
        name VARCHAR(100)
    );
    CREATE TABLE vacations(
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id) NOT NULL,
        place_id UUID REFERENCES places(id) NOT NULL,
        departure_date DATE
    );
    `;
    await client.query(SQL);
};

