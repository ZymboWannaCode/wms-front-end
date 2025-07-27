import { useEffect, useRef, useState } from "react";
import { API_LINK, FILE_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import Label from "../../part/Label";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";

export default function MasterRackDetail({ onChangePage, withID }) {
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);

  const formDataRef = useRef({
    Key: "",
    Name: "",
    Zone: "",
    ZoneId: "",
    "Capacity/slot": "",
    Row: [],
    Column: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));

      try {
        const data = await UseFetch(API_LINK + "MasterRack/GetDataRackById", {
          id: withID,
        });

        if (data === "ERROR" || data.length === 0) {
          throw new Error("Terjadi kesalahan: Gagal mengambil data proses.");
        } else {
          const rak = data[0];
          formDataRef.current.Key = rak.Key;
          formDataRef.current.Name = rak.Name;
          formDataRef.current.Zone = rak.Zone;
          formDataRef.current["Capacity/slot"] = rak["Capacity/slot"];

          const row = [...new Set(data.map((item) => item.Row))];
          const col = [...new Set(data.map((item) => item.Column))];
          formDataRef.current.Row = row;
          formDataRef.current.Column = col;
        }
      } catch (error) {
        window.scrollTo(0, 0);
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <>
      {isError.error && (
        <div className="flex-fill">
          <Alert type="danger" message={isError.message} />
        </div>
      )}
      <div className="card">
        <div className="card-header bg-primary fw-medium text-white">
          Detail Data Rack
        </div>
        <div className="card-body p-4">
          <div className="row">
            <div className="col-lg-3">
              <Label
                forLabel="Name"
                title="Name"
                data={formDataRef.current.Name}
              />
            </div>
            <div className="col-lg-3">
              <Label
                forLabel="Zone"
                title="Zone"
                data={formDataRef.current.Zone}
              />
            </div>
            <div className="col-lg-3">
              <Label
                forLabel="Capacity/slot"
                title="Capacity/slot"
                data={formDataRef.current["Capacity/slot"]}
              />
            </div>
            <hr className="my-3" />

            <div className="col-lg-12">
              <div className="overflow-x-auto">
                <div className="flex-fill">
                  <table className="table table-bordered border border-primary">
                    <thead>
                      <tr>
                        <th className="text-center">
                          {formDataRef.current.Name}
                        </th>
                        {formDataRef.current.Column.map((column, colIndex) => (
                          <th className="text-center" key={colIndex}>
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {formDataRef.current.Row.map((rowItem, rowIndex) => (
                        <tr key={rowIndex} className="text-center">
                          <th>{rowItem}</th>
                          {formDataRef.current.Column.map(
                            (colItem, colIndex) => (
                              <td
                                className="font-monospace"
                                key={colIndex}
                              >{`${colItem}-${rowItem}`}</td>
                            )
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="float-end my-4 mx-1">
        <Button
          classType="secondary px-4 py-2"
          label="KEMBALI"
          onClick={() => onChangePage("index")}
        />
      </div>
    </>
  );
}
