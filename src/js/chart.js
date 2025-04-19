document.addEventListener('DOMContentLoaded', function() {
    const table = document.getElementById('chart-data');
    const chartTypeSelect = document.getElementById('chart-type');
    const ctx = document.getElementById('my-chart').getContext('2d');
    
    let myChart = null;
    const colorPalette = [
        '#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f'
    ];

    table.querySelectorAll('tbody tr').forEach(row => {
        row.addEventListener('click', function() {
            updateChart(this);
        });
    });

    chartTypeSelect.addEventListener('change', () => {
        const selectedRow = table.querySelector('tr.selected');
        if(selectedRow) updateChart(selectedRow);
    });

    function updateChart(selectedRow) {
        table.querySelectorAll('tr').forEach(row => row.classList.remove('selected'));
        selectedRow.classList.add('selected');
        
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent).slice(1);
        const cells = Array.from(selectedRow.querySelectorAll('td')).slice(1);
        const year = selectedRow.querySelector('td:first-child').textContent;
        const dataValues = cells.map(cell => parseInt(cell.textContent));

        const config = {
            type: chartTypeSelect.value,
            data: {
                labels: headers,
                datasets: [{
                    label: `Adatok ${year}`,
                    data: dataValues,
                    backgroundColor: colorPalette,
                    borderColor: '#2c3e50',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: `Vállalati teljesítmény - ${year}`
                    }
                },
                scales: chartTypeSelect.value === 'pie' ? {} : {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Értékek'
                        }
                    }
                }
            }
        };

        if(myChart) myChart.destroy();
        
        myChart = new Chart(ctx, config);
    }

    updateChart(table.querySelector('tbody tr:first-child'));
});