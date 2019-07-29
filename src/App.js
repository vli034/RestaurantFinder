import React from 'react';
import Footer from './components/footer.js';
import MyForm from './components/form.js';
import Header from './components/header.js';

import './styles/styles.scss';

function App() {
  return (
    <main>
      <div className="App">
        <Header />
        <MyForm className='wrapper'/>
      </div>
      <Footer />
    </main>
  );
}

export default App;
