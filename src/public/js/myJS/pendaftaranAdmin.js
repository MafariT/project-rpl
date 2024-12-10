// Tombol "Ya" dan "Tidak"
const btnVerif = document.querySelectorAll(".btn-success");
const btnNoVerif = document.querySelectorAll(".btn-danger");

// Counter untuk jumlah terverifikasi/tidak terverifikasi
const dataVerif = document.getElementById("dataVerif");
const dataNoVerif = document.getElementById("dataNoVerif");

// Event listener untuk tombol "Ya"
btnVerif.forEach((btn) => {
    btn.addEventListener("click", function () {
        // Tambahkan 1 ke counter "Terverifikasi"
        let currentValue = parseInt(dataVerif.textContent, 10);
        dataVerif.textContent = currentValue + 1;

        // Tampilkan badge "Verifikasi" pada baris terkait
        const badgeVer = document.querySelectorAll(".badge-success") // Offset untuk badge global
        badgeVer.classList.remove("d-none");

        // Sembunyikan badge "Tidak Terverifikasi"
        const badgeNoVer = document.querySelectorAll(".badge-danger")
        badgeNoVer.classList.add("d-none");
    });
});

// Event listener untuk tombol "Tidak"
btnNoVerif.forEach((btn, index) => {
    btn.addEventListener("click", function () {
        // Tambahkan 1 ke counter "Tidak Terverifikasi"
        let currentValue = parseInt(dataNoVerif.textContent, 10);
        dataNoVerif.textContent = currentValue + 1;

        // Tampilkan badge "Tidak Terverifikasi" pada baris terkait
        const badgeNoVer = document.querySelectorAll(".badge-danger") // Offset untuk badge global
        badgeNoVer.classList.remove("d-none");

        // Sembunyikan badge "Verifikasi"
        const badgeVer = document.querySelectorAll(".badge-success")
        badgeVer.classList.add("d-none");
    });
});