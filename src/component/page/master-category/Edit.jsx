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
import Label from "../../part/Label";

export default function MasterCategoryEdit({ onChangePage, withID }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [listProvinsi, setListProvinsi] = useState({});
  const [listKabupaten, setListKabupaten] = useState({});
  const [listKecamatan, setListKecamatan] = useState({});
  const [listKelurahan, setListKelurahan] = useState({});

  const formDataRef = useRef({
    categoryID: "",
    categoryName: "",
    categoryDescription: "",
  });

  const userSchema = object({
    categoryID: string(),
    categoryName: string()
      .max(100, "maksimum 100 karakter")
      .required("harus diisi"),
    categoryDescription: string(),
  });

  const fetchDataByEndpointAndParams = async (
    endpoint,
    params,
    setter,
    errorMessage
  ) => {
    setIsError((prevError) => ({ ...prevError, error: false }));
    try {
      const data = await UseFetch(endpoint, params);
      if (data === "ERROR") {
        throw new Error(errorMessage);
      } else {
        setter(data);
      }
    } catch (error) {
      window.scrollTo(0, 0);
      setIsError((prevError) => ({
        ...prevError,
        error: true,
        message: error.message,
      }));
      setter({});
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));

      try {
        const data = await UseFetch(
          API_LINK + "MasterCategory/GetDataCategoryById",
          { id: withID }
        );

        if (data === "ERROR" || data.length === 0) {
          throw new Error("Terjadi kesalahan: Gagal mengambil data category.");
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

      // const uploadPromises = [];

      // const fileInputs = [
      //   { ref: fileNPWPRef, key: "berkasNPWPPelanggan" },
      //   { ref: fileSPPKPRef, key: "berkasSPPKPPelanggan" },
      //   { ref: fileSKTRef, key: "berkasSKTPelanggan" },
      //   { ref: fileLainRef, key: "berkasLainPelanggan" },
      // ];

      // fileInputs.forEach((fileInput) => {
      //   if (fileInput.ref.current.files.length > 0) {
      //     uploadPromises.push(
      //       UploadFile(fileInput.ref.current).then(
      //         (data) => (formDataRef.current[fileInput.key] = data.Hasil)
      //       )
      //     );
      //   }
      // });

      try {
        // await Promise.all(uploadPromises);

        const data = await UseFetch(
          API_LINK + "MasterCategory/UpdateCategory",
          formDataRef.current
        );

        if (data === "ERROR") {
          throw new Error("Terjadi kesalahan: Gagal menyimpan data category.");
        } else {
          SweetAlert("Sukses", "Data category berhasil disimpan", "success");
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
            Ubah Data Category
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-3">
                <Label
                  forLabel="categoryName"
                  title="Nama Category"
                  // data={formDataRef.current.categoryName}
                  value={formDataRef.current.categoryName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-lg-3">
                <Input
                  type="text"
                  forInput="categoryDescription"
                  label="Description"
                  isRequired
                  // isDisabled={formDataRef.current.isUsed === "Ya"}
                  value={formDataRef.current.categoryDescription}
                  onChange={handleInputChange}
                  // errorMessage={errors.categoryDescription}
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
