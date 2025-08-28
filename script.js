// Fixed Portfolio JavaScript - Compatible with existing HTML and Formspree

// 1. Enhanced form validation that works WITH Formspree
function validateAndSubmitForm(event) {
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const message = document.getElementById("message");

  // Check if elements exist
  if (!name || !email || !message) {
    return true; // Let form submit normally if elements not found
  }

  // Reset previous error states
  name.style.borderColor = "#fb725c";
  email.style.borderColor = "#fb725c";
  message.style.borderColor = "#fb725c";

  let isValid = true;
  let errorMessage = "";

  // Validate name
  if (name.value.trim().length < 2) {
    name.style.borderColor = "red";
    errorMessage += "Name must be at least 2 characters.\n";
    isValid = false;
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value.trim())) {
    email.style.borderColor = "red";
    errorMessage += "Please enter a valid email address.\n";
    isValid = false;
  }

  // Validate message
  if (message.value.trim().length < 10) {
    message.style.borderColor = "red";
    errorMessage += "Message must be at least 10 characters.\n";
    isValid = false;
  }

  if (!isValid) {
    event.preventDefault(); // Only prevent if validation fails
    alert(errorMessage);
    return false;
  }

  // If validation passes, show loading state and let form submit normally
  const submitBtn = document.getElementById("form-btn");
  if (submitBtn) {
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;
  }

  // Let the form submit to Formspree
  return true;
}

// 2. Counter animation for statistics - Improved and more reliable
function animateCounters() {
  const counters = document.querySelectorAll(".counter-style h1");

  if (counters.length === 0) {
    console.log("No counter elements found");
    return;
  }

  counters.forEach((counter, index) => {
    const fullText = counter.textContent.trim();
    console.log(`Counter ${index}: "${fullText}"`);

    // Extract number from text (handles 10+, 99%, 5+, etc.)
    const numberMatch = fullText.match(/(\d+)/);
    if (!numberMatch) {
      console.log(`No number found in: ${fullText}`);
      return;
    }

    const targetNumber = parseInt(numberMatch[1]);
    const prefix = fullText.substring(0, numberMatch.index);
    const suffix = fullText.substring(
      numberMatch.index + numberMatch[1].length
    );

    console.log(
      `Animating: ${targetNumber}, prefix: "${prefix}", suffix: "${suffix}"`
    );

    // Start animation
    let currentNumber = 0;
    const increment = targetNumber / 50; // 50 steps for smooth animation
    const duration = 40; // milliseconds between updates

    counter.textContent = prefix + "0" + suffix;

    const timer = setInterval(() => {
      currentNumber += increment;

      if (currentNumber >= targetNumber) {
        counter.textContent = prefix + targetNumber + suffix;
        clearInterval(timer);
        console.log(`Counter animation complete: ${counter.textContent}`);
      } else {
        counter.textContent = prefix + Math.floor(currentNumber) + suffix;
      }
    }, duration);
  });
}

// 3. Improved scroll animations with better counter trigger
function addScrollAnimations() {
  const style = document.createElement("style");
  style.textContent = `
        .fade-in {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .project:hover {
            transform: scale(1.02);
            transition: transform 0.3s ease;
        }
        
        .skills-tag h1:hover {
            color: #fb725c;
            transform: scale(1.1);
            transition: all 0.3s ease;
            cursor: default;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            transition: transform 0.3s ease;
        }
        
        .project-img:hover {
            box-shadow: 1px 1px 30px #fb725c;
            transition: box-shadow 0.3s ease;
        }
    `;
  document.head.appendChild(style);

  // Add fade-in class to elements
  const elementsToAnimate = document.querySelectorAll(
    ".project, .about-me-p, .counter"
  );
  elementsToAnimate.forEach((el) => {
    el.classList.add("fade-in");
  });

  // Create a flag to ensure counters only animate once
  let countersAnimated = false;

  // Intersection Observer for scroll animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          // Trigger counter animation when counter section is visible
          if (entry.target.classList.contains("counter") && !countersAnimated) {
            countersAnimated = true;
            console.log("Starting counter animation...");
            setTimeout(animateCounters, 300);
          }
        }
      });
    },
    {
      threshold: 0.3, // Trigger when 30% of element is visible
      rootMargin: "0px 0px -50px 0px", // Trigger a bit earlier
    }
  );

  elementsToAnimate.forEach((el) => observer.observe(el));

  // Fallback: Trigger counters after 3 seconds if not triggered by scroll
  setTimeout(() => {
    if (!countersAnimated) {
      console.log("Fallback: Starting counter animation...");
      countersAnimated = true;
      animateCounters();
    }
  }, 3000);
}

