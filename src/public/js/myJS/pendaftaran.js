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

const addEditButtonListeners = () => {
    const editButtons = document.querySelectorAll(".btnEdit");

    editButtons.forEach((button) => {
        button.addEventListener("click", async (event) => {
            const idPendaftaran = event.target.dataset.id;

            try {
                const response = await fetch(`/api/pendaftaran-berobat/user/${idPendaftaran}`);
                if (response.ok) {
                    const data = await response.json();

                    const modal = document.createElement("div");
                    modal.className = "modal fade";
                    modal.id = `editModal-${idPendaftaran}`;
                    modal.setAttribute("tabindex", "-1");
                    modal.setAttribute("aria-labelledby", `editModal-${idPendaftaran}-label`);
                    modal.setAttribute("aria-hidden", "true");

                    modal.innerHTML = `
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="editModal-${idPendaftaran}-label">Edit Pendaftaran</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <form id="editForm-${idPendaftaran}">
                                        <!-- NIK -->
                                        <div class="form-group">
                                            <label for="nik" style="color: black;">NIK</label>
                                            <input type="text" class="form-control" id="editNik" aria-describedby="" name="nik" value="${data.nik}" required>
                                        </div>
                                        <!-- NAMA -->
                                        <div class="form-group">
                                            <label for="editNama">Nama</label>
                                            <input type="text" class="form-control" id="editNama" name="nama" value="${data.nama}" required>
                                        </div>
                                        <!-- Jenis Kelamin -->
                                        <div class="form-group">
                                            <label for="form-check-label" class="col-form-label" style="color: black;">Jenis Kelamin</label>
                                            <div class="d-flex">
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" name="jenisKelamin" id="editJenisKelamin0"
                                                    value="laki-laki" ${data.jenisKelamin == "laki-laki" ? "checked" : ""} required>
                                                <label class="form-check-label mr-3" for="editJenisKelamin0" style="color: black;">
                                                    Laki-Laki
                                                </label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" name="jenisKelamin" id="editJenisKelamin1"
                                                    value="perempuan" ${data.jenisKelamin == "perempuan" ? "checked" : ""} required>
                                                <label class="form-check-label" for="editJenisKelamin1" style="color: black;">
                                                    Perempuan
                                                </label>
                                            </div>
                                            </div>
                                        </div>
                                        <!-- Alamat -->
                                        <div class="form-group">
                                            <label for="alamat" style="color: black;">Alamat</label>
                                            <input type="text" class="form-control" id="editAlamat" aria-describedby="" name="alamat" value="${data.alamat}" required>
                                        </div>
                                        <!-- No Telp -->
                                        <div class="form-group">
                                            <label for="editNoTel">No Telp</label>
                                            <input type="text" class="form-control" id="editNoTel" name="noTel" value="${data.noTel}" required>
                                        </div>
                                        <!-- Tanggal Lahir -->
                                        <div class="form-group">
                                            <label for="tanggalLahir" style="color: black;">Tanggal Lahir</label>
                                            <input type="date" class="form-control" id="editTanggalLahir" aria-describedby="" name="tanggalLahir" value="${data.tanggalLahir}" required>
                                        </div>
                                        <!-- Tanggal Pengajuan -->
                                        <div class="form-group">
                                            <label for="editTanggalPengajuan">Tanggal Pengajuan</label>
                                            <input type="date" class="form-control" id="editTanggalPengajuan" name="tanggalPengajuan" value="${data.tanggalPengajuan}" required>
                                        </div>
                                        <!-- Poli -->
                                        <div class="form-group">
                                            <label for="editPoli-${idPendaftaran}">Poli</label>
                                            <select class="form-control" id="editPoli-${idPendaftaran}" name="poli" required>

                                            </select>
                                        </div>
                                        <!-- keluhan -->
                                        <div class="form-group">
                                            <label for="keluhan" style="color: black;">Keluhan</label>
                                                <textarea class="form-control" id="keluhan" rows="4" placeholder="Jelaskan keluhan Anda lebih lengkap" name="keluhan" required>${data.keluhan || ""}
                                                </textarea>
                                        </div>
                                        <!-- namaDokter -->
                                        <div class="form-group">
                                            <label for="editNamaDokter-${idPendaftaran}" style="color: black;">Nama Dokter</label>
                                            <select class="form-control" id="editNamaDokter-${idPendaftaran}" name="namaDokter" required>

                                            </select>
                                        </div>
                                        <!-- jam -->
                                        <div class="form-group">
                                            <label for="jam" style="color: black;">Jam</label>
                                            <input type="time" class="form-control" id="editJam" aria-describedby="" name="jam" value="${data.jam}" required>
                                        </div>
                                        <!-- Jenis Pembayaran -->
                                        <div class="form-group">
                                            <label for="jenisPembayaran" style="color: black;">Jenis Pembayaran</label>
                                            <select class="form-control" id="jenisPembayaran" name="jenisPembayaran" required>
                                                <option value="dana" ${data.poli === "dana" ? "selected" : ""}>Dana</option>
                                                <option value="cash" ${data.poli === "cash" ? "selected" : ""}>Cash</option>
                                                <option value="gopay" ${data.poli === "gopay" ? "selected" : ""}>Gopay</option>
                                            </select>
                                            </select>
                                        </div>
                                        <!-- total Pemabayran -->
                                        <div class="form-group">
                                            <label for="totalPembayaran" style="color: black;">Total Pemabayaran</label>
                                            <input type="text" class="form-control" id="totalPembayaran" aria-describedby="" name="totalPembayaran" disabled="true"
                                            required value="${data.totalPembayaran}">
                                        </div>
                                        <div class="modal-footer">
                                            <button type="submit" class="btn btn-success" style="font-weight: 600;">Submit</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    `;

                    document.body.appendChild(modal);
                    $(`#editModal-${idPendaftaran}`).modal("show");
                    await populateSelects(
                        `editPoli-${idPendaftaran}`,
                        `editNamaDokter-${idPendaftaran}`,
                        idPendaftaran,
                    );

                    // Handle form submission
                    const id = button.getAttribute("data-id");
                    const editForm = document.getElementById(`editForm-${idPendaftaran}`);
                    editForm.addEventListener("submit", async (e) => {
                        e.preventDefault();
                        const formData = new FormData(editForm);

                        try {
                            const updateResponse = await fetch(`/api/pendaftaran-berobat/${id}`, {
                                method: "PUT",
                                body: formData,
                            });

                            if (updateResponse.ok) {
                                Swal.fire({
                                    icon: "success",
                                    title: "Pendaftaran berhasil diupdate",
                                    showConfirmButton: false,
                                    timer: 1500,
                                    timerProgressBar: true,
                                });
                                $(`#editModal-${idPendaftaran}`).modal("hide");
                                fetchData();
                            } else {
                                const errorData = await updateResponse.json();
                                Swal.fire({
                                    icon: "error",
                                    title: "Update gagal",
                                    text: errorData.message || "Terjadi kesalahan.",
                                });
                            }
                        } catch (error) {
                            console.error("Error updating pendaftaran:", error);
                            Swal.fire({
                                icon: "error",
                                title: "An error occurred",
                                text: "Terjadi kesalahan saat mengupdate pendaftaran",
                            });
                        }
                    });
                }
            } catch (error) {
                console.error("Error fetching pendaftaran details:", error);
                Swal.fire({
                    icon: "error",
                    title: "Gagal mendapatkan detail",
                    text: "Terjadi kesalahan saat mengambil data pendaftaran",
                });
            }
        });
    });
};

