function construirChart(){ 

    //const socket = new WebSocket("ws://localhost:3000/websocket");
    const socket = new WebSocket('ws://localhost:3001/ws');
    // Connection opened
    socket.onmessage = event => {
        const data = JSON.parse(event.data)
        const labels = data.labels
        const entradas = data.entradas
        const baixas = data.baixas

        const ctx = document.getElementById('myChart');
        const myChart = new Chart(ctx, {      
            data: {
                labels: labels,
                datasets: [{
                    type:'bar',
                    label: 'Entradas',
                    data: entradas,
                    backgroundColor: ['rgba(54, 162, 235, 0.2)'],
                    borderColor:['rgba(54, 162, 235, 1)'],
                    borderWidth: 2,
                },
                {
                    type:'line',
                    label: 'Entradas',
                    data: entradas,
                    backgroundColor: ['rgba(54, 162, 235, 0.2)'],
                    borderColor:['rgba(54, 162, 235, 1)'],
                    borderWidth: 2,
                },
                {
                    type: 'bar',
                    label: 'Saídas',
                    data: baixas,
                    backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                    borderColor:['rgba(255, 99, 132, 1)'],
                    borderWidth: 2,
                },
                {
                    type: 'line',
                    label: 'Saídas',
                    data: baixas,
                    backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                    borderColor:['rgba(255, 99, 132, 1)'],
                    borderWidth: 2,
                },],
            },
            options: {
                scales: {
                    x: {
                        grid: {
                            borderColor: ['rgba(246, 152, 45, 1)'],
                        }
                    }
                }
            }
        });
      }

    // Listen for messages
    socket.addEventListener('message', function (event) {

    });

 

   
} 

construirChart()

    
    