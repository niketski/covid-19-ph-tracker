const axios = require('axios'); // third party library for ajax requests

export default class CovidApi {

    constructor() {
        this.baseUrl = 'https://coronavirus-ph-api.herokuapp.com';
        this.endPoints = {
            cases: 'cases',
            casesOutside: 'cases-outside-ph',
            testResults: 'test-results',
            checkPoints: 'mm-checkpoints',
            lockdowns: 'lockdowns',
            total: 'total',
        };
    }

    async get(url, callback) {
        try {
            const response = await axios.get(url);
            callback(response);
            
        } catch(error) {
        
            callback(error);
        }
    }

    getTotalStatus(status, array) {
        return array.reduce((accumulator, item) => {
            return accumulator += (item.status.toLowerCase() == status.toLowerCase() ? 1 : 0);
        }, 0);
    }
}