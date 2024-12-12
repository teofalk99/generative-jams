import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


const ModelMenu = ( {currentModel, changeModel} ) => {

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-6">
          <button
            className={`btn btn-${currentModel == 'fastflux' ? ('dark'):('secondary')} w-100`}
            onClick={() => changeModel('fastflux')}
          >
            FastFlux (Runware)
          </button>
        </div>
        <div className="col-6">
          <button
            className={`btn btn-${currentModel == 'dall-e' ? ('dark'):('secondary')} w-100`}
            onClick={() => changeModel('dall-e')}
          >
            DALL-E (OpenAI)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelMenu;