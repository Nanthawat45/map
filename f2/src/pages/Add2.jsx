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
import { useLocation, useNavigate, Link } from "react-router-dom"; // นำเข้า Link
const base_url = import.meta.env.VITE_BASE_URL; // ค่าจาก .env

const Edit = () => {
  const location = useLocation();
  const { store } = location.state || {};
  const navigate = useNavigate();

  const center = [13.838487865712025, 100.02534086066446]; // SE NPRU
  const [myLocation, setMyLocation] = useState({ lat: store.lat || "", lng: store.lng || "" });
  const [newStore, setNewStore] = useState({
    id: store.id || "",
    name: store.name || "",
    address: store.address || "",
    direction: store.direction || "",
    lat: store.lat || "",
    lng: store.lng || "",
    radius: store.radius || "",
  });

  useEffect(() => {
    if (!store) {
      Swal.fire({
        title: "Error!",
        text: "Store data not found.",
        icon: "error",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/"); // Redirect to home or another page
      });
    }
  }, [store, navigate]);

  const housingIcon = new Icon({
    iconUrl: "https://img.icons8.com/plasticine/100/exterior.png",
    iconSize: [38, 45],
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
      await CourseService.updateStore(
        newStore.id,
        newStore.name,
        newStore.address,
        newStore.direction,
        newStore.lat,
        newStore.lng,
        newStore.radius
      );

      Swal.fire({
        title: "Success!",
        text: `Store "${newStore.name}" has been updated.`,
        icon: "success",
        confirmButtonText: "OK",
      });

      navigate("/"); // Redirect to home or another page after success
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
        <button type="submit" className="btn btn-outline btn-accent">Update Store</button>
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

          <Marker position={[newStore.lat, newStore.lng]} icon={housingIcon}>
            <Popup>
              <p>{newStore.name}</p>
              <p>{newStore.address}</p>
              <a href={newStore.direction}>Get Direction</a>
            </Popup>
          </Marker>

          {myLocation.lat && myLocation.lng && <Locationmap />}
        </MapContainer>
      </div>

      <Link to="/" className="btn btn-outline btn-secondary">Back to Home</Link>
    </div>
  );
};

export default Edit;
