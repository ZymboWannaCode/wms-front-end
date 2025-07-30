import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";

export default function MasterItemDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await UseFetch(API_LINK + `MasterItem/GetItemById/${id}`, {});
      if (result !== "ERROR") setData(result);
    };
    fetchData();
  }, [id]);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h4 className="fw-bold mb-3">Detail Item</h4>
      <div className="mb-2"><strong>Nama:</strong> {data.itm_name}</div>
      <div className="mb-2"><strong>Deskripsi:</strong> {data.itm_desc}</div>
      <div className="mb-2"><strong>UOM:</strong> {data.itm_uom}</div>
      <div className="mb-2"><strong>Status:</strong> {data.itm_status}</div>
    </div>
  );
}