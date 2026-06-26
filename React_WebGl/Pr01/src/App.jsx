import React from 'react'
import useLenis from './hooks/useLenis';
import Main from './pages/Main';

const App = () => {
  useLenis();

  return (
    <main>
      <Main />
    </main>
  )
}

export default App;
