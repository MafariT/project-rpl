document.addEventListener('DOMContentLoaded', function () {
  // Start Ambil data
  const testimonials = [{
      id: 1,
      nama: "Agus Subianto",
      tanggal: "2024-11-06",
      foto: "../img/asset/testimonial/1.jpg",
      rating: 4,
      ulasan: "Mantap sekali website ini, sungguh memudahkan saya dalam administrasi Puskesmas."
    },
    {
      id: 2,
      nama: "Dewi Sartika",
      tanggal: "2024-10-15",
      foto: "../img/asset/testimonial/2.jpg",
      rating: 5,
      ulasan: "Layanan sangat memuaskan dan cepat!"
    }
  ];

  const container = document.getElementById("tempatUlasan");

  testimonials.forEach(({
    nama,
    tanggal,
    foto,
    rating,
    ulasan
  }) => {
    // Generate HTML for stars
    const stars = Array(rating)
      .fill('<i class="fas fa-star text-warning"></i>')
      .join("");

    // Append testimonial
    const testimonialHTML = `
      <div class="mb-3 p-3" style="background-color: white; border-radius: 10px;">
        <div class="d-flex align-items-center">
          <img src="${foto}" class="img-thumbnail rounded-circle" alt="author image" style="width: auto; height: 100px" />
          <div class="author ml-3">
            <h3 class="mb-1" style="color: black; font-weight: 600; font-size: 20px">${nama}</h3>
            <p class="text-muted m-0">${new Date(tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</p>
          </div>
        </div>
        <p class="mt-3" style="color: black">${ulasan}</p>
        <div class="rating">${stars}</div>
      </div>
    `;
    container.innerHTML += testimonialHTML;
  });
  // End Ambil Data


  // untuk mengklik
  // Ambil elemen bintang dan textarea
  const bintangContainer = document.getElementById('star-rating');
  const ulasanTextArea = document.getElementById('ulasan');
  const submitButton = document.getElementById('submit-button');

  // Event listener untuk klik pada bintang
  bintangContainer.addEventListener('click', function (event) {
    const clickedStar = event.target.closest('.star'); // Mendapatkan elemen yang diklik
    const ulsBar = ulasanTextArea;

    if (clickedStar) {
      const starValue = clickedStar.getAttribute('data-value'); // Ambil nilai dari data-value
      const ulasanBar = ulsBar.value; // Ambil isi dari textarea
      console.log(`Bintang ${starValue} diklik dan isinya adalah "${ulasanBar}"`);
    }
  });

  // Event listener untuk tombol kirim ulasan
  submitButton.addEventListener('click', function (event) {
    event.preventDefault(); // Mencegah refresh halaman
    const clickedStar = event.target.closest('.star');
    const starValue = clickedStar.getAttribute('data-value');
    if (starValue) {
      const ulasan = ulasanTextArea.value;
      console.log(`Rating: ${starValue}, Ulasan: "${ulasan}"`);
    } else {
      console.log('Silakan pilih rating terlebih dahulu!');
    }
  });
  // End Klik

  // Untuk Menghover
  // bintang 1
  const bintang1 = document.getElementById("B1");
  bintang1.addEventListener("mouseenter", function () {
    bintang1.style.color = 'gold';
  });
  bintang1.addEventListener("mouseleave", function () {
    bintang1.style.color = '';
  });

  // Bintang 2
  const bintang2 = document.getElementById("B2");
  bintang2.addEventListener("mouseenter", function () {
    bintang1.style.color = 'gold';
    bintang2.style.color = 'gold';
  });
  bintang2.addEventListener("mouseleave", function () {
    bintang1.style.color = '';
    bintang2.style.color = '';
  });

  // Bintang 3
  const bintang3 = document.getElementById("B3");
  bintang3.addEventListener("mouseenter", function () {
    bintang1.style.color = 'gold';
    bintang2.style.color = 'gold';
    bintang3.style.color = 'gold';
  });
  bintang3.addEventListener("mouseleave", function () {
    bintang1.style.color = '';
    bintang2.style.color = '';
    bintang3.style.color = '';
  });

  // Bintang 4
  const bintang4 = document.getElementById("B4");
  bintang4.addEventListener("mouseenter", function () {
    bintang1.style.color = 'gold';
    bintang2.style.color = 'gold';
    bintang3.style.color = 'gold';
    bintang4.style.color = 'gold';
  });
  bintang4.addEventListener("mouseleave", function () {
    bintang1.style.color = '';
    bintang2.style.color = '';
    bintang3.style.color = '';
    bintang4.style.color = '';
  });

  // Bintang 5
  const bintang5 = document.getElementById("B5");
  bintang5.addEventListener("mouseenter", function () {
    bintang1.style.color = 'gold';
    bintang2.style.color = 'gold';
    bintang3.style.color = 'gold';
    bintang4.style.color = 'gold';
    bintang5.style.color = 'gold';
  });
  bintang5.addEventListener("mouseleave", function () {
    bintang1.style.color = '';
    bintang2.style.color = '';
    bintang3.style.color = '';
    bintang4.style.color = '';
    bintang5.style.color = '';
  });

  // Untuk mengklik menjadi active
  bintang1.addEventListener("click", function () {
    // untuk menambahkan star 2
    bintang1.classList.add("star2");
    // untuk menghapus star 2
    bintang2.classList.remove("star2");
    bintang3.classList.remove("star2");
    bintang4.classList.remove("star2");
    bintang5.classList.remove("star2");
  });

  bintang2.addEventListener("click", function () {
    // untuk menambahkan star2
    bintang1.classList.add("star2");
    bintang2.classList.add("star2");
    // untuk menghapus star 2
    bintang3.classList.remove("star2");
    bintang4.classList.remove("star2");
    bintang5.classList.remove("star2");
  });

  bintang3.addEventListener("click", function () {
    // untuk menambahkan star2
    bintang1.classList.add("star2");
    bintang2.classList.add("star2");
    bintang3.classList.add("star2");
    // untuk menghapus star 2
    bintang4.classList.remove("star2");
    bintang5.classList.remove("star2");
  });

  bintang4.addEventListener("click", function () {
    // untuk menambahkan star2
    bintang1.classList.add("star2");
    bintang2.classList.add("star2");
    bintang3.classList.add("star2");
    bintang4.classList.add("star2");
    // untuk menghapus star 2
    bintang5.classList.remove("star2");
  });

  bintang5.addEventListener("click", function () {
    // untuk menambahkan star2
    bintang1.classList.add("star2");
    bintang2.classList.add("star2");
    bintang3.classList.add("star2");
    bintang4.classList.add("star2");
    bintang5.classList.add("star2");
    // untuk menghapus star 2
  });
});