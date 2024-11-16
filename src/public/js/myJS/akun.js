// Update Profile Picture Preview
let profilePic = document.getElementById("profile-pic");
let inputPic = document.getElementById("foto");
let removePicButton = document.querySelector(".hapusFoto");

inputPic.onchange = function () {
    const file = inputPic.files[0];
    if (file) {
        profilePic.src = URL.createObjectURL(file); // Preview the image
    }
};

// Hapus Foto button
removePicButton.addEventListener("click", function (event) {
    event.preventDefault();

    profilePic.src = "../img/asset/testimonial/1.jpg"; // Or any default image
    inputPic.value = "";
});

document.addEventListener("DOMContentLoaded", async () => {
    const form = document.querySelector("form");
    const usernameInput = document.getElementById("userName");
    const emailInput = document.getElementById("email");

    try {
        // Fetch Pasien Data
        const pasienResponse = await fetch("/api/pasien/user");
        if (pasienResponse.ok) {
            const pasienData = await pasienResponse.json();

            for (const key in pasienData) {
                // Isi foto profil
                if (key === "fotoProfil") {
                    if (pasienData[key]) {
                        profilePic.src = `/uploads/${pasienData[key]}`;
                    }
                } else {
                    // Isi data text
                    const input = document.querySelector(`[name="${key}"]`);
                    if (input) input.value = pasienData[key];
                }
            }
        }

        // Fetch User Data (username, email)
        const userResponse = await fetch("/api/user");
        if (userResponse.ok) {
            const userData = await userResponse.json();
            usernameInput.value = userData[0]?.username || "";
            emailInput.value = userData[0]?.email || "";
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Create FormData for file upload
        const formData = new FormData(form);
        formData.delete("username"); // Exclude username
        formData.delete("email"); // Exclude email

        try {
            const response = await fetch("/api/pasien", {
                method: "POST", //
                body: formData,
            });

            if (response.ok) {
                alert("Profile updated successfully!");
                const responseData = await response.json();
            } else {
                const errorData = await response.json();
                console.error("Error submitting form:", errorData.message || response.statusText);
                alert("Failed to update profile.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occurred. Please try again.");
        }
    });
});

// Responsive Navbar Handling
function toggleLinkClass() {
    const navLinks = document.querySelectorAll(".navbar-nav .nav-tengah");
    const btn = document.querySelector(".tombol");
    const cont1 = document.querySelector(".csc1");

    if (window.innerWidth < 992) {
        // Mobile view
        navLinks.forEach((link) => {
            link.classList.remove("linknya");
            link.classList.add("link-hp");
        });
        btn.style.marginTop = "20px";
        if (cont1) cont1.style.marginTop = "50px";
    } else {
        // Desktop view
        navLinks.forEach((link) => {
            link.classList.add("linknya");
            link.classList.remove("link-hp");
        });
        btn.style.marginTop = "0px";
        if (cont1) cont1.style.marginTop = "0px";
    }
}

// Initialize Navbar Toggle
toggleLinkClass();
window.addEventListener("resize", toggleLinkClass);
