require('dotenv').config();
const newman = require('newman'); // require Newman in your project

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
const INTERVAL_MIN = Number(process.env.INTERVAL_MIN);

const msExecution = 1000 * 60         //minute
                  * INTERVAL_MIN   //minutes
let execOK = 0;
let execError = 0;

console.log('\n\n♻ Started\n\n');
logNext(msExecution);

setInterval(() => {
    newman.run({
        collection: require('./StopStartRest.postman_collection.json'),
        reporters: 'cli',
        globalVar: [
            { key: 'API_KEY', value: API_KEY },
            { key: 'API_SECRET', value: API_SECRET }
        ]
    }, function (err) {
        if (err) 
        { 
            execError++;
            console.log(`❌ ${new Date().toISOString()} [${execError}/${execError + execOK}]\n\n`);
            console.error(err); 
        }
        else
        {
            execOK++;
            console.log(`✅ ${new Date().toISOString()} [${execOK}/${execError + execOK}]\n\n`);
        }
        logNext(msExecution);
    });
  }, msExecution);
// call newman.run to pass the `options` object and wait for callback

function logNext(msExecution)
{
    console.log(`⏭ next in ${msToTime(msExecution)}' (${addMillisecondsToDate(new Date(), msExecution).toISOString()})`);
}

function msToTime(duration) {
    var minutes = Math.floor((duration / (1000 * 60)) % 60),
        seconds = Math.floor((duration / 1000) % 60);

    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return minutes + ":" + seconds;
}

function addMillisecondsToDate(date, milliseconds) {
    var timestamp = date.getTime();
    return new Date(timestamp + milliseconds);
}