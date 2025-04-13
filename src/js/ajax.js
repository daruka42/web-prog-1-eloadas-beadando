document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'apiurlkellide';
    
    const getDataBtn = document.getElementById('get-data');
    const dataOutput = document.getElementById('data-output');
    const statsOutput = document.getElementById('stats-output');
    
    const createForm = document.getElementById('create-form');
    const createName = document.getElementById('create-name');
    const createHeight = document.getElementById('create-height');
    const createOutput = document.getElementById('create-output');
    
    const updateId = document.getElementById('update-id');
    const getDataForIdBtn = document.getElementById('get-data-for-id');
    const updateForm = document.getElementById('update-form');
    const updateIdField = document.getElementById('update-id-field');
    const updateName = document.getElementById('update-name');
    const updateHeight = document.getElementById('update-height');
    const updateOutput = document.getElementById('update-output');
    
    const deleteId = document.getElementById('delete-id');
    const deleteDataBtn = document.getElementById('delete-data');
    const deleteOutput = document.getElementById('delete-output');
    
    getDataBtn.addEventListener('click', function() {
        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Hálózati hiba történt');
                }
                return response.json();
            })
            .then(data => {
                dataOutput.innerHTML = '<h4>Adatok:</h4>';
                data.forEach(item => {
                    dataOutput.innerHTML += `
                        <p>ID: ${item.id}, Név: ${item.name}, Magasság: ${item.height}</p>
                    `;
                });
                
                if (data.length > 0) {
                    const heights = data.map(item => parseInt(item.height));
                    const sum = heights.reduce((a, b) => a + b, 0);
                    const avg = sum / heights.length;
                    const max = Math.max(...heights);
                    
                    statsOutput.innerHTML = `
                        <h4>Statisztikák:</h4>
                        <p>Összes magasság: ${sum}</p>
                        <p>Átlag magasság: ${avg.toFixed(2)}</p>
                        <p>Legnagyobb magasság: ${max}</p>
                    `;
                } else {
                    statsOutput.innerHTML = '<p>Nincs adat a statisztikákhoz.</p>';
                }
            })
            .catch(error => {
                dataOutput.innerHTML = `<p class="error">Hiba történt: ${error.message}</p>`;
                statsOutput.innerHTML = '';
            });
    });
    
    createForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = createName.value.trim();
        const height = createHeight.value.trim();
        let isValid = true;
        
        if (!name || name.length > 30) {
            document.getElementById('create-name-error').textContent = 
                !name ? 'A név kötelező!' : 'Maximum 30 karakter!';
            isValid = false;
        } else {
            document.getElementById('create-name-error').textContent = '';
        }
        
        if (!height) {
            document.getElementById('create-height-error').textContent = 'A magasság kötelező!';
            isValid = false;
        } else {
            document.getElementById('create-height-error').textContent = '';
        }
        
        if (!isValid) return;
        
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                height: parseInt(height)
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Hálózati hiba történt');
            }
            return response.json();
        })
        .then(data => {
            createOutput.innerHTML = `<p class="success">Sikeres létrehozás! ID: ${data.id}</p>`;
            createForm.reset();
        })
        .catch(error => {
            createOutput.innerHTML = `<p class="error">Hiba történt: ${error.message}</p>`;
        });
    });
    
    getDataForIdBtn.addEventListener('click', function() {
        const id = updateId.value.trim();
        
        if (!id) {
            updateOutput.innerHTML = '<p class="error">Az ID megadása kötelező!</p>';
            return;
        }
        
        fetch(`${API_URL}/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Hálózati hiba történt vagy nem található az ID');
                }
                return response.json();
            })
            .then(data => {
                updateIdField.value = data.id;
                updateName.value = data.name;
                updateHeight.value = data.height;
                updateOutput.innerHTML = '<p class="success">Adatok betöltve!</p>';
            })
            .catch(error => {
                updateOutput.innerHTML = `<p class="error">Hiba történt: ${error.message}</p>`;
            });
    });
    
    updateForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const id = updateIdField.value;
        const name = updateName.value.trim();
        const height = updateHeight.value.trim();
        let isValid = true;
        
        if (!name || name.length > 30) {
            document.getElementById('update-name-error').textContent = 
                !name ? 'A név kötelező!' : 'Maximum 30 karakter!';
            isValid = false;
        } else {
            document.getElementById('update-name-error').textContent = '';
        }
        
        if (!height) {
            document.getElementById('update-height-error').textContent = 'A magasság kötelező!';
            isValid = false;
        } else {
            document.getElementById('update-height-error').textContent = '';
        }
        
        if (!isValid) return;
        
        fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                height: parseInt(height)
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Hálózati hiba történt');
            }
            return response.json();
        })
        .then(data => {
            updateOutput.innerHTML = '<p class="success">Sikeres frissítés!</p>';
        })
        .catch(error => {
            updateOutput.innerHTML = `<p class="error">Hiba történt: ${error.message}</p>`;
        });
    });
    
    deleteDataBtn.addEventListener('click', function() {
        const id = deleteId.value.trim();
        
        if (!id) {
            deleteOutput.innerHTML = '<p class="error">Az ID megadása kötelező!</p>';
            return;
        }
        
        if (!confirm(`Biztosan törölni szeretné az ID=${id} rekordot?`)) {
            return;
        }
        
        fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Hálózati hiba történt vagy nem található az ID');
            }
            return response.json();
        })
        .then(data => {
            deleteOutput.innerHTML = '<p class="success">Sikeres törlés!</p>';
            deleteId.value = '';
        })
        .catch(error => {
            deleteOutput.innerHTML = `<p class="error">Hiba történt: ${error.message}</p>`;
        });
    });
});