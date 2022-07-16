// value is e.target.value
function maskPhone(value) {
  let format = value.replace(/\D/g, "").match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
  return !format[2]
    ? format[1]
    : "(" + format[1] + ") " + format[2] + (format[3] ? "-" + format[3] : "");
}
