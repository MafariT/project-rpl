document.addEventListener("DOMContentLoaded", () => {
    const profilePic = document.getElementById("profile-pic");
    const inputPic = document.getElementById("foto");
    const removePicButton = document.querySelector(".hapusFoto");
    const form = document.querySelector("form");
    const username = document.getElementById("username");
    const email = document.getElementById("email");

    // Update Profile Picture Preview
    inputPic.addEventListener("change", () => {
        const file = inputPic.files[0];
        if (file) {
            profilePic.src = URL.createObjectURL(file);
        }
    });

    // Remove Profile Picture
    removePicButton.addEventListener("click", (event) => {
        event.preventDefault();
        profilePic.src = "default.jpg";
        inputPic.value = "";
    });

    // Fetch and Populate Data
    const fetchData = async () => {
        try {
            const [pasienResponse, userResponse] = await Promise.all([fetch("/api/pasien/user"), fetch("/api/user")]);

            if (pasienResponse.ok) {
                const pasienData = await pasienResponse.json();
                for (const [key, value] of Object.entries(pasienData)) {
                    if (key === "fotoProfil" && value) {
                        profilePic.src = `/uploads/${value}`;
                    } else {
                        const input = document.querySelector(`[name="${key}"]`);
                        if (input) input.value = value;
                    }
                }
            }

            if (userResponse.ok) {
                const userData = await userResponse.json();
                username.value = userData.username || "";
                email.value = userData.email || "";
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    fetchData();

    // Handle Form Submission
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(form);

        // Exclude username and email from the form data
        formData.delete("username");
        formData.delete("email");

        try {
            const response = await fetch("/api/pasien", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                alert("Profile updated successfully!");
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
});
