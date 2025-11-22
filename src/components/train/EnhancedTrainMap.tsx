import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix for default marker icon in Leaflet with React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons for different markers
const trainIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [35, 51],
    iconAnchor: [17, 51],
    className: 'train-marker'
});

const stationIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [20, 33],
    iconAnchor: [10, 33],
});

interface Station {
    name: string;
    lat: number;
    lng: number;
}

interface EnhancedTrainMapProps {
    trainLocation: {
        lat: number;
        lng: number;
        name: string;
    };
    previousStation?: Station;
    nextStation?: Station;
}

// Component to auto-center map and fit bounds
const MapUpdater = ({ trainLocation, previousStation, nextStation }: EnhancedTrainMapProps) => {
    const map = useMap();

    useEffect(() => {
        const bounds: L.LatLngExpression[] = [[trainLocation.lat, trainLocation.lng]];

        if (previousStation) {
            bounds.push([previousStation.lat, previousStation.lng]);
        }
        if (nextStation) {
            bounds.push([nextStation.lat, nextStation.lng]);
        }

        if (bounds.length > 1) {
            // Fit bounds with better padding to ensure all markers are visible
            map.fitBounds(bounds, {
                padding: [80, 80],
                maxZoom: 12
            });
        } else {
            map.setView([trainLocation.lat, trainLocation.lng], 13);
        }
    }, [trainLocation, previousStation, nextStation, map]);

    return null;
};

const EnhancedTrainMap = ({ trainLocation, previousStation, nextStation }: EnhancedTrainMapProps) => {
    return (
        <div className="h-full w-full rounded-lg overflow-hidden border shadow-sm relative z-0">
            <MapContainer
                center={[trainLocation.lat, trainLocation.lng]}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Previous Station Marker */}
                {previousStation && (
                    <Marker position={[previousStation.lat, previousStation.lng]} icon={stationIcon}>
                        <Popup>
                            <div className="font-semibold text-green-700">Previous Station</div>
                            <div className="text-sm">{previousStation.name}</div>
                        </Popup>
                    </Marker>
                )}

                {/* Train Current Location Marker */}
                <Marker position={[trainLocation.lat, trainLocation.lng]} icon={trainIcon}>
                    <Popup>
                        <div className="font-bold text-blue-700">🚂 Train Current Location</div>
                        <div className="text-sm">{trainLocation.name}</div>
                        <div className="text-xs text-gray-500">
                            {trainLocation.lat.toFixed(4)}°N, {trainLocation.lng.toFixed(4)}°E
                        </div>
                    </Popup>
                </Marker>

                {/* Next Station Marker */}
                {nextStation && (
                    <Marker position={[nextStation.lat, nextStation.lng]} icon={stationIcon}>
                        <Popup>
                            <div className="font-semibold text-orange-700">Next Station</div>
                            <div className="text-sm">{nextStation.name}</div>
                        </Popup>
                    </Marker>
                )}

                {/* Draw bold blue line connecting stations and train */}
                {previousStation && nextStation && (
                    <Polyline
                        positions={[
                            [previousStation.lat, previousStation.lng],
                            [trainLocation.lat, trainLocation.lng],
                            [nextStation.lat, nextStation.lng]
                        ]}
                        color="#2563eb"
                        weight={5}
                        opacity={0.8}
                    />
                )}

                <MapUpdater
                    trainLocation={trainLocation}
                    previousStation={previousStation}
                    nextStation={nextStation}
                />
            </MapContainer>
        </div>
    );
};

export default EnhancedTrainMap;
