document.addEventListener("DOMContentLoaded", () => {
    const profilePic = document.getElementById("profile-pic");
    const inputPic = document.getElementById("foto");
    const removePicButton = document.getElementById("hapus-foto");
    const updateButton = document.getElementById("update-btn");
    const logoutButton = document.getElementById("logout");
    const form = document.querySelector("form");
    const username = document.getElementById("username");
    const email = document.getElementById("email");
    const jenisKelamin0 = document.getElementById("jenisKelamin0");
    const jenisKelamin1 = document.getElementById("jenisKelamin1");

    // Update Profile Picture Preview
    inputPic.addEventListener("change", () => {
        const file = inputPic.files[0];
        if (file) {
            profilePic.src = URL.createObjectURL(file);
        }
    });

    // Remove Profile Picture
    removePicButton.addEventListener("click", async (event) => {
        event.preventDefault();

        Swal.fire({
            title: "Konfirmasi",
            icon: "warning",
            showCancelButton: true,
            cancelButtonColor: "#e74a3b",
            cancelButtonText: "Tidak",
            confirmButtonColor: "#7afb8d",
            confirmButtonText: "Ya",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    profilePic.src = "../img/asset/kosong.jpg";
                    inputPic.value = "";
                    const response = await fetch("/api/pasien/delete-pic", {
                        method: "GET",
                    });

                    if (response.ok) {
                        Swal.fire({
                            title: "Success",
                            text: "Foto Anda telah dihapus",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1500,
                            timerProgressBar: true,
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Gagal menghapus foto",
                            text: "Terjadi kesalahan saat menghapus foto",
                        });
                    }
                } catch (error) {
                    console.error("Error during delete:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Terjadi kesalahan saat menghapus foto",
                    });
                }
            }
        });
    });

    logoutButton.addEventListener("click", async (event) => {
        event.preventDefault();

        showLoading(true);
        Swal.fire({
            title: "Konfirmasi",
            icon: "warning",
            showCancelButton: true,
            cancelButtonColor: "#e74a3b",
            cancelButtonText: "Tidak",
            confirmButtonColor: "#7afb8d",
            confirmButtonText: "Ya",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch("/api/auth/logout", {
                        method: "GET",
                    });
                    window.location.href = response.url;
                    if (response.ok) {
                        Swal.fire({
                            title: "Success",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1500,
                            timerProgressBar: true,
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Gagal Logout",
                            text: "Terjadi kesalahan saat Logout",
                        });
                    }
                } catch (error) {
                    console.error("Error during delete:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Terjadi kesalahan saat Logout",
                    });
                } finally {
                    resetButtons();
                }
            } else {
                resetButtons();
            }
        });
    });

    // Fetch data
    const fetchData = async () => {
        try {
            const [pasienResponse, userResponse] = await Promise.all([fetch("/api/pasien/user"), fetch("/api/user")]);

            if (pasienResponse.ok) {
                const pasienData = await pasienResponse.json();
                for (const [key, value] of Object.entries(pasienData)) {
                    if (key === "fotoProfil" && value) {
                        profilePic.src = `/uploads/${value}`;
                    } else if (key === "jenisKelamin") {
                        if (value === "laki-laki") jenisKelamin0.checked = true; // Laki Laki
                        if (value === "Perempuan") jenisKelamin1.checked = true; // Perempuan
                    } else {
                        const input = document.querySelector(`[name="${key}"]`);
                        if (input) input.value = value;
                    }
                }
            }

            if (userResponse.ok) {
                const userData = await userResponse.json();
                username.value = userData.username || "";
                email.value = userData.email || "";
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

    fetchData();

    // Handle Form Submission
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(form);

        formData.delete("username");
        formData.delete("email");

        showLoading();

        try {
            const response = await fetch("/api/pasien", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Profile berhasil di update",
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                });
            } else if (response.status === 413) {
                Swal.fire({
                    icon: "error",
                    title: "Failed to update profile",
                    text: "Maksimal ukuran foto 5MB",
                    timer: 4000,
                    timerProgressBar: true,
                });
            } else {
                const errorData = await response.json();
                console.error("Error submitting form:", errorData || response.statusText);
                Swal.fire({
                    icon: "error",
                    title: "Failed to update profile",
                    text: `${errorData.message}`,
                });
            }
        } catch (error) {
            console.log;
            console.error("Error submitting form:", error);
            Swal.fire({
                icon: "error",
                title: "An error occurred",
                text: "Terjadi kesalahan saat memperbarui profil!",
            });
        } finally {
            resetButtons();
        }
    });

    const showLoading = (isLogout = false) => {
        if (isLogout) {
            logoutButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
            logoutButton.disabled = true;
        } else {
            updateButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
            updateButton.disabled = true;
        }
    };

    const resetButtons = () => {
        updateButton.innerHTML = "Update Profil";
        updateButton.disabled = false;

        logoutButton.innerHTML = "Logout";
        logoutButton.disabled = false;
    };
});
