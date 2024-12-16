async function sendResponse(idUlasan, ulasan) {
    try {
        const response = await fetch(`/api/ulasan/${idUlasan}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(ulasan),
        });

        if (response.ok) {
            const data = await response.json();
            Swal.fire({
                icon: "success",
                title: "Response Sent",
                text: data.message || "Your response has been successfully sent.",
            });
        } else {
            throw new Error("Failed to send response");
        }
    } catch (error) {
        console.error("Error sending response:", error);
        Swal.fire({
            icon: "error",
            title: "Failed to send response",
            text: error.message,
        });
    } finally {
        fetchData("");
    }
}

async function fetchData(filter = "") {
    try {
        const response = await fetch(`/api/admin/ulasan-admin?filter=${filter}`);

        if (response.ok) {
            const data = await response.json();

            const tempatUlasan = document.getElementById("tempat-ulasan");
            tempatUlasan.innerHTML = "";

            document.getElementById("data-ulasan").textContent = data.ulasanCount;

            data.ulasanDetails.forEach((ulasan) => {
                const stars = Array(ulasan.rating).fill('<i class="fas fa-star text-warning"></i>').join("");
                const reviewCard = document.createElement("div");
                reviewCard.classList.add("mb-3", "p-3");
                reviewCard.style.backgroundColor = "white";
                reviewCard.style.borderRadius = "10px";
                reviewCard.style.border = "1px solid #ddd";

                const cardContent = `
                    <div class="d-flex align-items-center">
                        <img src="/uploads/${ulasan.pasien.fotoProfil || "default-profile.png"}" class="img-thumbnail rounded-circle" alt="author image" style="width: 75px; height: 75px" />
                        <div class="author ml-3">
                            <h3 class="mb-1" style="color: black; font-weight: 600; font-size: 20px">${ulasan.pasien.nama || "Anonymous"}</h3>
                            <p class="text-muted m-0">${new Date(ulasan.created).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</p>
                        </div>
                    </div>
                    <p class="mt-3" style="color: black">${ulasan.isi}</p>
                    <div class="d-flex align-items-center justify-content-between mt-5">
                        <div class="rating" style="color: gold;">${stars}</div>
                        <div>
                            <button class="btn btn-primary btn-balas" id="btnBalas${ulasan.idUlasan}">Balas</button>
                        </div>
                    </div>
                    <form action="" method="" class="form-group mt-3" id="isiBalasan${ulasan.idUlasan}" style="display: none;">
                        <label for="response">Balas</label>
                        <textarea class="form-control" id="response${ulasan.idUlasan}" rows="5" placeholder="Masukkan Balasan"></textarea>
                        <div class="mt-3 d-flex justify-content-end">
                            <button type="submit" class="btn btn-primary">Kirim</button>
                        </div>
                    </form>
                `;

                reviewCard.innerHTML = cardContent;

                if (ulasan.balasan) {
                    const balasanDiv = document.createElement("div");
                    balasanDiv.style.marginTop = "10px";
                    balasanDiv.style.paddingLeft = "30px";
                    balasanDiv.style.borderLeft = "3px solid #ddd";
                    balasanDiv.style.paddingTop = "10px";
                    balasanDiv.innerHTML = `
                            <div class="d-flex align-items-center">
                                <img src="../img/asset/logo.png" class="img-thumbnail rounded-circle" alt="author image" style="width: 75px; height: 75px" />
                                <div class="author ml-3">
                                    <h3 class="mb-1" style="color: #007bff; font-weight: 600; font-size: 18px">Admin Puskesmart</h3>
                                    <p class="text-muted m-0">${new Date(ulasan.balasanCreated).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</p>
                                </div>
                            </div>
                            <p class="mt-3" style="color: black;">${ulasan.balasan}</p>
                        `;
                    reviewCard.appendChild(balasanDiv);
                }

                tempatUlasan.appendChild(reviewCard);

                const replyButton = document.getElementById(`btnBalas${ulasan.idUlasan}`);
                const replyForm = document.getElementById(`isiBalasan${ulasan.idUlasan}`);
                const replyTextarea = document.getElementById(`response${ulasan.idUlasan}`);

                replyButton.addEventListener("click", () => {
                    replyForm.style.display = replyForm.style.display === "none" ? "block" : "none";
                });

                // Handle form submission
                replyForm.addEventListener("submit", (e) => {
                    e.preventDefault();
                    const responseText = replyTextarea.value.trim();
                    if (responseText) {
                        sendResponse(ulasan.idUlasan, { ...ulasan, balasan: responseText });
                    } else {
                        Swal.fire({
                            icon: "warning",
                            title: "Empty Response",
                            text: "Please enter a response before submitting.",
                        });
                    }
                });
            });
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
            icon: "error",
            title: "Failed to fetch data",
            text: error,
        });
    }
}

function updateHeading(filterType) {
    const heading = document.getElementById("filter-heading");
    heading.textContent = `Data Ulasan - ${filterType}`;
}

document.getElementById("toggle-weekly").addEventListener("click", () => {
    fetchData("weekly");
    updateHeading("Mingguan");
});
document.getElementById("toggle-monthly").addEventListener("click", () => {
    fetchData("monthly");
    updateHeading("Bulanan");
});
document.getElementById("toggle-total").addEventListener("click", () => {
    fetchData("");
    updateHeading("Total");
});

document.addEventListener("DOMContentLoaded", () => {
    fetchData();
});
