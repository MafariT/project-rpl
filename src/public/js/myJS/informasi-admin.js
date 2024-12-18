const form = document.getElementById("submit-form");
const submitButton = document.getElementById("submit-btn");

const addEditButtonListeners = () => {
    const editButtons = document.querySelectorAll(".btnEdit");

    editButtons.forEach((button) => {
        button.addEventListener("click", async (event) => {
            const idInformasi = button.dataset.id;

            try {
                const response = await fetch(`/api/informasi/${idInformasi}`);
                if (response.ok) {
                    const data = await response.json();

                    let modal = document.getElementById("tambahinfo");

                    if (!modal) {
                        modal = document.createElement("div");
                        modal.className = "modal fade";
                        modal.id = "tambahinfo";
                        modal.setAttribute("tabindex", "-1");
                        modal.setAttribute("aria-labelledby", "tambahinfoLabel");
                        modal.setAttribute("aria-hidden", "true");
                        document.body.appendChild(modal);
                    }

                    modal.innerHTML = `
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="tambahinfoLabel" style="font-weight: 600;">Tambah Data Informasi</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <!-- Form -->
                                    <form id="submit-form">
                                        <div class="form-group">
                                            <label for="foto">File Gambar</label>
                                            <input type="file" id="foto" name="foto accept="image/* required"
                                        </div>
                                        <div class="form-group">
                                            <label for="judul">Judul</label>
                                            <input type="text" class="form-control" id="judul" name="judul" value="${data.judul}" min="1" max="255" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="isi">Isi</label>
                                            <textarea class="form-control" id="isi" name="isi" min="1" required>${data.isi}</textarea>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="submit" class="btn btn-success" style="font-weight: 600;" id="submit-btn">Submit</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    `;

                    // Show the modal
                    $(`#tambahinfo`).modal("show");

                    const submitForm = document.getElementById("submit-form");
                    submitForm.addEventListener("submit", async (e) => {
                        e.preventDefault();
                        const formData = new FormData(submitForm);
                        showLoading();

                        try {
                            const updateResponse = await fetch(`/api/informasi/${idInformasi}`, {
                                method: "PUT",
                                body: formData,
                            });

                            if (updateResponse.ok) {
                                Swal.fire({
                                    icon: "success",
                                    title: "Informasi berhasil diupdate",
                                    showConfirmButton: false,
                                    timer: 1500,
                                    timerProgressBar: true,
                                });
                            } else {
                                const errorData = await updateResponse.json();
                                Swal.fire({
                                    icon: "error",
                                    title: "Update gagal",
                                    text: errorData.message || "Terjadi kesalahan.",
                                });
                            }
                        } catch (error) {
                            console.error("Error updating informasi:", error);
                            Swal.fire({
                                icon: "error",
                                title: "An error occurred",
                                text: "Terjadi kesalahan saat mengupdate informasi",
                            });
                        } finally {
                            $(`#tambahinfo`).modal("hide");
                            fetchData();
                            resetButtons();
                        }
                    });
                } else {
                    throw new Error("Failed to fetch data.");
                }
            } catch (error) {
                console.error("Error fetching informasi details:", error);
                Swal.fire({
                    icon: "error",
                    title: "Gagal mendapatkan detail",
                    text: "Terjadi kesalahan saat mengambil data informasi",
                });
            }
        });
    });
};

const addDeleteButtonListeners = () => {
    const deleteButtons = document.querySelectorAll(".btnDelete");

    deleteButtons.forEach((button) => {
        button.addEventListener("click", async (event) => {
            const button = event.target;
            const idInformasi = button.getAttribute("data-id");

            if (!idInformasi) {
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
                const response = await fetch(`/api/informasi/delete/${idInformasi}`, {
                    method: "DELETE",
                });

                const responseData = await response.json();
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
            } finally {
                fetchData();
            }
        });
    });
};

form.addEventListener("submit", async (event) => {
    console.log("Form submit event triggered");
    event.preventDefault();
    const formData = new FormData(form);
    showLoading();

    try {
        const response = await fetch("/api/informasi", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            Swal.fire({
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
            });
        } else if (response.status === 413) {
            Swal.fire({
                icon: "error",
                text: "Maksimal ukuran foto 5MB",
                timer: 4000,
                timerProgressBar: true,
            });
        } else {
            const errorData = await response.json();
            console.error("Error submitting form:", errorData || response.statusText);
            Swal.fire({
                icon: "error",
                text: `${errorData.message}`,
            });
        }
    } catch (error) {
        console.log;
        console.error("Error submitting form:", error);
        Swal.fire({
            icon: "error",
            title: "An error occurred",
        });
    } finally {
        $(`#tambahinfo`).modal("hide");
        fetchData();
        resetButtons();
    }
});

