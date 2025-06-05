// Let's set up our array and its properties
let array = [];
const arraySize = 5;
const minValue = 1;  // Starting from 1 makes it easier to read
const maxValue = 99; // Keeping it under 100 for better visibility

// Handle the theme preference
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Create a fresh random array to work with
function generateArray() {
    array = Array.from({length: arraySize}, () => 
        Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue
    );
    displayArray();
}

// Figure out which numbers are the smallest and largest
function findMinMaxIndices() {
    let minIdx = 0;
    let maxIdx = 0;
    
    for (let i = 1; i < array.length; i++) {
        if (array[i] < array[minIdx]) minIdx = i;
        if (array[i] > array[maxIdx]) maxIdx = i;
    }
    
    return { minIdx, maxIdx };
}

// Show arrows pointing to the min and max numbers
function updateMinMaxArrows() {
    // Clean up any existing arrows first
    document.querySelectorAll('.arrow').forEach(arrow => arrow.remove());
    
    const { minIdx, maxIdx } = findMinMaxIndices();
    const containers = document.querySelectorAll('.number-container');
    
    // Add an upward arrow for the smallest number
    const minArrow = document.createElement('div');
    minArrow.className = 'arrow arrow-bottom min';
    minArrow.innerHTML = `
        <span class="arrow-text">smallest</span>
        <span class="arrow-symbol">↑</span>
    `;
    containers[minIdx].appendChild(minArrow);
    
    // Add a downward arrow for the largest number
    const maxArrow = document.createElement('div');
    maxArrow.className = 'arrow arrow-top max';
    maxArrow.innerHTML = `
        <span class="arrow-symbol">↓</span>
        <span class="arrow-text">largest</span>
    `;
    containers[maxIdx].appendChild(maxArrow);
}

// Clean up by removing all arrows
function removeArrows() {
    document.querySelectorAll('.arrow').forEach(arrow => arrow.remove());
}

// Put the numbers on screen and set up their input fields
function displayArray() {
    const container = document.getElementById('array-container');
    container.innerHTML = '';
    array.forEach((value, index) => {
        const numberContainer = document.createElement('div');
        numberContainer.className = 'number-container';
        
        const number = document.createElement('div');
        number.className = 'number';
        number.textContent = value;
        
        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'number-input';
        input.value = value;
        input.min = 1;
        input.max = 99;
        input.dataset.index = index;
        
        // Let users type in their own numbers
        input.addEventListener('change', (e) => {
            const newValue = parseInt(e.target.value);
            const index = parseInt(e.target.dataset.index);
            
            // Make sure the number makes sense
            if (isNaN(newValue) || newValue < 1 || newValue > 99) {
                e.target.value = array[index];
                return;
            }
            
            // Update what's shown on screen
            array[index] = newValue;
            const numberElement = e.target.parentNode.querySelector('.number');
            numberElement.textContent = newValue;
        });
        
        numberContainer.appendChild(number);
        numberContainer.appendChild(input);
        container.appendChild(numberContainer);
    });
}

// Keep the display in sync with our array
function updateDisplay() {
    const numbers = document.querySelectorAll('.number');
    array.forEach((value, index) => {
        numbers[index].textContent = value;
    });
    updateMinMaxArrows();
}

// Here's where the magic happens - Selection Sort
async function selectionSort() {
    const n = array.length;

    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        
        // Look for the smallest number in the unsorted part
        for (let j = i + 1; j < n; j++) {
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }
        
        // Swap if we found a smaller number
        if (minIdx !== i) {
            const temp = array[i];
            array[i] = array[minIdx];
            array[minIdx] = temp;
            updateDisplay();
        }
    }
    
    // All done! Show a nice message
    showCompletionMessage();
}

// Give users a pat on the back when sorting is done
function showCompletionMessage() {
    // Check if they want to see congratulations
    const showCongrats = localStorage.getItem('showCongrats');
    if (showCongrats === null || showCongrats === 'true') {
        const container = document.getElementById('container');
        const message = document.createElement('div');
        message.className = 'completion-message';
        message.innerHTML = '<h2>🎉 Sorted! 🎉</h2>';
        container.appendChild(message);
        
        // Don't leave the message hanging around too long
        setTimeout(() => {
            message.remove();
        }, 2000);
    }
}

// Show or hide the number input boxes
function toggleInputs(show) {
    const inputs = document.querySelectorAll('.number-input');
    inputs.forEach(input => {
        input.style.visibility = show ? 'visible' : 'hidden';
    });
}

// Get everything ready when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Set up the theme first
    initTheme();
    
    // Get our initial random numbers
    generateArray();

    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');

    // What happens when we click Sort
    startBtn.addEventListener('click', async () => {
        // Lock the sort button while we work
        startBtn.disabled = true;
        
        // Hide the input boxes during sorting
        toggleInputs(false);
        
        // Show which numbers are biggest and smallest
        updateMinMaxArrows();
        
        await selectionSort();
    });

    // What happens when we click Reset
    resetBtn.addEventListener('click', () => {
        // Let's sort again!
        startBtn.disabled = false;
        
        // Bring back the input boxes
        toggleInputs(true);
        
        // Clean up any leftover completion message
        const message = document.querySelector('.completion-message');
        if (message) {
            message.remove();
        }
        
        // Clear out the arrows
        removeArrows();
        
        // Get fresh random numbers
        generateArray();
    });
}); 