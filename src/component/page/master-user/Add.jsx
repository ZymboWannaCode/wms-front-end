import { useRef, useState, useEffect } from "react";
import { object, string } from "yup";
import { API_LINK } from "../../util/Constants";
import { validateAllInputs, validateInput } from "../../util/ValidateForm";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import UploadFile from "../../util/UploadFile";
import Button from "../../part/Button";
import DropDown from "../../part/Dropdown";
import Input from "../../part/Input";
import FileUpload from "../../part/FileUpload";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";
import { generateNextId } from "../../util/Formatting";

const listJenisUser = [
  { Value: "Alat", Text: "Alat" },
  { Value: "Mesin", Text: "Mesin" },
  { Value: "Perangkat Lunak", Text: "Perangkat Lunak" },
  { Value: "Lainnya", Text: "Lainnya" },
];

export default function MasterUserAdd({ onChangePage }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [listRole, setListRole] = useState({});
  const [listKaryawan, setListKaryawan] = useState({});

  const formDataRef = useRef({
    username: "",
    role: "",
    name: "",
    password: "",
  });

  const userSchema = object({
    username: string().max(30, "maksimum 30 karakter").required("harus diisi"),
    role: string().max(10, "maksimum 10 karakter").required("harus diisi"),
    name: string().max(50, "maksimum 50 karakter").required("harus diisi"),
    password: string()
      .max(300, "maksimum 300 karakter")
      .required("harus diisi"),
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

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));

      try {
        const data = await UseFetch(API_LINK + "MasterRole/GetListRole", {});

        if (data === "ERROR") {
          throw new Error("Terjadi kesalahan: Gagal mengambil daftar role.");
        } else {
          setListRole(data);
          window.scrollTo(0, 0);
        }
      } catch (error) {
        window.scrollTo(0, 0);
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
        setListRole({});
      }
    };

    fetchData();
  }, []);

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

      const encoder = new TextEncoder();
      const data = encoder.encode(formDataRef.current.password);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      formDataRef.current = { ...formDataRef.current, password: hashHex };

      try {
        const data = await UseFetch(
          API_LINK + "MasterUser/CreateUser",
          formDataRef.current
        );

        if (data === "ERROR") {
          throw new Error("Terjadi kesalahan: Gagal menyimpan data User.");
        } else {
          SweetAlert("Sukses", "Data User berhasil disimpan", "success");
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
            Tambah Data User Baru
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-6">
                <Input
                  type="text"
                  forInput="username"
                  label="Username"
                  isRequired
                  value={formDataRef.current.username}
                  onChange={handleInputChange}
                  errorMessage={errors.username}
                />
              </div>
              <div className="col-lg-6">
                <DropDown
                  forInput="role"
                  label="Role"
                  arrData={listRole}
                  isRequired
                  value={formDataRef.current.role}
                  onChange={handleInputChange}
                  errorMessage={errors.role}
                />
              </div>
              <div className="col-lg-6">
                <Input
                  type="text"
                  forInput="name"
                  label="Name"
                  isRequired
                  value={formDataRef.current.name}
                  onChange={handleInputChange}
                  errorMessage={errors.name}
                />
              </div>
              <div className="col-lg-6">
                <Input
                  type="text"
                  forInput="password"
                  label="Password"
                  isRequired
                  value={formDataRef.current.password}
                  onChange={handleInputChange}
                  errorMessage={errors.password}
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
