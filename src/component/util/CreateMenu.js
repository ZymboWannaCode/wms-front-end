import { ROOT_LINK, API_LINK, APPLICATION_ID } from "./Constants";
import UseFetch from "./UseFetch";

const CreateMenu = async (role) => {
  try {
    let data = [];
    switch (role.slice(0, 5)) {
      case "ROL01":
        data = [
          {
            nama: "Master Data",
            link: "#",
            parent: null,
          },
          {
            nama: "Category",
            link: "category",
            parent: 1,
          },
          {
            nama: "Item",
            link: "item",
            parent: 1,
          },
          {
            nama: "Warehouse Settings",
            link: "#",
            parent: null,
          },
          {
            nama: "Zone",
            link: "zone",
            parent: 2,
          },
          {
            nama: "Rack",
            link: "rack",
            parent: 2,
          },
          {
            nama: "User Management",
            link: "#",
            parent: null,
          },
          {
            nama: "User",
            link: "user",
            parent: 3,
          },
          {
            nama: "Role",
            link: "role",
            parent: 3,
          },
        ];
        break;
    }
    // const data = await UseFetch(API_LINK + "Utilities/GetListMenu", {
    //   username: "",
    //   role: role,
    //   application: APPLICATION_ID,
    // });

    let lastHeadkey = "";
    const transformedMenu = [
      {
        head: "Logout",
        headkey: "logout",
        link: ROOT_LINK + "/logout",
        sub: [],
      },
      {
        head: "Beranda",
        headkey: "beranda",
        link: ROOT_LINK + "/",
        sub: [],
      },
      {
        head: "Notifikasi",
        headkey: "notifikasi",
        link: ROOT_LINK + "/notifikasi",
        sub: [],
        isHidden: true,
      },
    ];

    data.forEach((item) => {
      if (item.parent === null || item.link === "#") {
        lastHeadkey = item.nama.toLowerCase().replace(/\s/g, "_");
        transformedMenu.push({
          head: item.nama,
          headkey: lastHeadkey,
          link: item.link === "#" ? item.link : ROOT_LINK + "/" + item.link,
          sub: [],
        });
      } else {
        const parent = transformedMenu.find(
          (item) => item.headkey === lastHeadkey
        );
        if (parent) {
          parent.sub.push({
            title: item.nama,
            link: ROOT_LINK + "/" + item.link,
          });
        }
      }
    });

    return transformedMenu;
  } catch {
    return [];
  }
};

export default CreateMenu;
