import Cookies from "js-cookie";
import { decryptId } from "./Encryptor";

const fetchData = async (url, param = {}, method = "POST") => {
  let activeUser = "";
  const cookie = Cookies.get("activeUser");
  if (cookie) activeUser = JSON.parse(decryptId(cookie)).username;

  try {
    let response;
    if (method === "POST") {
      const paramToSent = {
        ...param,
        activeUser: activeUser === "" ? undefined : activeUser,
      };

      response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(paramToSent),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwtToken"),
        },
      });
    } else {
      response = await fetch(url);
    }

    console.log("KIRIM PARAM:", param);
    console.log("STATUS:", response.status);

    // ✅ Kalau status 204 (No Content), langsung return null
    if (response.status === 204) {
      console.warn("No content dari server.");
      return null;
    }

    const resultText = await response.text();
    console.log("RAW RESULT:", resultText);

    if (!resultText || resultText.trim() === "") {
      console.warn("Empty response body.");
      return null;
    }

    try {
      const result = JSON.parse(resultText);
      return result;
    } catch (err) {
      console.error("Bukan JSON valid:", resultText);
      return "ERROR";
    }

  } catch (err) {
    console.error("Fetch error:", err);
    return "ERROR";
  }
};

export default fetchData;
