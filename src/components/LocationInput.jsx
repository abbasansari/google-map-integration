import React, { useState, useRef, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";

const libraries = ["places"]; // Libraries constant to avoid performance warning

const LocationInput = ({ setOrigin, setDestination }) => {
  const [originInput, setOriginInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const originRef = useRef();
  const destinationRef = useRef();

  useEffect(() => {
    if (isLoaded) {
      const originAutocomplete = new window.google.maps.places.Autocomplete(
        originRef.current
      );
      const destinationAutocomplete =
        new window.google.maps.places.Autocomplete(destinationRef.current);

      originAutocomplete.addListener("place_changed", () => {
        const place = originAutocomplete.getPlace();
        if (place.geometry) {
          setOrigin({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
        }
      });

      destinationAutocomplete.addListener("place_changed", () => {
        const place = destinationAutocomplete.getPlace();
        if (place.geometry) {
          setDestination({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
        }
      });
    }
  }, [isLoaded]);

  return (
    <form className="flex flex-col space-y-4">
      <input
        type="text"
        ref={originRef}
        placeholder="Origin (City Name)"
        className="p-2 border border-gray-300 rounded"
        required
      />
      <input
        type="text"
        ref={destinationRef}
        placeholder="Destination (City Name)"
        className="p-2 border border-gray-300 rounded"
        required
      />
      <button
        type="button"
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
      >
        Set Route
      </button>
    </form>
  );
};

export default LocationInput;
