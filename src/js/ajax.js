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
        try {
            const result = await makeApiRequest({ op: 'read' });
            
            dataOutput.innerHTML = '<h4>Adatok:</h4>';
            result.list.forEach(item => {
                dataOutput.innerHTML += `
                    <div class="data-item">
                        <p>ID: ${item.id}</p>
                        <p>Név: ${item.name}</p>
                        <p>Magasság: ${item.height}</p>
                    </div>
                `;
            });

            if (result.list.length > 0) {
                const heights = result.list.map(item => parseInt(item.height));
                const sum = heights.reduce((a, b) => a + b, 0);
                const avg = sum / heights.length;
                const max = Math.max(...heights);
                
                statsOutput.innerHTML = `
                    <div class="stats">
                        <h4>Statisztikák:</h4>
                        <p>Összmagasság: ${sum} cm</p>
                        <p>Átlagmagasság: ${avg.toFixed(1)} cm</p>
                        <p>Legmagasabb: ${max} cm</p>
                    </div>
                `;
            } else {
                statsOutput.innerHTML = '<p>Nincs megjeleníthető adat</p>';
            }
        } catch (error) {
            showError(dataOutput, error);
            statsOutput.innerHTML = '';
        }
    });

    createForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(createForm);
        const errors = validateForm(formData, ['name', 'height']);

        if (Object.values(errors).some(Boolean)) {
            showFormErrors('create', errors);
            return;
        }

        try {
            const result = await makeApiRequest({
                op: 'create',
                name: formData.get('name').slice(0, 100),
                height: formData.get('height').slice(0, 100),
                weight: '0'
            });

            handleApiResponse('create', result);
            createForm.reset();
        } catch (error) {
            showError(document.getElementById('create-output'), error);
        }
    });

    updateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(updateForm);
        const errors = validateForm(formData, ['name', 'height']);

        if (Object.values(errors).some(Boolean)) {
            showFormErrors('update', errors);
            return;
        }

        try {
            const result = await makeApiRequest({
                op: 'update',
                id: formData.get('id'),
                name: formData.get('name').slice(0, 100),
                height: formData.get('height').slice(0, 100),
                weight: '0'
            });

            handleApiResponse('update', result);
        } catch (error) {
            showError(document.getElementById('update-output'), error);
        }
    });

    deleteDataBtn.addEventListener('click', async () => {
        const id = document.getElementById('delete-id').value;
        if (!id || !confirm(`Biztos törlöd az ID=${id} rekordot?`)) return;

        try {
            const result = await makeApiRequest({
                op: 'delete',
                id: id
            });

            handleApiResponse('delete', result);
            document.getElementById('delete-id').value = '';
        } catch (error) {
            showError(document.getElementById('delete-output'), error);
        }
    });

    function validateForm(formData, fields) {
        const errors = {};
        
        fields.forEach(field => {
            const value = formData.get(field);
            if (!value) {
                errors[field] = 'Kötelező mező!';
            } else if (value.length > 30) {
                errors[field] = 'Max 30 karakter!';
            }
        });

        return errors;
    }

    function showFormErrors(prefix, errors) {
        Object.entries(errors).forEach(([field, message]) => {
            const errorElement = document.getElementById(`${prefix}-${field}-error`);
            if (errorElement) errorElement.textContent = message;
        });
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

    document.getElementById('get-data-for-id').addEventListener('click', async () => {
        const id = document.getElementById('update-id').value;
        if (!id) return;

        try {
            const result = await makeApiRequest({
                op: 'read',
                id: id
            });

            if (result.list.length > 0) {
                const data = result.list[0];
                document.getElementById('update-id-field').value = data.id;
                document.getElementById('update-name').value = data.name;
                document.getElementById('update-height').value = data.height;
                document.getElementById('update-output').innerHTML = '<p class="success">Adatok betöltve!</p>';
            }
        } catch (error) {
            showError(document.getElementById('update-output'), error);
        }
    });
});