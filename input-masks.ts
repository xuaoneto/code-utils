const maskPhone = (value: string) => {
  let f = value.replace(/\D/g, "").match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
  if (f) {
    const formated = !f[2]
      ? f[1]
      : `(${f[1]}) ${f[2]}${f[3] ? `-${f[3]}` : ""}`;
    return formated;
  }
  return "";
};

const maskCNPJ = (value: string) => {
  let f = value
    .replace(/\D/g, "")
    .match(/(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/);
  if (f) {
    const formated = !f[2]
      ? f[1]
      : `${f[1]}.${!f[3] ? f[2] : `${f[2]}.`}${!f[4] ? f[3] : `${f[3]}/`}${
          !f[5] ? f[4] : `${f[4]}-`
        }${f[5]}`;
    return formated;
  }
  return "";
};

function currencyMask(value: string) {
  value = value.replace(".", "").replace(",", "").replace(/\D/g, "");
  const options = { minimumFractionDigits: 3 };
  const result = new Intl.NumberFormat("pt-BR", options).format(
    parseFloat(value) / 1000
  );
  return result;
}
