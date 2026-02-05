document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');

    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('is-active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        mobileMenu.classList.remove('is-active');
        navMenu.classList.remove('active');
    }));

    // Sticky Navbar shadow on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            navbar.style.boxShadow = "0 2px 20px rgba(0,0,0,0.1)";
        } else {
            navbar.style.boxShadow = "none";
        }
    });


    // --- Category Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('hide');
                    item.classList.add('show');
                } else {
                    item.classList.remove('show');
                    item.classList.add('hide');
                }
            });
        });
    });


    // --- Lightbox Functionality ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeBtn = document.querySelector('.close-lightbox');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentIndex = 0;
    // Get all Visible items for navigation (in case of filtering) mechanism
    // Simplification: We will navigate through ALL items, or filtered?
    // User expectation: Navigate through visible items usually.
    // Let's implement navigation through ALL items for stability first, or better: 
    // update the list of "items to show" whenever filter changes. 

    // For simplicity and robustness in this static version, we'll iterate through the DOM list.
    // Ideally we skip hidden ones.

    const updateLightboxImage = (index) => {
        // Find the visible items
        const visibleItems = Array.from(galleryItems).filter(item => !item.classList.contains('hide'));

        // Wrap index
        if (index >= visibleItems.length) index = 0;
        if (index < 0) index = visibleItems.length - 1;

        currentIndex = index; // Update global index relative to visible items

        const item = visibleItems[index];
        const img = item.querySelector('img');
        const title = item.querySelector('.overlay h3').innerText;

        // Update Lightbox content
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.innerText = title;
    };

    // Open Lightbox
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            // Check if item is visible (it should be if clicked, but good to be safe)
            const visibleItems = Array.from(galleryItems).filter(i => !i.classList.contains('hide'));
            const index = visibleItems.indexOf(item);

            if (index !== -1) {
                lightbox.classList.add('active');
                updateLightboxImage(index);
                // Disable scroll
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close Lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    closeBtn.addEventListener('click', closeLightbox);

    // Close on click outside image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Navigation
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent closing
        updateLightboxImage(currentIndex - 1);
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateLightboxImage(currentIndex + 1);
    });

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') updateLightboxImage(currentIndex - 1);
        if (e.key === 'ArrowRight') updateLightboxImage(currentIndex + 1);
    });

});
