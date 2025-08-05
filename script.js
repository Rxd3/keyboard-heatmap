// Global variables
let heatmapInstance = null;  // Declare heatmapInstance at the top level
let originalKeyCoordinates = null; // Store original key coordinates for toggling spacebar

// Key coordinates for heatmap - map of character to {x, y} coordinates
const keyCoordinates = {
    // Number row
    '1': { x: 43, y: 64 }, '!': { x: 43, y: 64 },
    '2': { x: 110, y: 64 }, '@': { x: 110, y: 64 },
    '3': { x: 175, y: 64 }, '#': { x: 175, y: 64 },
    '4': { x: 245, y: 64 }, '$': { x: 245, y: 64 },
    '5': { x: 313, y: 64 }, '%': { x: 313, y: 64 },
    '6': { x: 380, y: 64 }, '^': { x: 380, y: 64 },
    '7': { x: 445, y: 64 }, '&': { x: 445, y: 64 },
    '8': { x: 515, y: 64 }, '*': { x: 515, y: 64 },
    '9': { x: 580, y: 64 }, '(': { x: 580, y: 64 },
    '0': { x: 645, y: 64 }, ')': { x: 645, y: 64 },
    '-': { x: 715, y: 64 }, '_': { x: 715, y: 64 },
    '=': { x: 785, y: 64 }, '+': { x: 785, y: 64 },
    // Top letter row
    'q': { x: 80, y: 130 }, 'w': { x: 150, y: 130 }, 'e': { x: 215, y: 130 }, 'r': { x: 285, y: 130 }, 't': { x: 350, y: 130 }, 'y': { x: 415, y: 130 }, 'u': { x: 485, y: 130 }, 'i': { x: 555, y: 130 }, 'o': { x: 622, y: 130 }, 'p': { x: 685, y: 130 }, 
    '[': { x: 755, y: 130 }, '{': { x: 755, y: 130 },
    ']': { x: 820, y: 130 }, '}': { x: 820, y: 130 },
    '\\': { x: 885, y: 130 }, '|': { x: 885, y: 130 },
    // Home row
    'a': { x: 110, y: 190 }, 's': { x: 175, y: 190 }, 'd': { x: 245, y: 190 }, 'f': { x: 315, y: 190 }, 'g': { x: 380, y: 190 }, 'h': { x: 450, y: 190 }, 'j': { x: 518, y: 190 }, 'k': { x: 584, y: 190 }, 'l': { x: 650, y: 190 }, 
    ';': { x: 715, y: 190 }, ':': { x: 715, y: 190 },
    "'": { x: 780, y: 190 }, '"': { x: 780, y: 190 },
    // Bottom letter row
    'z': { x: 130, y: 255 }, 'x': { x: 200, y: 255 }, 'c': { x: 265, y: 255 }, 'v': { x: 335, y: 255 }, 'b': { x: 400, y: 255 }, 'n': { x: 465, y: 255 }, 'm': { x: 535, y: 255 },
    ',': { x: 600, y: 255 }, '<': { x: 665, y: 255 },
    '.': { x: 670, y: 255 }, '>': { x: 670, y: 255 },
    '/': { x: 730, y: 255 }, '?': { x: 730, y: 255 },
    // Space bar
    ' ': { x: 450, y: 320 }
};

// Word list for WPM test - expanded with more diverse and interesting words
const wordList = [
    // Common words
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    
    // Action verbs
    'run', 'jump', 'swim', 'write', 'read', 'speak', 'think', 'create', 'build', 'solve',
    'learn', 'teach', 'grow', 'change', 'move', 'travel', 'explore', 'discover', 'imagine', 'believe',
    
    // Descriptive words
    'quick', 'bright', 'happy', 'brave', 'strong', 'clever', 'gentle', 'fierce', 'calm', 'vivid',
    'vibrant', 'mystic', 'ancient', 'modern', 'rapid', 'silent', 'loud', 'soft', 'sharp', 'smooth',
    
    // Nature words
    'ocean', 'mountain', 'forest', 'river', 'valley', 'desert', 'jungle', 'meadow', 'canyon', 'waterfall',
    'thunder', 'lightning', 'breeze', 'sunset', 'sunrise', 'horizon', 'galaxy', 'planet', 'comet', 'meteor',
    
    // Technology words
    'digital', 'virtual', 'network', 'system', 'process', 'analyze', 'compute', 'program', 'develop', 'design',
    'interface', 'database', 'algorithm', 'function', 'variable', 'browser', 'server', 'cloud', 'mobile', 'device',
    
    // Abstract concepts
    'freedom', 'wisdom', 'courage', 'justice', 'honor', 'beauty', 'truth', 'knowledge', 'imagination', 'creativity',
    'curiosity', 'discovery', 'adventure', 'journey', 'destiny', 'fortune', 'miracle', 'wonder', 'mystery', 'legend'
];

