// Example: Dynamically load documents (replace with backend integration as needed)
const documentsList = document.getElementById('documentsList');

// Demo data
const demoDocs = [
    { name: 'Resume.pdf', url: '#', type: 'pdf', date: '2025-07-14' },
    { name: 'Project.zip', url: '#', type: 'zip', date: '2025-07-13' },
    { name: 'Photo.png', url: '#', type: 'image', date: '2025-07-10' }
];

function renderDocuments(docs) {
    if (!docs.length) {
        documentsList.innerHTML = '<div class="document-item">No documents uploaded yet.</div>';
        return;
    }
    documentsList.innerHTML = docs.map(doc => `
        <div class="document-item">
            <span>📄 <strong>${doc.name}</strong> <small style="color:#666;font-size:0.95em">(${doc.date})</small></span>
            <a href="${doc.url}" class="download-link" download>Download</a>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    renderDocuments(demoDocs);
});
