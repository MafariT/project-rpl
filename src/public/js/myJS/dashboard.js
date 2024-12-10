const ctx = document.getElementById("myBarChart").getContext("2d");
const barChart = new Chart(ctx, {
    type: "bar",
    data: {
        labels: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
        datasets: [
            {
                label: "Data Pengunjung",
                data: [],
                backgroundColor: "rgba(0, 123, 255, 0.8)",
                borderRadius: 10,
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: "#e9ecef",
                },
            },
        },
    },
});

const pieCtx = document.getElementById("myPieChart").getContext("2d");
const pieChart = new Chart(pieCtx, {
    type: "doughnut",
    data: {
        labels: ["Anak-anak", "Remaja", "Dewasa"],
        datasets: [
            {
                data: [],
                backgroundColor: ["#007bff", "#28a745", "#17a2b8"],
                hoverBackgroundColor: ["#0056b3", "#1e7e34", "#117a8b"],
                hoverBorderColor: "rgba(234, 236, 244, 1)",
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: "rgba(255,255,255,0.9)",
                titleColor: "#6e707e",
                borderColor: "#dddfeb",
                borderWidth: 1,
                bodyColor: "#858796",
            },
        },
        cutout: "70%",
    },
});

async function updateCharts(filter = "") {
    try {
        const response = await fetch(`/api/admin/dashboard?filter=${filter}`);
        const data = await response.json();
        console.log(data);

        document.getElementById("total").textContent = data.total || 0;
        document.getElementById("verified").textContent = data.verified || 0;
        document.getElementById("not-verified").textContent = data.notVerified || 0;
        document.getElementById("bad-review").textContent = data.badReview || 0;

        barChart.data.datasets[0].data = [
            data.daysOfWeek.senin,
            data.daysOfWeek.selasa,
            data.daysOfWeek.rabu,
            data.daysOfWeek.kamis,
            data.daysOfWeek.jumat,
            data.daysOfWeek.sabtu,
            data.daysOfWeek.minggu,
        ];
        barChart.update();

        pieChart.data.datasets[0].data = [data.anakAnak, data.remaja, data.dewasa];
        pieChart.update();
    } catch (error) {
        console.error("Error updating charts:", error);
    }
}

document.getElementById("toggle-weekly").addEventListener("click", () => updateCharts("weekly"));
document.getElementById("toggle-monthly").addEventListener("click", () => updateCharts("monthly"));
document.getElementById("toggle-total").addEventListener("click", () => updateCharts(""));

updateCharts();

function toggleLinknyaClass() {
    if (window.innerWidth < 992) {
        const logo = document.getElementById("logo");
        const logo2 = document.getElementById("logo2");

        logo.classList.add("d-none");
        logo2.classList.remove("d-none");
    } else {
        const logo = document.getElementById("logo");
        logo.style.width = "130px";
    }
}

toggleLinknyaClass();
window.addEventListener("resize", toggleLinknyaClass);

const togleBtn = document.getElementById("sidebarToggle");
togleBtn.addEventListener("click", function () {
    const logo = document.getElementById("logo");
    const logo2 = document.getElementById("logo2");

    logo.classList.toggle("d-none");
    logo2.classList.toggle("d-none");
});
