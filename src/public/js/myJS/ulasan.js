document.addEventListener("DOMContentLoaded", async function () {
    const spinner = document.getElementById("spinner");
    const container = document.getElementById("tempatUlasan");
    const ulasanTextArea = document.getElementById("ulasan");
    const submitButton = document.getElementById("submit-button");
    const starElements = [
        document.getElementById("B1"),
        document.getElementById("B2"),
        document.getElementById("B3"),
        document.getElementById("B4"),
        document.getElementById("B5"),
    ];

    async function loadReviews() {
        try {
            const ulasanResponse = await fetch("/api/ulasan");

            if (ulasanResponse.ok) {
                const ulasanData = await ulasanResponse.json();
                spinner.remove();
                container.innerHTML = "";

                ulasanData.forEach(({ rating, created, isi, pasien }) => {
                    const stars = Array(rating).fill('<i class="fas fa-star text-warning"></i>').join("");
                    const ulasanHTML = `
                        <div class="mb-3 p-3" style="background-color: white; border-radius: 10px; border: 1px solid #ddd;">
                            <div class="d-flex align-items-center">
                                <img src="/uploads/${pasien?.fotoProfil || "default-profile.png"}" class="img-thumbnail rounded-circle" alt="author image" style="width: 100px; height: 100px" />
                                <div class="author ml-3">
                                    <h3 class="mb-1" style="color: black; font-weight: 600; font-size: 20px">${pasien?.nama || "Anonymous"}</h3>
                                    <p class="text-muted m-0">${new Date(created).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</p>
                                </div>
                            </div>
                            <p class="mt-3" style="color: black">${isi}</p>
                            <div class="rating">${stars}</div>
                        </div>
                    `;
                    container.innerHTML += ulasanHTML;
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    loadReviews();

    let selectedRating = null;

    starElements.forEach((star, index) => {
        star.addEventListener("mouseenter", function () {
            for (let i = 0; i <= index; i++) {
                starElements[i].style.color = "gold";
            }
        });

        star.addEventListener("mouseleave", function () {
            for (let i = 0; i <= index; i++) {
                starElements[i].style.color = "";
            }
        });

        star.addEventListener("click", function () {
            selectedRating = index + 1;
            for (let i = 0; i < starElements.length; i++) {
                if (i <= index) {
                    starElements[i].style.color = "gold";
                    starElements[i].classList.add("star2");
                } else {
                    starElements[i].style.color = "";
                    starElements[i].classList.remove("star2");
                }
            }
        });
    });

    submitButton.addEventListener("click", async function (event) {
        event.preventDefault();
        const ulasan = ulasanTextArea.value;

        if (selectedRating && ulasan) {
            const formData = new FormData();
            formData.append("rating", selectedRating);
            formData.append("isi", ulasan);

            try {
                const response = await fetch("/api/ulasan", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(Object.fromEntries(formData.entries())),
                });

                if (response.ok) {
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true,
                    });
                    $("#ulasanModal").modal("hide");

                    loadReviews();
                } else if (response.status === 404) {
                    Swal.fire({
                        icon: "warning",
                        title: "Harap isi data akun terlebih dahulu",
                        text: "Anda belum mengisi data akun, silakan lengkapi informasi akun Anda terlebih dahulu",
                    });
                } else {
                    const errorData = await response.json();
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: errorData?.message,
                    });
                }
            } catch (error) {
                console.error("Error submitting review:", error);
                Swal.fire({
                    icon: "error",
                    title: "Kesalahan jaringan",
                    text: "Tidak dapat terhubung ke server, Periksa koneksi Anda dan coba lagi",
                });
            }
        } else {
            Swal.fire({
                icon: "warning",
                text: "Pilih rating dan tulis ulasan terlebih dahulu",
            });
        }
    });
});
