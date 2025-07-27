import { useState } from "react";
import MasterRackIndex from "./Index";
import MasterRackAdd from "./Add";
import MasterRackDetail from "./Detail";
import MasterRackEdit from "./Edit";

export default function MasterRack() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <MasterRackIndex onChangePage={handleSetPageMode} />;
      case "add":
        return <MasterRackAdd onChangePage={handleSetPageMode} />;
      case "detail":
        return (
          <MasterRackDetail
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
      case "edit":
        return (
          <MasterRackEdit onChangePage={handleSetPageMode} withID={dataID} />
        );
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
