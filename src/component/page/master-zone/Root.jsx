import { useState } from "react";
import MasterZoneIndex from "./Index";
import MasterZoneAdd from "./Add";
import MasterZoneDetail from "./Detail";
import MasterZoneEdit from "./Edit";

export default function MasterZone() {
    const [pageMode, setPageMode] = useState("index");
    const [dataID, setDataID] = useState();

    function getPageMode() {
        switch (pageMode) {
            case "index":
                return <MasterZoneIndex onChangePage={handleSetPageMode} />;
            case "add":
                return <MasterZoneAdd onChangePage={handleSetPageMode} />;
            case "detail":
                return <MasterZoneDetail onChangePage={handleSetPageMode} withID={dataID} />;
            case "edit":
                return <MasterZoneEdit onChangePage={handleSetPageMode} withID={dataID} />;
        }
    }

    function handleSetPageMode(mode) {
        setPageMode(mode);
    }

    function handleSetPageMode(mode, withID) {
        setDataID(withID);
        setPageMode(mode);
    }
    return <div>{getPageMode()}</div>;
}