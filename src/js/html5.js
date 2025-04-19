document.addEventListener('DOMContentLoaded', function() {
    const storageInput = document.getElementById('storage-input');
    const saveStorageBtn = document.getElementById('save-storage');
    const clearStorageBtn = document.getElementById('clear-storage');
    const storageOutput = document.getElementById('storage-output');
    
    if (localStorage.getItem('savedText')) {
        storageInput.value = localStorage.getItem('savedText');
        storageOutput.textContent = `Mentett érték: ${localStorage.getItem('savedText')}`;
    }
    
    saveStorageBtn.addEventListener('click', function() {
        localStorage.setItem('savedText', storageInput.value);
        storageOutput.textContent = `Mentett érték: ${storageInput.value}`;
    });
    
    clearStorageBtn.addEventListener('click', function() {
        localStorage.removeItem('savedText');
        storageInput.value = '';
        storageOutput.textContent = 'Nincs mentett érték.';
    });

    const dragItem = document.getElementById('drag-item');
    const dropZone = document.getElementById('drop-zone');
    
    dragItem.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
        e.target.style.opacity = '0.4';
    });
    
    dragItem.addEventListener('dragend', function(e) {
        e.target.style.opacity = '1';
    });
    
    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.target.style.backgroundColor = '#f0f0f0';
    });
    
    dropZone.addEventListener('dragleave', function(e) {
        e.target.style.backgroundColor = '';
    });
    
    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        const draggedElement = document.getElementById(id);
        e.target.appendChild(draggedElement);
        e.target.style.backgroundColor = '';
    });
    
    const canvas = document.getElementById('my-canvas');
    const drawCanvasBtn = document.getElementById('draw-canvas');
    
    drawCanvasBtn.addEventListener('click', function() {
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.strokeStyle = 'red';
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(100, 50, 30, 0, Math.PI * 2);
        ctx.fillStyle = 'blue';
        ctx.fill();
        
        ctx.font = '16px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('Canvas példa', 30, 80);
    });
    
    drawCanvasBtn.click();
});
