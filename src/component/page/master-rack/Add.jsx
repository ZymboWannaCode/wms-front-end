import { useEffect, useRef, useState } from "react";
import { number, object, string } from "yup";
import { API_LINK } from "../../util/Constants";
import { validateAllInputs, validateInput } from "../../util/ValidateForm";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import UploadFile from "../../util/UploadFile";
import Button from "../../part/Button";
import Input from "../../part/Input";
import FileUpload from "../../part/FileUpload";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";
import DropDown from "../../part/Dropdown";

export default function MasterRackAdd({ onChangePage }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [listZone, setListZone] = useState({});

  const formDataRef = useRef({
    namaRack: "",
    zoneRack: "",
    capacity: 1,
    baris: 1,
    kolom: 1,
  });

  const fileModulRef = useRef(null);

  const userSchema = object({
    namaRack: string()
      .max(100, "maksimum 100 karakter")
      .required("harus diisi"),
    zoneRack: string()
      .max(100, "maksimum 100 karakter")
      .required("harus diisi"),
    capacity: number(),
    baris: number(),
    kolom: number(),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const validationError = validateInput(name, value, userSchema);
    formDataRef.current[name] = value;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [validationError.name]: validationError.error,
    }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    const validationErrors = await validateAllInputs(
      formDataRef.current,
      userSchema,
      setErrors
    );

    if (Object.values(validationErrors).every((error) => !error)) {
      setIsLoading(true);
      setIsError((prevError) => ({ ...prevError, error: false }));
      setErrors({});

      try {
        const data = await UseFetch(
          API_LINK + "MasterRack/CreateRack",
          formDataRef.current
        );

        if (data === "ERROR") {
          throw new Error("Terjadi kesalahan: Gagal menyimpan data proses.");
        } else {
          SweetAlert("Sukses", "Data proses berhasil disimpan", "success");
          onChangePage("index");
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
    } else window.scrollTo(0, 0);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));

      try {
        const data = await UseFetch(API_LINK + "MasterZone/GetListZone", {});

        if (data === "ERROR") {
          throw new Error("Terjadi kesalahan: Gagal mengambil daftar role.");
        } else {
          setListZone(data);
          window.scrollTo(0, 0);
        }
      } catch (error) {
        window.scrollTo(0, 0);
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
        setListZone({});
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
      <form onSubmit={handleAdd}>
        <div className="card">
          <div className="card-header bg-primary fw-medium text-white">
            Tambah Data Rack Baru
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-6">
                <Input
                  type="text"
                  forInput="namaRack"
                  label="Name"
                  isRequired
                  value={formDataRef.current.namaRack}
                  onChange={handleInputChange}
                  errorMessage={errors.namaRack}
                />
              </div>
              <div className="col-lg-6">
                <DropDown
                  forInput="zoneRack"
                  label="Zone"
                  arrData={listZone}
                  isRequired
                  value={formDataRef.current.zoneRack}
                  onChange={handleInputChange}
                  errorMessage={errors.zoneRack}
                />
              </div>
              <div className="col-lg-4">
                <Input
                  type="number"
                  forInput="capacity"
                  label="Capacity per slot"
                  isRequired
                  value={formDataRef.current.capacity}
                  onChange={handleInputChange}
                  errorMessage={errors.capacity}
                />
              </div>
              <div className="col-lg-4">
                <Input
                  type="number"
                  forInput="baris"
                  label="Total Row"
                  isRequired
                  value={formDataRef.current.baris}
                  onChange={handleInputChange}
                  errorMessage={errors.baris}
                />
              </div>
              <div className="col-lg-4">
                <Input
                  type="number"
                  forInput="kolom"
                  label="Total Column"
                  isRequired
                  value={formDataRef.current.kolom}
                  onChange={handleInputChange}
                  errorMessage={errors.kolom}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="float-end my-4 mx-1">
          <Button
            classType="secondary me-2 px-4 py-2"
            label="BATAL"
            onClick={() => onChangePage("index")}
          />
          <Button
            classType="primary ms-2 px-4 py-2"
            type="submit"
            label="SIMPAN"
          />
        </div>
      </form>
    </>
  );
}
