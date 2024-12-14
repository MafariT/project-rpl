let dataTableInstance = null;

function populateTable(dokterData, poliFilter = "") {
    const tbody = document.querySelector("tbody");
    const filteredDokterData = poliFilter ? dokterData.filter((dokter) => dokter.poli === poliFilter) : dokterData;
    const rows = [];

    tbody.innerHTML = "";
    filteredDokterData.forEach((dokter) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${dokter.nama}</td>
          <td>${dokter.poli}</td>
          <td>${dokter.jamMulai}</td>
          <td>${dokter.jamSelesai}</td>
        `;
        rows.push(tr);
        tbody.appendChild(tr);
    });

    // If DataTable is initialized, update the data
    if (dataTableInstance) {
        dataTableInstance.clear();
        dataTableInstance.rows.add(rows);
        dataTableInstance.draw();
    } else {
        const table = $("#myTable");
        dataTableInstance = table.DataTable();
    }
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
