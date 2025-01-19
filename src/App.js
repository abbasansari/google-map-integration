import React from "react";
import MapComponent from "./components/MapComponent";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">
        Real-Time Google Map Navigation
      </h1>
      <MapComponent />
    </div>
  );
};

export default App;
