document.addEventListener('DOMContentLoaded', () => {
    const text = "Visualize your typing patterns";
    const typingText = document.getElementById('typing-text');
    const cursor = document.querySelector('.cursor');
    
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100; // Speed in milliseconds
    let pauseTime = 2000; // Pause time at the end of the sentence
    
    function type() {
        const currentText = text.substring(0, charIndex);
        typingText.textContent = currentText;
        
        if (!isDeleting && charIndex < text.length) {
            // Typing forward
            charIndex++;
            setTimeout(type, typingSpeed);
        } else if (isDeleting && charIndex > 0) {
            // Deleting
            charIndex--;
            setTimeout(type, typingSpeed / 2);
        } else if (charIndex === text.length) {
            // Pause at the end of the sentence
            isDeleting = true;
            setTimeout(type, pauseTime);
        } else if (charIndex === 0) {
            // Start typing again
            isDeleting = false;
            setTimeout(type, 500);
        } else {
            // Continue typing
            isDeleting = !isDeleting;
            setTimeout(type, typingSpeed);
        }
    }
    
    // Start the typing effect after a short delay
    setTimeout(type, 1000);
    
    // Add a subtle animation to the cursor when typing
    const observer = new MutationObserver(() => {
        cursor.classList.add('typing');
        setTimeout(() => {
            cursor.classList.remove('typing');
        }, 100);
    });
    
    observer.observe(typingText, { childList: true });
});
