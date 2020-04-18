// imports
import './assets/styles/main.scss';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import CovidApi from './modules/CovidApi';
import Helper from './modules/Helper.js';
import Cache from './modules/Cache';
import { CountUp } from 'countup.js';
import Chart from 'chart.js'


// instantiate
const api          = new CovidApi();
const helper       = new Helper();
const cache        = new Cache(); // instantiate cache
// cache.init() // enable cache

     
// get total cases
const app = {
    totalCase: function() {
        
        // get resources from the server
        api.get(`${api.baseUrl}/${api.endPoints.cases}`, response => {
            let array     = response.data;
            
            populateData('.covid-total', array);

            //add total cases to the cache
            console.log('total cases generated from the server');

        });

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
    totalCasesTable: function() {

        // table of cases in the philippines
        let listContainer1 =  document.querySelector('.table-group[data-table-id="cases-inside"] .total-cases-list'); // table rows container
        let html1 = '';

        //get data from the server
        api.get(`${api.baseUrl}/${api.endPoints.cases}`, response => {
            let data = response.data;
            
            for (let item of data) {
                let badgeClass = 'badge-warning';
                let status = item.status.toLowerCase();

                if(status == 'recovered') {
                    badgeClass = 'badge-success';
                }

                if (status == 'died') {
                    badgeClass = 'badge-danger';
                }

                html1 += `
                    <tr>
                        <th scope="row">${item.case_no}</th>
                        <td>${item.date}</td>
                        <td>${item.nationality}</td>
                        <td>${item.age}</td>
                        <td>${item.gender}</td>
                        <td>${item.hospital_admitted_to}</td>
                        <td><span class="badge text-light ${badgeClass}">${item.status}</span></td>
                    </tr>
                `;
            }

            // append listst to the table
            listContainer1.insertAdjacentHTML('beforeend', html1);

            // remove loader
            document.querySelector('.table-group[data-table-id="cases-inside"] .table-loader').remove();
           
            // enable table sorting
            helper.sortableTable('[data-table-id="cases-inside"] table');
        });

    },
    fatalityRate: function(){
        let value = null;
        // chart default settings
        Chart.defaults.global.legend.display = false; // hide legends
        Chart.defaults.global.animation.onProgress = function(animation) {
            value = animation.animationObject.currentStep / animation.animationObject.numSteps;
            console.log(Math.round(value));
        }
       
        const ageChartCtx = document.querySelector('.fatality-chart[data-fatality-type="age"]').getContext('2d');
        const ageChart    = new Chart(ageChartCtx , {
            type: 'bar',
            data: {
                labels: ['0-10','11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80', '81-90'],
                datasets: [
                    {
                        label: '',
                        backgroundColor: 'rgba(52, 73, 94, 0.5)',
                        borderColor: 'rgba(52, 73, 94, 1)',
                        data: [10, 150, 200, 400, 400, 400, 400, 400, 400]
                    }
                ]
            },
            options: {
            }
        });

    },
    init: function() {
        this.totalCase(); 
        this.totalCasesTable();
        this.fatalityRate();
    }
};

// window events
window.addEventListener('load', function() {

    // initialize app
    app.init();

});

