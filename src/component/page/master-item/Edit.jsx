import { useEffect, useState } from "react";
import { API_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import { useNavigate, useParams } from "react-router-dom";

export default function MasterItemEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await UseFetch(API_LINK + `MasterItem/GetItemById/${id}`, {});
      if (result !== "ERROR") setFormData(result);
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await UseFetch(API_LINK + "MasterItem/EditItem", {
      method: "PUT",
      body: JSON.stringify({
        ...formData,
        itm_modif_by: "admin",
        itm_modif_date: new Date().toISOString(),
      }),
    });
    if (result !== "ERROR") navigate("/item");
  };

  if (!formData) return <div>Loading...</div>;

  return (
    <div>
      <h4 className="fw-bold mb-3">Edit Item</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nama Item</label>
          <input
            type="text"
            className="form-control"
            value={formData.itm_name}
            onChange={(e) => setFormData({ ...formData, itm_name: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label>Deskripsi</label>
          <textarea
            className="form-control"
            value={formData.itm_desc}
            onChange={(e) => setFormData({ ...formData, itm_desc: e.target.value })}
          ></textarea>
        </div>
        <div className="mb-3">
          <label>UOM</label>
          <input
            type="text"
            className="form-control"
            value={formData.itm_uom}
            onChange={(e) => setFormData({ ...formData, itm_uom: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label>Status</label>
          <select
            className="form-control"
            value={formData.itm_status}
            onChange={(e) => setFormData({ ...formData, itm_status: e.target.value })}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <button type="submit" className="btn btn-success">
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}