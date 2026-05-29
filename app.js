/* ELITE HIGH-ENERGY EDITORIAL FRONTEND LOGIC FOR PPAPARAZZI BAR */

// 📖 3-SHEET (6-PAGE) 3D SCROLL-BOUND MENU BOOK PHYSICS (TRACKS STICKY RUNWAY)
const pinWrapper = document.querySelector('.scroll-pin-wrapper');
const menuBook = document.getElementById('menu-book');
const sheet1 = document.getElementById('sheet-1');
const sheet2 = document.getElementById('sheet-2');
const sheet3 = document.getElementById('sheet-3');

window.addEventListener('scroll', () => {
    // Check if 3D book viewport is active (only on desktop >= 1025px)
    if (window.innerWidth < 1025) return;

    const scrollY = window.scrollY;
    
    // Locate the parent scroll-pin-wrapper relative to the document
    const wrapperRect = pinWrapper.getBoundingClientRect();
    const wrapperTop = wrapperRect.top + scrollY;
    const wrapperHeight = wrapperRect.height;
    
    // The pinning happens during the full height of the wrapper minus 100vh of the sticky viewport
    const startScroll = wrapperTop;
    const endScroll = wrapperTop + wrapperHeight - window.innerHeight;
    
    // Calculate progress ratio (0.0 to 1.0)
    let progress = (scrollY - startScroll) / (endScroll - startScroll);
    progress = Math.max(0, Math.min(1, progress)); // Bound between 0 and 1

    // 📖 3-SHEET PAGE-TURNING PROGRESS PHASES:
    // Phase 1 (0.0 to 0.33): Sheet 1 flips from 0deg to -180deg
    // Phase 2 (0.33 to 0.66): Sheet 2 flips from 0deg to -180deg
    // Phase 3 (0.66 to 1.00): Sheet 3 flips from 0deg to -180deg
    
    let angle1 = 0;
    let angle2 = 0;
    let angle3 = 0;

    // Sheet 1 turn physics
    if (progress <= 0.33) {
        const factor = progress / 0.33;
        angle1 = factor * -180;
    } else {
        angle1 = -180;
    }

    // Sheet 2 turn physics
    if (progress > 0.33 && progress <= 0.66) {
        const factor = (progress - 0.33) / 0.33;
        angle2 = factor * -180;
    } else if (progress > 0.66) {
        angle2 = -180;
    }

    // Sheet 3 turn physics
    if (progress > 0.66) {
        const factor = (progress - 0.66) / 0.34;
        angle3 = factor * -180;
    }

    // Apply exact Y-rotations dynamically
    sheet1.style.transform = `rotateY(${angle1}deg)`;
    sheet2.style.transform = `rotateY(${angle2}deg)`;
    sheet3.style.transform = `rotateY(${angle3}deg)`;

    // DYNAMIC Z-INDEXING TO PREVENT FLICKER LAYER CLIPPING
    sheet1.style.zIndex = (angle1 < -90) ? 1 : 10;
    sheet2.style.zIndex = (angle2 < -90) ? 2 : 9;
    sheet3.style.zIndex = (angle3 < -90) ? 3 : 8;

    // Subtly tilt the entire book as we flip pages to add organic depth
    const bookTilt = (progress - 0.5) * -12; // -6deg to +6deg
    menuBook.style.transform = `rotateX(15deg) rotateY(${bookTilt}deg)`;
});

// Mobile Image Zoom Lightbox controls
const mobileLightbox = document.getElementById('mobile-lightbox');
const lightboxImg = document.getElementById('lightbox-img');

function zoomMobileImage(imgElement) {
    lightboxImg.src = imgElement.src;
    mobileLightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop mobile background scroll
}

function closeMobileZoom() {
    mobileLightbox.classList.remove('active');
    document.body.style.overflow = 'auto'; // Enable scroll
}

// Booking Modal Drawer Controls
const modal = document.getElementById('booking-modal');
const formScreen = document.getElementById('modal-form-screen');
const successScreen = document.getElementById('modal-success-screen');

function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop background scroll
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Enable scroll
    
    // Reset screens after close transition completes
    setTimeout(() => {
        formScreen.classList.remove('hidden');
        formScreen.style.opacity = '1';
        successScreen.classList.add('hidden');
        document.getElementById('reservation-form').reset();
        document.getElementById('guests-count-val').innerText = '4';
    }, 400);
}

// Handle Reservation Form Submission (WhatsApp Priority Routing)
function handleReservationSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('booking-name').value;
    const phone = document.getElementById('booking-phone').value;
    const dateInput = document.getElementById('booking-date').value;
    const time = document.getElementById('booking-time').value;
    const guests = document.getElementById('booking-guests').value;

    // Format human-readable date
    const formattedDate = new Date(dateInput).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    // Populate receipt details
    document.getElementById('receipt-name').innerText = name;
    document.getElementById('receipt-guests').innerText = `${guests} Guests`;
    document.getElementById('receipt-schedule').innerText = `${formattedDate} at ${time}`;

    // Generate Direct WhatsApp redirect link pre-filled
    const managerPhone = "919836515932"; // Ppaparazzi manager cell
    const textMsg = `Hi Ppaparazzi! I would like to book a VIP table for ${guests} guests on ${formattedDate} at ${time} under the name "${name}". Please confirm my booking! (Phone: ${phone})`;
    const encodedMsg = encodeURIComponent(textMsg);
    const waUrl = `https://wa.me/${managerPhone}?text=${encodedMsg}`;
    
    document.getElementById('whatsapp-direct-link').href = waUrl;

    // Transition between form and success screens
    formScreen.style.transition = 'opacity 0.3s ease';
    formScreen.style.opacity = '0';
    
    setTimeout(() => {
        formScreen.classList.add('hidden');
        successScreen.classList.remove('hidden');
        successScreen.style.opacity = '0';
        successScreen.style.transition = 'opacity 0.4s ease';
        
        // Force reflow
        successScreen.offsetHeight;
        successScreen.style.opacity = '1';
    }, 300);

    // Production log simulation
    console.log("VIP Direct Booking Sent to Ppaparazzi Manager:");
    console.log("Name:", name, "| Phone:", phone, "| Guests:", guests, "| Schedule:", formattedDate, time);
}

// 📲 MOBILE TOUCH SWIPE CAROUSEL SCROLL DOT INDICATOR SYNCHRONIZER
const slider = document.querySelector('.mobile-menu-slider');
const dots = document.querySelectorAll('.dot');

if (slider && dots.length > 0) {
    slider.addEventListener('scroll', () => {
        const scrollPosition = slider.scrollLeft + (slider.clientWidth / 2);
        const slides = document.querySelectorAll('.mobile-menu-slide');
        
        let activeIndex = 0;
        let minDiff = Infinity;
        
        slides.forEach((slide, idx) => {
            const slideCenter = slide.offsetLeft + (slide.clientWidth / 2);
            const diff = Math.abs(scrollPosition - slideCenter);
            if (diff < minDiff) {
                minDiff = diff;
                activeIndex = idx;
            }
        });
        
        dots.forEach((dot, idx) => {
            if (idx === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    });
}
