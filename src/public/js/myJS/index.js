function toggleLinknyaClass() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-tengah');
    const btn = document.querySelector('.tombol');
    // const logo = document.querySelector('.puskeSmart');
    const cont1 = document.querySelector('.csc1');
    if (window.innerWidth < 992) {
        // Aktifkan tampilan mobile
        navLinks.forEach(link => {
            if (link.classList.contains('linknya')) {
                link.classList.remove('linknya');
                link.classList.add('link-hp');
            }
        });
        btn.style.marginTop = '20px';
        // logo.style.width = '40px';
        // logo.style.height = '40px';
        if (cont1) cont1.style.marginTop = '50px';
    } else {
        // Aktifkan tampilan desktop
        navLinks.forEach(link => {
            if (link.classList.contains('link-hp')) {
                link.classList.add('linknya');
                link.classList.remove('link-hp');
            }
        });
        // logo.style.width = '50px'; // Sesuaikan ukuran logo jika dibutuhkan
        // logo.style.height = '50px';
        btn.style.marginTop = '0px';
    }
}

toggleLinknyaClass();
window.addEventListener('resize', toggleLinknyaClass);
