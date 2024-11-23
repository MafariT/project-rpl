function getLayanan() {
    const layanan = document.getElementById("Layanan");
    const card = document.getElementById("Card");

    layanan.classList.remove('d-none');
    card.classList.add('d-none');
}

function getberita() {
    const layanan = document.getElementById("Layanan");
    const card = document.getElementById("Card");

    layanan.classList.add('d-none');
    card.classList.add('d-flex');
}

let btnLayanan = document.getElementById("btnLayanan");
let btnBerita = document.getElementById("btnBerita");


btnLayanan.addEventListener("click", getLayanan);
btnBerita.addEventListener("click", getberita);
