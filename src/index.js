// imports
import './assets/styles/main.scss';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import CovidApi from './modules/CovidApi';
import Helper from './modules/Helper.js'
import { CountUp } from 'countup.js';


// instantiate
const api = new CovidApi();
const helper = new Helper();

// get total cases
const app = {
    totalCase: function() {
        // get resources
        api.get(`${api.baseUrl}/${api.endPoints.cases}`, response => {
            const array     = response.data;
            const admitted  = api.getTotalStatus('admitted', array);
            const recovered = api.getTotalStatus('recovered', array);
            const died      = api.getTotalStatus('died', array);
            const total     = array.length;
        
            // append data to the DOM
            const targetElement = document.querySelectorAll('.covid-total');

            targetElement.forEach(item => {
                const status = item.dataset.totalCase.toLowerCase();
                
                switch(status) {

                    case 'admitted':
                        item.textContent = helper.formatNumber(admitted);
                        break;
                    case 'recover':
                        item.textContent = helper.formatNumber(recovered);
                        break;
                    case 'die':
                        item.textContent = helper.formatNumber(died);
                        break;
                    default:
                        item.textContent = helper.formatNumber(total);
                }

            });

            
        });
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