const addHapusButtonListeners = () => {
    const editHapusButtons = document.querySelectorAll(".btnHapus");

    editHapusButtons.forEach((button) => {
        button.addEventListener("click", async (event) => {
            const button = event.target;
            const id = button.getAttribute("data-id");

            if (!id) {
                console.error("ID is missing for the delete action.");
                return;
            }

            const { isConfirmed } = await Swal.fire({
                title: "Konfirmasi",
                icon: "warning",
                showCancelButton: true,
                cancelButtonColor: "#e74a3b",
                cancelButtonText: "Tidak",
                confirmButtonColor: "#68A3F3",
                confirmButtonText: "Ya",
            });

            if (!isConfirmed) {
                return;
            }

            try {
                const response = await fetch(`/api/pendaftaran-berobat/user/${id}`, {
                    method: "DELETE",
                });

                const responseData = await response.json();
                if (response.ok) {
                    Swal.fire({
                        title: "Success",
                        text: "Data Anda telah dihapus!",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true,
                    });
                    fetchData();
                } else {
                    Swal.fire({
                        title: "Error!",
                        text: responseData.message || "Something went wrong.",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                }
            } catch (error) {
                console.error("Error during DELETE request:", error);
                Swal.fire({
                    title: "An error occurred",
                    text: "Terjadi kesalahan saat menghapus data!",
                });
            }
        });
    });
};

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

                tr.innerHTML = `
                        <td>${pendaftaran.nama}</td>
                        <td>${pendaftaran.noTel}</td>
                        <td>${pendaftaran.tanggalPengajuan}</td>
                        <td>${pendaftaran.poli}</td>
                        <td class="d-flex justify-content-center">
                            <div class="d-flex">
                                <button class="btnLihat btn" data-id="${pendaftaran.idPendaftaran}" data-toggle="modal" data-target="#${modalId}">Lihat</button>
                                <button class="btnEdit btn" data-id="${pendaftaran.idPendaftaran}" id="${pendaftaran.idPendaftaran}">Edit</button>
                            </div>
                        </td>
                        <td>
                            <div class="d-flex">
                                <button class="btnHapus btn" data-id="${pendaftaran.idPendaftaran}">Hapus</button>
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
                                        <p><strong>Jenis Pembayaran:</strong> ${pendaftaran.jenisPembayaran}</p>
                                        <p><strong>Total Pembayaran:</strong> ${pendaftaran.totalPembayaran}</p>
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

            // Initialize DataTable
            initDataTable();
            addEditButtonListeners();
            addHapusButtonListeners();
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

        let pendaftaranData = null;
        if (idPendaftaran) {
            const pendaftaranResponse = await fetch(`/api/pendaftaran-berobat/user/${idPendaftaran}`);
            if (!pendaftaranResponse.ok) throw new Error("Failed to fetch pendaftaran data");

            pendaftaranData = await pendaftaranResponse.json();
        }

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

        // Set the selected poli if it's for the edit case
        if (pendaftaranData) {
            poliSelect.value = pendaftaranData.poli;
        }

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

        if (pendaftaranData) {
            namaDokterSelect.value = pendaftaranData.namaDokter;
        }

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
