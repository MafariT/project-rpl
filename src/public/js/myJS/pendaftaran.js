document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const jenisKelamin0 = document.getElementById("jenisKelamin0");
    const jenisKelamin1 = document.getElementById("jenisKelamin1");
    
    // Fetch data
    const fetchData = async () => {
        try {
            const [pasienResponse, pendaftaranResponse] = await Promise.all([
                fetch("/api/pasien/user"),
                fetch("/api/pendaftaran-berobat/user")
            ]);
    
            // Handle Pasien Data
            if (pasienResponse.ok) {
                const pasienData = await pasienResponse.json();
                for (const [key, value] of Object.entries(pasienData)) {
                    if (key === "jenisKelamin") {
                        if (value === "laki-laki") jenisKelamin0.checked = true; // Laki Laki
                        if (value === "Perempuan") jenisKelamin1.checked = true; // Perempuan
                    } else {
                        const input = document.querySelector(`[name="${key}"]`);
                        if (input) input.value = value;
                    }
                }
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
    
                    // Create the modal for this row
                    const modal = document.createElement("div");
                    modal.innerHTML = `
                        <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}-label" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="${modalId}-label">Detail Pendaftaran</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
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
                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    </div>
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
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            Swal.fire({
                icon: "error",
                title: "Failed to fetch data",
                text: "Terjadi kesalahan saat mengambil data!",
            });
        }
    };
    
    const initDataTable = () => {
        const table = $('#myTable'); 
        table.DataTable(); // Reinitialize
    };
    
    fetchData();

    // Handle Form Submission
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        console.log(formData);

        try {
            const response = await fetch("/api/pendaftaran-berobat", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Pendaftaran berhasil!",
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                });
                $('#tambahPendaftaran').modal('hide')
                fetchData(); 
            } else {
                const errorData = await response.json();
                console.error("Error submitting form:", errorData || response.statusText);
                Swal.fire({
                    icon: "error",
                    title: "Pendaftaran gagal!",
                });
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            Swal.fire({
                icon: "error",
                title: "An error occurred",
                text: "Terjadi kesalahan saat pendaftaran!",
            });
        }
    });

    const addEditButtonListeners = () => {
        const editButtons = document.querySelectorAll(".btnEdit");

        editButtons.forEach((button) => {
            button.addEventListener("click", async (event) => {
                const idPendaftaran = event.target.dataset.id;

                try {
                    const response = await fetch(`/api/pendaftaran-berobat/${idPendaftaran}`);
                    if (response.ok) {
                        const data = await response.json();

                        // Dynamically create and populate the modal
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
                                            <div class="form-group">
                                                <label for="editNama">Nama</label>
                                                <input type="text" class="form-control" id="editNama" name="nama" value="${data.nama}" required>
                                            </div>
                                            <div class="form-group">
                                                <label for="editNoTel">No Telp</label>
                                                <input type="text" class="form-control" id="editNoTel" name="noTel" value="${data.noTel}" required>
                                            </div>
                                            <div class="form-group">
                                                <label for="editTanggalPengajuan">Tanggal Pengajuan</label>
                                                <input type="date" class="form-control" id="editTanggalPengajuan" name="tanggalPengajuan" value="${data.tanggalPengajuan}" required>
                                            </div>
                                            <div class="form-group">
                                                <label for="editPoli">Poli</label>
                                                <select class="form-control" id="editPoli" name="poli" required>
                                                    <option value="Umum" ${data.poli === "Umum" ? "selected" : ""}>Umum</option>
                                                    <option value="Bidan" ${data.poli === "Bidan" ? "selected" : ""}>Bidan</option>
                                                    <option value="Gigi" ${data.poli === "Gigi" ? "selected" : ""}>Gigi</option>
                                                </select>
                                            </div>
                                            <button type="submit" class="btn btn-primary">Save Changes</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        `;

                        document.body.appendChild(modal);
                        $(`#editModal-${idPendaftaran}`).modal("show");

                        // Handle form submission
                        const editForm = document.getElementById(`editForm-${idPendaftaran}`);
                        editForm.addEventListener("submit", async (e) => {
                            e.preventDefault();
                            const formData = new FormData(editForm);

                            try {
                                const updateResponse = await fetch(`/api/pendaftaran-berobat/${idPendaftaran}`, {
                                    method: "PUT",
                                    body: formData,
                                });

                                if (updateResponse.ok) {
                                    Swal.fire({
                                        icon: "success",
                                        title: "Pendaftaran berhasil diupdate!",
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
                                        title: "Update gagal!",
                                        text: errorData.message || "Terjadi kesalahan.",
                                    });
                                }
                            } catch (error) {
                                console.error("Error updating pendaftaran:", error);
                                Swal.fire({
                                    icon: "error",
                                    title: "An error occurred",
                                    text: "Terjadi kesalahan saat mengupdate pendaftaran!",
                                });
                            }
                        });
                    }
                } catch (error) {
                    console.error("Error fetching pendaftaran details:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Gagal mendapatkan detail!",
                        text: "Terjadi kesalahan saat mengambil data pendaftaran.",
                    });
                }
            });
        });
    };

    // Responsive Navbar Handling
    function toggleLinkClass() {
        const navLinks = document.querySelectorAll(".navbar-nav .nav-tengah");
        const btn = document.querySelector(".tombol");
        const cont1 = document.querySelector(".csc1");

        if (window.innerWidth < 992) {
            // Mobile view
            navLinks.forEach((link) => {
                link.classList.remove("linknya");
                link.classList.add("link-hp");
            });
            btn.style.marginTop = "20px";
            if (cont1) cont1.style.marginTop = "50px";
        } else {
            // Desktop view
            navLinks.forEach((link) => {
                link.classList.add("linknya");
                link.classList.remove("link-hp");
            });
            btn.style.marginTop = "0px";
            if (cont1) cont1.style.marginTop = "0px";
        }
    }

    // Initialize Navbar Toggle
    toggleLinkClass();
    window.addEventListener("resize", toggleLinkClass);
});
