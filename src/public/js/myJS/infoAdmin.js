function adjustLayout() {
    const cardContainers = document.querySelectorAll('.card-container');
    const isMobile = window.innerWidth <= 768;

    cardContainers.forEach(container => {
        if (isMobile) {
            container.style.flexDirection = 'column';
            container.style.alignItems = 'center';
        } else {
            container.style.flexDirection = 'row';
            container.style.alignItems = 'flex-start';
        }
    });
}

// Jalankan fungsi saat halaman dimuat dan saat ukuran layar berubah
window.addEventListener('load', adjustLayout);
window.addEventListener('resize', adjustLayout);

function adjustButtonLayout() {
    const cardActions = document.querySelectorAll('.card-actions');
    const isMobile = window.innerWidth <= 768;

    cardActions.forEach(action => {
        if (isMobile) {
            action.style.flexDirection = 'row';
            action.style.gap = '15px';
            action.style.justifyContent = 'center';
        } else {
            action.style.flexDirection = 'column';
            action.style.gap = '10px';
            action.style.justifyContent = 'start';
        }
    });
}

// Jalankan fungsi saat halaman dimuat dan saat ukuran layar berubah
window.addEventListener('load', adjustButtonLayout);
window.addEventListener('resize', adjustButtonLayout);