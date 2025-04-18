document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.querySelector('#data-table tbody');
    const addRowBtn = document.getElementById('add-row');
    const searchInput = document.getElementById('search-input');
    const sortColumn = document.getElementById('sort-column');
    const sortDirection = document.getElementById('sort-direction');
    const modal = document.getElementById('edit-modal');
    const closeBtn = document.querySelector('.close');
    const editForm = document.getElementById('edit-form');
    
    const columnKeys = ['name', 'age', 'city', 'job']; // Oszlopkulcsok a rendezéshez
    let tableData = JSON.parse(localStorage.getItem('tableData')) || [
        { id: 1, name: 'Kovács János', age: 32, city: 'Budapest', job: 'Fejlesztő' },
        { id: 2, name: 'Nagy Anna', age: 28, city: 'Debrecen', job: 'Tervező' },
        { id: 3, name: 'Tóth Péter', age: 45, city: 'Szeged', job: 'Menedzser' },
        { id: 4, name: 'Szabó Eszter', age: 23, city: 'Pécs', job: 'Marketing' }
    ];

    const saveToStorage = () => {
        localStorage.setItem('tableData', JSON.stringify(tableData));
    };

    function renderTable(data) {
        tableBody.innerHTML = '';
        
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.name}</td>
                <td>${row.age}</td>
                <td>${row.city}</td>
                <td>${row.job}</td>
                <td>
                    <button class="edit-btn" data-id="${row.id}">Szerkesztés</button>
                    <button class="delete-btn" data-id="${row.id}">Törlés</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', handleEdit);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDelete);
        });
    }

    addRowBtn.addEventListener('click', () => {
        const newId = tableData.length > 0 ? Math.max(...tableData.map(row => row.id)) + 1 : 1;
        const newRow = {
            id: newId,
            name: 'Új felhasználó',
            age: 25,
            city: 'Város',
            job: 'Foglalkozás'
        };
        
        tableData.push(newRow);
        saveToStorage();
        renderTable(tableData);
    });

    const handleEdit = (e) => {        const id = parseInt(e.target.dataset.id);
        const row = tableData.find(item => item.id === id);
        
        if (row) {
            document.getElementById('edit-id').value = row.id;
            document.getElementById('edit-name').value = row.name;
            document.getElementById('edit-age').value = row.age;
            document.getElementById('edit-city').value = row.city;
            document.getElementById('edit-job').value = row.job;
            modal.style.display = 'block';
        }
    };

    const handleDelete = (e) => {
        const id = parseInt(e.target.dataset.id);
        if (confirm('Biztosan törölni szeretné ezt a sort?')) {
            tableData = tableData.filter(row => row.id !== id);
            saveToStorage();
            renderTable(tableData);
        }
    };

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredData = tableData.filter(row => 
            Object.values(row).some(value => 
                value.toString().toLowerCase().includes(searchTerm)
            )
        );
        renderTable(filteredData);
    });

    const sortTable = () => {
        const columnIndex = sortColumn.value;
        const direction = sortDirection.value;
        
        if (!columnIndex) return;
        
        tableData.sort((a, b) => {
            const keyA = a[columnKeys[columnIndex]];
            const keyB = b[columnKeys[columnIndex]];
            
            if (typeof keyA === 'string') {
                return direction === 'asc' 
                    ? keyA.localeCompare(keyB)
                    : keyB.localeCompare(keyA);
            }
            return direction === 'asc' ? keyA - keyB : keyB - keyA;
        });
        
        renderTable(tableData);
    };

    sortColumn.addEventListener('change', sortTable);
    sortDirection.addEventListener('change', sortTable);

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            id: parseInt(document.getElementById('edit-id').value),
            name: document.getElementById('edit-name').value.trim(),
            age: parseInt(document.getElementById('edit-age').value),
            city: document.getElementById('edit-city').value.trim(),
            job: document.getElementById('edit-job').value.trim()
        };

        let isValid = true;
        const errors = {
            name: formData.name ? (formData.name.length > 30 ? 'Maximum 30 karakter!' : '') : 'A név kötelező!',
            age: formData.age ? (formData.age < 1 || formData.age > 120 ? '1 és 120 között legyen!' : '') : 'A kor kötelező!',
            city: formData.city ? (formData.city.length > 30 ? 'Maximum 30 karakter!' : '') : 'A város kötelező!',
            job: formData.job ? (formData.job.length > 30 ? 'Maximum 30 karakter!' : '') : 'A foglalkozás kötelező!'
        };

        Object.entries(errors).forEach(([key, error]) => {
            const errorElement = document.getElementById(`${key}-error`);
            errorElement.textContent = error;
            isValid = isValid && !error;
        });

        if (!isValid) return;

        const rowIndex = tableData.findIndex(row => row.id === formData.id);
        if (rowIndex !== -1) {
            tableData[rowIndex] = formData;
            saveToStorage();
            renderTable(tableData);
            modal.style.display = 'none';
        }
    });
    renderTable(tableData);
});