import axios from "axios";
import Swal from "sweetalert2";

const DeleteStore = ({ storeId, isAdmin, stores, setStores, base_url }) => {
  const handleDeleteStore = async (storeId) => {
    if (!isAdmin) {
      console.log("You are not admin"); // ตรวจสอบสิทธิ์ admin
      return;
    }

    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmed.isConfirmed) {
      try {
        console.log("Deleting store with ID:", storeId);
        await axios.delete(`${base_url}/api/v1/maps/${storeId}`);
        setStores(stores.filter((store) => store.id !== storeId));
        Swal.fire("Deleted!", "The store has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting store:", error);
        Swal.fire("Error!", "There was a problem deleting the store.", "error");
      }
    }
  };

  return (
    <>
      {isAdmin && (
        <button
          onClick={() => handleDeleteStore(storeId)}
          className="btn btn-danger"
        >
          Delete Store
        </button>
      )}
    </>
  );
};

export default DeleteStore;
