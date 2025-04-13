document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.querySelector('#data-table tbody');
    const addRowBtn = document.getElementById('add-row');
    const searchInput = document.getElementById('search-input');
    const sortColumn = document.getElementById('sort-column');
    const sortDirection = document.getElementById('sort-direction');
    const modal = document.getElementById('edit-modal');
    const closeBtn = document.querySelector('.close');
    const editForm = document.getElementById('edit-form');
    
    let tableData = [
        { id: 1, name: 'Kovács János', age: 32, city: 'Budapest', job: 'Fejlesztő' },
        { id: 2, name: 'Nagy Anna', age: 28, city: 'Debrecen', job: 'Tervező' },
        { id: 3, name: 'Tóth Péter', age: 45, city: 'Szeged', job: 'Menedzser' },
        { id: 4, name: 'Szabó Eszter', age: 23, city: 'Pécs', job: 'Marketing' }
    ];
    
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
    
    addRowBtn.addEventListener('click', function() {
        const newId = tableData.length > 0 ? Math.max(...tableData.map(row => row.id)) + 1 : 1;
        const newRow = {
            id: newId,
            name: 'Új felhasználó',
            age: 25,
            city: 'Város',
            job: 'Foglalkozás'
        };
        
        tableData.push(newRow);
        renderTable(tableData);
    });
    
    function handleEdit(e) {
        const id = parseInt(e.target.getAttribute('data-id'));
        const row = tableData.find(item => item.id === id);
        
        if (row) {
            document.getElementById('edit-id').value = row.id;
            document.getElementById('edit-name').value = row.name;
            document.getElementById('edit-age').value = row.age;
            document.getElementById('edit-city').value = row.city;
            document.getElementById('edit-job').value = row.job;
            
            modal.style.display = 'block';
        }
    }
    
    function handleDelete(e) {
        const id = parseInt(e.target.getAttribute('data-id'));
        if (confirm('Biztosan törölni szeretné ezt a sort?')) {
            tableData = tableData.filter(row => row.id !== id);
            renderTable(tableData);
        }
    }
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredData = tableData.filter(row => 
            row.name.toLowerCase().includes(searchTerm) ||
            row.age.toString().includes(searchTerm) ||
            row.city.toLowerCase().includes(searchTerm) ||
            row.job.toLowerCase().includes(searchTerm)
        );
        renderTable(filteredData);
    });
    
    sortColumn.addEventListener('change', sortTable);
    sortDirection.addEventListener('change', sortTable);
    
    function sortTable() {
        const columnIndex = sortColumn.value;
        const direction = sortDirection.value;
        
        if (columnIndex === '') return;
        
        tableData.sort((a, b) => {
            const keyA = Object.values(a)[columnIndex];
            const keyB = Object.values(b)[columnIndex];
            
            if (typeof keyA === 'string') {
                return direction === 'asc' 
                    ? keyA.localeCompare(keyB)
                    : keyB.localeCompare(keyA);
            } else {
                return direction === 'asc' 
                    ? keyA - keyB
                    : keyB - keyA;
            }
        });
        
        renderTable(tableData);
    }
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('edit-name').value;
        const age = document.getElementById('edit-age').value;
        const city = document.getElementById('edit-city').value;
        const job = document.getElementById('edit-job').value;
        
        let isValid = true;
        
        if (!name || name.length > 30) {
            document.getElementById('name-error').textContent = 
                !name ? 'A név kötelező!' : 'Maximum 30 karakter!';
            isValid = false;
        } else {
            document.getElementById('name-error').textContent = '';
        }
        
        if (!age || age < 1 || age > 120) {
            document.getElementById('age-error').textContent = 
                !age ? 'A kor kötelező!' : '1 és 120 között legyen!';
            isValid = false;
        } else {
            document.getElementById('age-error').textContent = '';
        }
        
        if (!city || city.length > 30) {
            document.getElementById('city-error').textContent = 
                !city ? 'A város kötelező!' : 'Maximum 30 karakter!';
            isValid = false;
        } else {
            document.getElementById('city-error').textContent = '';
        }
        
        if (!job || job.length > 30) {
            document.getElementById('job-error').textContent = 
                !job ? 'A foglalkozás kötelező!' : 'Maximum 30 karakter!';
            isValid = false;
        } else {
            document.getElementById('job-error').textContent = '';
        }
        
        if (!isValid) return;
        
        const id = parseInt(document.getElementById('edit-id').value);
        const rowIndex = tableData.findIndex(row => row.id === id);
        
        if (rowIndex !== -1) {
            tableData[rowIndex] = {
                id,
                name,
                age: parseInt(age),
                city,
                job
            };
            
            renderTable(tableData);
            modal.style.display = 'none';
        }
    });
    
    renderTable(tableData);
});