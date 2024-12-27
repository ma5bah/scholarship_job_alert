module.exports = {
    apps: [{
        name: 'scholarship_machine',
        script: 'pnpm run start;',
        env: {
            "NODE_ENV": "production",
            "CRON_TIME": "*/10 * * * *",
        }
    },],
};
