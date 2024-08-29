
import React, { useState } from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';

function App() {
  const [canvas, setCanvas] = useState(null);

  return (
    <div className="App">
      <Toolbar canvas={canvas} />
      <Canvas setCanvas={setCanvas} />
    </div>
  );
}

export default App;
