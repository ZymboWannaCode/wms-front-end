import { useEffect, useRef, useState } from "react";
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

export default function MasterRoleAdd({ onChangePage }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const formDataRef = useRef({
    id: "",
    RoleName: "",
    Description: "",
  });

  const userSchema = object({
    id: string().max(5, "maksimum 5 karakter").required("harus diisi"),
    RoleName: string().max(30, "maksimum 5 karakter").required("harus diisi"),
    Description: string()
      .max(100, "maksimum 100 karakter")
      .required("harus diisi"),
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      setIsLoading(true);

      try {
        const data = await UseFetch(API_LINK + "MasterRole/GetLastRoleId", {});

        if (data === "ERROR" || data.length === 0) {
          throw new Error("Terjadi kesalahan: Gagal mengambil data role.");
        } else {
          console.log(generateNextId(data[0].id, "ROL", 2));
          formDataRef.current = {
            ...formDataRef,
            id: generateNextId(data[0].id, "ROL", 2),
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

    fetchData();
  }, []);

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
      {
        id: formDataRef.current.id.trim(),
        RoleName: formDataRef.current.RoleName.trim(),
        Description: formDataRef.current.Description,
      },
      userSchema,
      setErrors
    );

    if (Object.values(validationErrors).every((error) => !error)) {
      setIsLoading(true);
      setIsError((prevError) => ({ ...prevError, error: false }));
      setErrors({});

      try {
        const data = await UseFetch(API_LINK + "MasterRole/CreateRole", {
          id: formDataRef.current.id.trim(),
          RoleName: formDataRef.current.RoleName.trim(),
          Description: formDataRef.current.Description,
        });

        if (data === "ERROR") {
          throw new Error("Terjadi kesalahan: Gagal menyimpan data role.");
        } else {
          SweetAlert("Sukses", "Data role berhasil disimpan", "success");
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
            Ubah Data role
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-3">
                <Input
                  type="text"
                  forInput="id"
                  label="Role"
                  isRequired
                  isDisabled
                  value={formDataRef.current.id}
                  onChange={handleInputChange}
                  errorMessage={errors.id}
                />
              </div>
              <div className="col-lg-4">
                <Input
                  type="text"
                  forInput="RoleName"
                  label="Role Name"
                  isRequired
                  value={formDataRef.current.RoleName}
                  onChange={handleInputChange}
                  errorMessage={errors.RoleName}
                />
              </div>
              <div className="col-lg-5">
                <Input
                  type="text"
                  forInput="Description"
                  label="Description"
                  isRequired
                  value={formDataRef.current.Description}
                  onChange={handleInputChange}
                  errorMessage={errors.Description}
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
