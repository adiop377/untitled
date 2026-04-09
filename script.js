document.addEventListener('DOMContentLoaded', () => {
    // Dialog typing effect
    const dialogText = document.querySelector('.dialog p');
    if (dialogText) {
        const text = dialogText.textContent;
        dialogText.textContent = '';
        let i = 0;

        function typeWriter() {
            if (i < text.length) {
                dialogText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        // Start typing after a short delay
        setTimeout(typeWriter, 1000);
    }

    // Modal logic
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('imgModal');
    const closeBtn = document.querySelector('.close-modal');

    function openModal(src) {
        modal.style.display = "block";
        modalImg.src = src;
    }

    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = "none";
        }
    }

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Disable Right-Click (Anti-Download)
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    }, false);

    // Dynamic Optimization: Intersection Observer for Scroll Reveals
    const observerOptions = {
        threshold: 0.05, // Lower threshold for more sensitive triggering
        rootMargin: "0px 0px -20px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initial Observation
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => revealObserver.observe(el));

    // Safety Fallback: Force reveal after 3 seconds if observer fails
    setTimeout(() => {
        revealElements.forEach(el => {
            if (!el.classList.contains('active')) {
                el.classList.add('active');
            }
        });
    }, 2000);

    // Dynamically load projects from the database
    async function loadProjects() {
        const grid = document.getElementById('workGrid');
        if (!grid) return;

        try {
            const res = await fetch('projects.json');
            if (!res.ok) throw new Error('Network response was not ok');
            const projects = await res.json();
            
            grid.innerHTML = '';
            projects.forEach(p => {
                const card = document.createElement('div');
                card.className = 'work-card reveal';
                card.innerHTML = `
                    <div class="card-img-container">
                        <img src="${p.image}" alt="Quest Item" class="work-img" loading="lazy" onerror="this.src='https://via.placeholder.com/300x200?text=IMG_ERROR'">
                    </div>
                `;
                
                card.onclick = () => openModal(p.image);
                grid.appendChild(card);
                revealObserver.observe(card);
            });
        } catch (err) {
            console.error('Failed to load projects:', err);
            grid.innerHTML = '<p class="pixel-card">Quest Log Empty or Failed to Sync...</p>';
        }
    }

    loadProjects();

    // Parallax effect for scanlines (subtle move)
    window.addEventListener('scroll', () => {
        const scanlines = document.querySelector('.scanlines');
        if (scanlines) {
            const offset = window.pageYOffset;
            scanlines.style.backgroundPositionY = `${offset * 0.5}px`;
        }
    });

    // Console log easter egg
    console.log('%c UNTITLED STUDIO PORTFOLIO ', 'background: #00ffcc; color: #000; font-weight: bold; font-family: monospace; border: 2px solid #000;');
    console.log('%c [QUEST LOADED]: Portfolio Initialized. Ready to Build. ', 'color: #ff00ff;');
});