// 4. Typing effect for hero section - All text
function startTypingEffect() {
  // Get hero text elements - need to be more specific
  const heroSection = document.querySelector(".hero-section");
  if (!heroSection) {
    console.log("Hero section not found");
    return;
  }

  // Get the specific elements from the CTA section
  const ctaSection = heroSection.querySelector(".cta");
  const helloText = ctaSection.querySelector("h1:first-child"); // "Hello ."
  const nameText = ctaSection.querySelector(".name h1"); // "i'm Haytham"

  // Get the h1 that comes after the .name div
  const allH1s = ctaSection.querySelectorAll("h1");
  let titleText = null;

  // Find "Full Stack Developer" text (should be the last h1 in cta)
  for (let i = allH1s.length - 1; i >= 0; i--) {
    if (allH1s[i].textContent.trim() === "Full Stack Developer") {
      titleText = allH1s[i];
      break;
    }
  }

  console.log("Found elements:", {
    hello: helloText ? helloText.textContent : "not found",
    name: nameText ? nameText.textContent : "not found",
    title: titleText ? titleText.textContent : "not found",
  });

  if (!helloText || !nameText || !titleText) {
    console.log("Some hero text elements not found");
    return;
  }

  // Store original texts
  const originalTexts = {
    hello: helloText.textContent,
    name: nameText.textContent,
    title: titleText.textContent,
  };

  // Clear all texts initially
  helloText.textContent = "";
  nameText.textContent = "";
  titleText.textContent = "";

  // Function to type out individual text
  function typeText(element, text, delay = 0, speed = 80) {
    setTimeout(() => {
      let i = 0;
      element.textContent = ""; // Clear before starting
      const typeTimer = setInterval(() => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(typeTimer);
        }
      }, speed);
    }, delay);
  }

  // Start typing animations in sequence
  typeText(helloText, originalTexts.hello, 0, 120); // "Hello ." - starts immediately
  typeText(nameText, originalTexts.name, 1000, 100); // "i'm Haytham" - after 1 second
  typeText(titleText, originalTexts.title, 2500, 90); // "Full Stack Developer" - after 2.5 seconds

  // Add blinking cursor effect to the last element
  setTimeout(() => {
    const cursor = document.createElement("span");
    cursor.textContent = "|";
    cursor.style.cssText = `
            animation: blink 1s infinite;
            margin-left: 5px;
            color: #fb725c;
        `;
    titleText.appendChild(cursor);

    // Add cursor animation styles
    if (!document.getElementById("cursor-animation")) {
      const cursorStyle = document.createElement("style");
      cursorStyle.id = "cursor-animation";
      cursorStyle.textContent = `
                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }
            `;
      document.head.appendChild(cursorStyle);
    }

    // Remove cursor after 3 seconds
    setTimeout(() => {
      if (cursor.parentNode) {
        cursor.remove();
      }
    }, 3000);
  }, 4500); // After all text is typed + small buffer
}

