const pilihButtonListeners = () => {
    const pilihButtons = document.querySelectorAll(".btnPilih");

    pilihButtons.forEach((button) => {
        button.addEventListener("click", async (event) => {
            const idPendaftaran = event.target.dataset.id;

            try {
                const modal = document.createElement("div");
                modal.className = "modal fade";
                modal.id = `pilihModal-${idPendaftaran}`;
                modal.setAttribute("tabindex", "-1");
                modal.setAttribute("aria-labelledby", `pilihModal-${idPendaftaran}-label`);
                modal.setAttribute("aria-hidden", "true");

                modal.innerHTML = `
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-body">
                                <form id="form-${idPendaftaran}">
                                    <div class="form-group">
                                        <label for="jenisKehadiran" style="color: black;" class="d-flex">Kehadiran</label>
                                        <select class="form-control" id="jenisKehadiran-${idPendaftaran}" name="jenisKehadiran" required>
                                            <option value="yes">Hadir</option>
                                            <option value="no">Tidak Hadir</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="pesan" style="color: black;" class="d-flex">Pesan</label>
                                        <textarea class="form-control" id="pesan-${idPendaftaran}" rows="4" name="pesan" required></textarea>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-kirim" id="kirim-${idPendaftaran}">Kirim</button>
                            </div>
                        </div>
                    </div>
                `;

                document.body.appendChild(modal);

                // Show the modal
                const modalInstance = new bootstrap.Modal(modal);
                modalInstance.show();

                document.getElementById(`kirim-${idPendaftaran}`).addEventListener("click", async () => {
                    const jenisKehadiran = document.getElementById(`jenisKehadiran-${idPendaftaran}`).value;
                    showLoading(idPendaftaran);

                    try {
                        const response = await fetch(
                            `/api/admin/set-verified?filter=${jenisKehadiran}&id=${idPendaftaran}`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    message: document.getElementById(`pesan-${idPendaftaran}`).value,
                                }),
                            },
                        );

                        if (response.ok) {
                            Swal.fire({
                                title: "Success",
                                icon: "success",
                                showConfirmButton: false,
                                timer: 1000,
                                timerProgressBar: true,
                            });
                        } else {
                            Swal.fire({
                                title: "Error!",
                                text: data.message,
                                icon: "error",
                                confirmButtonText: "OK",
                            });
                        }
                    } catch (error) {
                        console.error("Error during POST request:", error);
                        Swal.fire({
                            title: "An error occurred",
                            text: error,
                        });
                    } finally {
                        fetchData();
                        resetButtons(idPendaftaran);
                        modalInstance.hide();
                    }
                });
            } catch (error) {
                console.error("Error adding modal:", error);
            }
        });
    });
};

let dataTableInstance = null;

async function fetchData(filter = "") {
    try {
        const response = await fetch(`/api/admin/pendaftaran-admin?filter=${filter}`);

        // Handle Pendaftaran Data
        if (response.ok) {
            const data = await response.json();
            const tbody = document.querySelector("tbody");

            document.getElementById("hadir").textContent = data.present || 0;
            document.getElementById("tidak-hadir").textContent = data.notPresent || 0;

            // Clear existing rows
            tbody.innerHTML = "";

            const rows = [];
            data.pendaftaranBerobat.forEach((pendaftaran) => {
                const tr = document.createElement("tr");
                const modalId = `modal-${pendaftaran.idPendaftaran}`;
                const mulaiBayar = new Date(pendaftaran.created).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                });
                const tanggalPengajuan = new Date(pendaftaran.tanggalPengajuan).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                });

                tr.innerHTML = `
                    <td style="color: black;">${pendaftaran.nama}</td>
                    <td style="color: black;">${pendaftaran.noTagihan}</td>
                    <td style="color: black;">${tanggalPengajuan}</td>
                    <td style="color: black;">${pendaftaran.poli}</td>
                    <td>
                        <div class="d-flex justify-content-center">
                            <button class="btnLihat btn" data-id="${pendaftaran.idPendaftaran}" data-toggle="modal" data-target="#${modalId}">Lihat</button>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex justify-content-center">
                            <button class="btnPilih btn btn-success d-flex mr-2" data-id="${pendaftaran.idPendaftaran}" data-toggle="modal">Pilih</button>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex justify-content-center align-items-center">
                            <span class="badge ${pendaftaran.isPresent ? "badge-success" : "badge-danger"} mt-2" style="height: auto; font-size: 1rem;">
                            ${pendaftaran.isPresent ? "Hadir" : "Tidak Hadir"}
                            </span>
                        </div>
                    </td>
                `;

                rows.push(tr);
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
                    </div>
                `;
                tbody.appendChild(tr);
                document.body.appendChild(modal);
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
            pilihButtonListeners();
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
            icon: "error",
            title: "Failed to fetch data",
            text: error,
        });
    }
}

function updateHeading(filterType) {
    const heading = document.getElementById("filter-heading");
    heading.textContent = `Tabel Kunjungan Pasien - ${filterType}`;
}

function showLoading(idPendaftaran) {
    const kirimButton = document.getElementById(`kirim-${idPendaftaran}`);
    kirimButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
    kirimButton.disabled = true;
}

function resetButtons(idPendaftaran) {
    const kirimButton = document.getElementById(`kirim-${idPendaftaran}`);
    kirimButton.innerHTML = "Kirim";
    kirimButton.disabled = false;
}

document.getElementById("toggle-weekly").addEventListener("click", () => {
    fetchData("weekly");
    updateHeading("Mingguan");
});
document.getElementById("toggle-monthly").addEventListener("click", () => {
    fetchData("monthly");
    updateHeading("Bulanan");
});
document.getElementById("toggle-total").addEventListener("click", () => {
    fetchData("");
    updateHeading("Total");
});

document.addEventListener("DOMContentLoaded", () => {
    fetchData();
});
