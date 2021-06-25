import React from 'react'

function Navigation({prevImage="", nextImage="", handleClick}) {
  return (
    <div className="Navigation">
      <a href={prevImage} onClick={handleClick}>
          Previous
        </a>
        <a href={nextImage} onClick={handleClick}>
          Next
        </a>
    </div>
  )
}

export default Navigation
