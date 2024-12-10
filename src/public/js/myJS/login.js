const form = document.querySelector("form");

async function login() {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const jsonData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jsonData),
            });
            if (response.status === 200) {
                window.location.href = "/home";
            } else if (response.status === 302) {
                window.location.href = "/dashboard-admin";
            } else if (response.status === 401) {
                Swal.fire({
                    icon: "error",
                    title: "Login Failed",
                    text: "Nama pengguna atau kata sandi salah",
                    timer: 3000,
                    timerProgressBar: true,
                });
            } else {
                const errorData = await response.json();
                console.error("Error submitting form:", errorData || response.statusText);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: errorData?.message,
                });
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            Swal.fire({
                icon: "error",
                title: "Kesalahan jaringan",
                text: "Tidak dapat terhubung ke server, Periksa koneksi Anda dan coba lagi",
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    login();
});
