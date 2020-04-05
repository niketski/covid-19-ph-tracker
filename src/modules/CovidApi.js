const axios = require('axios'); // third party library for ajax requests

export default class CovidApi {

    constructor() {
        this.baseUrl = 'https://coronavirus-ph-api.herokuapp.com';
        this.endPoints = {
            cases: 'cases',
            casesOutside: 'cases-outside-ph',
            testResults: 'test-results',
            checkPoints: 'mm-checkpoints',
            lockdowns: 'lockdowns'
        };
    }

    // private keyword is not supported, I used a prefix '_' to consider as private function
    async _request(url, callback) {
        try {
            const response = await axios.get(url);
            callback(response);
        } catch(error) {
            console.error('Invalid url');
            callback(error);
        }
    }

    getCases(callback) {
        this._request(`${this.baseUrl}/${this.endPoints.cases}`, callback);
    }

    getCasesOutside(callback) {
       this._request(`${this.baseUrl}/${this.endPoints.casesOutside}`, callback);
    }

    getTestResults(callback) {
        this._request(`${this.baseUrl}/${this.endPoints.testResults}`, callback);
    }

    getCheckpoints(callback) {
        this._request(`${this.baseUrl}/${this.endPoints.checkPoints}`, callback);
    }

    getLockDowns(callback) {
        this._request(`${this.baseUrl}/${this.endPoints.checkPoints}`, callback);
    }
}