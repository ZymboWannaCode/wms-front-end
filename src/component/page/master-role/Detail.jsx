import { useEffect, useRef, useState } from "react";
import { API_LINK, FILE_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import Label from "../../part/Label";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";

export default function MasterRoleDetail({ onChangePage, withID }) {
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);

  const formDataRef = useRef({
    id: "",
    RoleName: "",
    Description: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));

      try {
        const data = await UseFetch(API_LINK + "MasterRole/GetDataRoleById", {
          id: withID.slice(0, 5),
        });

        if (data === "ERROR" || data.length === 0) {
          throw new Error(
            "Terjadi kesalahan: Gagal mengambil data role."
          );
        } else {
          formDataRef.current = { ...formDataRef.current, ...data[0] };
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
          Detail Data role
        </div>
        <div className="card-body p-4">
          <div className="row">
            <div className="col-lg-4">
              <Label
                forLabel="Role"
                title="Role"
                data={formDataRef.current.id}
              />
            </div>
            <div className="col-lg-4">
              <Label
                forLabel="Role Name"
                title="Role Name"
                data={formDataRef.current.RoleName}
              />
            </div>
            <div className="col-lg-4">
              <Label
                forLabel="Description"
                title="Description"
                data={formDataRef.current.Description}
              />
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
