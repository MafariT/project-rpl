const form = document.querySelector("form");
const jenisKelamin0 = document.getElementById("jenisKelamin0");
const jenisKelamin1 = document.getElementById("jenisKelamin1");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    try {
        const response = await fetch("/api/pendaftaran-berobat", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            Swal.fire({
                icon: "success",
                title: "Pendaftaran berhasil",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
            });
            $("#tambahPendaftaran").modal("hide");
            fetchData();
        } else {
            const errorData = await response.json();
            console.error("Error submitting form:", errorData || response.statusText);
            Swal.fire({
                icon: "error",
                title: "Pendaftaran gagal",
            });
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        Swal.fire({
            icon: "error",
            title: "An error occurred",
            text: "Terjadi kesalahan saat pendaftaran",
        });
    }
});

const fetchData = async () => {
    try {
        const [pasienResponse, pendaftaranResponse] = await Promise.all([
            fetch("/api/pasien/user"),
            fetch("/api/pendaftaran-berobat/user"),
        ]);

        // Handle Pasien Data
        if (pasienResponse.ok) {
            const pasienData = await pasienResponse.json();
            for (const [key, value] of Object.entries(pasienData)) {
                if (key === "jenisKelamin") {
                    if (value === "laki-laki") jenisKelamin0.checked = true;
                    if (value === "Perempuan") jenisKelamin1.checked = true;
                } else {
                    const input = document.querySelector(`[name="${key}"]`);
                    if (input) input.value = value;
                }
            }
        } else if (pasienResponse.status === 404) {
            Swal.fire({
                icon: "warning",
                title: "Harap isi data akun terlebih dahulu",
                text: "Anda belum mengisi data akun, silakan lengkapi informasi akun Anda terlebih dahulu",
            });
        } else {
            console.error("Error fetching pasien data:", pasienResponse.statusText);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Gagal mengambil data pasien",
            });
        }

        // Handle Pendaftaran Data
        if (pendaftaranResponse.ok) {
            const pendaftaranData = await pendaftaranResponse.json();
            const tbody = document.querySelector("tbody");

            // Clear existing rows
            tbody.innerHTML = "";

            pendaftaranData.forEach((pendaftaran) => {
                const tr = document.createElement("tr");
                const modalId = `modal-${pendaftaran.idPendaftaran}`;
                const mulaiBayar = new Date(pendaftaran.created).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                });
                tr.innerHTML = `
                        <td>${pendaftaran.nama}</td>
                        <td>${pendaftaran.noTagihan}</td>
                        <td>${pendaftaran.jenisPembayaran === "Cash" ? "Cash" : "Bank BRI"}</td>
                        <td>${pendaftaran.totalPembayaran}</td>
                        <td >${mulaiBayar}</td>
                        <td>
                            <div class="d-flex justify-content-center">
                                <button class="btnLihat btn" data-id="${pendaftaran.idPendaftaran}" data-toggle="modal" data-target="#${modalId}">Lihat</button>
                                <!-- <button class="btnEdit btn" data-id="${pendaftaran.idPendaftaran}" id="${pendaftaran.idPendaftaran}">Edit</button> -->
                            </div>
                        </td>
                    `;

                const modal = document.createElement("div");
                modal.innerHTML = `
                        <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}-label" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="${modalId}-label">Detail Pendaftaran</h5>
                                    </div>
                                    <div class="modal-body">
                                        <p><strong>Nik:</strong> ${pendaftaran.nik}</p>
                                        <p><strong>Nama:</strong> ${pendaftaran.nama}</p>
                                        <p><strong>No. Telepon:</strong> ${pendaftaran.noTel}</p>
                                        <p><strong>Jenis Kelamin:</strong> ${pendaftaran.jenisKelamin}</p>
                                        <p><strong>Tanggal Lahir:</strong> ${pendaftaran.tanggalLahir}</p>
                                        <p><strong>Tanggal Pengajuan:</strong> ${pendaftaran.tanggalPengajuan}</p>
                                        <p><strong>Poli:</strong> ${pendaftaran.poli}</p>
                                        <p><strong>Keluhan:</strong> ${pendaftaran.keluhan}</p>
                                        <p><strong>Nama Dokter:</strong> ${pendaftaran.namaDokter}</p>
                                        <p><strong>Jam:</strong> ${pendaftaran.jam}</p>
                                        <p><strong>Jenis Pembayaran:</strong> ${pendaftaran.jenisPembayaran === "Cash" ? "Cash" : "Bank BRI"}</p>
                                        <p><strong>Total Pembayaran:</strong> ${pendaftaran.totalPembayaran}</p>
                                        <p><strong>No Tagihan:</strong> ${pendaftaran.noTagihan}</p>
                                        <p><strong>Mulai Bayar:</strong> ${mulaiBayar}</p>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-danger" data-dismiss="modal" style="color: white; font-weight: 600">Tutup</button>
                                    </div>
                            </div>
                        </div>
                    `;

                tbody.appendChild(tr);
                document.body.appendChild(modal);
            });
            initDataTable();
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
            icon: "error",
            title: "Failed to fetch data",
            text: "Terjadi kesalahan saat mengambil data",
        });
    }
};

async function populateSelects(poliSelectId = "poli", namaDokterSelectId = "namaDokter", idPendaftaran = null) {
    try {
        const dokterResponse = await fetch("/api/dokter");
        if (!dokterResponse.ok) throw new Error("Failed to fetch dokter data");

        const dokterData = await dokterResponse.json();

        // Populate poli
        const poliSelect = document.getElementById(poliSelectId);
        poliSelect.innerHTML = "";
        const uniquePoli = [...new Set(dokterData.map((dokter) => dokter.poli))];
        uniquePoli.forEach((poli) => {
            const option = document.createElement("option");
            option.value = poli;
            option.textContent = poli;
            poliSelect.appendChild(option);
        });

        // Populate and filter namaDokter
        const namaDokterSelect = document.getElementById(namaDokterSelectId);
        namaDokterSelect.innerHTML = "";

        const filteredDokter = dokterData.filter((dokter) => dokter.poli === poliSelect.value);
        filteredDokter.forEach((dokter) => {
            const option = document.createElement("option");
            option.value = dokter.nama;
            option.textContent = dokter.nama;
            namaDokterSelect.appendChild(option);
        });

        // Event listener to update namaDokter dynamically if poli changes
        poliSelect.addEventListener("change", () => {
            const selectedPoli = poliSelect.value;
            const updatedFilteredDokter = dokterData.filter((dokter) => dokter.poli === selectedPoli);

            namaDokterSelect.innerHTML = "";
            updatedFilteredDokter.forEach((dokter) => {
                const option = document.createElement("option");
                option.value = dokter.nama;
                option.textContent = dokter.nama;
                namaDokterSelect.appendChild(option);
            });

            namaDokterSelect.value = "";
        });
    } catch (error) {
        console.error("Error populating selects:", error);
    }
}

const initDataTable = () => {
    const table = $("#myTable");
    table.DataTable(); // Reinitialize
};

document.addEventListener("DOMContentLoaded", () => {
    fetchData();
    populateSelects();
});
