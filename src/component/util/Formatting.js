import moment from "moment";
import "moment/dist/locale/id";

export const separator = (input) => {
  let parsedInput = parseFloat(input.toString().replace(/\./g, ""));

  if (isNaN(parsedInput)) return "";

  const options = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: true,
    decimal: ",",
    thousands: ".",
  };

  return parsedInput.toLocaleString("id-ID", options);
};

export const clearSeparator = (input) => {
  if (input) {
    let parsedInput = parseFloat(input.toString().replace(/\./g, ""));
    return parsedInput;
  }
  return 0;
};

export const formatDate = (input, dateOnly = false) => {
  return dateOnly
    ? moment(input).format("DD MMMM yyyy")
    : moment(input).format("DD MMMM yyyy, HH:mm");
};

export function generateNextId(currentId, prefix, padLength = 2) {
  const number = parseInt(currentId.replace(prefix, ""), 10);
  const nextNumber = number + 1;

  const paddedNumber = String(nextNumber).padStart(padLength, "0");

  return prefix + paddedNumber;
}
