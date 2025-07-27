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

export default function MasterZoneAdd({ onChangePage }) {
const [errors, setErrors] = useState({});
const [isError, setIsError] = useState({ error: false, message: "" });
const [isLoading, setIsLoading] = useState(false);

const formDataRef = useRef({
    nama: "",
    deskripsi: "",
});

const zoneSchema = object({
    nama: string().max(50, "maksimum 50 karakter").required("harus diisi"),
    deskripsi: string().max(200, "maksimum 200 karakter"),
});

const handleInputChange = (e) => {
    const { name, value } = e.target;
    const validationError = validateInput(name, value, zoneSchema);
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
    zoneSchema,
    setErrors
    );

    if (Object.values(validationErrors).every((error) => !error)) {
    setIsLoading(true);
    setIsError((prevError) => ({ ...prevError, error: false }));
    setErrors({});

    try {
        const data = await UseFetch(
        API_LINK + "MasterZone/CreateZone",
        formDataRef.current
        );

        if (data === "ERROR") {
        throw new Error("Terjadi kesalahan: Gagal menyimpan data Zona.");
        } else {
        SweetAlert("Sukses", "Data Zona berhasil disimpan", "success");
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
    } else{
        window.scrollTo(0, 0);
    } 
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
            Tambah Data Zona Baru
        </div>
        <div className="card-body p-4">
            <div className="row">
            <div className="col-lg-6">
                <Input
                type="text"
                forInput="nama"
                label="Nama Zona"
                isRequired
                value={formDataRef.current.nama}
                onChange={handleInputChange}
                errorMessage={errors.nama}
                />
            </div>
            <div className="col-lg-6">
                <Input
                type="text"
                forInput="deskripsi"
                label="Deskripsi"
                value={formDataRef.current.deskripsi}
                onChange={handleInputChange}
                errorMessage={errors.deskripsi}
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