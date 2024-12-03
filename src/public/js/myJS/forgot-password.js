document.addEventListener('DOMContentLoaded', function () {
    const submitButton = document.getElementById('btnSubmit');
    const emailInput = document.getElementById('email');
    
    submitButton.addEventListener("submit", async function (event) {
      event.preventDefault(); 
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
  
        console.log(response);
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
      }
    });
  });
  