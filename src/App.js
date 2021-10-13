import React, { useState } from 'react';
import './global.css';
import './components/common/shared.css';
import Header from './components/common/Header';
import Home from './components/common/Home';
import Travel from './components/content/Travel';
import Itineraries from './components/content/Itineraries';

function App() {

  const [currentPage, setCurrentPage] = useState('Home');

  return (
      <body>
        <Header setCurrentPage={setCurrentPage} currentPage={currentPage} />
        <main>
          {currentPage === "Home" && <Home />}
          {currentPage === "Travel" && <Travel />}
          {currentPage === "Itineraries" && <Itineraries />}
        </main>
        <footer>

        </footer>
      </body>
  );
}

export default App;