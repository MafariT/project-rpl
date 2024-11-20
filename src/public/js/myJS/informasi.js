const fetchData = async () => {
  try {
      const informasiResponse = await fetch("/api/informasi");

      if (informasiResponse.ok) {
          const data = await informasiResponse.json();
          const cardContainer = document.getElementById("Card");

          data.forEach(item => {
            const cardHTML = `
            <!-- Card 1 -->
              <div class="mb-4 p-3" style="background-color: #F2F2F2; border-radius: 10px; width: 21rem; border: 1px solid black;">
                <img src="${item.foto}" class="card-img-top custom-img" alt="" width="300" height="190">
                <div class="">
                  <h5 class="mt-3 mb-3" style="color: black; font-weight: bold;">${item.judul}</h5>
                  <p class="card-text">${item.isi}</p>
                  <div class="d-flex justify-content-end">
                    <a href="" class="btn btn-success card-link mt-3" style="font-weight: bold;" data-toggle="modal"
                      data-target="#modal-${item.idInformasi}">Lihat Detail</a>
                  </div>
                </div>
              </div>
              <!-- Modal -->
              <div class="modal fade" id="modal-${item.idInformasi}" tabindex="-1" aria-labelledby="beritaLabeberita" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLabel" style="color: black;">${item.judul}</h5>
                    </div>
                    <div class="modal-body" style="color: black;">
                      ${item.isi}
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-danger" data-dismiss="modal" style="font-weight: bold;">Tutup</button>
                    </div>
                  </div>
                </div>
              </div>
            <!-- End Card and Modal -->
            `;
            cardContainer.innerHTML += cardHTML;
          });
        }
  } catch (error) {
    console.log(error);
  }
}

fetchData();

// Untuk Navbar
function toggleLinknyaClass() {
  const navLinks = document.querySelectorAll('.navbar-nav .nav-tengah');
  const btn = document.querySelector('.tombol');
  // const logo = document.querySelector('.puskeSmart');
  const cont1 = document.querySelector('.csc1');
  if (window.innerWidth < 992) {
    // Aktifkan tampilan mobile
    navLinks.forEach(link => {
      if (link.classList.contains('linknya')) {
        link.classList.remove('linknya');
        link.classList.add('link-hp');
      }
    });
    btn.style.marginTop = '20px';
    // logo.style.width = '40px';
    // logo.style.height = '40px';
    if (cont1) cont1.style.marginTop = '50px';
  } else {
    // Aktifkan tampilan desktop
    navLinks.forEach(link => {
      if (link.classList.contains('link-hp')) {
        link.classList.add('linknya');
        link.classList.remove('link-hp');
      }
    });
    // logo.style.width = '50px'; // Sesuaikan ukuran logo jika dibutuhkan
    // logo.style.height = '50px';
    btn.style.marginTop = '0px';
  }
}

toggleLinknyaClass();
window.addEventListener('resize', toggleLinknyaClass);