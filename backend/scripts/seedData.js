require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const { ingestData } = require('../services/ingestionService');

const seed = async () => {
    try {
        await connectDB();
        await ingestData();
        console.log('Seeding completed.');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
