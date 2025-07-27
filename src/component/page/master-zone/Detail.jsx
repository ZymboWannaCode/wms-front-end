import { useEffect, useRef, useState } from "react";
import { API_LINK, FILE_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import Label from "../../part/Label";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";

export default function MasterZoneDetail({ onChangePage, withID }) {
const [isError, setIsError] = useState({ error: false, message: "" });
const [isLoading, setIsLoading] = useState(true);

const formDataRef = useRef({
    id: null,
    Name: "",
    Description: "",
});

useEffect(() => {
    const fetchData = async () => {
    setIsError({ error: false, message: "" });

    try {
        const data = await UseFetch(API_LINK + "MasterZone/GetDataZoneById", {
        id: withID,
        });

        if (data === "ERROR" || !data) {
        throw new Error("Gagal mengambil data Zona");
        }

        formDataRef.current = {
        id: data[0].id,
        Name: data[0].Name,
        Description: data[0].Description || "-",
        };

    } catch (error) {
        window.scrollTo(0, 0);
        setIsError({
        error: true,
        message: error.message || "Terjadi kesalahan saat mengambil data",
        });
    } finally {
        setIsLoading(false);
    }
    };

    fetchData();
}, [withID]);

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
        Detail Data Zona
        </div>
        <div className="card-body p-4">
        <div className="row">
            <div className="col-lg-6">
            <Label
                forLabel="Name"
                title="Nama Zona"
                data={formDataRef.current.Name}
            />
            </div>
            <div className="col-lg-12 mt-3">
            <Label
                forLabel="Description"
                title="Deskripsi"
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