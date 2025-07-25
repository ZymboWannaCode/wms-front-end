import { useEffect, useRef, useState } from "react";
import { PAGE_SIZE, API_LINK } from "../../util/Constants";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Table from "../../part/Table";
import Paging from "../../part/Paging";
import Filter from "../../part/Filter";
import DropDown from "../../part/Dropdown";
import Alert from "../../part/Alert";
import Loading from "../../part/Loading";

const inisialisasiData = [
{
    Key: null,
    No: null,
    Name: null,
    Description: null,
    Count: 0,
},
];

const dataFilterSort = [
{ Value: "[Name] asc", Text: "Nama [↑]" },
{ Value: "[Name] desc", Text: "Nama [↓]" },
{ Value: "[Description] asc", Text: "Deskripsi [↑]" },
{ Value: "[Description] desc", Text: "Deskripsi [↓]" },
];

export default function MasterZoneIndex({ onChangePage }) {
const [isError, setIsError] = useState(false);
const [isLoading, setIsLoading] = useState(true);
const [currentData, setCurrentData] = useState(inisialisasiData);
const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    sort: "[Name] asc",
});

const searchQuery = useRef();
const searchFilterSort = useRef();

function handleSetCurrentPage(newCurrentPage) {
    setIsLoading(true);
    setCurrentFilter((prevFilter) => {
    return {
        ...prevFilter,
        page: newCurrentPage,
    };
    });
}

function handleSearch() {
    setIsLoading(true);
    setCurrentFilter((prevFilter) => {
    return {
        ...prevFilter,
        page: 1,
        query: searchQuery.current.value,
        sort: searchFilterSort.current.value,
    };
    });
}

// fungsi deleteZone
function handleDeleteZone(id) {
    if (id == null || isNaN(id)) {
        SweetAlert("Error", "ID Zona tidak valid", "error");
        return;
    }

    SweetAlert(
        "Konfirmasi Hapus",
        "Apakah Anda yakin ingin menghapus data zona ini?",
        "warning",
        "Hapus"
    ).then((result) => {
        if (result) {
            setIsLoading(true);
            setIsError(false);
            UseFetch(API_LINK + "MasterZone/DeleteZone", {
                idZone: id,
            })
            .then((data) => {
                if (data === "ERROR" || !data || (Array.isArray(data) && data.length === 0)) {
                    setIsError(true);
                    SweetAlert("Error", "Gagal menghapus data zona", "error");
                } else {
                    SweetAlert(
                        "Berhasil!",
                        `Data Zona berhasil dihapus: ${data.Name || data[0]?.Name || ''}`,
                        "success"
                    );
                    handleSetCurrentPage(currentFilter.page);
                }
            })
            .catch((error) => {
                console.error("Error saat menghapus:", error);
                setIsError(true);
                SweetAlert("Error", "Terjadi kesalahan saat menghapus", "error");
            })
            .finally(() => setIsLoading(false));
        } else {
            SweetAlert(
                "Dibatalkan",
                "Data zona tidak dihapus",
                "info"
            );
        }
    });
}
useEffect(() => {
    const fetchData = async () => {
        setIsError(false);
        try {
            const data = await UseFetch(
                API_LINK + "MasterZone/GetDataZone",
                currentFilter
            );
                        
            if (data === "ERROR" || !data) {
                setIsError(true);
            } else if (data.length === 0) {
                setCurrentData(inisialisasiData);
            } else {
                const formattedData = data.map((value, index) => ({
                    ...value,
                    No: (currentFilter.page - 1) * PAGE_SIZE + index + 1,
                    Aksi: ["Detail", "Edit", "Delete"],
                    Alignment: ["center", "left", "left", "center"],
                }));
                setCurrentData(formattedData);
            }
        } catch (error) {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    fetchData();
}, [currentFilter]);

return (
    <>
    <div className="d-flex flex-column">
        {isError && (
        <div className="flex-fill">
            <Alert
            type="warning"
            message="Terjadi kesalahan: Gagal mengambil data zona."
            />
        </div>
        )}
        <div className="flex-fill">
        <div className="input-group">
            <Button
            iconName="add"
            classType="success"
            label="Tambah"
            onClick={() => onChangePage("add")}
            />
            <Input
            ref={searchQuery}
            forInput="pencarianZone"
            placeholder="Cari"
            />
            <Button
            iconName="search"
            classType="primary px-4"
            title="Cari"
            onClick={handleSearch}
            />
            <Filter>
            <DropDown
                ref={searchFilterSort}
                forInput="ddUrut"
                label="Urut Berdasarkan"
                type="none"
                arrData={dataFilterSort}
                defaultValue="[Name] asc"
            />
            </Filter>
        </div>
        </div>
        <div className="mt-3">
        {isLoading ? (
            <Loading />
        ) : (
            <div className="d-flex flex-column">
            <Table
                data={currentData}
                onDetail={onChangePage}
                onEdit={onChangePage}
                onDelete={handleDeleteZone}
                hiddenColumns={['Key']}
            />
            <Paging
                pageSize={PAGE_SIZE}
                pageCurrent={currentFilter.page}
                totalData={currentData[0]["Count"]}
                navigation={handleSetCurrentPage}
            />
            </div>
        )}
        </div>
    </div>
    </>
);
}