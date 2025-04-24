document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'http://gamf.nhely.hu/ajax2/';
    const NEPTUN_CODE = 'Q60PVQ';
    const CUSTOM_CODE = 'efg456';
    const API_CODE = NEPTUN_CODE + CUSTOM_CODE;
    
    const getDataBtn = document.getElementById('get-data');
    const dataOutput = document.getElementById('data-output');
    const statsOutput = document.getElementById('stats-output');
    const createForm = document.getElementById('create-form');
    const updateForm = document.getElementById('update-form');
    const deleteDataBtn = document.getElementById('delete-data');
    const getDataForIdBtn = document.getElementById('get-data-for-id');
    
    clearFormErrors('create');
    clearFormErrors('update');
    
    const makeApiRequest = async (params) => {
        const formData = new URLSearchParams();
        formData.append('code', API_CODE);
        
        Object.entries(params).forEach(([key, value]) => {
            formData.append(key, value);
        });
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            });
            
            if (!response.ok) throw new Error(`HTTP hiba: ${response.status}`);
            return await response.json();
        } catch (error) {
            throw new Error(`API hiba: ${error.message}`);
        }
    };
    
    getDataBtn.addEventListener('click', async () => {
        dataOutput.innerHTML = '<p>Adatok betöltése...</p>';
        statsOutput.innerHTML = '';
        
        try {
            const result = await makeApiRequest({ op: 'read' });
            
            if (result.list && result.list.length > 0) {
                dataOutput.innerHTML = '<h4>Adatok:</h4>';
                let tableHtml = '<table class="data-table"><thead><tr><th>ID</th><th>Név</th><th>Magasság</th></tr></thead><tbody>';
                
                result.list.forEach(item => {
                    tableHtml += `<tr><td>${item.id}</td><td>${escapeHtml(item.name)}</td><td>${item.height} cm</td></tr>`;
                });
                
                tableHtml += '</tbody></table>';
                dataOutput.innerHTML += tableHtml;
                
                const heights = result.list.map(item => parseInt(item.height));
                const sum = heights.reduce((a, b) => a + b, 0);
                const avg = sum / heights.length;
                const max = Math.max(...heights);
                const min = Math.min(...heights);
                
                statsOutput.innerHTML = `
                    <div class="stats">
                        <h4>Statisztikák:</h4>
                        <p>Összmagasság: ${sum} cm</p>
                        <p>Átlagmagasság: ${avg.toFixed(1)} cm</p>
                        <p>Legmagasabb: ${max} cm</p>
                        <p>Legalacsonyabb: ${min} cm</p>
                        <p>Rekordok száma: ${heights.length}</p>
                    </div>
                `;
            } else {
                dataOutput.innerHTML = '<p>Nincs megjeleníthető adat</p>';
                statsOutput.innerHTML = '';
            }
        } catch (error) {
            showError(dataOutput, error);
            statsOutput.innerHTML = '';
        }
    });
    
    createForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(createForm);
        clearFormErrors('create');
        const errors = validateForm(formData);
        
        if (Object.keys(errors).length > 0) {
            showFormErrors('create', errors);
            return;
        }
        
        document.getElementById('create-output').innerHTML = '<p>Feldolgozás...</p>';
        
        try {
            const result = await makeApiRequest({
                op: 'create',
                name: formData.get('name'),
                height: formData.get('height'),
                weight: '0'
            });
            
            handleApiResponse('create', result);
            
            if (result.rowCount > 0) {
                createForm.reset();
                getDataBtn.click();
            }
        } catch (error) {
            showError(document.getElementById('create-output'), error);
        }
    });
    
    updateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(updateForm);
        clearFormErrors('update');
        
        if (!formData.get('id')) {
            document.getElementById('update-output').innerHTML = '<p class="error">Nincs kiválasztva ID!</p>';
            return;
        }
        
        const errors = validateForm(formData);
        
        if (Object.keys(errors).length > 0) {
            showFormErrors('update', errors);
            return;
        }
        
        document.getElementById('update-output').innerHTML = '<p>Feldolgozás...</p>';
        
        try {
            const result = await makeApiRequest({
                op: 'update',
                id: formData.get('id'),
                name: formData.get('name'),
                height: formData.get('height'),
                weight: '0'
            });
            
            handleApiResponse('update', result);
            
            if (result.rowCount > 0) {
                getDataBtn.click();
            }
        } catch (error) {
            showError(document.getElementById('update-output'), error);
        }
    });
    
    getDataForIdBtn.addEventListener('click', async () => {
        const id = document.getElementById('update-id').value;
        clearFormErrors('update');
        
        if (!id) {
            document.getElementById('update-output').innerHTML = '<p class="error">Adjon meg egy ID-t!</p>';
            return;
        }
        
        document.getElementById('update-output').innerHTML = '<p>Adatok keresése...</p>';
        
        try {
            const result = await makeApiRequest({
                op: 'read',
                id: id
            });
            
            if (result.list && result.list.length > 0) {
                const data = result.list[0];
                document.getElementById('update-id-field').value = data.id;
                document.getElementById('update-name').value = data.name;
                document.getElementById('update-height').value = data.height;
                document.getElementById('update-output').innerHTML = '<p class="success">Adatok betöltve szerkesztésre!</p>';
            } else {
                document.getElementById('update-output').innerHTML = `<p class="error">Nem található rekord ezzel az ID-val: ${id}</p>`;
                updateForm.reset();
            }
        } catch (error) {
            showError(document.getElementById('update-output'), error);
            updateForm.reset();
        }
    });
    
    deleteDataBtn.addEventListener('click', async () => {
        const id = document.getElementById('delete-id').value;
        const deleteOutput = document.getElementById('delete-output');
        
        if (!id) {
            deleteOutput.innerHTML = '<p class="error">Adjon meg egy ID-t!</p>';
            return;
        }
        
        if (!confirm(`Biztos törölni szeretné az ID=${id} azonosítójú rekordot?`)) {
            return;
        }
        
        deleteOutput.innerHTML = '<p>Törlés folyamatban...</p>';
        
        try {
            const result = await makeApiRequest({
                op: 'delete',
                id: id
            });
            
            handleApiResponse('delete', result);
            
            if (result.rowCount > 0) {
                document.getElementById('delete-id').value = '';
                getDataBtn.click();
            }
        } catch (error) {
            showError(deleteOutput, error);
        }
    });
    
    function validateForm(formData) {
        const errors = {};
        
        const name = formData.get('name');
        if (!name) {
            errors.name = 'A név megadása kötelező!';
        } else if (name.length > 30) {
            errors.name = 'A név maximum 30 karakter lehet!';
        }
        
        const height = formData.get('height');
        if (!height) {
            errors.height = 'A magasság megadása kötelező!';
        } else if (isNaN(height) || parseInt(height) <= 0) {
            errors.height = 'A magasságnak pozitív számnak kell lennie!';
        }
        
        return errors;
    }
    
    function showFormErrors(prefix, errors) {
        Object.entries(errors).forEach(([field, message]) => {
            const errorElement = document.getElementById(`${prefix}-${field}-error`);
            if (errorElement) errorElement.textContent = message;
        });
    }
    
    function clearFormErrors(prefix) {
        const errorElements = document.querySelectorAll(`#${prefix}-form .error-message`);
        errorElements.forEach(el => el.textContent = '');
    }
    
    function handleApiResponse(operation, result) {
        const outputElement = document.getElementById(`${operation}-output`);
        if (result.rowCount > 0) {
            outputElement.innerHTML = `<p class="success">Sikeres ${operation} művelet!</p>`;
        } else {
            outputElement.innerHTML = `<p class="error">Sikertelen ${operation} művelet</p>`;
        }
    }
    
    function showError(element, error) {
        element.innerHTML = `<p class="error">Hiba: ${error.message}</p>`;
    }
    
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
