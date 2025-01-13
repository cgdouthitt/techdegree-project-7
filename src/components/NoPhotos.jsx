import React from "react";

const NoPhotos = ({title}) => (
  <li className='not-found'>
    <h3>Sorry, no photos match your search: { title }</h3>
  </li>
);

export default NoPhotos;