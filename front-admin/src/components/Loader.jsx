import React from 'react'
import {ColorRing} from "react-loader-spinner";

function Loader() {
  return (
  
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-primary"></div>
  </div>
  )
}

export default Loader