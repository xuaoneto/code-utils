// value is e.target.value

function currencyMask(value) {
  value = value.replace(".", "").replace(",", "").replace(/\D/g, "");
  const options = { minimumFractionDigits: 3 };
  const result = new Intl.NumberFormat("pt-BR", options).format(
    parseFloat(value) / 1000
  );
  return result;
}