const fetchData = async () => {
    try {
        const informasiResponse = await fetch("/api/informasi");

        if (informasiResponse.ok) {
            const data = await informasiResponse.json();
            const tempatInformasi = document.getElementById("tempatInformasi");
            tempatInformasi.innerHTML = "";

            data.forEach((item) => {
                const cardHTML = `
                <div class="mb-4 p-3 card-container d-flex align-items-center flex-wrap"
                    style="border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                    <div class="card-image" style="flex: 0 0 15%; text-align: center; padding-right: 15px;">
                        <img
                            src="/uploads/informasi/${item.foto}"
                            class="card-img-top custom-img" alt="Card Image"
                            style="width: 100%; border-radius: 5px; object-fit: cover;">
                    </div>
                    <div class="card-content" style="flex: 1; padding-right: 15px;">
                        <h5 class="mt-3 mb-3 card-title" style="color: black; font-weight: bold; font-size: 1.2em;">
                            ${item.judul}
                        </h5>
                        <h6 style="color: gray; margin-bottom: 8px;">${new Date(item.created).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</h6>
                        <p class="card-text limit-text" style="color: #555; font-size: 0.9em; margin: 0;">
                            ${limitText(item.isi, 200)}
                        </p>
                    </div>
                    <div class="card-actions" style="flex: 0 0 auto; display: flex; flex-direction: column; gap: 10px; align-items: center;">
                        <a href="/informasi-admin/${item.idInformasi}" class="btn btn-primary" style="padding: 8px; font-size: 0.9em;">
                            <i class="fa-solid fa-eye"></i>
                        </a>
                        <button class="btnEdit btn-success" data-id="${item.idInformasi}" style="padding: 8px; font-size: 0.9em;">
                            <i class="fa-solid fa-pen-to-square" id="${item.idInformasi}"></i>
                        </button>
                        <button class="btnDelete btn-danger" data-id="${item.idInformasi}" style="padding: 8px; font-size: 0.9em;">
                            <i class="fa-solid fa-trash" id="${item.idInformasi}"></i>
                        </button>
                    </div>
                </div>`;
                tempatInformasi.insertAdjacentHTML("beforeend", cardHTML);
            });
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        addEditButtonListeners();
        addDeleteButtonListeners();
    }
};

function showLoading() {
    submitButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
    submitButton.disabled = true;
}

function resetButtons() {
    submitButton.innerHTML = "Submit";
    submitButton.disabled = false;
}

function limitText(text, limit) {
    if (text.length > limit) {
        return text.substring(0, limit) + "...";
    }
    return text;
}

function adjustLayout() {
    const cardContainers = document.querySelectorAll(".card-container");
    const isMobile = window.innerWidth <= 768;

    cardContainers.forEach((container) => {
        if (isMobile) {
            container.style.flexDirection = "column";
            container.style.alignItems = "center";
        } else {
            container.style.flexDirection = "row";
            container.style.alignItems = "flex-start";
        }
    });
}

// Jalankan fungsi saat halaman dimuat dan saat ukuran layar berubah
window.addEventListener("load", adjustLayout);
window.addEventListener("resize", adjustLayout);

function adjustButtonLayout() {
    const cardActions = document.querySelectorAll(".card-actions");
    const isMobile = window.innerWidth <= 768;

    cardActions.forEach((action) => {
        if (isMobile) {
            action.style.flexDirection = "row";
            action.style.gap = "15px";
            action.style.justifyContent = "center";
        } else {
            action.style.flexDirection = "column";
            action.style.gap = "10px";
            action.style.justifyContent = "start";
        }
    });
}

// Jalankan fungsi saat halaman dimuat dan saat ukuran layar berubah
window.addEventListener("load", adjustButtonLayout);
window.addEventListener("resize", adjustButtonLayout);
document.addEventListener("DOMContentLoaded", () => {
    fetchData();
});
