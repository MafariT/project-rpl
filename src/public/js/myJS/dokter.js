function populateTable(dokterData, poliFilter = "") {
    const tableBody = document.querySelector("#myTable tbody");
    tableBody.innerHTML = "";

    const filteredDokterData = poliFilter ? dokterData.filter((dokter) => dokter.poli === poliFilter) : dokterData;

    filteredDokterData.forEach((dokter) => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${dokter.nama}</td>
          <td>${dokter.poli}</td>
          <td>${dokter.jamMulai}</td>
          <td>${dokter.jamSelesai}</td>
        `;

        tableBody.appendChild(row);
    });

    initDataTable();
}

async function fetchDokterData(poliFilter) {
    try {
        const response = await fetch("/api/dokter");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const dokterData = await response.json();

        if (poliFilter) {
            populateTable(dokterData, poliFilter);
        } else {
            populateTable(dokterData);
        }

        document.getElementById("dokterTable").classList.remove("d-none");
    } catch (error) {
        console.error("Failed to fetch doctor data:", error);

        Swal.fire({
            icon: "error",
            title: "Failed to fetch data",
            text: "Terjadi kesalahan saat mengambil data",
        });
    }
}

function initDataTable() {
    const table = $("#myTable");
    table.DataTable();
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("pilihButton").addEventListener("click", () => {
        const poliSelect = document.getElementById("listPoli");
        const selectedPoli = poliSelect.value;

        fetchDokterData(selectedPoli !== "Pilih Poli" ? selectedPoli : "");
    });
});
