import './assets/styles/main.scss';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import mapApi from './modules/Map';
import CovidApi from './modules/CovidApi';


const covidApi = new CovidApi();




covidApi.getCasesLocal()
.then( data => {
    console.log(data);
})
.catch(err => {
    console.log(err);
});

covidApi.checkpoints()
.then( data => {
    console.log(data);
})
.catch(err => {
    console.log(err);
});