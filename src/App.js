import React, { useState } from 'react';
// Components
import Header from './components/common/Header';
import Home from './components/common/Home';
import Travel from './components/content/Travel';
import Itineraries from './components/content/Itineraries';
import Footer from './components/common/Footer';
// CSS
import './global.css';
import './components/common/shared.css';

function App() {

  const [currentPage, setCurrentPage] = useState('Home');

  return (
      <body>
        <article className="backgroundCover delicateArch zIndexNegative">
          <article className="backgroundOpacity zIndexNegative" />
        </article>
        <main>
          <Header setCurrentPage={setCurrentPage} currentPage={currentPage} />
          {currentPage === "Home" && <Home />}
          {currentPage === "Travel" && <Travel />}
          {currentPage === "Itineraries" && <Itineraries />}
          <Footer />
        </main>
      </body>
  );
}

export default App;