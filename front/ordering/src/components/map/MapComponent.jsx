// This is a simplified map component using React Map GL
// In a real app, you'd use the full Mapbox integration

import { useState, useEffect } from 'react'
import { FiMapPin } from 'react-icons/fi'

// This is a placeholder component for the map
// In a real app, you would use react-map-gl or Google Maps
function MapComponent({ initialLocation, onLocationChange }) {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation)
  
  // Handle click on map
  const handleMapClick = (e) => {
    // This is a mock function to simulate clicking on different parts of the map
    // In a real app, you would get coordinates from the map click event
    const randomOffset = (Math.random() - 0.5) * 0.01 // Small random offset
    const newLocation = [
      selectedLocation[0] + randomOffset,
      selectedLocation[1] + randomOffset
    ]
    
    setSelectedLocation(newLocation)
    onLocationChange(newLocation)
  }
  
  useEffect(() => {
    setSelectedLocation(initialLocation)
  }, [initialLocation])
  
  return (
    <div className="relative bg-neutral-100 rounded-lg overflow-hidden" style={{ height: '250px' }}>
      {/* Simulated map */}
      <div 
        className="w-full h-full bg-cover bg-center cursor-pointer"
        style={{ backgroundImage: 'url(https://images.pexels.com/photos/2850287/pexels-photo-2850287.jpeg?auto=compress&cs=tinysrgb&w=1600)' }}
        onClick={handleMapClick}
      />
      
      {/* Center pin */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-accent-500">
        <FiMapPin size={30} />
      </div>
      
      {/* Location info */}
      <div className="absolute bottom-0 left-0 right-0 bg-white p-3 border-t border-neutral-200">
        {/* <p className="text-sm">Selected location: {selectedLocation[1].toFixed(4)}, {selectedLocation[0].toFixed(4)}</p> */}
        <p className="text-sm">
          Selected location: 
          {selectedLocation && selectedLocation.length === 2 
            ? `${selectedLocation[1].toFixed(4)}, ${selectedLocation[0].toFixed(4)}`
            : 'N/A'}
        </p>
        <p className="text-xs text-neutral-500">Click on the map to change the delivery location</p>
      </div>
    </div>
  )
}

export default MapComponent