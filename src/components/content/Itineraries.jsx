import React, { useState } from "react";
// Components
import Map from './Map';
// MUI
import { Modal, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ChevronLeft ,ChevronRight } from '@material-ui/icons';
// Consts
import { defaultItineraries } from './consts/DefaultItineraries.js';
import { nationalParks } from './consts/NationalParks.js';
// CSS
import './content.css';
// Misc.
// const configuration = require('../../configuration.json'); // use deafult/import instead
// const SiteConfiguration = require("../../SiteConfiguration.xlsx"); // remove

const Itineraries = (props) => {

    const { configuration, itineraries } = props;

    const itinerariesList = itineraries ? itineraries : defaultItineraries;


    const [modalOpen, setModalOpen] = useState(false);
    const [activeItinerary, setActiveItinerary] = useState(itinerariesList[2]);
    const [display, setDisplay] = useState('map');

    const [activeModalImage, setActiveModalImage] = useState(0);

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);
    
    const openItinerary = (itinerary) => {
        setActiveItinerary(itinerary);
        handleOpenModal();
    }

	const handleDisplayChange = (event, newDisplay) => {
		setDisplay(newDisplay);
	};

    const handlePreviousCarouselImage = () => {
        if (activeModalImage === 0) {
            setActiveModalImage(activeItinerary.modalImageSources.length - 1)
        } else {
            setActiveModalImage(activeModalImage - 1)
        }
    }
    const handleNextCarouselImage = () => {
        if (activeModalImage < activeItinerary.modalImageSources.length - 1) {
            setActiveModalImage(activeModalImage + 1)
        } else {
            setActiveModalImage(0)
        }
    }

    const cardVariation = configuration.itineraries.cardVariation; // Variations: "card", "contained"

    return (
        <article>
            <section className={`width80Percent marginAuto flexFlowRowWrap justifySpaceBetween alignCenter${cardVariation === 'card' ? "" : " paddingTopLarge paddingLeftLarge paddingRightLarge paddingBottomLarge backgroundColorWhite"}`}>
                {itinerariesList.map((itinerary, i) => {
                    return (
                        <div className={`${cardVariation === 'card' ? "card default alignCenter " : "card contained"}marginTopMassive flexColumn`} onClick={() => openItinerary(itinerary)} key={i}>
                            <img src={itinerary.previewImageSource} style={{ height: '200px',  }} alt={itinerary.header} className="width100Percent" />
                            <h2 className="serifFont marginTopExtraSmall">{itinerary.header}</h2>
                            <h4 className="grayFont">{itinerary.subHeader}</h4>
                        </div>
                    )
                })}
            </section>
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                // aria-labelledby="modal-modal-title"
                // aria-describedby="modal-modal-description"
                className="justifyCenter alignCenter"
            >
                <div className="width90Percent backgroundColorWhite marginAuto marginTopMassive paddingBottomLarge flexColumn alignCenter" style={{ height: '80vh', borderRadius: '16px' }}>
                    <div className="width90Percent flexRow justifySpaceBetween alignCenter marginTopMedium marginBottomMedium paddingLeftSmall paddingRightSmall">
                        <h1 className="massiveFont serifFont">{activeItinerary.header}</h1>
                        <ToggleButtonGroup
                            value={display}
                            exclusive
                            onChange={handleDisplayChange}
                            aria-label="display"
                        >
                            <ToggleButton className="small" value="map" aria-label="map display">
                                Map
                            </ToggleButton>
                            <ToggleButton className="small" value="itinerary" aria-label="itinerary display">
                                Itinerary
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>

                    {display === 'map' && <Map activeItinerary={activeItinerary} />}

                    {(display === 'itinerary' && cardVariation === 'card') && <>
                        <div className="flexRow justifySpaceAround alignCenter marginTopLarge">
                            <ChevronLeft onClick={() => handlePreviousCarouselImage()} />
                            <img src={activeItinerary.modalImageSources[activeModalImage]} style={{ height: '300px' }} alt={activeItinerary.modalImageDescriptions[activeModalImage]} />
                            <ChevronRight onClick={() => handleNextCarouselImage()} />
                        </div>

                        <h3>{activeItinerary.modalImageDescriptions[activeModalImage]}</h3>
                        <h2 className="grayFont marginTopMedium">{activeItinerary.subHeader}</h2>
                        <p className="">{activeItinerary.description}</p>

                        <ol>
                            {activeItinerary.nationalParksOnly ? activeItinerary.destinations.map((destination, i) => {
                                return <li key={i}>{nationalParks[destination - 1].name}</li>
                            }) : activeItinerary.destinationNames.map((destinationName, i) => {
                                return <li key={i}>{destinationName}</li>
                            })}
                        </ol>
                    </>}

                    {(display === 'itinerary' && cardVariation === 'contained') && <>
                        <div className="flexRow justifySpaceAround alignCenter marginTopLarge">
                            <ChevronLeft onClick={() => handlePreviousCarouselImage()} />
                            <img src={activeItinerary.modalImageSources[activeModalImage]} style={{ height: '300px' }} alt={activeItinerary.modalImageDescriptions[activeModalImage]} />
                            <ChevronRight onClick={() => handleNextCarouselImage()} />
                        </div>

                        <h3>{activeItinerary.modalImageDescriptions[activeModalImage]}</h3>
                        <h2 className="grayFont marginTopMedium">{activeItinerary.subHeader}</h2>
                        <p className="">{activeItinerary.description}</p>

                        <ol>
                            {activeItinerary.nationalParksOnly ? activeItinerary.destinations.map((destination, i) => {
                                return <li key={i}>{nationalParks[destination - 1].name}</li>
                            }) : activeItinerary.destinationNames.map((destinationName, i) => {
                                return <li key={i}>{destinationName}</li>
                            })}
                        </ol>
                    </>}
                </div>
            </Modal>
        </article>
    )
}

export default Itineraries;