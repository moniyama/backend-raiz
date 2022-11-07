const fetch = require('node-fetch');

const URL = (() => {
    const urls = {
        development: 'http://localhost:3000',
        production: 'https://lab-api-bq.onrender.com'
    };

    const env = process.env.NODE_ENV || 'production';
    return urls[env];
})();

const toMinutes = (time) => time * 1000 * 60; 
const interval = toMinutes(5);

const ping = async() => {
    try {
        await fetch(`${URL}/healthcheck/ping`);
    } catch (err) {
        console.log('Could not ping', err)
    }
};

setInterval(ping, interval);