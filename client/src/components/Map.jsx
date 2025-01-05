import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

// Calculate distance between two points using the Haversine formula
const calculateDistance = (coord1, coord2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(coord2[1] - coord1[1]);
  const dLon = toRad(coord2[0] - coord1[0]);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(coord1[1])) * Math.cos(toRad(coord2[1])) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal place
};

const toRad = (degree) => degree * Math.PI / 180;

const Map = ({ location, zoom = 13 }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    if (!location) return;
    if (map.current) return;

    const initializeMap = async () => {
      // Get user's current location
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = [position.coords.longitude, position.coords.latitude];
            
            // Initialize map
            map.current = new mapboxgl.Map({
              container: mapContainer.current,
              style: 'mapbox://styles/mapbox/streets-v11',
              center: location.coordinates,
              zoom: zoom
            });

            // Add item marker (red)
            new mapboxgl.Marker({ color: '#FF0000' })
              .setLngLat(location.coordinates)
              .setPopup(new mapboxgl.Popup().setHTML('<p>Item location</p>'))
              .addTo(map.current);

            // Add user location marker (blue)
            new mapboxgl.Marker({ color: '#0000FF' })
              .setLngLat(userLocation)
              .setPopup(new mapboxgl.Popup().setHTML('<p>Your location</p>'))
              .addTo(map.current);

            // Calculate and store distance
            const dist = calculateDistance(userLocation, location.coordinates);
            setDistance(dist);

            // Add navigation controls
            map.current.addControl(new mapboxgl.NavigationControl());

            // Add line between points
            map.current.on('load', () => {
              map.current.addSource('route', {
                type: 'geojson',
                data: {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'LineString',
                    coordinates: [userLocation, location.coordinates]
                  }
                }
              });

              map.current.addLayer({
                id: 'route',
                type: 'line',
                source: 'route',
                layout: {
                  'line-join': 'round',
                  'line-cap': 'round'
                },
                paint: {
                  'line-color': '#888',
                  'line-width': 2,
                  'line-dasharray': [2, 2]
                }
              });

              // Fit bounds to show both markers
              const bounds = new mapboxgl.LngLatBounds()
                .extend(userLocation)
                .extend(location.coordinates);

              map.current.fitBounds(bounds, {
                padding: 50
              });
            });
          },
          (error) => {
            console.error('Error getting location:', error);
            // Initialize map with just item location if user location fails
            map.current = new mapboxgl.Map({
              container: mapContainer.current,
              style: 'mapbox://styles/mapbox/streets-v11',
              center: location.coordinates,
              zoom: zoom
            });

            new mapboxgl.Marker()
              .setLngLat(location.coordinates)
              .addTo(map.current);

            map.current.addControl(new mapboxgl.NavigationControl());
          }
        );
      }
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [location, zoom]);

  return (
    <div className="space-y-2">
      <div 
        ref={mapContainer} 
        className="h-64 w-full rounded-lg overflow-hidden"
      />
      {distance && (
        <div className="text-sm text-gray-600">
          Distance from your location: {distance} km
        </div>
      )}
    </div>
  );
};

export default Map;