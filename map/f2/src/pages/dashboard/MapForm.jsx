import { useState } from "react";
import { useFinancialRecord } from "../../contexts/financial.contexts";
import { useUser } from "@clerk/clerk-react";

const MapForm = () => {
  const [mapData, setMapData] = useState({
    name: "",
    address: "",
    direction: "",
  });

  const { addRecord } = useFinancialRecord(); // ใช้ฟังก์ชัน addRecord จาก context
  const { user } = useUser(); // ใช้ข้อมูล user จาก Clerk

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงของ input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMapData({ ...mapData, [name]: value });
  };

  // ฟังก์ชันสำหรับจัดการการส่งฟอร์ม
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addRecord(mapData); // เพิ่มข้อมูล mapData
      setMapData({ name: "", address: "", direction: "" }); // รีเซ็ตฟอร์มหลังการบันทึก
    } catch (error) {
      console.error("Failed to add record:", error);
    }
  };

  // เช็คบทบาทของผู้ใช้
  const isAdminOrModerator = user && (user.publicMetadata.role === 'admin' || user.publicMetadata.role === 'moderator');

  return (
    <div>
      {isAdminOrModerator && (
        <form className="space-y-2" onSubmit={handleSubmit}>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Name</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              name="name"
              value={mapData.name}
              onChange={handleChange}
              className="input input-bordered w-full max-w-xs"
            />
          </label>

          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Address</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              name="address"
              value={mapData.address}
              onChange={handleChange}
              className="input input-bordered w-full max-w-xs"
            />
          </label>

          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Direction</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              name="direction"
              value={mapData.direction}
              onChange={handleChange}
              className="input input-bordered w-full max-w-xs"
            />
          </label>

          <button type="submit" className="btn btn-primary w-full max-w-xs">
            Add Map Data
          </button>
        </form>
      )}
      {!isAdminOrModerator && (
        <p>You do not have permission to add map data.</p>
      )}
    </div>
  );
};

export default MapForm;
