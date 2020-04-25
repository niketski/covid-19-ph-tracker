// imports
import './assets/styles/main.scss';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import CovidApi from './modules/CovidApi';
import Helper from './modules/Helper.js';
import Cache from './modules/Cache';
import { CountUp } from 'countup.js';
import Chart, { helpers } from 'chart.js'
import MapApi from './modules/Map';


// instantiate
const api          = new CovidApi();
const helper       = new Helper();
const cache        = new Cache(); // instantiate cache
const map          = new MapApi();
// cache.init() // enable cache

     
// get total cases
const app = {
    totalCase: function() {
        
        // get resources from the server
        api.get(`${api.baseUrl}/${api.endPoints.total}`, response => {
            let data       = response.data.data;
            const totalItems = document.querySelectorAll('.covid-total'); 
           
            console.log(response);

            //populate data 
            totalItems.forEach(item => {
                const type = item.dataset.total;
                
                item.textContent = helper.formatNumber(data[type]);

            });

           // update data last update date
           document.querySelector('.cases-update-date').innerHTML = data.last_update;


        });

    },
    dailyCases: function() {

        // get resources from the server
        api.get(`${api.baseUrl}/${api.endPoints.total}`, response => {
            let data       = response.data.data;
            const dailyCasesItems = document.querySelectorAll('.daily-cases-item'); 
           
            // populate data for each item
            dailyCasesItems.forEach(item => {
                const itemType         = item.dataset.dailyCases;
                const contentContainer = item.querySelector('.card-text');
                console.log(contentContainer);
                // remove current content
                contentContainer.innerHTML = `<span class="cases-count">${helper.formatNumber(data[itemType])}</span>`;

                // insert data
                // contentContainer.innerHTML = `${data[itemType]}`;
            });    

        });

    },
    totalCasesTable: function() {

        // table of cases in the philippines
        let listContainer1 =  document.querySelector('.table-group[data-table-id="cases-inside"] .total-cases-list'); // table rows container
        let html1 = '';

        //get data from the server
        api.get(`${api.baseUrl}/${api.endPoints.cases}`, response => {
            let data = response.data.data;
            for (let item of data) {
                let badgeClass = 'badge-warning';
                let status = item.status.toLowerCase();

                if(status == 'recovered') {
                    badgeClass = 'badge-success';
                }

                if (status == 'expired') {
                    badgeClass = 'badge-danger';
                }

                html1 += `
                    <tr>
                        <th scope="row">${item.case_no}</th>
                        <td>${item.date_of_announcement_to_public}</td>
                        <td>${item.nationality}</td>
                        <td>${item.age}</td>
                        <td>${(item.sex == null || item.sex == undefined || item.sex == '') ? 'TBA' : item.sex}</td> 
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
        Chart.defaults.global.tooltips.callbacks.label = function (item, object) {
            return `${item.value}%`;
        }
        
        // fatality rate by age canvas
        const ageChartCtx = document.querySelector('.fatality-chart[data-fatality-type="age"]').getContext('2d');

         // fatality rate by gender canvas
         const genderChartCtx = document.querySelector('.fatality-chart[data-fatality-type="gender"]').getContext('2d');
        

        //get data from the server
        api.get(`${api.baseUrl}/${api.endPoints.cases}`, response => {
            let data = response.data.data;
            
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
                   
                   return percentage(labelData, data.length).toFixed(2);

                } else { // this means the label is 'TBA' or unconfirmed
                    
                    let labelData = data.reduce((currentValue, item) =>{
                        return item.age == 0 || typeof item.age == 'string' ? currentValue += 1 : currentValue;
                    }, 0);
                    
                    return percentage(labelData, data.length).toFixed(2);
                }
                

            });


            return generatedData;
        }

        //generate data for fatality rate by gender chart
        function generateChartDataByGender(labelArray, data) {
            const generatedData = labelArray.map(label => {

                if(label.toLowerCase() == 'tba') {
                    let total = data.reduce((prevValue, value) => {
                        return (value.sex.toLowerCase() == 'tba' || value.sex.toLowerCase() == '') ? prevValue += 1 : prevValue;
                    }, 0);

                    return percentage(total, data.length).toFixed(2);
                }
                
                label = label == 'Female' ? 'F' : 'M';

                let total = data.reduce((prevValue, value) => {
                    return label.toLowerCase() == value.sex.toLowerCase() ? prevValue += 1 : prevValue;
                }, 0);

                return percentage(total, data.length).toFixed(2);
                
            });
            
            return generatedData;
        }

        // calculate percentage
        function percentage(a, b) {
            return (a / b) * 100;
        }
    },
    mMCommunityQuarantineCheckpoints: function() {

        const map1 = map.addMap('mm-checkpoint-map', {
            center: [51.505, -0.09],
            zoom: 13
        });

        map1.setView([map.currentPos().latitude, map.currentPos().longitude], 12);
        map1.setView([14.769163, 121.080297], 11);
        api.get(`${api.baseUrl}/${api.endPoints.checkPoints}`, response => {
            const data = response.data.data;
           
            for (let item in data) {

                L.marker([data[item].lat, data[item].lng], {
                }).addTo(map1);
            }
        
        })
        
    },
    init: function() {
        this.dailyCases();
        this.totalCase(); 
        this.totalCasesTable();
        this.fatalityRate();
        this.mMCommunityQuarantineCheckpoints();
    }
};

// window events
window.addEventListener('load', function() {

    // initialize app
    app.init();

});

