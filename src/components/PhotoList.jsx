import { useEffect, useState } from 'react'
import React from "react";

import Photo from "./Photo";
import NoPhotos from "./NoPhotos";

const PhotoList = ({data, title}) => {
  const results = data
  let photos;
  useEffect(() => {
    document.title = title
  }, [title])

  if (data.length > 0) {
    photos = results.map(photo => <Photo url={`https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`} key={photo.id} />)
  } else {
    photos = <NoPhotos title={title} />
  }
  
  
  return (
    <div className="photo-container">
      <h2>Results</h2>
      <ul>
        {photos}
      </ul>
    </div>
  );
};

export default PhotoList;
