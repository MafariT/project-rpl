// Function resize
function toggleLinknyaClass() {
    if (window.innerWidth < 992) {
        const logo = document.getElementById("logo");
        const logo2 = document.getElementById("logo2");

        logo.classList.add('d-none');
        logo2.classList.remove('d-none');
    } else {
        const logo = document.getElementById("logo");
        logo.style.width = '130px';
    }
}

toggleLinknyaClass();
window.addEventListener('resize', toggleLinknyaClass);

// Fungsi Toggle BTN
const togleBtn = document.getElementById("sidebarToggle");
togleBtn.addEventListener("click", function () {
    const logo = document.getElementById("logo");
    const logo2 = document.getElementById("logo2");

    logo.classList.toggle('d-none');
    logo2.classList.toggle('d-none');
});