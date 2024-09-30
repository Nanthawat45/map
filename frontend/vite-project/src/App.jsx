import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvent,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import "./App.css";
const base_url = import.meta.env.VITE_API_BASE_URL;

const App = () => {
  const center = [13.838487865712025, 100.02534086066446]; //SE NPRU
  const [stores, setStores] = useState([]);
  const [mylocation, setMylocation] = useState({ lat: "", lng: "" });
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await axios.get(base_url + "/api/stores");
        console.log(response.data);
        if (response.status === 200) {
          setStores(response.data);
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };
    fetchStore();
  }, []);

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setMylocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  };

  return (
    <div>
      <h1>Store Dalivery Zone Checker</h1>
      <button onClick={handleGetLocation}>Get My location</button>
      <div>
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "75vh", width: "100vw" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/**Display My Location */}
          <Marker position={[mylocation.lat, mylocation.lng]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>

          {/**Display all stores on map */}
          {stores &&
            stores.map((store) => {
              return (
                <Marker position={[store.lat, store.lng]}>
                  <Popup>
                    <p>{store.name}</p>
                    <p>{store.address}</p>
                    <a href={store.direction}>Get Direction</a>
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      </div>
    </div>
  );
};

export default App;
