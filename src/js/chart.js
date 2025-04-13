document.addEventListener('DOMContentLoaded', function() {
    const table = document.getElementById('chart-data');
    const drawChartBtn = document.getElementById('draw-chart');
    const chartTypeSelect = document.getElementById('chart-type');
    const ctx = document.getElementById('my-chart').getContext('2d');
    
    let myChart = null;
    
    drawChartBtn.addEventListener('click', function() {
        const rows = Array.from(table.querySelectorAll('tbody tr'));
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent);
        
        const labels = rows.map(row => row.cells[0].textContent);
        const datasets = [];
        
        for (let i = 1; i < headers.length; i++) {
            const data = rows.map(row => parseInt(row.cells[i].textContent));
            
            datasets.push({
                label: headers[i],
                data: data,
                backgroundColor: getRandomColor(),
                borderColor: getRandomColor(),
                borderWidth: 1
            });
        }
        
        if (myChart) {
            myChart.destroy();
        }
        
        myChart = new Chart(ctx, {
            type: chartTypeSelect.value,
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Vállalati adatok diagramja'
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    });
    
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    drawChartBtn.click();
});