import React, { useState, useEffect, useRef } from "react";
// Mapbox
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
// Consts
import { nationalParks } from './consts/NationalParks.js';
import { defaultItineraries } from './consts/DefaultItineraries.js';
// CSS
import "../common/shared.css";

const Map = (props) => {

	mapboxgl.accessToken = 'pk.eyJ1IjoiamNnaWxzb24iLCJhIjoiY2t1cHQ1MHpuNG9vdTJ2bW5xZHF2dHB0biJ9.mSpwuDikQNyZjfXdVm6J0g';
	const mapContainer = useRef(null);
    const map = useRef(null);
    // Uses values from activeItinerary when passed from Itineraries component
	const [lng, setLng] = useState(props.activeItinerary?.mapCenter?.long || -96); 
	const [lat, setLat] = useState(props.activeItinerary?.mapCenter?.lat || 37.5);
    const [zoom, setZoom] = useState(props.activeItinerary?.mapZoom || 3.6);
    // Uses an index of available itineraries
    const [itineraries, setItineraries] = useState(props.itineraries ? props.itineraries : defaultItineraries);
    const [activeItineraryIndex, setActiveItineraryIndex] = useState(0);
    const [itinerary, setItinerary] = useState(props.activeItinerary || itineraries[activeItineraryIndex]);

	useEffect(() => {
        if (map.current) return;
        
        // Itinerary lines
        let coordinates = [];
        // Coordinates string formatted for mapbox directions API (Example: -84.51,39.13;-84.51,39.10)
        let coordinatesString = '';

        console.log("itinerary",itinerary)
        if (itinerary.nationalParksOnly) {
            for (let destination of itinerary.destinations) {
                console.log("itinerary.destinations",itinerary.destinations)
                coordinates.push([nationalParks[destination - 1].long, nationalParks[destination - 1].lat]);
                coordinatesString += `${nationalParks[destination - 1].long},${nationalParks[destination - 1].lat};`;
            }
        } else {
            for (let destination of itinerary.destinations) {
                coordinates.push(destination.long, destination.lat);
                coordinatesString += `${destination.long},${destination.lat};`;
            }
        }

        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinatesString.substring(0, (coordinatesString.length - 1))}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
        let route = []
        axios.get(url)
            .then(response => route = response.data.routes[0].geometry.coordinates)
            .catch(error => console.log(error))

		map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v10', // Update version here (satellite-streets-v11, outdoors-v11) https://docs.mapbox.com/api/maps/styles/#mapbox-styles and https://docs.mapbox.com/api/maps/styles/#mapbox-styles
            center: [lng, lat],
            zoom: zoom,
        });

        // List of markers
        const markers = props.activeItinerary ? itinerary.destinations : nationalParks;

        let currentDestinationNameIndex = 0;
        for (let marker of markers) {
            const markerStyles = document.createElement('div');
            markerStyles.className = props.activeItinerary ? "marker destination" : `marker${marker.visited ? '' : ' unvisited'}`;
            markerStyles.style.marginTop = '-16px'

            const markerCoordinates = props.activeItinerary ?
                itinerary.nationalParksOnly ?
                    [nationalParks[itinerary.destinations[currentDestinationNameIndex] - 1].long, nationalParks[itinerary.destinations[currentDestinationNameIndex] - 1].lat] :
                    [marker.long, marker.lat] :
                [marker.long, marker.lat];
            
            const mark = new mapboxgl.Marker(markerStyles)
                .setLngLat(markerCoordinates)
                .setPopup(
                    new mapboxgl.Popup({ offset: 40 })
                    .setHTML(
                        props.activeItinerary ?
                            `<h2 class="serifFont greenFont">${itinerary.destinationNames[currentDestinationNameIndex]}</h2>`
                        :
                            `<h2 class="serifFont greenFont">${marker.name}</h2>
                            <h4 class="grayFont noMarginTop">${marker.states}</h4>
                            <p>${marker.description || ''}</p>`
                    )
                )
                .addTo(map.current);
            
            currentDestinationNameIndex++;
        }
        
        // Itinerary lines - only displayed for itineraries
        if (props.activeItinerary) {
            map.current.on('load', () => {
                map.current.addLayer({
                    id: 'route',
                    type: 'line',
                    source: {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                        type: 'LineString',
                        coordinates: route
                        }
                    }
                    },
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#669DF6',
                        'line-width': 4
                    }
                });
            });
        }

    });
    
    return (
        <div ref={mapContainer} className="mapbox" />
    )
}

export default Map;