// fungsi Chart JS
const ctx = document.getElementById('myBarChart').getContext('2d');

new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
        datasets: [{
            label: 'Data Pengunjung',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: 'rgba(0, 123, 255, 0.8)', // Warna primary Bootstrap dengan transparansi
            borderRadius: 10 // Menambahkan radius pada batang
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true, // Menampilkan label di atas chart
            }
        },
        scales: {
            x: {
                grid: {
                    display: false // Menghilangkan grid pada sumbu x
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: '#e9ecef' // Warna grid yang lebih lembut
                }
            }
        }
    }
});

// Donut Chart
const pieCtx = document.getElementById('myPieChart').getContext('2d');
new Chart(pieCtx, {
    type: 'doughnut',
    data: {
        labels: ['Anak-anak', 'Remaja', 'Dewasa'],
        datasets: [{
            data: [55, 30, 15],
            backgroundColor: ['#007bff', '#28a745', '#17a2b8'], // Primary, Success, Info
            hoverBackgroundColor: ['#0056b3', '#1e7e34', '#117a8b'],
            hoverBorderColor: 'rgba(234, 236, 244, 1)'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false // Menghilangkan legenda di atas chart
            },
            tooltip: {
                backgroundColor: 'rgba(255,255,255,0.9)',
                titleColor: '#6e707e',
                borderColor: '#dddfeb',
                borderWidth: 1,
                bodyColor: '#858796'
            }
        },
        cutout: '70%' // Mengatur ukuran lubang di tengah donut
    }
});

// Function resize
function toggleLinknyaClass() {
    if (window.innerWidth < 992) {
        const logo = document.getElementById("logo");
        const logo2 = document.getElementById("logo2");

        logo.classList.add('d-none');
        logo2.classList.remove('d-none');
    } else {
        const logo = document.getElementById("logo");
        logo.style.width = '130px';
    }
}

toggleLinknyaClass();
window.addEventListener('resize', toggleLinknyaClass);

// Fungsi Toggle BTN
const togleBtn = document.getElementById("sidebarToggle");
togleBtn.addEventListener("click", function () {
    const logo = document.getElementById("logo");
    const logo2 = document.getElementById("logo2");

    logo.classList.toggle('d-none');
    logo2.classList.toggle('d-none');
});