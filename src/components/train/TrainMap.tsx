import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
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
}

// Component to auto-center map when coordinates change
const MapUpdater = ({ lat, lng }: { lat: number; lng: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng], map.getZoom());
    }, [lat, lng, map]);
    return null;
};

const TrainMap = ({ lat, lng, trainName }: TrainMapProps) => {
    return (
        <div className="h-[300px] w-full rounded-lg overflow-hidden border shadow-sm relative z-0">
            <MapContainer
                center={[lat, lng]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lng]}>
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
