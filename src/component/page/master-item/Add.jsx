import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";

export default function MasterItemAdd() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    itm_name: "",
    itm_desc: "",
    itm_uom: "",
    itm_category_id: "",
    itm_status: "Active",
  });

  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const payload = {
        p1: "1",
        p2: "",
        p3: "cat_name",
        p4: "1",
        p5: "", p6: "", p7: "", p8: "", p9: "", p10: "",
        p11: "", p12: "", p13: "", p14: "", p15: "",
        p16: "", p17: "", p18: "", p19: "", p20: "",
        p21: "", p22: "", p23: "", p24: "", p25: "",
        p26: "", p27: "", p28: "", p29: "", p30: "",
        p31: "", p32: "", p33: "", p34: "", p35: "",
        p36: "", p37: "", p38: "", p39: "", p40: "",
        p41: "", p42: "", p43: "", p44: "", p45: "",
        p46: "", p47: "", p48: "", p49: "", p50: ""
      };

      const response = await UseFetch(API_LINK + "MasterCategory/GetDataCategory", payload, "POST");

      if (Array.isArray(response)) {
        setCategoryList(response);
        console.log("Category list:", response);
      } else {
        console.error("Failed to load categories:", response);
        setCategoryList([]);
      }
    };

    fetchCategories();
  }, []);

  const uomOptions = ["PCS", "BOX", "KG", "LITER"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      itm_create_by: "admin",
      itm_create_date: new Date().toISOString(),
    };
    const result = await UseFetch(API_LINK + "MasterItem/CreateItem", payload, "POST");
    if (result !== "ERROR") navigate("/item");
  };

  return (
    <div>
      <h4 className="fw-bold mb-3">Tambah Item</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nama Item</label>
          <input
            type="text"
            className="form-control"
            placeholder="Masukkan nama item"
            value={formData.itm_name}
            onChange={(e) => setFormData({ ...formData, itm_name: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label>Deskripsi</label>
          <textarea
            className="form-control"
            placeholder="Masukkan deskripsi item"
            value={formData.itm_desc}
            onChange={(e) => setFormData({ ...formData, itm_desc: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label>UOM</label>
          <select
            className="form-control"
            value={formData.itm_uom}
            onChange={(e) => setFormData({ ...formData, itm_uom: e.target.value })}
            required
          >
            <option value="">Pilih UOM</option>
            {uomOptions.map((uom, idx) => (
              <option key={idx} value={uom}>
                {uom}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>Kategori</label>
          <select
            className="form-control"
            value={formData.itm_category_id}
            onChange={(e) => setFormData({ ...formData, itm_category_id: e.target.value })}
            required
          >
            <option disabled value="">Pilih Kategori</option>
            {categoryList.map((cat) => (
              <option key={cat.cat_id} value={cat.cat_id}>
                {cat.cat_name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Simpan
        </button>
      </form>
    </div>
  );
}
