module.exports = {
    apps: [{
        name: 'scholarship_machine',
        script: 'node --env-file=".env" dist/src/main.js',
        env: {
            "NODE_ENV": "production",
            "CRON_TIME": "*/10 * * * *",
        }
    },],
};
