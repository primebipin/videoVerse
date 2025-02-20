import React, { useState } from 'react';
import Header from './components/Header';
import ScriptGenerator from './components/ScriptGenerator';
import VideoGenerator from './components/VideoGenerator';
import ImageSelector from './components/ImageSelector';

const App = () => {
  const [script, setScript] = useState('');
  const [image, setImage] = useState('');

  return (
    <div className='w-100'>
      <Header />
      <div className="">
        <ScriptGenerator setScript={setScript} script={script}/>
        <ImageSelector setImage={setImage} image={image} script={script} />
        <VideoGenerator script={script} image={image} />
      </div>
    </div>
  );
};

export default App;
