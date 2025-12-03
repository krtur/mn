/**
 * This script can be included in your HTML to test the modal scrolling behavior
 * It simulates clicking on a button to open a modal and ensures it's visible
 */

// Function to test modal visibility
function testModalVisibility() {
  // Wait for the modal to open
  setTimeout(() => {
    // Find the modal element
    const modalElement = document.querySelector('.animate-fade-in-up');
    
    if (modalElement) {
      console.log('Modal found, scrolling into view');
      
      // Scroll to the modal with smooth behavior
      modalElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Log success
      console.log('Modal should now be centered in the viewport');
    } else {
      console.error('Modal element not found');
    }
  }, 100);
}

// You can call this function after clicking a button that opens a modal
// Example: document.querySelector('.btn-primary').addEventListener('click', testModalVisibility);
