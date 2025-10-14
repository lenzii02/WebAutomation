// Membuat fungsi kalkulator dengan 3 parameter yaitu angka1, angka2, dan operator
function kalkulator(angka1, angka2, operator) {
  switch (operator) {
    case "+":
      return angka1 + angka2;
    case "-":
      return angka1 - angka2;
    case "*":
      return angka1 * angka2;
    case ":":
    case "/":
      return angka1 / angka2;
    default:
      return "Operator tidak valid!";
  }
}

module.exports = { kalkulator };