// WPM Test State
let currentCharIndex = 0;
let startTime = 0;
let currentSentence = '';

// Generate a random sentence
function generateRandomSentence(wordCount = 15) {
    const words = [];
    for (let i = 0; i < wordCount; i++) {
        const randomIndex = Math.floor(Math.random() * wordList.length);
        words.push(wordList[randomIndex]);
    }
    return words.join(' ').charAt(0).toUpperCase() + words.join(' ').slice(1) ;
}

// Display the sentence with character spans
function displaySentence(sentence) {
    const wpmText = document.getElementById('wpm-text');
    if (!wpmText) return;
    
    wpmText.innerHTML = '';
    
    // Split into characters and create spans
    const chars = sentence.split('');
    chars.forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        if (index === 0) span.classList.add('current');
        wpmText.appendChild(span);
    });
}

// Handle keyboard input
function handleKeyDown(e) {
    const wpmTest = document.getElementById('wpm-test');
    if (!wpmTest || wpmTest.style.display === 'none') {
        return;
    }
    
    // Start timer on first keypress
    if (startTime === 0) {
        startTime = Date.now();
    }
    
    // Handle backspace
    if (e.key === 'Backspace') {
        if (currentCharIndex > 0) {
            const spans = document.querySelectorAll('#wpm-text span');
            spans[currentCharIndex].classList.remove('current');
            currentCharIndex--;
            spans[currentCharIndex].classList.remove('correct');
            spans[currentCharIndex].classList.add('current');
        }
        return;
    }
    
    // Only process regular character keys
    if (e.key.length === 1) {
        const currentChar = currentSentence[currentCharIndex];
        const spans = document.querySelectorAll('#wpm-text span');
        
        if (e.key === currentChar) {
            // Correct character - update heatmap with the typed character
            if (heatmapInstance) {
                const char = e.key.toLowerCase();
                if (keyCoordinates[char]) {
                    const currentData = heatmapInstance.getData() || { data: [] };
                    const existingPointIndex = currentData.data.findIndex(
                        point => point.x === keyCoordinates[char].x && 
                               point.y === keyCoordinates[char].y
                    );
                    
                    const newData = {
                        ...currentData,
                        data: [...currentData.data]
                    };
                    
                    if (existingPointIndex >= 0) {
                        // Increment existing point
                        newData.data[existingPointIndex] = {
                            ...newData.data[existingPointIndex],
                            value: (newData.data[existingPointIndex].value || 0) + 1
                        };
                    } else {
                        // Add new point
                        newData.data.push({
                            x: keyCoordinates[char].x,
                            y: keyCoordinates[char].y,
                            value: 1
                        });
                    }
                    
                    // Update heatmap with new data
                    heatmapInstance.setData({
                        ...newData,
                        max: Math.max(...newData.data.map(p => p.value), 1)
                    });
                }
            }
            
            // Update UI
            spans[currentCharIndex].classList.remove('current');
            spans[currentCharIndex].classList.add('correct');
            currentCharIndex++;
            
            // Check if test is complete
            if (currentCharIndex >= currentSentence.length) {
                endWPMTest();
                return;
            }
            
            // Move to next character
            spans[currentCharIndex].classList.add('current');
        }
    }
}

// End the WPM test and show results
function endWPMTest() {
    const endTime = Date.now();
    const timeElapsed = (endTime - startTime) / 1000 / 60; // in minutes
    const wordsTyped = currentSentence.length / 5; // standard word = 5 characters
    const wpm = Math.round(wordsTyped / timeElapsed);
    
    // Show results in the interface
    // Clear and rebuild the WPM test container
    const wpmTest = document.getElementById('wpm-test');
    if (wpmTest) {
        // Clear everything
        wpmTest.innerHTML = '';
        
        // Create and style the container
        const container = document.createElement('div');
        container.style.cssText = 'text-align:center; margin:0; padding:0;';
        
        // Create and add the "Test Complete!" text
        const completeText = document.createElement('div');
        completeText.textContent = 'Test Complete!';
        completeText.style.cssText = 'font-size:24px; color:#fff; margin:0 0 20px 0; padding:0;';
        container.appendChild(completeText);
        
        // Create and add the WPM score
        const wpmScore = document.createElement('div');
        wpmScore.textContent = wpm + ' WPM';
        wpmScore.style.cssText = 'font-size:48px; color:#4CAF50; font-weight:bold; margin:0 0 40px 0; padding:0;';
        container.appendChild(wpmScore);
        
        // Create and add the Try Again button
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display:flex; justify-content:center; width:100%; margin:0; padding:0;';
        
        const tryAgainBtn = document.createElement('button');
        tryAgainBtn.id = 'try-again-btn';
        tryAgainBtn.className = 'start-button';
        tryAgainBtn.textContent = 'Try Again';
        tryAgainBtn.style.cssText = 'padding:8px 30px; font-size:16px; margin:0;';
        
        buttonContainer.appendChild(tryAgainBtn);
        container.appendChild(buttonContainer);
        wpmTest.appendChild(container);
        
        // Add the hidden input back
        const wpmInput = document.createElement('input');
        wpmInput.type = 'text';
        wpmInput.id = 'wpm-input';
        wpmInput.style.cssText = 'opacity:0; position:absolute; pointer-events:none; width:0; height:0; border:none; padding:0; margin:0;';
        wpmInput.tabIndex = -1;
        wpmTest.appendChild(wpmInput);
        
        // Add event listener for the Try Again button
        tryAgainBtn.addEventListener('click', resetWPMTest);
    }
}

