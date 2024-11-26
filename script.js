// Typing animation text
const phrases = [
    "Self-taught",
    "Enthusiastic",
    "Machine Learning",
    "Web Development",
    "Martian"
];

let currentPhraseIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typingSpeed = 200; // Moderate typing speed (decreased from 300)

function typeEffect() {
    const typedTextSpan = document.getElementById("typed-text");
    const currentPhrase = phrases[currentPhraseIndex];
    
    if (isDeleting) {
        typedTextSpan.textContent = currentPhrase.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        typingSpeed = 100; // Moderate deletion speed (decreased from 200)
    } else {
        typedTextSpan.textContent = currentPhrase.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        typingSpeed = 200; // Moderate typing speed
    }
    
    if (!isDeleting && currentCharIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at end
    } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        typingSpeed = 1000; // Pause before starting new word
    }
    
    setTimeout(typeEffect, typingSpeed);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Mobile Navigation
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const navLinks = document.querySelector('.nav-links');

mobileNavToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileNavToggle.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileNavToggle.classList.remove('active');
    });
});

// Parallax effect for stars background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Parallax effect for stars background
    document.querySelector('.stars').style.transform = `translateY(${scrolled * 0.3}px)`;
    
    // Fade in elements on scroll
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrolled > (sectionTop - window.innerHeight / 1.5)) {
            section.classList.add('animate');
        }
    });
});

// Project data
const projects = [
    {
        title: "ChatSNC",
        description: "Full-stack chatbot application using LLM and RAG for college website.",
        tags: ["FastAPI", "Vue.js", "TailwindCSS", "PostgreSQL"],
        image: "assets/chatsnc.png",
        github: "https://github.com/flyme2mars/chatsnc",
    },
    {
        title: "Food Classifier",
        description: "Deep Learning model to classify food images using PyTorch.",
        tags: ["PyTorch", "Machine Learning", "Computer Vision"],
        image: "assets/food_classifier.png",
        demo: "https://huggingface.co/spaces/akshaikrishna/food-classifier-mobilenet"
    },
    {
        title: "MNIST Classifier",
        description: "Handwritten digit classifier implemented from scratch in C, featuring custom neural network architecture.",
        tags: ["C", "Machine Learning", "Neural Networks"],
        image: "assets/mnist-c.png",
        github: "https://github.com/flyme2mars/mnist-c"
    }
];

// Function to create project cards
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';

    const image = document.createElement('img');
    image.className = 'project-image';
    image.src = project.image;
    image.alt = project.title;
    
    const content = document.createElement('div');
    content.className = 'project-content';
    
    const title = document.createElement('h3');
    title.className = 'project-title';
    title.textContent = project.title;
    
    const description = document.createElement('p');
    description.className = 'project-description';
    description.textContent = project.description;
    
    const tags = document.createElement('div');
    tags.className = 'project-tags';
    project.tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'project-tag';
        tagSpan.textContent = tag;
        tags.appendChild(tagSpan);
    });
    
    const links = document.createElement('div');
    links.className = 'project-links';
    
    if (project.github) {
        const githubLink = document.createElement('a');
        githubLink.className = 'project-link';
        githubLink.href = project.github;
        githubLink.target = '_blank';
        githubLink.rel = 'noopener noreferrer';
        githubLink.innerHTML = '<i class="fab fa-github"></i> GitHub';
        links.appendChild(githubLink);
    }
    
    if (project.demo) {
        const demoLink = document.createElement('a');
        demoLink.className = 'project-link';
        demoLink.href = project.demo;
        demoLink.target = '_blank';
        demoLink.rel = 'noopener noreferrer';
        demoLink.innerHTML = '<i class="fas fa-external-link-alt"></i> Live Demo';
        links.appendChild(demoLink);
    }
    
    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(tags);
    content.appendChild(links);
    
    card.appendChild(image);
    card.appendChild(content);
    
    return card;
}

// Function to populate projects
function populateProjects() {
    console.log('Populating projects...');
    const projectsGrid = document.querySelector('.projects-grid');
    console.log('Projects grid element:', projectsGrid);
    
    if (!projectsGrid) {
        console.error('Projects grid not found!');
        return;
    }
    
    // Clear existing content
    projectsGrid.innerHTML = '';
    
    projects.forEach(project => {
        console.log('Creating card for project:', project.title);
        const card = createProjectCard(project);
        projectsGrid.appendChild(card);
    });
}

// Initialize projects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing projects...');
    populateProjects();
});

// Also try initializing after a short delay as a fallback
setTimeout(() => {
    console.log('Delayed initialization...');
    populateProjects();
}, 1000);

// Space background visibility management
const spaceBackground = document.getElementById('space-background');
const hero = document.querySelector('.hero');
let lastScrollY = window.scrollY;
let ticking = false;

function updateSpaceVisibility() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Calculate opacity based on scroll position
    const opacity = Math.max(0, Math.min(1, 1 - (scrollY / windowHeight)));
    
    // Apply opacity to both space background and hero section
    if (spaceBackground) {
        spaceBackground.style.opacity = opacity;
        spaceBackground.style.display = 'block';
    }
    if (hero) {
        hero.style.opacity = opacity;
    }
    
    lastScrollY = scrollY;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateSpaceVisibility();
            ticking = false;
        });
        ticking = true;
    }
});

// Initial call to set correct state
updateSpaceVisibility();

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    typeEffect();
    
    // Add scroll animation for elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
            
            // Never completely hide the background, just adjust opacity
            setTimeout(() => {
                const spaceBackground = document.getElementById('space-background');
                const heroSection = document.querySelector('.hero');
                if (!isInViewport(heroSection)) {
                    updateSpaceVisibility();
                }
            }, 1000);
        }
    });
});

// Helper function for smooth scroll links
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= -rect.height &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + rect.height
    );
}

// Random shooting stars
function createShootingStar() {
    const star = document.createElement('div');
    star.className = 'shooting-star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.animationDuration = `${Math.random() * 2 + 1}s`;
    document.querySelector('.stars').appendChild(star);
    
    setTimeout(() => {
        star.remove();
    }, 3000);
}

setInterval(createShootingStar, 4000);

// Navbar scroll effect
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Loading screen management
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    typeEffect();
    
    // Add scroll animation for elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
});

// Hide loading screen when everything is loaded
window.addEventListener('load', () => {
    // Wait a bit to ensure Three.js scene is ready
    setTimeout(hideLoadingScreen, 1000);
});
