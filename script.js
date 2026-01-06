fetch('http://localhost:3000/cars')
    .then(response => response.json())
    .then(data => {
        const list = document.createElement('ul');

        data.forEach(car => {
            const li = document.createElement('li');
            li.textContent = `${car.color}- ${car.brand}`;
        

        const btn = document.createElement('button');
        btn.textContent = "Delete";

        btn.addEventListener('click', () => {
            fetch(`http://localhost:3000/cars/${car.id}`, {
                method: 'DELETE'
            })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                li.remove();
            });
        });

        li.appendChild(btn);
        list.appendChild(li);

        });
       
        document.body.appendChild(list);
    });