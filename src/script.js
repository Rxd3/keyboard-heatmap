document.addEventListener('DOMContentLoaded', () => {
    const keyboardImg = document.getElementById('keyboard-img');
    
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
        let heatmapInstance;
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
        const originalKeyCoordinates = { ...keyCoordinates };
        
        // Remove spacebar by default
        delete keyCoordinates[' '];

        // Toggle spacebar visibility
        const toggleSpacebar = document.getElementById('toggle-spacebar');
        const heatmapSizeSelect = document.getElementById('heatmap-size');
        
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

        // Toggle spacebar visibility
        toggleSpacebar.addEventListener('change', function() {
            if (this.checked) {
                keyCoordinates[' '] = originalKeyCoordinates[' ']; // Restore spacebar
            } else {
                delete keyCoordinates[' ']; // Remove spacebar
            }
            generateHeatmap(textInput.value); // Regenerate heatmap
        });

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
        initStats();
        
        // Add event listener for keyboard input
        const textInput = document.getElementById('text-input');
        textInput.addEventListener('keydown', (e) => {
            handleKeyForStats(e.key);
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
            initStats();
            
            // Add event listener for keyboard input
            const textInput = document.getElementById('text-input');
            textInput.addEventListener('keydown', (e) => {
                handleKeyForStats(e.key);
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
        });
    }
});