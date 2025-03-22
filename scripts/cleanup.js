// This script is meant to be run after deployment to clean up old route groups
// that might cause build issues on Vercel

const fs = require('fs');
const path = require('path');

// Path to the old (guest) directory
const oldGuestDirPath = path.join(__dirname, '..', 'app', '(guest)');

// Check if the directory exists
if (fs.existsSync(oldGuestDirPath)) {
  console.log(`Found old (guest) directory at ${oldGuestDirPath}`);
  
  try {
    // Delete the directory recursively
    fs.rmSync(oldGuestDirPath, { recursive: true, force: true });
    console.log('Successfully deleted old (guest) directory');
  } catch (error) {
    console.error('Error deleting old (guest) directory:', error);
  }
} else {
  console.log('Old (guest) directory not found, nothing to clean up');
}

console.log('Cleanup complete'); 