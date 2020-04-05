// imports
import './assets/styles/main.scss';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import CovidApi from './modules/CovidApi';

// instantiate
const api = new CovidApi();

api.getCasesOutside(response => {
    console.log(response);
});