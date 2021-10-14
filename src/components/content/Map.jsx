import React, { useState, useEffect, useRef } from "react";
// Mapbox
import mapboxgl from 'mapbox-gl';
// Consts
import { nationalParks } from './NationalParks.js'
import { itineraries } from './Itineraries.js'
// CSS
import "../common/shared.css"

const Map = () => {

	mapboxgl.accessToken = 'pk.eyJ1IjoiamNnaWxzb24iLCJhIjoiY2t1cHQ1MHpuNG9vdTJ2bW5xZHF2dHB0biJ9.mSpwuDikQNyZjfXdVm6J0g';
	const mapContainer = useRef(null);
	const map = useRef(null);
	const [lng, setLng] = useState(-96);
	const [lat, setLat] = useState(37.5);
    const [zoom, setZoom] = useState(3.6);
    const [activeItinerary, setActiveItinerary] = useState(0);
    
	useEffect(() => {
        if (map.current) return;

        // Itinerary lines
        let coordinates = [];
        if (itineraries[activeItinerary].nationalParksOnly) {
            for (let destination of itineraries[activeItinerary].destinations) {
                coordinates.push([nationalParks[destination - 1].lat, nationalParks[destination - 1].long])
            }
        }

		map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/satellite-streets-v11', // Update version here
            center: [lng, lat],
            zoom: zoom,
            // Itinerary Layer
            // layers: [{
            //     id: 'route',
            //     type: 'line',
            //     source: {
            //       'type': 'geojson',
            //       'data': {
            //         'type': 'Feature',
            //         'properties': {},
            //         'geometry': {
            //           'type': 'LineString',
            //           'coordinates': coordinates
            //         },
            //       }
            //     },
            //     layout: {
            //       'line-join': 'round',
            //       'line-cap': 'round'
            //     },
            //     paint: {
            //       'line-color': '#888',
            //       'line-width': 8
            //     }
            //   }]
        });

        map.on('style.load', () => {
            map.addSource('route', {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': coordinates
                    }
                }
            });
            map.addLayer({
                'id': 'route',
                'type': 'line',
                'source': 'route',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#888',
                    'line-width': 8
                }
            });
        });


        // National Parks markers
        for (let marker of nationalParks) {
            const markerStyles = document.createElement('div');
            markerStyles.className = `marker${marker.visited ? '' : ' unvisited'}`;
            markerStyles.style.marginTop = '-16px'
            
            const mark = new mapboxgl.Marker(markerStyles)
                .setLngLat([marker.long, marker.lat])
                .setPopup(
                    new mapboxgl.Popup({ offset: 40 })
                    .setHTML(
                        `<h2 class="serifFont greenFont">${marker.name}</h2>
                        <h4 class="grayFont noMarginTop">${marker.states}</h4>
                        <p>${marker.description || ''}</p>`
                    )
                )
                .addTo(map.current);
        }

        // Itineraries
        // for (let marker of itineraries) {
        //     // const markerStyles = document.createElement('div');
        //     // markerStyles.className = `marker${marker.visited ? '' : ' unvisited'}`;
        //     // markerStyles.style.marginTop = '-16px'
            
        //     // const mark = new mapboxgl.Marker(markerStyles)
        //     //     .setLngLat([marker.long, marker.lat])
        //     //     .setPopup(
        //     //         new mapboxgl.Popup({ offset: 40 })
        //     //         .setHTML(
        //     //             `<h2 class="serifFont greenFont">${marker.name}</h2>
        //     //             <h4 class="grayFont noMarginTop">${marker.states}</h4>
        //     //             <p>${marker.description || ''}</p>`
        //     //         )
        //     //     )
        //     //     .addTo(map.current);

        //     mapboxNavigation.requestRoutes(
        //         RouteOptions.builder()
        //             .accessToken(MAPBOX_TOKEN)
        //             .coordinates(listOf(originPoint, destinationPoint))
        //             .build()
        //     )
        // }    
    });
    
    return (
        <div ref={mapContainer} className="mapbox" />
    )
}

export default Map;