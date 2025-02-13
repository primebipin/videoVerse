import React, { useState } from 'react';
import Header from './components/Header';
import ScriptGenerator from './components/ScriptGenerator';
import VideoGenerator from './components/VideoGenerator';

const App = () => {
  const [script, setScript] = useState('');
  const [image, setImage] = useState('');
  
  return (
    <div className='w-100'>
      <Header />
      <div className="">
        <ScriptGenerator onScriptGenerated={setScript} />
        <VideoGenerator script={script} setImage={image} />
      </div>
    </div>
  );
};

export default App;
