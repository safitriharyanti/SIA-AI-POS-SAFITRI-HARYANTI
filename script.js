function prosesData() {
  const input = document.getElementById("inputData").value;
  const output = document.getElementById("output");

  // contoh proses sederhana
  output.innerText = "Hasil: " + input.toUpperCase();
}
