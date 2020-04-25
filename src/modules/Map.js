import { OpenStreetMapProvider, GoogleProvider } from 'leaflet-geosearch';
// setup
const provider = new OpenStreetMapProvider();

// const provider = new GoogleProvider({ 
//     params: {
//       key: 'AIzaSyBSRtn8hIoJ2tRtz-bsKsITc3RRLqeV8nA',
//     },
//   });

export default class MapApi {

    constructor() {
        this.accessToken = 'pk.eyJ1Ijoibmljb2xlbGltIiwiYSI6ImNrOGI5ejdnZzA0MmEzbHA5YnhtdXR5dHEifQ.1qjX45Apfhs8THkzSfN7gQ';
    }

    currentPos() {
        // default position (manila)
        let position = {
            latitude: 14.6091,
            longitude: 121.0223
        };
        

        // check if geolocation is available
        if(navigator.geolocation) {

            // update position
            navigator.geolocation.getCurrentPosition(function(pos){
                position = {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                }
            });

        } 

        return position;
    }

    addMap(id, config) {
        const map = L.map(id, config); // create map

        // default tile layer for the maps
        L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
            maxZoom: 20,
            attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        }).addTo(map);

        return map;
    }

    init() {
        const {latitude, longitude } = this.currentPos();   
    }

}
