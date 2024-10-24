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
import Maps from "./services/Map.services"
const base_url = import.meta.env.VITE_BASE_URL; // ค่าจาก .env
import Edit from "./pages/Add2"
import Swal from "sweetalert2";
import { Icon } from "leaflet";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(true);
  const center = [13.838487865712025, 100.02534086066446]; // SE NPRU
  const [stores, setStores] = useState([]);
  const [myLocation, setMyLocation] = useState({ lat: "", lng: "" });
  const [deliveryZone, setDeliveryZone] = useState({
    lat: 13.82804643,
    lng: 100.04233271,
    radius: 1000,
  });
  const [selectedStore, setSelectedStore] = useState(null);
  const [newStore, setNewStore] = useState({
    name: "",
    address: "",
    direction: "",
    lat: "",
    lng: "",
    radius: "",
  });

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
        const response = await axios.get(base_url + "/api/v1/maps"); // เปลี่ยนไปใช้ API ของคุณ
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
    iconSize: [38, 45], // size of the icon
  });

  const defaultIcon = new Icon({
    iconUrl: "https://img.icons8.com/plasticine/100/exterior.png",
    iconSize: [38, 45], // ขนาดของไอคอน
  });

  const selectedIcon = new Icon({
    iconUrl:
      "https://img.icons8.com/?size=100&id=21240&format=png&color=000000",
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
  

  const handleDelete = async (id) => {
    try {
      const response = await Maps.deleteCourse(id);
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: response.data.message,
          position: "center",
          timer: 7000,
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error Deleting Course",
        text: error?.response?.data?.message || "Something went wrong!",
        timer: 1500,
      });
    }
  };
  
  
  // ฟังก์ชันลบร้านค้า
  const handleDeleteStore = async (id) => {
    const response = await StoreService.deletestore(id);
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    const handleEditStore = (store) => {
      // ส่ง store ไปยัง Add เพื่อทำการแก้ไข
      navigate("/add", { state: { store } });
    };

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
          key={store.id}
          icon={selectedStore === store.id ? selectedIcon : defaultIcon}
          eventHandlers={{
            click: () => {
              setDeliveryZone({
                lat: store.lat,
                lng: store.lng,
                radius: store.radius,
              });
              setSelectedStore(store.id);
            },
          }}
        >
          <Popup>
            <p>{store.name}</p>
            <p>{store.address}</p>
            <a href={store.direction}>Get Direction</a>
            {isAdmin && ( // ตรวจสอบว่าเป็น admin หรือไม่
              <>
                <button onClick={() => handleEditStore(store)} className="btn btn-warning">
                  Edit Store
                </button>
                <button onClick={() => handleDelete(store.id)} className="btn btn-danger">
                  Delete Store
                </button>
              </>
            )}
          </Popup>
        </Marker>
      ))}
          {myLocation.lat && myLocation.lng && <Locationmap />}
        </MapContainer>
      </div>
    </div>
  );
};

export default App;