// Reset WPM test
function resetWPMTest() {
    // Reset all test state variables
    currentCharIndex = 0;
    startTime = 0;
    currentSentence = '';
    
    // Reset the UI to initial state
    const wpmStart = document.getElementById('wpm-start');
    const wpmTest = document.getElementById('wpm-test');
    
    if (wpmStart) {
        wpmStart.style.display = 'block';
    }
    
    if (wpmTest) {
        // Clear the test content
        wpmTest.innerHTML = '';
        wpmTest.style.display = 'none';
        
        // Recreate the wpm-text div for future use
        const wpmText = document.createElement('div');
        wpmText.id = 'wpm-text';
        wpmText.className = 'big-text';
        wpmText.style.whiteSpace = 'pre-wrap';
        wpmText.style.wordWrap = 'break-word';
        wpmText.style.margin = '0';
        wpmText.style.padding = '0';
        
        // Recreate the hidden input
        const wpmInput = document.createElement('input');
        wpmInput.type = 'text';
        wpmInput.id = 'wpm-input';
        wpmInput.style.cssText = 'opacity:0; position:absolute; pointer-events:none; width:0; height:0; border:none; padding:0; margin:0;';
        wpmInput.tabIndex = -1;
        
        // Add elements back to the test container
        wpmTest.appendChild(wpmText);
        wpmTest.appendChild(wpmInput);
    }
}

// Start a new WPM test
function startWPMTest() {
    const wpmStart = document.getElementById('wpm-start');
    const wpmTest = document.getElementById('wpm-test');
    
    if (!wpmStart || !wpmTest) {
        return;
    }
    
    // Show test UI
    wpmStart.style.display = 'none';
    wpmTest.style.display = 'block';
    
    // Apply current spacebar visibility setting to WPM test
    const toggleSpacebar = document.getElementById('toggle-spacebar');
    if (toggleSpacebar) {
        updateSpacebarVisibility(toggleSpacebar.checked);
    }
    
    // Generate and display sentence
    currentSentence = generateRandomSentence(10);

    displaySentence(currentSentence);
    
    // Reset state
    currentCharIndex = 0;
    startTime = 0;
    
    // Clear the heatmap at the start of the test
    if (heatmapInstance) {
        heatmapInstance.setData({
            max: 1,
            data: []
        });
    }
    
    // Focus the hidden input
    const wpmInput = document.getElementById('wpm-input');
    if (wpmInput) {
        wpmInput.focus();
    }
}

// Update spacebar visibility based on toggle state
function updateSpacebarVisibility(showSpacebar) {
    if (showSpacebar) {
        keyCoordinates[' '] = originalKeyCoordinates[' ']; // Restore spacebar
    } else {
        delete keyCoordinates[' ']; // Remove spacebar
    }
    
    // Update heatmap with new key coordinates
    if (heatmapInstance) {
        heatmapInstance.setData({
            max: 1,
            data: []
        });
    }
}

// Initialize heatmap
function initHeatmap() {
    if (heatmapInstance) {
        heatmapInstance._renderer.canvas.remove();
    }
    
    const heatmapConfig = {
        container: document.getElementById('heatmap-container'),
        radius: 65,
        maxOpacity: 0.45,
        minOpacity: 0.01,
        blur: 0.9,
        gradient: {
            0.25: 'blue',
            0.5: 'green',
            0.75: 'yellow',
            1: 'red'
        }
    };
    
    heatmapInstance = h337.create(heatmapConfig);
    return heatmapInstance;
}

