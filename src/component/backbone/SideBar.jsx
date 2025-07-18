import Menu from "./Menu";

export default function SideBar({ listMenu }) {
  return (
    <>
      <div className="border-end position-fixed h-100 pt-2 overflow-y-auto sidebarMenu">
        <Menu listMenu={listMenu} />
      </div>
      <button
        className="btn btn-primary d-md-none position-fixed bottom-0 end-0 m-4 mb-5 z-3"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#sidebarMenu"
        aria-controls="sidebarMenu"
      >
        <i className="fi fi-br-menu-burger"></i>
      </button>

      <div
        className="offcanvas offcanvas-start d-md-block position-md-fixed h-100 pt-2 border-end sidebarMenu"
        tabIndex="-1"
        id="sidebarMenu"
      >
        <div className="offcanvas-header d-md-none">
          <h5 className="offcanvas-title">Menu</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body p-0 overflow-y-auto">
          <Menu listMenu={listMenu} />
        </div>
      </div>
    </>
  );
}