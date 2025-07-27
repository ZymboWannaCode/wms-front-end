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

export default function MasterZoneEdit({ onChangePage, withID }) {
const [errors, setErrors] = useState({});
const [isError, setIsError] = useState({ error: false, message: "" });
const [isLoading, setIsLoading] = useState(true);
const [displayId, setDisplayId] = useState("");

const formDataRef = useRef({
    id: null,
    Name: "",
    Description: "",
});

const zoneSchema = object({
    id: string().required("ID zona harus diisi"),
    Name: string()
    .max(50, "Maksimum 50 karakter")
    .required("Nama zona harus diisi"),
    Description: string().max(200, "Maksimum 200 karakter"),
});

useEffect(() => {
    const fetchData = async () => {
    setIsError({ error: false, message: "" });

    try {
        // Fetch existing zone data
        const data = await UseFetch(API_LINK + "MasterZone/GetDataZoneById", {
        id: withID,
        });

        if (data === "ERROR" || !data || data.length === 0) {
        throw new Error("Gagal mengambil data zona");
        }

        // Populate form with existing data
        formDataRef.current = {
            id: data[0].id,
            Name: data[0].Name,
            Description: data[0].Description || "",
        };

    } catch (error) {
        setIsError({
        error: true,
        message: error.message || "Terjadi kesalahan saat mengambil data",
        });
        window.scrollTo(0, 0);
    } finally {
        setIsLoading(false);
    }
    };

    fetchData();
}, [withID]);

const handleInputChange = (e) => {
    const { name, value } = e.target;
    const validationError = validateInput(name, value, zoneSchema);
    formDataRef.current[name] = value;
    setErrors((prev) => ({ ...prev, [name]: validationError.error }));
};

const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = await validateAllInputs(
    formDataRef.current,
    zoneSchema,
    setErrors
    );

    if (Object.values(validationErrors).some(error => error)) {
    window.scrollTo(0, 0);
    return;
    }

    setIsLoading(true);
    setIsError({ error: false, message: "" });

    try {
    const response = await UseFetch(
        API_LINK + "MasterZone/UpdateZone",
        formDataRef.current
    );

    if (response === "ERROR") {
        throw new Error(response.message || "Gagal memperbarui data zona");
    }

    SweetAlert("Sukses", "Data zona berhasil diperbarui", "success");
    onChangePage("index");
    } catch (error) {
    setIsError({
        error: true,
        message: error.message || "Terjadi kesalahan saat menyimpan data",
    });
    window.scrollTo(0, 0);

    } finally {
    setIsLoading(false);
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
    
    <form onSubmit={handleSubmit}>
        <div className="card">
        <div className="card-header bg-primary fw-medium text-white">
            Ubah Data Zona
        </div>
        <div className="card-body p-4">
            <div className="row">
            <div className="col-lg-6">
                <Input
                type="text"
                forInput="Name"
                label="Nama Zona"
                isRequired
                value={formDataRef.current.Name}
                onChange={handleInputChange}
                errorMessage={errors.Name}
                />
            </div>
            <div className="col-lg-6">
                <Input
                type="text"
                forInput="Description"
                label="Description"
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
            disabled={isLoading}
        />
        </div>
    </form>
    </>
);
}