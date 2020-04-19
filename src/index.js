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
                        <td>${(item.gender == null || item.gender == undefined || item.gender == '') ? 'TBA' : item.gender}</td> 
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
        
        // fatality rate by age canvas
        const ageChartCtx = document.querySelector('.fatality-chart[data-fatality-type="age"]').getContext('2d');

         // fatality rate by gender canvas
         const genderChartCtx = document.querySelector('.fatality-chart[data-fatality-type="gender"]').getContext('2d');
        

        //get data from the server
        api.get(`${api.baseUrl}/${api.endPoints.cases}`, response => {
            let data = response.data;

            // age chart config
            const ageChartConfig = {
                type: 'bar',
                data: {
                    labels: ['1-10','11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80', '81-90','91-100', 'TBA'],
                    datasets: [
                        {
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            data:  generateChartDataByAge(['1-10','11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80', '81-90', '91-100', 'TBA'], data)
                        }
                    ]
                }
            }

            // gender chart config
            const genderChartConfig = {
                type: 'pie',
                data: {
                    labels: ['Male', 'Female', 'TBA'],
                    datasets: [
                        {
                            backgroundColor: [
                                'rgba(52, 152, 219, 0.5)',
                                'rgba(231, 76, 60, 0.5)',
                                'rgba(0, 0, 0, 0.5)'
                            ],
                            data: generateChartDataByGender(['Male', 'Female', 'TBA'], data)
                        },
                    ]
                },
                options: {
                    legend: {
                        display: true
                    }
                }
            }

            // instantiate charts
            const ageChart    = new Chart(ageChartCtx , ageChartConfig); // fatality rate by age chart
            const genderChart    = new Chart(genderChartCtx, genderChartConfig); // fatality rate by gender
           
    
        });

         
        // generate data for the chart of fatality rate by age
        function generateChartDataByAge(chartLabels, data) {
            let labelArray       = chartLabels;
            let sortedLabelArray =  labelArray.map(label => {
                const regExp     = new RegExp(/^(\d+)-(\d+)$/); // age format
                const isValidAgeFormat   = regExp.test(label); // check if the label is a valid age format
                
                return isValidAgeFormat ? label.split('-') : label; // if valid age format , age format is converted into array
            });
            
            var generatedData = sortedLabelArray.map(label => {

                if(label instanceof Array) { // this only applied for valid age format, for example [20, 20]
                    const [startAge, endAge] = label;
                    
                    let labelData = data.reduce((currentValue, item) => {
                        return (item.age >= startAge && item.age <= endAge) ? currentValue += 1 : currentValue;
                    }, 0);

                    return labelData;

                } else { // this means the label is 'TBA' or unconfirmed
                    
                    let labelData = data.reduce((currentValue, item) =>{
                        return item.age == 0 || typeof item.age == 'string' ? currentValue += 1 : currentValue;
                    }, 0);

                    return labelData;
                }
                

            });


            return generatedData;
        }

        //generate data for fatality rate by gender chart
        function generateChartDataByGender(labelArray, data) {
            const generatedData = labelArray.map(label => {

                if(label.toLowerCase() == 'tba') {
                    return data.reduce((prevValue, value) => {
                        return (value.gender.toLowerCase() == 'tba' || value.gender.toLowerCase() == '') ? prevValue += 1 : prevValue;
                    }, 0);
                }
                
                label = label == 'Female' ? 'F' : 'M';

                return data.reduce((prevValue, value) => {
                    return label.toLowerCase() == value.gender.toLowerCase() ? prevValue += 1 : prevValue;
                }, 0);
                
            });
    
            return generatedData;
        }


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

