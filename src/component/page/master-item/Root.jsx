import { useState } from "react";
import MasterItemIndex from "./Index";
import MasterItemAdd from "./Add";
import MasterItemDetail from "./Detail";
import MasterItemEdit from "./Edit";

export default function MasterItem() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <MasterItemIndex onChangePage={handleSetPageMode} />;
      case "add":
        return <MasterItemAdd onChangePage={handleSetPageMode} />;
      case "detail":
        return (
          <MasterItemDetail
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
      case "edit":
        return (
          <MasterItemEdit
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
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
