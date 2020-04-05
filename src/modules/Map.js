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
        // default position
        let position = {
            latitude: 14.50488318162341,
            longitude: 120.993874669075
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

    init() {
        const {latitude, longitude } = this.currentPos();
        const form = document.querySelector('.map-form');
        const input = document.querySelector('.covid-input');
        // search
        const results = provider.search({ query: input.value });

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
          
            const results = await provider.search({ query: input.value });
            console.log(results); // » [{}, {}, {}, ...]
          });

        // initialize map
        const map = L.map('covid-map', {
            center: [latitude, longitude],
            zoom: 10,
            preferCanvas: true
        });
        map.setView([this.currentPos().latitude, this.currentPos().longitude], 10);

        // add tile layer 
        L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
            subdomains: 'abcd',
            minZoom: 0,
            maxZoom: 20,
        }).addTo(map);

        // add circle overlay
        L.circle([latitude, longitude], {
            radius: 1000,
            stroke: true,
            color: '#000',
            weight: 3,
            fillColor: '#000',
            fillOpacity: 0.6,
            opacity: 0.8
        }).addTo(map);

        // create a red polygon from an array of LatLng points
        var latlngs = [
            [ // first polygon
              [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]], // outer ring
              [[37.29, -108.58],[40.71, -108.58],[40.71, -102.50],[37.29, -102.50]] // hole
            ],
            [ // second polygon
              [[41, -111.03],[45, -111.04],[45, -104.05],[41, -104.05]]
            ]
          ];
        var polygon = L.polygon(latlngs, {color: 'red'}).addTo(map).bindPopup('<h1>hello world</h1>');

        // zoom the map to the polygon
        map.fitBounds(polygon.getBounds());

        // map events
        map.on('click', function() {
            // map.setView([latitude, longitude], 10);
            
        });

        // map.setView([getPosition().latitude, getPosition().longitude], 0);

      
    }

}
