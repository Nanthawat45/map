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
  const center = [13.838487865712025, 100.02534086066446]; // SE NPRU
  const [stores, setStores] = useState([]);
  const [myLocation, setMyLocation] = useState({ lat: "", lng: "" });
  const [deliveryZone, setDeliveryZone] = useState({
    lat: 13.82804643,
    lng: 100.04233271,
    radius: 1000,
  });
  const [selectedStore, setSelectedStore] = useState(null);

  const defaultIcon = new Icon({
    iconUrl: "https://img.icons8.com/?size=100&id=65006&format=png&color=000000",//
    iconSize: [38, 45], // ขนาดของไอคอน
  });

  // function to calculate distance between 2 points using Haversine Formula
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3; // Earth radius in meters
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
    return R * c; // Distance in meters
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

  const housingIcon = new Icon({
    iconUrl: "https://img.icons8.com/?size=100&id=42814&format=png&color=000000",
    iconSize: [38, 45], // size of the icon 
  });

  const Locationmap = () => {
    useMapEvent({
      click(e) {
        const { lat, lng } = e.latlng;
        setMyLocation({ lat, lng });
        console.log("Click at latitude:" + lat + " longitude:" + lng);
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

  const selectedIcon = new Icon({
    iconUrl: "https://img.icons8.com/?size=100&id=77111&format=png&color=000000",//
  });

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setMyLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  };

  const handleAddStore = async () => {
    if (myLocation.lat === "" || myLocation.lng === "") {
      Swal.fire({
        title: "Error!",
        text: "Please select a valid location to add a store.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const newStore = {
      name: "New Store", // คุณสามารถปรับให้เป็นชื่อที่ต้องการ
      address: "New Address", // ปรับให้เป็นที่อยู่ที่ต้องการ
      lat: myLocation.lat,
      lng: myLocation.lng,
      direction: "New Direction", // ปรับให้เป็นลิงค์สำหรับการนำทาง
    };

    try {
      const response = await axios.post(base_url + "/api/stores", newStore);
      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Store Added",
          text: "The store has been successfully added.",
          confirmButtonText: "OK",
        });
        // Update the store list after adding a new store
        setStores((prevStores) => [...prevStores, response.data]);
      }
    } catch (error) {
      console.error("Error adding store:", error);
      Swal.fire({
        title: "Error!",
        text: "There was an error adding the store.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
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
    if (!deliveryZone.lat || !deliveryZone.lng) {
      Swal.fire({
        title: "Error !",
        text: "Please enter your valid location",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    
    const nearbyStores = stores.filter(store => {
      const distance = calculateDistance(
        myLocation.lat,
        myLocation.lng,
        store.lat,
        store.lng
      );
      return distance <= deliveryZone.radius; // ตรวจสอบว่าร้านค้าอยู่ใน radius หรือไม่
    });

    if (nearbyStores.length > 0) {
      const storeNames = nearbyStores.map(store => store.name).join(", ");
      Swal.fire({
        icon: "success",
        title: "Nearby Stores",
        text: `You have the following stores in the delivery zone: ${storeNames}`,
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "No Stores Found",
        text: "There are no stores within the delivery zone.",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div>
      <h1>Store Delivery Zone Checker</h1>
      <button
        className="btn btn-outline btn-primary"
        onClick={handleGetLocation}
      >
        Get My Location
      </button>
      <button
        className="btn btn-outline btn-accent"
        onClick={handleLocationCheck}
      >
        Check Delivery Availability
      </button>
      <button
        className="btn btn-outline btn-secondary"
        onClick={handleAddStore}
      >
        Add Store at My Location
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

          {/**Display all stores on map */}
          {stores &&
            stores.map((store) => {
              return (
                <Marker 
                  position={[store.lat, store.lng]} 
                  key={store.id}
                  icon={selectedStore === store.id ? selectedIcon : defaultIcon} // เปลี่ยนสีไอคอนตามร้านที่เลือก
                  eventHandlers={{
                    click: () => {
                      setDeliveryZone({
                        lat: store.lat,
                        lng: store.lng,
                        radius: 700, // สามารถปรับ radius ได้
                      });
                      setSelectedStore(store.id); // ตั้งค่าให้ร้านค้าที่ถูกเลือก
                    },
                  }}
                >
                  <Popup>
                    <p>{store.name}</p>
                    <p>{store.address}</p>
                    <a href={store.direction}>Get Direction</a>
                  </Popup>
                </Marker>
              );
            })}
          {myLocation.lat && myLocation.lng && <Locationmap />}
        </MapContainer>
      </div>
    </div>
  );
};

export default App;
