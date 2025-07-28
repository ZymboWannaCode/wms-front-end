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

export default function MasterCategoryAdd({ onChangePage }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const formDataRef = useRef({
    categoryName: "",
    categoryDesription: "",
  });

  const userSchema = object({
    categoryName: string()
      .max(100, "maksimum 50 karakter")
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const validationError = validateInput(name, value, userSchema);
    formDataRef.current[name] = value;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [validationError.name]: validationError.error,
    }));
  };

  // const handleFileChange = (ref, extAllowed) => {
  //   const { name, value } = ref.current;
  //   const file = ref.current.files[0];
  //   const fileName = file.name;
  //   const fileSize = file.size;
  //   const fileExt = fileName.split(".").pop().toLowerCase();
  //   const validationError = validateInput(name, value, userSchema);
  //   let error = "";

  //   if (fileSize / 1024576 > 10) error = "berkas terlalu besar";
  //   else if (!extAllowed.split(",").includes(fileExt))
  //     error = "format berkas tidak valid";

  //   if (error) ref.current.value = "";

  //   setErrors((prevErrors) => ({
  //     ...prevErrors,
  //     [validationError.name]: error,
  //   }));
  // };

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
          API_LINK + "MasterCategory/CreateCategory",
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
            Tambah Data Category Baru
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-3">
                <Input
                  type="text"
                  forInput="categoryName"
                  label="Category Name"
                  isRequired
                  value={formDataRef.current.categoryName}
                  onChange={handleInputChange}
                  errorMessage={errors.categoryName}
                />
              </div>
              <div className="col-lg-9">
                <Input
                  type="text"
                  forInput="categoryDescription"
                  label="Description"
                  isRequired
                  value={formDataRef.current.categoryDesription}
                  onChange={handleInputChange}
                  errorMessage={errors.categoryDescription}
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