// 5. Scroll to top button
function createScrollToTopButton() {
  const scrollBtn = document.createElement("button");
  scrollBtn.innerHTML = "↑";
  scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #fb725c;
        color: white;
        border: none;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(251, 114, 92, 0.3);
    `;

  document.body.appendChild(scrollBtn);

  // Show/hide button based on scroll position
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollBtn.style.opacity = "1";
      scrollBtn.style.visibility = "visible";
    } else {
      scrollBtn.style.opacity = "0";
      scrollBtn.style.visibility = "hidden";
    }
  });

  // Scroll to top functionality
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// 6. Mobile menu for responsive design
function createMobileMenu() {
  const nav = document.querySelector("nav");
  const navList = document.querySelector("nav ul");

  if (!nav || !navList) return;

  // Create hamburger button
  const menuToggle = document.createElement("button");
  menuToggle.innerHTML = "☰";
  menuToggle.className = "mobile-menu-toggle";
  menuToggle.style.cssText = `
        display: none;
        background: none;
        border: none;
        color: #f9ffff;
        font-size: 24px;
        cursor: pointer;
        padding: 5px;
    `;

  // Insert before the nav list
  nav.insertBefore(menuToggle, navList);

  // Add mobile styles
  const mobileStyles = document.createElement("style");
  mobileStyles.textContent = `
        @media (max-width: 768px) {
            .mobile-menu-toggle {
                display: block !important;
            }
            
            nav ul {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: #121e28;
                flex-direction: column;
                padding: 20px 0;
                border-top: 2px solid #fb725c;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            }
            
            nav ul.mobile-active {
                display: flex !important;
            }
            
            nav ul li {
                margin: 10px 0;
            }
            
            nav {
                position: relative;
            }
        }
    `;
  document.head.appendChild(mobileStyles);

  // Toggle functionality
  menuToggle.addEventListener("click", () => {
    navList.classList.toggle("mobile-active");
    menuToggle.innerHTML = navList.classList.contains("mobile-active")
      ? "✕"
      : "☰";
  });

  // Close menu when clicking on nav links
  const navLinks = navList.querySelectorAll("a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navList.classList.remove("mobile-active");
      menuToggle.innerHTML = "☰";
    });
  });
}

// 7. Smooth scrolling for anchor links (if you add them)
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// 8. Add loading animation to buttons
function enhanceButtons() {
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((btn) => {
    btn.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)";
    });

    btn.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });
}

// 9. Form field enhancements
function enhanceFormFields() {
  const formFields = document.querySelectorAll("#name, #email, #message");

  formFields.forEach((field) => {
    // Add focus effects
    field.addEventListener("focus", function () {
      this.style.borderColor = "#fb725c";
      this.style.boxShadow = "0 0 5px rgba(251, 114, 92, 0.3)";
    });

    field.addEventListener("blur", function () {
      this.style.boxShadow = "none";
    });

    // Add input validation feedback
    field.addEventListener("input", function () {
      if (this.value.trim().length > 0) {
        this.style.borderColor = "#4CAF50"; // Green for valid input
      } else {
        this.style.borderColor = "#fb725c"; // Back to default
      }
    });
  });
}

// 10. Initialize all features when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("Portfolio JavaScript loaded successfully!");

  // Initialize all features
  addScrollAnimations();
  createScrollToTopButton();
  createMobileMenu();
  initSmoothScrolling();
  enhanceButtons();
  enhanceFormFields();

  // Start typing effect after a short delay
  setTimeout(startTypingEffect, 1000);

  // Add form validation that works WITH Formspree
  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", validateAndSubmitForm);
  }
});

// 11. Console welcome message
console.log(`
🚀 Welcome to Haytham's Portfolio!
✨ Enhanced with JavaScript features:
   • Form validation (works with Formspree)
   • Scroll animations
   • Counter animations
   • Mobile responsive menu
   • Smooth scrolling
   • Interactive buttons
   
👨‍💻 Portfolio by Haytham Alredwan
`);

// Export functions for potential external use
window.portfolioJS = {
  validateAndSubmitForm,
  animateCounters,
  startTypingEffect,
};
