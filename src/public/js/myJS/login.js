const urlParams = new URLSearchParams(window.location.search);
const error = urlParams.get("error");

if (error === "invalid-credential") {
    document.getElementById("error-message").style.display = "block";
}
