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
import Swal from "sweetalert2";
import { Icon } from "leaflet";

const App = () => {
  const center = [13.838487865712025, 100.02534086066446]; //SE NPRU
  const [stores, setStores] = useState([]);
  const [myLocation, setMyLocation] = useState({ lat: "", lng: "" });
  const [deliveryZone, setDeliveryZone] = useState({
    lat: 13.82804643,
    lng: 100.04233271,
    radius: 1000,
  });
  //function to calulate calulate distance between 2 points using Haversine Formular
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3; //Eath radius in meters
    const phi_1 = (lat1 * Math.PI) / 180;
    const phi_2 = (lat2 * Math.PI) / 180;

    const delta_phi = ((lat2 - lat1) * Math.PI) / 180;
    const delta_lambda = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(delta_phi / 2) * Math.sin(delta_phi / 2) +
      Math.cos(phi_1) *
        Math.cos(phi_2) *
        Math.sin(delta_lambda / 2) *
        Math.sin(delta_lambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; //Distance in meters
  };

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
  //housingIcon;
  const housingIcon = new Icon({
    iconUrl: "https://img.icons8.com/plasticine/100/exterior.png",
    iconSize: [38, 45], // size of the icon
  });

  const Locationmap = () => {
    useMapEvent({
      click(e) {
        const { lat, lng } = e.latlng;
        setMyLocation({ lat, lng });
        console.log("Click at latitue:" + lat + "longtitue" + lng);
      },
    });
    return (
      <Marker position={[myLocation.lat, myLocation.lng]} icon={housingIcon}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    );
  };

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setMyLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  };

  const handleLocationCheck = () => {
    if (myLocation.lat === "" || myLocation.lng === "") {
      Swal.fire({
        title: "Error !",
        text: "Please enter your valid location",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    if (deliveryZone.lat === "" || deliveryZone.lng === "") {
      Swal.fire({
        title: "Error !",
        text: "Please enter your valid location",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    const distance = calculateDistance(
      myLocation.lat,
      myLocation.lng,
      deliveryZone.lat,
      deliveryZone.lng
    );
    if (distance <= deliveryZone.radius) {
      Swal.fire({
        icon: "success",
        title: "success",
        text: "You are within the delivery zone",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You are outside the delivery zone",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div>
      <h1>Store Dalivery Zone Checker</h1>
      <button
        className="btn btn-outline btn-primary"
        onClick={handleGetLocation}
      >
        Get My location
      </button>
      <button
        className="btn btn-outline btn-accent"
        onClick={handleLocationCheck}
      >
        Check Delivery Availabiliy
      </button>
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
          <Marker position={[myLocation.lat, myLocation.lng]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>

          {/**Display all stores on map */}
          {stores &&
            stores.map((store, index) => {
              return (
                <Marker
                  position={[store.lat, store.lng]}
                  key={store.id || index}
                >
                  <Popup>
                    <p>{store.name}</p>
                    <p>{store.address}</p>
                    <a href={store.direction}>Get Direction</a>
                  </Popup>
                </Marker>
              );
            })}

          <Locationmap />
        </MapContainer>
      </div>
    </div>
  );
};

export default App;