// Create mobile toggle buttons
function createMobileToggles() {
    if (window.innerWidth > 768) return; // Only create on mobile
    
    // Remove existing toggles if they exist
    const existingToggles = document.querySelector('.mobile-toggles');
    if (existingToggles) {
        existingToggles.remove();
    }
    
    // Create container for mobile toggles
    const mobileToggles = document.createElement('div');
    mobileToggles.className = 'mobile-toggles';
    
    // Get current states
    const spacebarVisible = ' ' in keyCoordinates;
    const wpmMode = document.getElementById('wpm-test').style.display !== 'none';
    
    // Create Show Spacebar toggle
    const spacebarToggle = document.createElement('div');
    spacebarToggle.className = 'mobile-toggle-item';
    spacebarToggle.innerHTML = `
        <span>Show Spacebar</span>
        <label class="switch">
            <input type="checkbox" id="mobile-toggle-spacebar" ${spacebarVisible ? 'checked' : ''}>
            <span class="slider round"></span>
        </label>
    `;
    
    // Create WPM Mode toggle
    const wpmToggle = document.createElement('div');
    wpmToggle.className = 'mobile-toggle-item';
    wpmToggle.innerHTML = `
        <span>WPM Mode</span>
        <label class="switch">
            <input type="checkbox" id="mobile-toggle-wpm" ${wpmMode ? 'checked' : ''}>
            <span class="slider round"></span>
        </label>
    `;
    
    // Append toggles to container
    mobileToggles.appendChild(spacebarToggle);
    mobileToggles.appendChild(wpmToggle);
    
    // Insert after keyboard container
    const keyboardContainer = document.getElementById('keyboard-container');
    if (keyboardContainer && keyboardContainer.parentNode) {
        keyboardContainer.parentNode.insertBefore(mobileToggles, keyboardContainer.nextSibling);
    }
    
    // Add event listeners
    const spacebarCheckbox = document.getElementById('mobile-toggle-spacebar');
    const wpmCheckbox = document.getElementById('mobile-toggle-wpm');
    
    if (spacebarCheckbox) {
        spacebarCheckbox.addEventListener('change', function(e) {
            const showSpacebar = this.checked;
            updateSpacebarVisibility(showSpacebar);
            
            // Update local storage if needed
            localStorage.setItem('showSpacebar', showSpacebar);
            
            // Sync with desktop toggle if it exists
            const desktopToggle = document.getElementById('toggle-spacebar');
            if (desktopToggle) {
                desktopToggle.checked = showSpacebar;
                desktopToggle.dispatchEvent(new Event('change'));
            }
        });
        
        // Trigger initial state
        if (spacebarCheckbox.checked) {
            updateSpacebarVisibility(true);
        }
    }
    
    if (wpmCheckbox) {
        wpmCheckbox.addEventListener('change', function(e) {
            const wpmMode = this.checked;
            toggleSampleButtons(wpmMode);
            
            // Update local storage
            localStorage.setItem('wpmMode', wpmMode);
            
            // Sync with desktop toggle if it exists
            const desktopToggle = document.getElementById('toggle-sample-buttons');
            if (desktopToggle) {
                desktopToggle.checked = wpmMode;
                desktopToggle.dispatchEvent(new Event('change'));
            }
        });
        
        // Trigger initial state
        if (wpmCheckbox.checked) {
            toggleSampleButtons(true);
        }
    }
}

