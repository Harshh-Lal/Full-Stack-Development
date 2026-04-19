import fs from 'fs';
import path from 'path';

function fixMarkers(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  // Find standard Git markers:
  // <<<<<<< HEAD
  // (ours)
  // =======
  // (theirs)
  // >>>>>>> <commit-hash>
  
  // We want to keep "theirs" (the remote side, representing origin/main updates).
  const regex = /<<<<<<< HEAD\n([\s\S]*?)=======\n([\s\S]*?)>>>>>>>.*?\n/g;
  
  const original = content;
  content = content.replace(regex, '$2');
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('Fixed:', filePath);
  } else {
    console.log('No markers found or regex mismatch in:', filePath);
  }
}

fixMarkers('./frontend/src/pages/OrderScreen.jsx');
fixMarkers('./frontend/src/pages/Admin.jsx');
// Also verify LiveStations just in case
fixMarkers('./frontend/src/pages/LiveStations.jsx');
