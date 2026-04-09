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
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Performance: Once revealed, we don't need to observe it anymore
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // Dynamically load projects from the database
    async function loadProjects() {
        const grid = document.getElementById('workGrid');
        if (!grid) return;

        try {
            const res = await fetch('projects.json');
            const projects = await res.json();
            
            grid.innerHTML = '';
            projects.forEach(p => {
                const card = document.createElement('div');
                card.className = 'work-card reveal'; // Added reveal class for dynamic entry
                card.innerHTML = `
                    <div class="card-img-container">
                        <img src="${p.image}" alt="Quest Item" class="work-img" loading="lazy">
                    </div>
                `;
                
                // Click to zoom
                card.onclick = () => openModal(p.image);
                
                grid.appendChild(card);
                revealObserver.observe(card); // Observe new dynamic cards
            });
        } catch (err) {
            console.error('Failed to load projects:', err);
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
