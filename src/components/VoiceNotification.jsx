import React, { useEffect } from "react";
import Speech from "react-speech";

const VoiceNotification = ({ userLocation, destination }) => {
  useEffect(() => {
    if (userLocation && destination) {
      const distance = getDistance(userLocation, destination);
      if (distance < 50) {
        alert("You have arrived at your destination!");
        // Uncomment the line below to enable voice notification
        // <Speech text="You have arrived at your destination!" />
      }
    }
  }, [userLocation, destination]);

  const getDistance = (loc1, loc2) => {
    const R = 6371e3; // Radius of the Earth in meters
    const lat1 = loc1.lat * (Math.PI / 180); // Convert latitude from degrees to radians
    const lat2 = loc2.lat * (Math.PI / 180); // Convert latitude from degrees to radians
    const deltaLat = (loc2.lat - loc1.lat) * (Math.PI / 180); // Difference in latitude in radians
    const deltaLng = (loc2.lng - loc1.lng) * (Math.PI / 180); // Difference in longitude in radians

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLng / 2) *
        Math.sin(deltaLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  return (
    <div>
      {/* Optionally, you can add more UI elements or notifications here */}
    </div>
  );
};

export default VoiceNotification;
