import React from "react";
import { DirectionsRenderer } from "@react-google-maps/api";

const RouteRenderer = ({ directions }) => {
  return <>{directions && <DirectionsRenderer directions={directions} />}</>;
};

export default RouteRenderer;
