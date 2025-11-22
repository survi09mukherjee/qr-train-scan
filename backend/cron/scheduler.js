const cron = require('node-cron');
const { ingestData } = require('../services/ingestionService');

const startCronJobs = () => {
    // Run every day at midnight (00:00)
    cron.schedule('0 0 * * *', async () => {
        console.log('Running daily train data refresh...');
        try {
            await ingestData();
            console.log('Daily data refresh completed.');
        } catch (error) {
            console.error('Daily data refresh failed:', error);
        }
    });

    console.log('Cron jobs scheduled.');
};

module.exports = startCronJobs;
