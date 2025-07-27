import { useState } from "react";
import MasterCategoryIndex from "./Index";
import MasterCategoryAdd from "./Add";
import MasterCategoryDetail from "./Detail";
import MasterCategoryEdit from "./Edit";

export default function MasterCategory() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <MasterCategoryIndex onChangePage={handleSetPageMode} />;
      case "add":
        return <MasterCategoryAdd onChangePage={handleSetPageMode} />;
      case "detail":
        return (
          <MasterCategoryDetail
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
      case "edit":
        return (
          <MasterCategoryEdit
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
