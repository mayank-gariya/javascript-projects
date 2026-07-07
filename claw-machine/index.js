const clawAssembly = document.getElementById('clawAssembly');
const clawRod = document.getElementById('clawRod');
const prizesContainer = document.getElementById('prizesContainer');
const moveLeftBtn = document.getElementById('moveLeftBtn');
const moveRightBtn = document.getElementById('moveRightBtn');
const grabBtn = document.getElementById('grabBtn');

// Configuration Constants
const MACHINE_WIDTH = 360;
const CLAW_WIDTH = 40;
const MAX_LEFT = 40 // Chute area buffer
const MAX_RIGHT = MACHINE_WIDTH - CLAW_WIDTH;
const DROP_DEPTH = 320; // How far down the rod stretches

// State Variables
let currentX = 150; 
let isBusy = false;
let prizesArray = [];

// Generate initial square box prizes
function spawnPrizes() {
    const colors = ['#ff4d6d', '#ff758f', '#ffb3c1', '#34d399', '#60a5fa', '#fbbf24'];
    // Generate a simple row of random colored boxes
    for (let i = 0; i < 7; i++) {
        const prize = document.createElement('div');
        prize.classList.add('prize');
        
        // Randomize horizontal placement slightly
        const targetX = 70 + (i * 38); 
        prize.style.left = `${targetX}px`;
        prize.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        prizesContainer.appendChild(prize);
        prizesArray.push({ element: prize, x: targetX });
    }
}

// Claw Movement Mechanics
function moveClaw(direction) {
    if (isBusy) return;
    
    if (direction === 'left' && currentX > MAX_LEFT) {
        currentX -= 15;
    } else if (direction === 'right' && currentX < MAX_RIGHT) {
        currentX += 15;
    }
    clawAssembly.style.left = `${currentX}px`;
}

async function runGrabSequence() {
    if (isBusy) return;
    isBusy = true;
    toggleControls(false);

    // 1. Drop the rod down
    clawRod.style.height = `${DROP_DEPTH}px`;
    await delay(500);

    // Close claw visual state
    clawAssembly.classList.add('grabbing');

    // 2. Simple physics check (Did we land near a prize box?)
    // Center point of claw alignment
    const clawCenterX = currentX + (CLAW_WIDTH / 2);
    let caughtPrize = null;

    for (let p of prizesArray) {
        // Check if prize x overlaps with claw center x
        if (Math.abs(p.x + 17 - clawCenterX) < 20) {
            caughtPrize = p;
            break;
        }
    }

    // 3. Attach prize to claw if caught
    if (caughtPrize) {
        caughtPrize.element.style.transition = 'bottom 0.5s ease-in-out, left 0.5s linear';
        caughtPrize.element.style.bottom = 'initial';
        caughtPrize.element.style.top = '30px'; // Lock to bottom of claw assembly
        clawAssembly.appendChild(caughtPrize.element);
    }

    // 4. Retract rod back up
    clawRod.style.height = '20px';
    await delay(500);

    // 5. Return to Home position (over the Drop Chute at left)
    currentX = 10;
    clawAssembly.style.transition = 'left 1.5s ease-in-out';
    clawAssembly.style.left = `${currentX}px`;
    await delay(1500);
    clawAssembly.style.transition = 'left 0.1s linear'; // Restore normal step transition

    // 6. Release Claw and Drop Prize
    clawAssembly.classList.remove('grabbing');
    if (caughtPrize) {
        caughtPrize.element.style.top = 'initial';
        caughtPrize.element.style.bottom = '0px';
        // Move prize directly down into the prize chute
        document.getElementById('playArea').appendChild(caughtPrize.element);
        caughtPrize.element.style.left = '10px';
        caughtPrize.element.style.transform = 'translateY(100px)';
        caughtPrize.element.style.transition = 'transform 0.4s ease-in';
        
        // Remove from tracked array
        prizesArray = prizesArray.filter(p => p !== caughtPrize);
        alert("Winner! You grabbed a prize!");
    }

    // Reset machine state
    isBusy = false;
    toggleControls(true);
}

// Helper Functions
function toggleControls(enable) {
    grabBtn.disabled = !enable;
    moveLeftBtn.disabled = !enable;
    moveRightBtn.disabled = !enable;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Event Listeners
moveLeftBtn.addEventListener('click', () => moveClaw('left'));
moveRightBtn.addEventListener('click', () => moveClaw('right'));
grabBtn.addEventListener('click', runGrabSequence);

// Keyboard support for ease of use
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') moveClaw('left');
    if (e.key === 'ArrowRight') moveClaw('right');
    if (e.key === ' ' || e.key === 'Enter') runGrabSequence(); // Space or enter to grab
});

spawnPrizes();