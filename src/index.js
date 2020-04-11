// imports
import './assets/styles/main.scss';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import CovidApi from './modules/CovidApi';
import Helper from './modules/Helper.js';
import Cache from './modules/Cache';
import { CountUp } from 'countup.js';


// instantiate
const api          = new CovidApi();
const helper       = new Helper();
const cache        = new Cache(); // instantiate cache
cache.init() // enable cache

     
// get total cases
const app = {
    totalCase: function() {
        
        // get data from the cache if enabled and id the cached item exist
        if(cache.enabled && cache._isItemExist('total-cases')) {

            // generate data from the cache
            const covidCache     = cache.storage.getItem('covid');
            const totalCaseArray = JSON.parse(covidCache).filter(item => item.name == 'total-cases');
           
           populateData('.covid-total', totalCaseArray[0].value);
           console.log('total cases generated from the cache');
            
        } else {

            // get resources from the server
            api.get(`${api.baseUrl}/${api.endPoints.cases}`, response => {
                let array     = response.data;

                populateData('.covid-total', array);

                //add total cases to the cache
                cache.add('total-cases', array)
                console.log('total cases generated from the server');

            });
        }

        function populateData (selector, array) {
            const elements = document.querySelectorAll(selector);
            
            elements.forEach(element => {
                let status = element.dataset.totalCase.toLowerCase();
                
                if(status == 'total') {
                    element.textContent = helper.formatNumber(array.length);
                } else {
                    element.textContent = helper.formatNumber(api.getTotalStatus(status, array));
                }
            });
        }
        
        
    },
    init: function() {
        this.totalCase();
    }
};

// window events
window.addEventListener('load', function() {

    // initialize app
    app.init();

});

