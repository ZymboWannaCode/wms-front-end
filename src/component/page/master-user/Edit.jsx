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

export default function MasterUserEdit({ onChangePage, withID }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [listRole, setListRole] = useState({});

  const formDataRef = useRef({
    Username: "",
    RoleId: "",
    Name: "",
    Password: "",
  });

  const userSchema = object({
    Username: string().max(30, "maksimum 30 karakter").required("harus diisi"),
    RoleId: string().max(10, "maksimum 10 karakter").required("harus diisi"),
    Name: string().max(50, "maksimum 50 karakter").required("harus diisi"),
    Password: string().max(300, "maksimum 300 karakter"),
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
    const fetchRole = async () => {
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
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));

      try {
        const data = await UseFetch(API_LINK + "MasterUser/GetDataUserById", {
          id: withID,
        });

        if (data === "ERROR" || data.length === 0) {
          throw new Error("Terjadi kesalahan: Gagal mengambil data user.");
        } else {
          formDataRef.current = {
            ...formDataRef.current,
            Username: data[0].Username,
            RoleId: data[0].RoleId,
            Name: data[0].Name,
            Password: "",
          };
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

    fetchRole();

    fetchData();
  }, []);

  useEffect(() => {}, []);

  const handleAdd = async (e) => {
    e.preventDefault();

    const validationErrors = await validateAllInputs(
      formDataRef.current,
      userSchema,
      setErrors
    );

    console.log(formDataRef.current);
    if (Object.values(validationErrors).every((error) => !error)) {
      setIsLoading(true);
      setIsError((prevError) => ({ ...prevError, error: false }));
      setErrors({});

      const encoder = new TextEncoder();
      const data = encoder.encode(formDataRef.current.Password);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      formDataRef.current = { ...formDataRef.current, Password: hashHex };

      try {
        const data = await UseFetch(
          API_LINK + "MasterUser/UpdateUser",
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
            Ubah Data User
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-6">
                <Input
                  type="text"
                  forInput="Username"
                  label="Username"
                  isRequired
                  isDisabled
                  value={formDataRef.current.Username}
                  onChange={handleInputChange}
                  errorMessage={errors.Username}
                />
              </div>
              <div className="col-lg-6">
                <DropDown
                  forInput="RoleId"
                  label="Role"
                  arrData={listRole}
                  isRequired
                  value={formDataRef.current.RoleId}
                  onChange={handleInputChange}
                  errorMessage={errors.RoleId}
                />
              </div>
              <div className="col-lg-6">
                <Input
                  type="text"
                  forInput="Name"
                  label="Name"
                  isRequired
                  value={formDataRef.current.Name}
                  onChange={handleInputChange}
                  errorMessage={errors.Name}
                />
              </div>
              <div className="col-lg-6">
                <Input
                  type="text"
                  forInput="Password"
                  label="Password"
                  value={formDataRef.current.Password}
                  onChange={handleInputChange}
                  errorMessage={errors.Password}
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
