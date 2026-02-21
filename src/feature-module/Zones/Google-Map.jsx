import React, { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  DrawingManager,
  Polygon,
} from "@react-google-maps/api";
import { URLS } from "../../url";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 17.385044,
  lng: 78.486671,
};

const libraries = ["drawing", "places"];

export default function ZoneMap({ onPolygonComplete, initialCoordinates, center }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: URLS.GoogleMapsKey,
    libraries,
  });

  const [polygonPath, setPolygonPath] = useState(initialCoordinates || []);
  const [mapCenter, setMapCenter] = useState(center || defaultCenter);

  // Update map center when prop changes
  useEffect(() => {
    if (center) {
      setMapCenter(center);
    }
  }, [center]);

  // Update polygon when initialCoordinates change
  useEffect(() => {
    setPolygonPath(initialCoordinates || []);
  }, [initialCoordinates]);

  const onPolygonCompleteCallback = useCallback(
    (polygon) => {
      const path = polygon.getPath().getArray();
      const coordinates = path.map((point) => ({
        lat: point.lat(),
        lng: point.lng(),
      }));

      setPolygonPath(coordinates);
      if (onPolygonComplete) onPolygonComplete(coordinates);

      // Remove drawing overlay after completion (optional)
      polygon.setMap(null);
    },
    [onPolygonComplete]
  );

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mapCenter}
      zoom={12}
    >
      <DrawingManager
        onPolygonComplete={onPolygonCompleteCallback}
        options={{
          drawingControl: true,
          drawingControlOptions: {
            drawingModes: ["polygon"],
          },
          polygonOptions: {
            fillColor: "#00FF00",
            fillOpacity: 0.4,
            strokeColor: "#008000",
            strokeWeight: 2,
            clickable: true,
            editable: true,
            draggable: false,
          },
        }}
      />

      {polygonPath.length > 0 && (
        <Polygon
          path={polygonPath}
          options={{
            fillColor: "#00FF00",
            fillOpacity: 0.4,
            strokeColor: "#008000",
            strokeWeight: 2,
            editable: true,
          }}
        />
      )}
    </GoogleMap>
  );
}