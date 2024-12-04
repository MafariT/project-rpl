document.addEventListener('DOMContentLoaded', function () {
  const btnSubmit = document.getElementById("btnSubmit");
  const form = document.querySelector("form");
  const emailInput = document.getElementById('email');
  
  form.addEventListener("submit", async function (event) {
    event.preventDefault(); 
    showLoading();
    const email = emailInput.value;
    const formData = new FormData();
    formData.append("email", email);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Silahkan periksa email anda',
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        }).then(() => {
          window.location.href = '/';
        });
      } else if (response.status === 404) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: "Email tidak ditemukan",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
        });
      } else {
          const errorData = await response.json();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorData?.message,
          });
        }
    } catch (error) {
      console.error('Error submitting forgot password request:', error);
      Swal.fire({
        icon: 'error',
        title: "Kesalahan jaringan",
        text: "Tidak dapat terhubung ke server, Periksa koneksi Anda dan coba lagi",
      });
    } finally {
      resetButton();
    }
  });

  const showLoading = () => {
    btnSubmit.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
    btnSubmit.disabled = true;
  };

  const resetButton = () => {
    btnSubmit.innerHTML = "Kirim";
    btnSubmit.disabled = false;
  };
});
  