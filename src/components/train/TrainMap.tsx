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

interface TrainMapProps {
    lat: number;
    lng: number;
    trainName: string;
    route?: { lat: number; lng: number; name: string }[];
}

// Component to auto-center map when coordinates change
const MapUpdater = ({ lat, lng }: { lat: number; lng: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng], map.getZoom());
    }, [lat, lng, map]);
    return null;
};

const TrainMap = ({ lat, lng, trainName, route = [] }: TrainMapProps) => {
    const polylinePositions = route.map(s => [s.lat, s.lng] as [number, number]);

    return (
        <div className="h-[300px] w-full rounded-lg overflow-hidden border shadow-sm relative z-0">
            <MapContainer
                center={[lat, lng]}
                zoom={10}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Route Polyline */}
                {polylinePositions.length > 0 && (
                    <Polyline
                        positions={polylinePositions}
                        pathOptions={{ color: 'blue', weight: 4 }}
                    />
                )}

                {/* Station Markers */}
                {route.map((station, idx) => (
                    <Marker key={idx} position={[station.lat, station.lng]}>
                        <Popup>
                            <div className="font-semibold">{station.name}</div>
                        </Popup>
                    </Marker>
                ))}

                {/* Current Train Marker */}
                <Marker position={[lat, lng]} zIndexOffset={1000}>
                    <Popup>
                        <div className="font-semibold">{trainName}</div>
                        <div className="text-xs">Current Location</div>
                    </Popup>
                </Marker>
                <MapUpdater lat={lat} lng={lng} />
            </MapContainer>
        </div>
    );
};

export default TrainMap;
