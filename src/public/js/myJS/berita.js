document.addEventListener("DOMContentLoaded", () => {
  // untuk mengambil data informasi  
  const fetchData = async () => {
    try {
      const informasiResponse = await fetch("/api/informasi");

      if (informasiResponse.ok) {
        const data = await informasiResponse.json();
        const cardContainer = document.getElementById("Card");

        data.forEach((item) => {
          const cardHTML = `
            <!-- Card 1 -->
            <div class="kartuInforma mb-4 p-3 card-container">
              <img src="${item.foto}" class="card-img-top custom-img" alt="" width="300" height="190">
              <div class="card-content">
                <!-- Judul dengan text truncation -->
                <h5 class="mt-3 mb-3 card-title" style="color: black; font-weight: bold;">${item.judul}</h5>
                <h6>${item.created.substring(0, 10)}</h6>
                <p class="card-text">${item.isi}</p>
                <div class="d-flex justify-content-end">
                  <a href="/informasi/${item.idInformasi}" class="btn btn-success card-link mt-3" style="font-weight: bold;">Lihat Detail</a>
                </div>
              </div>
            </div>
            `;
          cardContainer.innerHTML += cardHTML;
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  fetchData();

  // Untuk memainkan tombol
  // Ambil tombol
  const btnBerita = document.getElementById("btnBerita");
  const btnLayanan = document.getElementById("btnLayanan");
  const btnFasilitas = document.getElementById("btnFasilitas");
  const btnDokter = document.getElementById("btnDokter");

  // Fungsi untuk mengubah tombol yang aktif dan non-aktif
  const toggleActiveButton = (activeButton) => {
    // Ambil semua tombol
    const buttons = [btnBerita, btnLayanan, btnFasilitas, btnDokter];

    buttons.forEach(button => {
      if (button === activeButton) {
        button.classList.add("btnActive");
        button.classList.remove("btnNonActive");
      } else {
        button.classList.remove("btnActive");
        button.classList.add("btnNonActive");
      }
    });
  };

  // Event listener untuk tombol berita
  btnBerita.addEventListener("click", () => {
    toggleActiveButton(btnBerita);
    // Menampilkan atau menyembunyikan konten
    document.getElementById("Layanan").classList.add("d-none");
    document.getElementById("Card").classList.remove("d-none");
  });

  // Event listener untuk tombol layanan
  btnLayanan.addEventListener("click", () => {
    toggleActiveButton(btnLayanan);
    // Menampilkan atau menyembunyikan konten
    document.getElementById("Card").classList.add("d-none");
    document.getElementById("Layanan").classList.remove("d-none");
  });

  // Event listener untuk tombol fasilitas
  btnFasilitas.addEventListener("click", () => {
    toggleActiveButton(btnFasilitas);
    // Logika untuk konten Fasilitas jika diperlukan
  });

  // Event listener untuk tombol dokter
  btnDokter.addEventListener("click", () => {
    toggleActiveButton(btnDokter);
    // Logika untuk konten Dokter jika diperlukan
  });
});