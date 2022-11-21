const fetch = require('node-fetch');

const { toMinutes } = require('./utils');

const URL = (() => {
    const urls = {
        development: 'http://localhost:3000',
        production: 'https://lab-api-bq.onrender.com'
    };

    const env = process.env.NODE_ENV || 'production';
    return urls[env];
})();

const ping = async() => {
    try {
        await fetch(`${URL}/healthcheck/ping`);
    } catch (err) {
        console.log('Could not ping', err)
    }
};

const interval = toMinutes(5);
setInterval(ping, interval);