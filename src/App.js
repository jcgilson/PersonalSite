import React, { useState, useRef } from 'react';
// Components
import Header from './components/common/Header';
import Home from './components/common/Home';
import Itineraries from './components/content/Itineraries';
import NationalParks from './components/content/NationalParks';
// import Gallery from './components/content/Gallery';
import Golf from './components/content/Golf';
import Resources from './components/content/Resources';
// import Footer from './components/common/Footer';
// MUI
import { Modal } from '@mui/material';
// CSS
import './global.css';
import './components/common/shared.css';
import './configurableStyles.css';

import { defaultItineraries } from './components/content/consts/DefaultItineraries.js';
import siteConfigurationDownloadFile from './SiteConfiguration.xlsx';
const defaultConfiguration = require('./defaultConfiguration.json');
const Excel = require('exceljs');

function App() {

  const links = ["Itineraries", "National Parks", "Gallery", "Golf", "Resources"];
  const [configuration, setConfiguration] = useState(defaultConfiguration);
  const [itineraries, setItineraries] = useState(defaultItineraries);
  const [currentPage, setCurrentPage] = useState("Golf");
  const [displayUploadButton, setDisplayUploadButton] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  
  const fileInputRef = useRef(null);
  // Upload images folder with separate ref in modal

  const getAppBackgroundClassName = () => {
    const backgroundConfiguration = configuration.app.background;
    let backgroundClassName = 'body ';

    if (backgroundConfiguration.type === "image") {
      backgroundClassName += `backgroundCover zIndexNegative ${backgroundConfiguration.imageSource}`;
    }

    if (backgroundConfiguration.type === "color") {
      backgroundClassName += `color${backgroundConfiguration.colorHexCode}`;
    }

    return backgroundClassName;
  }

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const importFile = (e) => {
    const file = e.target.files[0];

    if (file) {
        const filetype = file.name.split('.')[file.name.split('.').length - 1];
        if (filetype !== 'xlsx') {
            console.log("NOT AN EXCEL FILE")
            return;
        }
    }

    const excel = new Excel.Workbook();
    const reader = new FileReader();

    reader.readAsArrayBuffer(file);
    reader.onload = () => {
        const buffer = reader.result;
        excel.xlsx.load(buffer)
            .then(wkbk => {
              const siteConfiguration = wkbk.getWorksheet('Site Configuration');
              siteConfiguration.columns.forEach((col, index) => {
                if (index === 2) {
                  let configurationImport = {
                    app: {
                      background: {

                      }
                    },
                    itineraries: {}
                  };

                  // Background Styles
                  configurationImport.app.background.type = col.values[5];
                  configurationImport.app.background.imageSource = col.values[6];
                  configurationImport.app.background.colorHexCode = col.values[7];
                  
                  // Itinerary Styles
                  configurationImport.itineraries.cardVariation = col.values[11];
                  
                  setConfiguration(configurationImport);
                  return;
                }
              });
              
              const itinerariesConfiguration = wkbk.getWorksheet('Itineraries');
              let itinerariesImport = [];
              itinerariesConfiguration.eachRow((row, rowNumber) => {
                if (rowNumber >= 5) { // Excel data starts on row 5
                  const row = itinerariesConfiguration.getRow(rowNumber).values
                  const itinerary = {
                    id: row[1],
                    name: row[2],
                    nationalParksOnly: row[3],
                    destinations: row[4].split(","),
                    destinationNames: row[5].split(","),
                    shortDescription: row[6],
                    description: row[7],
                    previewImageSource: row[8],
                    modalImageSources: row[9] ? row[9].split(",") : [],
                    modalImageDescriptions: row[10] ? row[10].split(",") : [],
                    header: row[11],
                    subHeader: row[12],
                    mapZoom: row[13],
                    mapCenter: { lat: row[14].split(",")[0], long: row[14].split(",")[1] },
                  };
                  itinerariesImport.push(itinerary);
                }
              });
              setItineraries(itinerariesImport);
            });
    }
    setDisplayUploadButton(false);
    handleCloseModal();
  }

  // console.log("configuration",configuration)

  return (
      <div className={getAppBackgroundClassName()}>
        <article>
          <section className="backgroundOpacity zIndexNegative" />
        </article>
        <main>
          <Header links={links} setCurrentPage={setCurrentPage} currentPage={currentPage} />
          {currentPage === "Home" && <Home links={links} setCurrentPage={setCurrentPage} />}
          {currentPage === "Itineraries" && <Itineraries itineraries={itineraries} configuration={configuration} />}
          {currentPage === "National Parks" && <NationalParks />}
          {/* {currentPage === "Gallery" && <Gallery />} */}
          {currentPage === "Golf" && <Golf />}
          {currentPage === "Resources" && <Resources />}
          {/* Upload Excel */}
          {displayUploadButton && currentPage !== "Golf" &&
            <button
                onClick={() => handleOpenModal()}
                style={{ backgroundColor: 'black', position: 'fixed', bottom: '24px', left: '24px', borderRadius: '48px', padding: '8px', height: '64px', width: '64px' }}
                className="boxShadowMedium whiteFont smallFont"
            >
              Upload Your Travels
            </button>
          }
          {/* <Footer /> */}
        </main>
        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          className="justifyCenter alignCenter"
        >
          <div className="width90Percent backgroundColorWhite marginAuto marginTopMassive paddingBottomLarge flexColumn alignCenter" style={{ height: '80vh', borderRadius: '16px' }}>
            <a href={siteConfigurationDownloadFile} download="Site-Configuration.xlsx" className="removeTextDecoration">
              Download Site Configuration
            </a>
            <button onClick={() => fileInputRef.current.click()}>
              Upload Site Configuration
            </button>
            <input
              ref={fileInputRef}
              type="file"
              hidden
              onChange={importFile}
            />
          </div>
        </Modal>
      </div>
  );
}

export default App;