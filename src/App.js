import React, { useState } from 'react';
import './global.css';
import './components/common/shared.css';
import Header from './components/common/Header';
import Home from './components/common/Home';
import Travel from './components/content/Travel';

function App() {

  const [currentPage, setCurrentPage] = useState('Home');

  return (
      <body className="pageContainer">
        <Header setCurrentPage={setCurrentPage} currentPage={currentPage} />
        <main>
			<Home />
			{currentPage === "Travel" && <Travel />}
        </main>
        <footer>

        </footer>
      </body>
  );
}

export default App;