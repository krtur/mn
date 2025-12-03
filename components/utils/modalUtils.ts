/**
 * Utility functions for modals
 */

/**
 * Ensures a modal is visible in the viewport when opened
 * @param setterFunction - The state setter function that controls the modal visibility
 */
export const openModalAndEnsureVisibility = (setterFunction: React.Dispatch<React.SetStateAction<boolean>>) => {
  // Open the modal
  setterFunction(true);
  
  // After opening the modal, ensure it's visible
  setTimeout(() => {
    // Find the modal element that was just opened
    const modalElement = document.querySelector('.animate-fade-in-up');
    if (modalElement) {
      // Scroll to the modal with smooth behavior
      modalElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 100); // Small delay to ensure the modal has been rendered
};