// Save original key coordinates for toggling spacebar
originalKeyCoordinates = JSON.parse(JSON.stringify(keyCoordinates));

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const keyboardImg = document.getElementById('keyboard-img');
    
    // Create mobile toggles if on mobile
    createMobileToggles();
    
    // Update mobile toggles on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth <= 768) {
                if (!document.querySelector('.mobile-toggles')) {
                    createMobileToggles();
                }
            } else {
                const mobileToggles = document.querySelector('.mobile-toggles');
                if (mobileToggles) mobileToggles.remove();
            }
        }, 250);
    });
    
    // Sync mobile toggles with desktop toggles
    function syncMobileToggles() {
        const desktopSpacebarToggle = document.getElementById('toggle-spacebar');
        const mobileSpacebarToggle = document.getElementById('mobile-toggle-spacebar');
        const desktopWpmToggle = document.getElementById('toggle-sample-buttons');
        const mobileWpmToggle = document.getElementById('mobile-toggle-wpm');
        
        if (desktopSpacebarToggle && mobileSpacebarToggle) {
            mobileSpacebarToggle.checked = desktopSpacebarToggle.checked;
        }
        if (desktopWpmToggle && mobileWpmToggle) {
            mobileWpmToggle.checked = desktopWpmToggle.checked;
        }
    }
    
    // Set up start button event listener
    const startButton = document.getElementById('start-typing-btn');
    if (startButton) {
        startButton.addEventListener('click', startWPMTest);
    }
    
    // Set up global keydown listener for the WPM test
    document.addEventListener('keydown', function(e) {
        const wpmTest = document.getElementById('wpm-test');
        
        if (wpmTest && wpmTest.style.display !== 'none') {
            e.preventDefault(); // Prevent default behavior
            e.stopPropagation(); // Stop event bubbling
            handleKeyDown(e);
        }
    }, true); // Use capture phase to catch events earlier

    function toggleSampleButtons(wpmMode) {
        const sampleButtons = document.getElementById('sample-buttons');
        const startScreen = document.getElementById('start-screen');
        const textInput = document.getElementById('text-input');
        const wpmStart = document.getElementById('wpm-start');
        const wpmTest = document.getElementById('wpm-test');
        
        if (!sampleButtons || !startScreen || !textInput || !wpmStart || !wpmTest) {
            console.error('One or more required elements not found');
            return;
        }
        
        if (wpmMode) {
            // WPM mode ON - show start screen, hide sample buttons and textarea
            sampleButtons.style.display = 'none';
            startScreen.style.display = 'block';
            textInput.style.display = 'none';
            
            // Reset WPM test state
            wpmStart.style.display = 'block';
            wpmTest.style.display = 'none';
            
            // Reset any active test
            resetWPMTest();
        } else {
            // WPM mode OFF - show sample buttons and textarea, hide start screen
            sampleButtons.style.display = 'block';
            startScreen.style.display = 'none';
            textInput.style.display = 'block';
            
            // Reset WPM test
            resetWPMTest();
        }
    }
    
    // Initialize WPM mode from localStorage if available
    const toggleCheckbox = document.getElementById('toggle-sample-buttons');
    const savedWpmMode = localStorage.getItem('wpmMode');
    const initialWpmMode = savedWpmMode ? savedWpmMode === 'true' : false;
    
    // Initialize the UI based on the saved state
    if (toggleCheckbox) {
        // Set initial state
        toggleCheckbox.checked = initialWpmMode;
        
        // Add event listener for desktop toggle
        toggleCheckbox.addEventListener('change', function() {
            const wpmMode = this.checked;
            localStorage.setItem('wpmMode', wpmMode);
            toggleSampleButtons(wpmMode);
            
            // Sync with mobile toggle if it exists
            const mobileWpmToggle = document.getElementById('mobile-toggle-wpm');
            if (mobileWpmToggle) {
                mobileWpmToggle.checked = wpmMode;
            }
        });
        
        // Initialize mobile toggle if it exists
        const mobileWpmToggle = document.getElementById('mobile-toggle-wpm');
        if (mobileWpmToggle) {
            mobileWpmToggle.checked = initialWpmMode;
            
            mobileWpmToggle.addEventListener('change', function() {
                const wpmMode = this.checked;
                localStorage.setItem('wpmMode', wpmMode);
                toggleSampleButtons(wpmMode);
                
                // Sync with desktop toggle
                if (toggleCheckbox) {
                    toggleCheckbox.checked = wpmMode;
                }
            });
        }
        
        // Set initial UI state
        toggleSampleButtons(initialWpmMode);
    }
    
    // Add event listener for the start typing button
    const startTypingBtn = document.getElementById('start-typing-btn');
    const textInput = document.getElementById('text-input');
    
    if (startTypingBtn && textInput) {
        startTypingBtn.addEventListener('click', () => {
            textInput.focus();
        });
    }
    
    // This function contains all the logic and will only run once the image is loaded.
    function initializeHeatmapApp() {
        const keyboardContainer = document.getElementById('keyboard-container');
        const heatmapContainer = document.getElementById('heatmap-container');
        const textInput = document.getElementById('text-input');

        // Set the parent container's height to match the image. This is crucial.
        keyboardContainer.style.height = `${keyboardImg.height}px`;

        // Now, set the heatmap container size to match the parent.
        heatmapContainer.style.width = `${keyboardImg.width}px`;
        heatmapContainer.style.height = `${keyboardImg.height}px`;

        const keyCoordinates = {
            // Number row
            '1': { x: 43, y: 64 }, '!': { x: 43, y: 64 },
            '2': { x: 110, y: 64 }, '@': { x: 110, y: 64 },
            '3': { x: 175, y: 64 }, '#': { x: 175, y: 64 },
            '4': { x: 245, y: 64 }, '$': { x: 245, y: 64 },
            '5': { x: 313, y: 64 }, '%': { x: 313, y: 64 },
            '6': { x: 380, y: 64 }, '^': { x: 380, y: 64 },
            '7': { x: 445, y: 64 }, '&': { x: 445, y: 64 },
            '8': { x: 515, y: 64 }, '*': { x: 515, y: 64 },
            '9': { x: 580, y: 64 }, '(': { x: 580, y: 64 },
            '0': { x: 645, y: 64 }, ')': { x: 645, y: 64 },
            '-': { x: 715, y: 64 }, '_': { x: 715, y: 64 },
            '=': { x: 785, y: 64 }, '+': { x: 785, y: 64 },
            // Top letter row
            'q': { x: 80, y: 130 }, 'w': { x: 150, y: 130 }, 'e': { x: 215, y: 130 }, 'r': { x: 285, y: 130 }, 't': { x: 350, y: 130 }, 'y': { x: 415, y: 130 }, 'u': { x: 485, y: 130 }, 'i': { x: 555, y: 130 }, 'o': { x: 622, y: 130 }, 'p': { x: 685, y: 130 }, 
            '[': { x: 755, y: 130 }, '{': { x: 755, y: 130 },
            ']': { x: 820, y: 130 }, '}': { x: 820, y: 130 },
            '\\': { x: 885, y: 130 }, '|': { x: 885, y: 130 },
            // Home row
            'a': { x: 110, y: 190 }, 's': { x: 175, y: 190 }, 'd': { x: 245, y: 190 }, 'f': { x: 315, y: 190 }, 'g': { x: 380, y: 190 }, 'h': { x: 450, y: 190 }, 'j': { x: 518, y: 190 }, 'k': { x: 584, y: 190 }, 'l': { x: 650, y: 190 }, 
            ';': { x: 715, y: 190 }, ':': { x: 715, y: 190 },
            '\'': { x: 780, y: 190 }, '"': { x: 780, y: 190 },
            // Bottom letter row
            'z': { x: 130, y: 255 }, 'x': { x: 200, y: 255 }, 'c': { x: 265, y: 255 }, 'v': { x: 335, y: 255 }, 'b': { x: 400, y: 255 }, 'n': { x: 465, y: 255 }, 'm': { x: 535, y: 255 },
            ',': { x: 600, y: 255 }, '<': { x: 665, y: 255 },
            '.': { x: 670, y: 255 }, '>': { x: 670, y: 255 },
            '/': { x: 730, y: 255 }, '?': { x: 730, y: 255 },
            // Space bar
            ' ': { x: 450, y: 320 }
        };

        const sampleTexts = {
            sample1: 'The quick brown fox jumps over the lazy dog. This sentence uses every letter of the alphabet.',
            sample2: 'Programming is the art of telling a computer what to do. It requires logic, creativity, and a lot of coffee.',
            sample3: 'Heatmaps are a great way to visualize data density and user interaction patterns on a website or application.',
            sample4: 'She sells seashells by the seashore.'
        };

        // Heatmap configuration
        const heatmapConfig = {
            container: heatmapContainer,
            radius: 65, // Default radius
            maxOpacity: 0.45,
            minOpacity: 0.01,
            blur: 0.9,
            gradient: {
                0.25: 'blue',
                0.5: 'green',
                0.75: 'yellow',
                1: 'red'
            }
        };
        
        // Initialize heatmap with default settings
        function initHeatmap() {
            // Destroy existing instance if it exists
            if (heatmapInstance) {
                heatmapInstance._renderer.canvas.remove();
            }
            heatmapInstance = h337.create(heatmapConfig);
            return heatmapInstance;
        }
        
        // Initialize the heatmap
        heatmapInstance = initHeatmap();

        // Generate heatmap based on input text
        function generateHeatmap(text, updateRadius = true) {
            const charCounts = {};
            const lowerCaseText = text.toLowerCase();

            // Update heatmap radius based on current selection if needed
            if (updateRadius) {
                updateHeatmapRadius(false);
            }

            for (const char of lowerCaseText) {
                if (keyCoordinates[char]) {
                    if (!charCounts[char]) {
                        charCounts[char] = 0;
                    }
                    charCounts[char]++;
                }
            }

            const dataPoints = Object.keys(charCounts).map(char => ({
                x: keyCoordinates[char].x,
                y: keyCoordinates[char].y,
                value: charCounts[char]
            }));

            // Ensure max is at least 1 so single points are visible.
            const max = Math.max(...Object.values(charCounts), 1);

            const data = {
                max: max,
                data: dataPoints
            };

            heatmapInstance.setData(data);
        }

        textInput.addEventListener('input', (e) => generateHeatmap(e.target.value));

        for (let i = 1; i <= 4; i++) {
            document.getElementById(`sample${i}`).addEventListener('click', () => {
                const sampleText = sampleTexts[`sample${i}`];
                textInput.value = sampleText;
                generateHeatmap(sampleText);
            });
        }

        // Repaint the heatmap to ensure it's drawn correctly after the container is sized.
        heatmapInstance.repaint();

        // Store the original key coordinates for toggling spacebar
        originalKeyCoordinates = { ...keyCoordinates };
        
        // Initialize spacebar state based on checkbox
        const toggleSpacebar = document.getElementById('toggle-spacebar');
        const heatmapSizeSelect = document.getElementById('heatmap-size');
        
        // Set initial spacebar state
        if (toggleSpacebar && !toggleSpacebar.checked) {
            delete keyCoordinates[' '];
        }
        
        // Add event listener for spacebar toggle
        if (toggleSpacebar) {
            toggleSpacebar.addEventListener('change', function() {
                if (this.checked) {
                    keyCoordinates[' '] = originalKeyCoordinates[' '];
                } else {
                    delete keyCoordinates[' '];
                }
                // Regenerate heatmap with updated key coordinates
                if (document.getElementById('wpm-test').style.display === 'block') {
                    // If in WPM test mode, update the heatmap
                    const wpmInput = document.getElementById('wpm-input');
                    if (wpmInput) {
                        const typedText = wpmInput.value;
                        generateHeatmap(typedText);
                    }
                } else {
                    // In normal mode
                    generateHeatmap(textInput.value);
                }
            });
        }
        
        // Heatmap size presets
        const heatmapSizes = {
            small: 40,
            normal: 65,
            big: 100
        };

        // Function to update heatmap radius
        function updateHeatmapRadius(regenerateHeatmap = true) {
            const currentSize = document.getElementById('heatmap-size').value;
            const radius = heatmapSizes[currentSize];
            heatmapConfig.radius = radius; // Update the config
            initHeatmap(); // Reinitialize the heatmap with new radius
            
            // Only regenerate heatmap if explicitly requested to avoid infinite loops
            if (regenerateHeatmap && textInput.value) {
                generateHeatmap(textInput.value, false);
            }
            return radius;
        }

        // Change heatmap size
        heatmapSizeSelect.addEventListener('change', function() {
            updateHeatmapRadius();
            generateHeatmap(textInput.value); // Regenerate heatmap with new size
        });

        // Initialize with default radius
        updateHeatmapRadius();

        // Set initial state
        const initialText = sampleTexts.sample1;
        textInput.value = initialText;
        generateHeatmap(initialText);
    }

    // Stats tracking variables
    const stats = {
        totalKeystrokes: 0,
        keyPresses: {},
        backspaceCount: 0,
        wordCount: 0,
        totalWordLength: 0,
        lastKeyWasSpace: false
    };

    // Initialize stats
    function initStats() {
        // Reset all stats
        stats.totalKeystrokes = 0;
        stats.keyPresses = {};
        stats.backspaceCount = 0;
        stats.wordCount = 0;
        stats.totalWordLength = 0;
        stats.lastKeyWasSpace = false;
        
        updateStatsDisplay();
    }

    // Update the stats display
    function updateStatsDisplay() {
        // Update total keystrokes
        document.getElementById('total-keystrokes').textContent = stats.totalKeystrokes;
        
        // Update backspace count
        document.getElementById('backspace-count').textContent = stats.backspaceCount;
        
        // Update word count
        document.getElementById('word-count').textContent = stats.wordCount;
        
        // Calculate and update average word length
        const avgWordLength = stats.wordCount > 0 
            ? (stats.totalWordLength / stats.wordCount).toFixed(1)
            : '0';
        document.getElementById('avg-word-length').textContent = avgWordLength;
        
        // Find and update most used key
        let mostUsedKey = '-';
        let maxCount = 0;
        
        for (const [key, count] of Object.entries(stats.keyPresses)) {
            if (count > maxCount && key !== ' ' && key !== 'Backspace') {
                maxCount = count;
                mostUsedKey = key === ' ' ? 'Space' : key.toUpperCase();
            }
        }
        
        document.getElementById('most-used-key').textContent = mostUsedKey;
    }

    // Handle keyboard input for stats
    function handleKeyForStats(key) {
        // Skip if it's a control key we don't want to count
        if ([
            'Shift', 'Control', 'Alt', 'Meta', 'CapsLock',
            'Tab', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'
        ].includes(key)) {
            return;
        }
        
        // Handle backspace
        if (key === 'Backspace') {
            stats.backspaceCount++;
            return;
        }
        
        // Count the key press
        stats.totalKeystrokes++;
        stats.keyPresses[key] = (stats.keyPresses[key] || 0) + 1;
        
        // Update word count and average word length
        if (key === ' ') {
            if (!stats.lastKeyWasSpace) {
                stats.wordCount++;
            }
            stats.lastKeyWasSpace = true;
        } else {
            if (stats.lastKeyWasSpace) {
                stats.wordCount++;
                stats.lastKeyWasSpace = false;
            }
            // Add to total word length if it's not a space
            stats.totalWordLength++;
        }
        
        // Update the display
        updateStatsDisplay();
    }

    // Add event listener for reset button
    const resetButton = document.getElementById('reset-stats');
    if (resetButton) {
        resetButton.addEventListener('click', initStats);
    }

    // Make sidebar draggable
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        let isSidebarDragging = false;
        let sidebarOffsetX, sidebarOffsetY;
        
        // Use the first toggle as the drag handle
        const sidebarHandle = sidebar.querySelector('.sidebar-toggle:first-child') || sidebar;
        
        const startSidebarDrag = (e) => {
            // Only start dragging if clicking on the handle or its children (but not inputs/buttons)
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT') {
                return;
            }
            
            isSidebarDragging = true;
            const rect = sidebar.getBoundingClientRect();
            sidebarOffsetX = e.clientX - rect.left;
            sidebarOffsetY = e.clientY - rect.top;
            
            e.preventDefault();
            sidebar.style.cursor = 'grabbing';
            document.addEventListener('mousemove', onSidebarDrag);
            document.addEventListener('mouseup', stopSidebarDrag);
        };
        
        const onSidebarDrag = (e) => {
            if (!isSidebarDragging) return;
            
            const x = e.clientX - sidebarOffsetX;
            const y = e.clientY - sidebarOffsetY;
            
            sidebar.style.left = `${x}px`;
            sidebar.style.top = `${y}px`;
            sidebar.style.transform = 'none';
        };
        
        const stopSidebarDrag = () => {
            isSidebarDragging = false;
            sidebar.style.cursor = 'grab';
            document.removeEventListener('mousemove', onSidebarDrag);
            document.removeEventListener('mouseup', stopSidebarDrag);
        };
        
        sidebarHandle.addEventListener('mousedown', startSidebarDrag);
    }

    // Make stats container draggable
    const statsContainer = document.getElementById('stats-container');
    if (statsContainer) {
        let isDragging = false;
        let offsetX, offsetY;

        // Make the header the drag handle
        const header = statsContainer.querySelector('h3');
        
        const startDrag = (e) => {
            isDragging = true;
            
            // Calculate the offset from the mouse to the container's top-left corner
            const rect = statsContainer.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            
            // Prevent text selection while dragging
            e.preventDefault();
            
            // Change cursor to grabbing
            statsContainer.style.cursor = 'grabbing';
            if (header) header.style.cursor = 'grabbing';
            
            // Add event listeners for mousemove and mouseup
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', stopDrag);
        };
        
        const onDrag = (e) => {
            if (!isDragging) return;
            
            // Calculate new position
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            
            // Update container position
            statsContainer.style.left = `${x}px`;
            statsContainer.style.top = `${y}px`;
            
            // Remove any transform that might interfere
            statsContainer.style.transform = 'none';
        };
        
        const stopDrag = () => {
            isDragging = false;
            
            // Revert cursor
            statsContainer.style.cursor = 'grab';
            if (header) header.style.cursor = 'grab';
            
            // Remove event listeners
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', stopDrag);
        };
        
        // Add event listeners to the header
        if (header) {
            header.addEventListener('mousedown', startDrag);
        } else {
            // Fallback to the whole container if no header is found
            statsContainer.addEventListener('mousedown', startDrag);
        }
    }

    // Ensure the app only runs after the image is fully loaded
    if (keyboardImg.complete) {
        initializeHeatmapApp();
        initHeatmap();  // Initialize heatmap
        initStats();
        
        // Add event listener for keyboard input
        const textInput = document.getElementById('text-input');
        textInput.addEventListener('keydown', (e) => {
            handleKeyForStats(e.key);
            handleKeyDown(e);
        });
        
        // Update stats when text is pasted or changed programmatically
        textInput.addEventListener('input', () => {
            // This will be triggered after the paste event
            // We'll just update the word count and average word length
            const text = textInput.value;
            const words = text.trim().split(/\s+/).filter(word => word.length > 0);
            stats.wordCount = words.length;
            stats.totalWordLength = words.reduce((sum, word) => sum + word.length, 0);
            updateStatsDisplay();
        });
    } else {
        keyboardImg.addEventListener('load', () => {
            initializeHeatmapApp();
            initHeatmap();  // Initialize heatmap
            initStats();
            
            // Add event listener for keyboard input
            const textInput = document.getElementById('text-input');
            textInput.addEventListener('keydown', (e) => {
                handleKeyForStats(e.key);
                handleKeyDown(e);
            });
            
            // Update stats when text is pasted or changed programmatically
            textInput.addEventListener('input', () => {
                const text = textInput.value;
                const words = text.trim().split(/\s+/).filter(word => word.length > 0);
                stats.wordCount = words.length;
                stats.totalWordLength = words.reduce((sum, word) => sum + word.length, 0);
                updateStatsDisplay();
            });
        });
    }
});