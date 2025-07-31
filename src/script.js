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
            '1': { x: 60, y: 70 }, '!': { x: 60, y: 70 },
            '2': { x: 125, y: 70 }, '@': { x: 125, y: 70 },
            '3': { x: 185, y: 70 }, '#': { x: 185, y: 70 },
            '4': { x: 245, y: 70 }, '$': { x: 245, y: 70 },
            '5': { x: 313, y: 70 }, '%': { x: 313, y: 70 },
            '6': { x: 380, y: 70 }, '^': { x: 380, y: 70 },
            '7': { x: 440, y: 70 }, '&': { x: 440, y: 70 },
            '8': { x: 500, y: 70 }, '*': { x: 500, y: 70 },
            '9': { x: 563, y: 70 }, '(': { x: 563, y: 70 },
            '0': { x: 625, y: 70 }, ')': { x: 625, y: 70 },
            '-': { x: 690, y: 70 }, '_': { x: 690, y: 70 },
            '=': { x: 760, y: 70 }, '+': { x: 760, y: 70 },
            // Top letter row
            'q': { x: 105, y: 130 }, 'w': { x: 165, y: 130 }, 'e': { x: 225, y: 130 }, 'r': { x: 285, y: 130 }, 't': { x: 350, y: 130 }, 'y': { x: 415, y: 130 }, 'u': { x: 475, y: 130 }, 'i': { x: 540, y: 130 }, 'o': { x: 605, y: 130 }, 'p': { x: 665, y: 130 }, 
            '[': { x: 730, y: 130 }, '{': { x: 730, y: 130 },
            ']': { x: 790, y: 130 }, '}': { x: 790, y: 130 },
            '\\': { x: 850, y: 130 }, '|': { x: 850, y: 130 },
            // Home row
            'a': { x: 135, y: 190 }, 's': { x: 195, y: 190 }, 'd': { x: 255, y: 190 }, 'f': { x: 315, y: 190 }, 'g': { x: 375, y: 190 }, 'h': { x: 435, y: 190 }, 'j': { x: 505, y: 190 }, 'k': { x: 570, y: 190 }, 'l': { x: 630, y: 190 }, 
            ';': { x: 695, y: 190 }, ':': { x: 695, y: 190 },
            '\'': { x: 760, y: 190 }, '"': { x: 760, y: 190 },
            // Bottom letter row
            'z': { x: 150, y: 250 }, 'x': { x: 210, y: 250 }, 'c': { x: 270, y: 250 }, 'v': { x: 335, y: 250 }, 'b': { x: 400, y: 250 }, 'n': { x: 465, y: 250 }, 'm': { x: 525, y: 250 },
            ',': { x: 585, y: 250 }, '<': { x: 585, y: 250 },
            '.': { x: 645, y: 250 }, '>': { x: 645, y: 250 },
            '/': { x: 710, y: 250 }, '?': { x: 710, y: 250 },
            // Space bar
            ' ': { x: 435, y: 310 }
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

    // Ensure the app only runs after the image is fully loaded
    if (keyboardImg.complete) {
        initializeHeatmapApp();
    } else {
        keyboardImg.addEventListener('load', initializeHeatmapApp);
    }
});