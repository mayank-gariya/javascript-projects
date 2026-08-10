/**
 * Clean JavaScript Module Template
 * Handles interactivity, event listeners, and dynamic UI state.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Element Selectors
  const actionButton = document.querySelector('.btn');
  const container = document.querySelector('.container');

  // 2. State Management
  const state = {
    isLoading: false,
    clickCount: 0
  };

  // 3. Event Handlers
  async function handleClick(event) {
    event.preventDefault();
    
    if (state.isLoading) return;
    
    state.clickCount += 1;
    updateButtonState(true);

    try {
      // Simulate an async operation (e.g., API call)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      showNotification(`Success! Click count: ${state.clickCount}`);
    } catch (error) {
      console.error('An error occurred:', error);
      showNotification('Something went wrong.', true);
    } finally {
      updateButtonState(false);
    }
  }

  // 4. UI Helper Functions
  function updateButtonState(loading) {
    state.isLoading = loading;
    if (loading) {
      actionButton.textContent = 'Processing...';
      actionButton.style.opacity = '0.7';
      actionButton.style.cursor = 'wait';
    } else {
      actionButton.textContent = 'Get Started';
      actionButton.style.opacity = '1';
      actionButton.style.cursor = 'pointer';
    }
  }

  function showNotification(message, isError = false) {
    // Remove existing notification if present
    const existingMessage = document.querySelector('.feedback-message');
    if (existingMessage) existingMessage.remove();

    // Create feedback banner
    const feedback = document.createElement('div');
    feedback.className = 'feedback-message';
    feedback.textContent = message;
    
    // Inline styling for feedback
    Object.assign(feedback.style, {
      marginTop: '1rem',
      padding: '0.75rem',
      borderRadius: '8px',
      fontSize: '0.875rem',
      textAlign: 'center',
      backgroundColor: isError ? '#fef2f2' : '#f0fdf4',
      color: isError ? '#991b1b' : '#166534',
      border: `1px solid ${isError ? '#fecaca' : '#bbf7d0'}`
    });

    container.appendChild(feedback);
  }

  // 5. Attach Listeners
  if (actionButton) {
    actionButton.addEventListener('click', handleClick);
  }
});