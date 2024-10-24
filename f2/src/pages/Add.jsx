import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvent,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Swal from "sweetalert2";
import { Icon } from "leaflet";
import CourseService from "../services/Map.services"; // import CourseService
import { useLocation } from "react-router-dom";
const base_url = import.meta.env.VITE_BASE_URL; // ค่าจาก .env

const Add = () => {
  const location = useLocation();
  const { store } = location.state || {};

  const center = [13.838487865712025, 100.02534086066446]; // SE NPRU
  const [stores, setStores] = useState([]);
  const [myLocation, setMyLocation] = useState({ lat: "", lng: "" });
  const [selectedStore, setSelectedStore] = useState(null);
  const [newStore, setNewStore] = useState({
    name: "",
    address: "",
    direction: "",
    lat: "",
    lng: "",
    radius: "",
  });
  

  // ฟังก์ชันเพิ่มสโตร์
  const onAddStore = (store) => {
    setStores((prevStores) => [...prevStores, store]); // อัปเดต state
  };

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await CourseService.getAllCourse(); // ใช้ getAllCourse จาก Service
        console.log(response.data);
        if (response.status === 200) {
          if (Array.isArray(response.data)) {
            setStores(response.data);
          } else {
            setStores([]); // Default empty array
          }
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
        setStores([]); // Default empty array on error
      }
    };
    fetchStore();
  }, []);

  const housingIcon = new Icon({
    iconUrl: "https://img.icons8.com/plasticine/100/exterior.png",
    iconSize: [38, 45],
  });

  const selectedIcon = new Icon({
    iconUrl: "https://img.icons8.com/?size=100&id=21240&format=png&color=000000",
    iconSize: [25, 26],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const Locationmap = () => {
    useMapEvent({
      click(e) {
        const { lat, lng } = e.latlng;
        setNewStore({ ...newStore, lat, lng }); // Update lat, lng when user clicks
        setMyLocation({ lat, lng });
        console.log("Clicked at lat: " + lat + ", lng: " + lng);
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (newStore.lat === "" || newStore.lng === "") {
      Swal.fire({
        title: "Error!",
        text: "Please select a location on the map.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      // เรียกใช้งาน addstore จาก CourseService เพื่อเพิ่มข้อมูลใหม่
      await CourseService.addstore(
        newStore.name,
        newStore.address,
        newStore.direction,
        newStore.lat,
        newStore.lng,
        newStore.radius
      );

      onAddStore(newStore); // เรียกใช้ฟังก์ชันที่เพิ่มร้านใน state

      Swal.fire({
        title: "Success!",
        text: `Store "${newStore.name}" has been added.`,
        icon: "success",
        confirmButtonText: "OK",
      });

      // รีเซ็ตฟอร์ม
      setNewStore({
        name: "",
        address: "",
        direction: "",
        lat: "",
        lng: "",
        radius: "",
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to add the store.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error adding store:", error);
    }
  };

  return (
    <div>
      <button className="btn btn-outline btn-primary" onClick={handleGetLocation}>
        Get My Location
      </button>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Store Name"
          value={newStore.name}
          onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={newStore.address}
          onChange={(e) =>
            setNewStore({ ...newStore, address: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Direction"
          value={newStore.direction}
          onChange={(e) =>
            setNewStore({ ...newStore, direction: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="Radius (meters)"
          value={newStore.radius}
          onChange={(e) =>
            setNewStore({ ...newStore, radius: e.target.value })
          }
          required
        />
        <p>
          Latitude: {newStore.lat || "Click on the map to select"} | Longitude:{" "}
          {newStore.lng || "Click on the map to select"}
        </p>
        <button type="submit" className="btn btn-outline btn-accent">Add Store</button>
      </form>

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

          {stores &&
            stores.map((store) => (
              <Marker
                position={[store.lat, store.lng]}
                key={store.id} // ตรวจสอบว่ามี key ที่ unique
                icon={selectedStore === store.id ? selectedIcon : housingIcon}
                eventHandlers={{
                  click: () => {
                    setSelectedStore(store.id);
                    Swal.fire({
                      title: "Store Selected",
                      text: `You have selected ${store.name} as your delivery zone.`,
                      icon: "info",
                      confirmButtonText: "OK",
                    });
                  },
                }}
              >
                <Popup>
                  <p>{store.name}</p>
                  <p>{store.address}</p>
                  <a href={store.direction}>Get Direction</a>
                </Popup>
              </Marker>
            ))}

          {myLocation.lat && myLocation.lng && <Locationmap />}
        </MapContainer>
      </div>
    </div>
  );
};

export default Add;
