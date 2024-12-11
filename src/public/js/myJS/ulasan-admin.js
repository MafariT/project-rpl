// Tunggu hingga DOM sepenuhnya dimuat
window.onload = function() {
    // Seleksi semua tombol dengan kelas .btn-balas
    const tombolBalas = document.querySelectorAll('.btn-balas');
  
    tombolBalas.forEach(button => {
      button.addEventListener('click', function() {
        // Temukan elemen parent dari tombol yang diklik
        const parentCard = button.closest('.mb-3');
  
        // Cari form dengan id isiBalasan di dalam elemen parent
        const formBalasan = parentCard.querySelector('#isiBalasan');
  
        // Tampilkan form balasan dan sembunyikan tombol
        if (formBalasan) {
          formBalasan.style.display = 'block';
          button.style.display = 'none';
        }
      });
    });
  
    // Tambahkan event listener untuk form submit
    const semuaFormBalasan = document.querySelectorAll('#isiBalasan');
  
    semuaFormBalasan.forEach(form => {
      form.addEventListener('submit', function(event) {
        event.preventDefault(); // Mencegah pengiriman form default
  
        const parentCard = form.closest('.mb-3');
        const textarea = form.querySelector('#response');
        const userResponse = textarea.value.trim();
  
        if (userResponse) {
          // Buat elemen baru untuk menampilkan balasan
          const balasanDiv = document.createElement('div');
          balasanDiv.innerHTML = `
            <hr>
            <div class="d-flex align-items-center">
              <img src="../img/asset/testimonial/1.jpg" class="img-thumbnail rounded-circle" alt="author image" style="width: 100px; height: 100px" />
              <div class="author ml-3">
                <h3 class="mb-1" style="color: black; font-weight: 600; font-size: 20px">Agus Subianto</h3>
                <p class="text-muted m-0">24 November 2024</p>
              </div>
            </div>
            <p class="mt-3" style="color: black">${userResponse}</p>
          `;
  
          // Tambahkan balasan ke dalam card
          parentCard.appendChild(balasanDiv);
  
          // Kosongkan textarea dan sembunyikan form
          textarea.value = '';
          form.style.display = 'none';
        }
      });
    });
  };