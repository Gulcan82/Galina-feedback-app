import http from 'k6/http';
import { sleep } from 'k6';


const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export let options = {
    stages: [
        { duration: '30s', target: 100 },  // Ramp-up to 100 users in 30 seconds
        { duration: '1m', target: 250 },   // Ramp-up to 250 users in 1 minute
        { duration: '1m', target: 500 },   // Ramp-up to 500 users in 1 minute
        { duration: '2m', target: 0 }      // Ramp-down to 0 users in 2 minutes
    ]
};

export default function () {
    http.get(`${BASE_URL}/feedback`);  // Use backticks for string interpolation
    sleep(1);
}
