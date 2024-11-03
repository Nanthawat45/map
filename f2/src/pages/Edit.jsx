import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Swal from "sweetalert2";
import { Icon } from "leaflet";
import CourseService from "../services/Map.services"; // นำเข้า CourseService
import { useLocation, useParams } from "react-router-dom"; // นำเข้า useParams

const Edit = () => {
  const { id } = useParams(); // ดึง store.id จาก URL
  const [store, setStore] = useState({});
  const [myLocation, setMyLocation] = useState({ lat: "", lng: "" });
  const [newStore, setNewStore] = useState({
    name: "",
    address: "",
    direction: "",
    lat: "",
    lng: "",
    radius: "",
  });

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await CourseService.getCourseById(id); // เรียกใช้ฟังก์ชัน getCourseById
        setStore(response.data); // สมมุติว่า response.data เป็นข้อมูลร้านค้า
      } catch (error) {
        console.error("Error fetching store:", error);
      }
    };

    fetchStore();
  }, [id]); // เรียกใช้เมื่อ id เปลี่ยนแปลง

  useEffect(() => {
    if (store) {
      // ตั้งค่าข้อมูลเก่าของร้านค้าให้กับ newStore
      setNewStore({
        name: store.name || "",
        address: store.address || "",
        direction: store.direction || "",
        lat: store.lat || "",
        lng: store.lng || "",
        radius: store.radius || "",
      });
      setMyLocation({ lat: store.lat || "", lng: store.lng || "" });
    }
  }, [store]);

  const housingIcon = new Icon({
    iconUrl: "https://img.icons8.com/?size=100&id=2797&format=png&color=000000",
    iconSize: [30, 30], // size of the icon
    iconAnchor: [19, 30], // ปรับตำแหน่ง anchor
  });

  const Locationmap = () => {
    useMapEvent({
      click(e) {
        const { lat, lng } = e.latlng;
        setNewStore({ ...newStore, lat, lng });
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
      setNewStore((prevStore) => ({
        ...prevStore,
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }));
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!newStore.name || !newStore.address || !newStore.direction) {
      Swal.fire({
        title: "Error!",
        text: "Store information is missing.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const response = await CourseService.editCourse(id, newStore); // ใช้ id ในการอัปเดต
      console.log('Response from API:', response); // log response from API
      Swal.fire({
        title: "Success!",
        text: "Store updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to update the store.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error updating store:", error);
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
          onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Direction"
          value={newStore.direction}
          onChange={(e) => setNewStore({ ...newStore, direction: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Radius (meters)"
          value={newStore.radius}
          onChange={(e) => setNewStore({ ...newStore, radius: e.target.value })}
          required
        />
        <p>
          Latitude: {newStore.lat || "Click on the map to select"} | Longitude:{" "}
          {newStore.lng || "Click on the map to select"}
        </p>
        <button type="submit" className="btn btn-outline btn-accent">Update Store</button>
      </form>

      <div>
        <MapContainer
          center={[myLocation.lat || 13.838487865712025, myLocation.lng || 100.02534086066446]} // ค่าเริ่มต้น
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "75vh", width: "100vw" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {myLocation.lat && myLocation.lng && <Locationmap />}
        </MapContainer>
      </div>
    </div>
  );
};

export default Edit;