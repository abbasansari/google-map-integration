import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import LocationInput from "./LocationInput";
import VoiceNotification from "./VoiceNotification";

const libraries = ["places"];

const MapComponent = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [directions, setDirections] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [nearbyPlaces, setNearbyPlaces] = useState([]);

  const speak = useCallback((message) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);
    synth.speak(utterance);
  }, []);

  useEffect(() => {
    const handleLocationChange = (position) => {
      const { latitude, longitude } = position.coords;
      const location = { lat: latitude, lng: longitude };
      setUserLocation(location);
      setOrigin(location);
    };

    const handleError = (error) => {
      console.error("Geolocation error:", error);
      alert(
        "Unable to fetch your current location. Using default location (Lahore)."
      );
      setUserLocation({ lat: 31.5497, lng: 74.3436 });
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        handleLocationChange,
        handleError
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setUserLocation({ lat: 31.5497, lng: 74.3436 });
    }
  }, []);

  useEffect(() => {
    if (window.google && origin && destination) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: new window.google.maps.LatLng(origin.lat, origin.lng),
          destination: new window.google.maps.LatLng(
            destination.lat,
            destination.lng
          ),
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
            const route = result.routes[0].legs[0];
            setDistance(route.distance.text);
            setDuration(route.duration.text);
          } else {
            console.error("Error fetching directions:", status);
          }
        }
      );
    }
  }, [origin, destination]);

  useEffect(() => {
    if (window.google && userLocation && origin && destination) {
      const service = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );
      const placeTypes = ["restaurant", "gas_station", "store"];
      let allResults = [];
      placeTypes.forEach((type) => {
        const request = {
          location: new window.google.maps.LatLng(
            userLocation.lat,
            userLocation.lng
          ),
          radius: 50,
          type,
        };
        service.nearbySearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            allResults = [...allResults, ...results];
            setNearbyPlaces((prevPlaces) => {
              const newPlaces = [...prevPlaces, ...results];
              newPlaces.forEach((place) => {
                speak(`You are near ${place.name}`);
              });
              return newPlaces;
            });
          } else {
            console.error("Error fetching nearby places:", status);
          }
        });
      });
    }
  }, [userLocation, origin, destination, speak]);

  const handleMapClick = useCallback((event) => {
    const newLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setUserLocation(newLocation);
    setOrigin(newLocation);
  }, []);

  const mapCenter = useMemo(
    () => userLocation || { lat: 31.5497, lng: 74.3436 },
    [userLocation]
  );

  if (loadError) return <p>Error loading maps: {loadError.message}</p>;
  if (!isLoaded) return <p>Loading Maps...</p>;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">
        Google Map Integration Using Mern
      </h1>
      <LocationInput setOrigin={setOrigin} setDestination={setDestination} />
      <div className="mt-4">
        <GoogleMap
          center={mapCenter}
          zoom={10}
          mapContainerStyle={{ height: "400px", width: "100%" }}
          onClick={handleMapClick}
        >
          {userLocation && <Marker position={userLocation} />}
          {origin && <Marker position={origin} />}
          {destination && <Marker position={destination} />}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>
      {distance && duration && (
        <div className="mt-4">
          <p>Total Distance: {distance}</p>
          <p>Estimated Time: {duration}</p>
        </div>
      )}
      <div className="mt-4">
        <h2 className="font-bold text-lg">Nearby Places:</h2>
        <ul>
          {nearbyPlaces.map((place) => (
            <li key={place.place_id}>{place.name}</li>
          ))}
        </ul>
      </div>
      <VoiceNotification
        userLocation={userLocation}
        destination={destination}
      />
    </div>
  );
};

export default React.memo(MapComponent);
