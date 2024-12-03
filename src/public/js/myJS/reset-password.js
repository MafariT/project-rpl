document.addEventListener('DOMContentLoaded', function () {
  const submitButton = document.getElementById('btnSubmit');
  const newPasswordInput = document.getElementById('newPassword');
  
  const pathParts = window.location.pathname.split('/');
  const token = pathParts[pathParts.length - 1];

  submitButton.addEventListener("click", async function (event) {
    event.preventDefault();
    const newPassword = newPasswordInput.value;

    const formData = new FormData();
    formData.append("token", token);
    formData.append("newPassword", newPassword);

    try {
      const response = await fetch(`/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });

      console.log(response)
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        }).then(() => {
          window.location.href = '/login';
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
      console.error('Error submitting reset password request:', error);
      Swal.fire({
        icon: 'error',
        title: "Kesalahan jaringan",
        text: "Tidak dapat terhubung ke server, Periksa koneksi Anda dan coba lagi",
      });
    }
  });
});
