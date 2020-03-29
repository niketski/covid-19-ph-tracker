export default class CovidApi {

    constructor() {
        this.baseUrl = 'https://coronavirus-ph-api.now.sh';
    }

    async getCasesLocal(condition = true) {
        let endpoint = condition == false ? 'cases-outside-ph' : 'cases';
        const response = await fetch(`${this.baseUrl}/${endpoint}`);
        const data     = await response.json();

      
        if(!response.ok) {
            return Promise.reject('Invalid Url');
        }

        return data;
    }

    async checkpoints() {
        const response = await fetch(`${this.baseUrl}/mm-checkpoints`);
        const data     = await response.json();

      
        if(!response.ok) {
            return Promise.reject('Invalid Url');
        }

        return data;
    }

}