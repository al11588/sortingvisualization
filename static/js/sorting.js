// Hey! This is where we set up our array and its properties
let array = [];
const arraySize = 5;
const minValue = 1;  // Starting from 1 makes things easier to read
const maxValue = 99; // Keeping numbers under 100 so they're nice and visible

// Let's create a fresh random array to play with
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
    
    // Only add the largest indicator if it's the 5th number
    if (maxIdx === 4) {
        const maxArrow = document.createElement('div');
        maxArrow.className = 'arrow arrow-top max';
        maxArrow.innerHTML = `
            <span class="arrow-symbol">↓</span>
            <span class="arrow-text">largest</span>
        `;
        containers[maxIdx].appendChild(maxArrow);
    }
}

// Clean up by removing all arrows
function removeArrows() {
    document.querySelectorAll('.arrow').forEach(arrow => arrow.remove());
}

// Time to put our numbers on screen and set up their input boxes
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
        
        // Let's make it interactive - users can type their own numbers
        input.addEventListener('change', (e) => {
            const newValue = parseInt(e.target.value);
            const index = parseInt(e.target.dataset.index);
            
            // Oops! Let's make sure the number makes sense
            if (isNaN(newValue) || newValue < 1 || newValue > 99) {
                e.target.value = array[index];
                return;
            }
            
            // Great! Update what's shown on screen
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

// Here comes the magic - Selection Sort! 🎩✨
async function selectionSort() {
    const initialArray = [...array]; // Let's keep track of where we started
    const n = array.length;

    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        
        // Time to hunt for the smallest number in the unsorted part
        for (let j = i + 1; j < n; j++) {
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }
        
        // Found a smaller number? Let's swap them!
        if (minIdx !== i) {
            const temp = array[i];
            array[i] = array[minIdx];
            array[minIdx] = temp;
            updateDisplay();
        }
    }
    
    // Nice! Let's save this sorting achievement for posterity
    await saveSortingHistory(initialArray, array, 'Selection Sort');
    
    // Time to celebrate! 🎉
    showCompletionMessage();
}

// Let's give users a virtual high-five when they're done sorting!
function showCompletionMessage() {
    // First, let's check if they want to see our congratulations
    const showCongrats = localStorage.getItem('showCongrats');
    if (showCongrats === null || showCongrats === 'true') {
        const container = document.getElementById('container');
        const message = document.createElement('div');
        message.className = 'completion-message';
        message.innerHTML = '<h2>🎉 Sorted! 🎉</h2>';
        container.appendChild(message);
        
        // Show the share button
        const shareBtn = document.getElementById('shareBtn');
        shareBtn.style.display = 'inline-flex';
        
        // We'll keep the celebration brief - just 2 seconds
        setTimeout(() => {
            message.remove();
        }, 2000);
    }
}

// Share the sorting results on Twitter
function shareOnTwitter() {
    const text = `I sorted these numbers using Selection Sort: ${array.join(', ')} 🎉 #codingisfun #al11588  `;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank');
}

// Show or hide the number input boxes
function toggleInputs(show) {
    const inputs = document.querySelectorAll('.number-input');
    inputs.forEach(input => {
        input.style.visibility = show ? 'visible' : 'hidden';
    });
}

// Alright, let's get everything ready when the page loads!
document.addEventListener('DOMContentLoaded', () => {
    // First things first - let's get some random numbers to play with
    generateArray();

    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    const shareBtn = document.getElementById('shareBtn');

    // Here's what happens when someone hits the Sort button
    startBtn.addEventListener('click', async () => {
        // Hold on tight - we're going sorting!
        startBtn.disabled = true;
        shareBtn.style.display = 'none';
        
        // Let's hide those input boxes while we work our magic
        toggleInputs(false);
        
        // Time to show off which numbers are the biggest and smallest
        updateMinMaxArrows();
        
        await selectionSort();
    });

    // And here's what happens when someone wants to start fresh
    resetBtn.addEventListener('click', () => {
        // Ready for another round of sorting!
        startBtn.disabled = false;
        shareBtn.style.display = 'none';
        
        // Bring those input boxes back
        toggleInputs(true);
        
        // Clean up any leftover celebration messages
        const message = document.querySelector('.completion-message');
        if (message) {
            message.remove();
        }
        
        // Wave goodbye to those arrows
        removeArrows();
        
        // Time for a new set of numbers!
        generateArray();
    });

    // Handle sharing to Twitter
    shareBtn.addEventListener('click', shareOnTwitter);
});

// Let's keep track of our sorting adventures!
async function saveSortingHistory(initialArray, sortedArray, algorithm) {
    try {
        const response = await fetch('/api/save-sort', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                initial_array: initialArray,
                sorted_array: sortedArray,
                algorithm: algorithm
            })
        });
        const data = await response.json();
        if (data.status !== 'success') {
            console.error('Oops! Had trouble saving our sorting history:', data.message);
        }
    } catch (error) {
        console.error('Uh-oh! Something went wrong while saving our sorting history:', error);
    }
}