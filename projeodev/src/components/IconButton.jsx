import React from 'react'
import { Trash } from 'react-bootstrap-icons'; 

const IconButton = ({ onClick }) => (
    <button
      onClick={onClick}><Trash color="red" />
    </button>
  );

  export default IconButton