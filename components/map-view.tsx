"use client";

import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const pointsOfInterest = [
  {
    id: 1,
    position: { lat: 40.7128, lng: -74.006 },
    title: "New York City",
    description: "The Big Apple",
  },
  {
    id: 2,
    position: { lat: 34.0522, lng: -118.2437 },
    title: "Los Angeles",
    description: "City of Angels",
  },
  {
    id: 3,
    position: { lat: 41.8781, lng: -87.6298 },
    title: "Chicago",
    description: "The Windy City",
  },
];

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "0.75rem",
};

const center = {
  lat: 39.8283,
  lng: -98.5795,
};

function MapSkeleton() {
  return (
    <div className="h-full w-full">
      <div className="h-full w-full rounded-xl">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  );
}

export function MapView() {
  const [selectedMarker, setSelectedMarker] = useState<
    (typeof pointsOfInterest)[0] | null
  >(null);

  const [isLoading, setIsLoading] = useState(true);

  const options = useMemo(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
      scrollwheel: true,
      styles: [],
    }),
    [],
  );

  return (
    <div className="w-full grow p-8">
      {isLoading && <MapSkeleton />}
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
        onLoad={() => setIsLoading(false)}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={4}
          center={center}
          options={options}
        >
          {pointsOfInterest.map((point) => (
            <Marker
              key={point.id}
              position={point.position}
              title={point.title}
              onClick={() => setSelectedMarker(point)}
            />
          ))}
          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className="p-2">
                <h3 className="font-semibold">{selectedMarker.title}</h3>
                <p>{selectedMarker.description}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
