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
           
            //helper.sortableTable('asdasd');
        });

        // table of cases of filipino nationals outside the philippines
        let listContainer2 = document.querySelector('.table-group[data-table-id="cases-outside"] .total-cases-list'); // table rows container
        let html2 = '';

         //get data from the server
         api.get(`${api.baseUrl}/${api.endPoints.casesOutside}`, response => {
            let data = response.data;
            
            for (let item of data) {
                html2 += `
                    <tr>
                        <th  scope="row">${item.country_territory_place}</th>
                        <td>${item.confirmed}</td>
                        <td>${item.recovered}</td>
                        <td>${item.died}</td>
                    </tr>
                `;
            }

            // append listst to the table
            listContainer2.insertAdjacentHTML('beforeend', html2);
            // remove loader
            document.querySelector('.table-group[data-table-id="cases-outside"] .table-loader').remove();

            helper.sortableTable('[data-table-id="cases-outside"] table');

        });

       

    },
    init: function() {
        this.totalCase(); 
        this.totalCasesTable();
    }
};

// window events
window.addEventListener('load', function() {

    // initialize app
    app.init();

});

