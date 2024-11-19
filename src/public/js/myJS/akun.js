document.addEventListener("DOMContentLoaded", () => {
    const profilePic = document.getElementById("profile-pic");
    const inputPic = document.getElementById("foto");
    const removePicButton = document.getElementById("hapus-foto");
    const logoutButton = document.getElementById("logout");
    const form = document.querySelector("form");
    const username = document.getElementById("username");
    const email = document.getElementById("email");

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
            confirmButtonColor: "#68A3F3",
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
                            text: "Foto Anda telah dihapus!",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1500,
                            timerProgressBar: true,
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Gagal menghapus foto",
                            text: "Terjadi kesalahan saat menghapus foto!",
                        });
                    }
                } catch (error) {
                    console.error("Error during delete:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Terjadi kesalahan saat menghapus foto!",
                    });
                }
            }
        });
    });

    // Logout
    logoutButton.addEventListener("click", async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("/api/auth/logout", {
                method: "GET",
            });
            window.location.href = response.url;
        } catch (error) {
            console.error("Error during logout:", error);
            Swal.fire({
                icon: "error",
                title: "Logout Failed",
                text: "Terjadi kesalahan saat logout!",
            });
        }
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
                text: "Terjadi kesalahan saat mengambil data!",
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

        try {
            const response = await fetch("/api/pasien", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Profile berhasil di update!",
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                });
            } else {
                const errorData = await response.json();
                console.error("Error submitting form:", errorData.message || response.statusText);
                Swal.fire({
                    icon: "error",
                    title: "Failed to update profile",
                    text: "Gagal memperbarui profil!",
                });
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            Swal.fire({
                icon: "error",
                title: "An error occurred",
                text: "Terjadi kesalahan saat memperbarui profil!",
            });
        }
    });

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
