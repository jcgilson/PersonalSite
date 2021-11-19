// Images
// import roadtrip2019 from '../../../images/roadtrip2019.png';
// import roadtrip2021 from '../../../images/roadtrip2021.png';
import pnw from '../../../images/pnw.png';
import portland from '../../../images/portland.png';
import mountHood from '../../../images/mountHood.png';
import eagleCreek from '../../../images/eagleCreek.png';

// import vegas from '../../../images/vegas.png';
import everglades from '../../../images/everglades.png';
import sequoia from '../../../images/sequoia.png';
import craterLake from '../../../images/crater-lake.png';
import bigBend from '../../../images/big-bend.png';

import arches from '../../../images/delicate-arch.png'
import blackCanyon from '../../../images/black-canyon.png'

import deathValley from '../../../images/deathValley.png';

export const defaultItineraries = [
    {
        id: 1,
        name: "2019 Roadtrip",
        nationalParksOnly: true,
        destinations: [
            51, // Rocky Mountain
            9, // Canyonlands
            3, // Arches
            10, // Capitol Reef
            8, // Bryce Canyon
            24, // Grand Canyon
            63, // Zion
            25, // Grand Teton
            61, // Yellowstone
            59, // Wind Cave
            4, // Badlands
        ],
        destinationNames: ["Rocky Mountain", "Canyonlands", "Arches", "Capitol Reef", "Bryce Canyon", "Grand Canyon", "Zion", "Grand Teton", "Yellowstone", "Wind Cave", "Badlands"],
        shortDescription: "11 National Parks, 24 Days Camping, 5000+ Miles Driven",
        description: "During my senior year of college I began planning the trip of a lifetime with my best friend.",
        previewImageSource: arches,
        modalImageSources: [],
        modalImageDescriptions: [],
        // routeImageSource: roadtrip2019,
        header: "RMNP, UT, WY, SD",
        subHeader: "11 National Parks & Mount Rushmore",
        mapZoom: 5,
        mapCenter: { lat: 40.60, long: -108.50 }
    },
    {
        id: 2,
        name: "2021 Roadtrip",
        nationalParksOnly: true,
        destinations: [
            51, // Rocky Mountain
            7, // Black Canyon of the Gunnison
            3, // Arches
            9, // Canyonlands
            43, // Mesa Verde
            27, // Great Sand Dunes
        ],
        destinationNames: ["Rocky Mountain", "Black Canyon of the Gunnison", "Arches", "Canyonlands", "Mesa Verde", "Great Sand Dunes"],
        shortDescription: "6 National Parks",
        description: "",
        previewImageSource: blackCanyon,
        modalImageSources: [],
        modalImageDescriptions: [],
        // routeImageSource: roadtrip2021,
        header: "CO & Moab",
        subHeader: "6 National Parks",
        mapZoom: 6.4,
        mapCenter: { lat: 38.80, long: -107.72 }
    },
    {
        id: 3,
        name: "Pacific Northwest",
        nationalParksOnly: false,
        destinations: [
            {long: -122.67, lat: 45.51}, // Portland
            {long: -121.70, lat: 45.37}, // Mount Hood
            {long: -121.92, lat: 45.63}, // Eagle Creek Trail
            {long: -121.72, lat: 46.88}, // Mount Ranier
            {long: -123.60, lat: 47.80}, // Olympic
            {long: -122.33, lat: 47.60}, // Seattle
            {long: -121.29, lat: 48.77}, // North Cascades
            {long: -123.12, lat: 49.28}, // Vancouver
        ],
        destinationNames: ["Portland", "Mount Hood", "Eagle Creek Trail", "Mount Ranier NP", "Olympic NP", "Seattle", "North Cascades NP", "Vancouver"],
        shortDescription: "3 National Parks",
        description: "This is at the very top of my to-do list.",
        previewImageSource: pnw,
        modalImageSources: [portland, mountHood, eagleCreek],
        modalImageDescriptions: ["Portland", "Mount Hood", "Eagle Creek Trail"],
        header: "Pacific Northwest",
        subHeader: "3 National Parks",
        mapZoom: 6,
        mapCenter: { lat: 47.40, long: -123.00 }
    },
    {
        id: 4,
        name: "Southern Florida",
        nationalParksOnly: false,
        destinations: [
            {long: -80.19, lat: 25.76}, // Miami
            {long: -80.23, lat: 25.57}, // Biscayne
            {long: -80.48, lat: 25.44}, // Everglades
            {long: -81.78, lat: 24.55}, // Key West
            {long: -82.92, lat: 24.63}, // Dry Tortugas
        ],
        destinationNames: ["Miami", "Biscayne", "Everglades", "Key West", "Dry Tortugas"],
        shortDescription: "3 National Parks",
        description: "This is at the very top of my to-do list.",
        previewImageSource: everglades,
        modalImageSources: [everglades, mountHood, eagleCreek],
        modalImageDescriptions: ["Miami", "Biscayne", "Everglades", "Key West", "Dry Tortugas"],
        header: "Southern Florida",
        subHeader: "3 National Parks",
        mapZoom: 7.8,
        mapCenter: { lat: 25.18, long: -81.45 }
    },
    {
        id: 5,
        name: "California",
        nationalParksOnly: false,
        destinations: [
            {long: -121.18, lat: 36.49}, // Pinnacles
            {long: -119.54, lat: 37.87}, // Yosemite
            {long: -118.56, lat: 36.89}, // Kings Canyon
            {long: -118.57, lat: 36.49}, // Sequoia
        ],
        destinationNames: ["Pinnacles", "Yosemite", "Kings Canyon", "Sequoia"],
        shortDescription: "4 National Parks",
        description: "This is at the very top of my to-do list.",
        previewImageSource: sequoia,
        modalImageSources: [sequoia, mountHood, eagleCreek],
        modalImageDescriptions: ["Pinnacles", "Yosemite", "Kings Canyon", "Sequoia"],
        header: "California",
        subHeader: "4 National Parks",
        mapZoom: 7.5,
        mapCenter: { lat: 37.20, long: -120.11 }
    },
    {
        id: 6,
        name: "Northen California",
        nationalParksOnly: false,
        destinations: [
            {long: -123.17, lat: 42.87}, // Crater Lake
            {long: -124.00, lat: 41.21}, // Redwood
            {long: -121.42, lat: 40.5}, // Lassen Volcanic
        ],
        destinationNames: ["Crater Lake", "Redwood", "Lassen Volcanic"],
        shortDescription: "3 National Parks",
        description: "This is at the very top of my to-do list.",
        previewImageSource: craterLake,
        modalImageSources: [craterLake, mountHood, eagleCreek],
        modalImageDescriptions: ["Crater Lake", "Redwood", "Lassen Volcanic"],
        header: "Northern California",
        subHeader: "3 National Parks",
        mapZoom: 6.5,
        mapCenter: { lat: 41.70, long: -122.75 }
    },
    {
        id: 7,
        name: "New Mexico & Texas",
        nationalParksOnly: false,
        destinations: [
            {long: -106.33, lat: 32.79}, // White Sands
            {long: -104.55, lat: 32.13}, // Carlsbad Caverns
            {long: -104.86, lat: 31.92}, // Guadalupe Mountains
            {long: -103.25, lat: 29.25}, // Big Bend
        ],
        destinationNames: ["White Sands", "Carlsbad Caverns", "Guadalupe Mountains", "Big Bend"],
        shortDescription: "4 National Parks",
        description: "This is at the very top of my to-do list.",
        previewImageSource: bigBend,
        modalImageSources: [bigBend, mountHood, eagleCreek],
        modalImageDescriptions: ["White Sands", "Carlsbad Caverns", "Guadalupe Mountains", "Big Bend"],
        header: "New Mexico & Texas",
        subHeader: "4 National Parks",
        mapZoom: 6.3,
        mapCenter: { lat: 31.00, long: -104.55 }
    },
    {
        id: 8,
        name: "Death Valley",
        nationalParksOnly: false,
        destinations: [
            {long: -111.89, lat: 40.76}, // Salt Lake City
            {long: -114.26, lat: 38.93}, // Great Basin
            {long: -115.14, lat: 36.17}, // Las Vegas
            {long: -117.08, lat: 36.51}, // Death Valley
        ],
        destinationNames: ["Salt Lake City", "Great Basin", "Las Vegas", "Death Valley"],
        shortDescription: "2 National Parks",
        description: "This is at the very top of my to-do list.",
        previewImageSource: deathValley,
        modalImageSources: [deathValley, mountHood, eagleCreek],
        modalImageDescriptions: ["Salt Lake City", "Great Basin", "Las Vegas", "Death Valley"],
        header: "Death Valley",
        subHeader: "2 National Parks",
        mapZoom: 5.7,
        mapCenter: { lat: 38.50, long: -114.00 }
    },
];
