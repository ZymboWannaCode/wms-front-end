import { useState } from "react";
import MasterRoleIndex from "./Index";
import MasterRoleAdd from "./Add";
import MasterRoleDetail from "./Detail";
import MasterRoleEdit from "./Edit";

export default function MasterRole() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <MasterRoleIndex onChangePage={handleSetPageMode} />;
      case "add":
        return <MasterRoleAdd onChangePage={handleSetPageMode} />;
      case "detail":
        return (
          <MasterRoleDetail
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
      case "edit":
        return (
          <MasterRoleEdit
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
