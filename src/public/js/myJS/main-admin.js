async function getAdminInfo() {
    const response = await fetch(`/api/admin/user`);
    const data = await response.json();

    document.getElementById("admin-name").textContent = data.nama;
    document.getElementById("profile-pic").src = `/uploads/${data.fotoProfil}`;
}

async function logout() {
    const logoutButton = document.getElementById("logout");
    logoutButton.addEventListener("click", async (event) => {
        event.preventDefault();
        const response = await fetch("/api/auth/logout", {
            method: "GET",
        });
        window.location.href = response.url;
    });
}

// Function resize
function toggleLinknyaClass() {
    if (window.innerWidth < 992) {
        const logo = document.getElementById("logo");
        const logo2 = document.getElementById("logo2");

        logo.classList.add("d-none");
        logo2.classList.remove("d-none");
    } else {
        const logo = document.getElementById("logo");
        logo.style.width = "130px";
    }
}

toggleLinknyaClass();
window.addEventListener("resize", toggleLinknyaClass);

// Fungsi Toggle BTN
const togleBtn = document.getElementById("sidebarToggle");
togleBtn.addEventListener("click", function () {
    const logo = document.getElementById("logo");
    const logo2 = document.getElementById("logo2");

    logo.classList.toggle("d-none");
    logo2.classList.toggle("d-none");
});

document.addEventListener("DOMContentLoaded", () => {
    getAdminInfo();
    logout();
});
