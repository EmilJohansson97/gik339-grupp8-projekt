//hämta element
const form = document.getElementById("itemForm");
const messageDiv = document.getElementById('msg');
const brandInput = document.getElementById('brand');
const colorInput = document.getElementById('color');
const idInput = document.getElementById('carId');


// ✅ Global lista (bara en)
const list = document.createElement('ul');
document.body.appendChild(list);
list.className = 'list-unstyled ms-5';
// ✅ Lägg till en bil i listan (återanvänds av GET + POST)
function addCarToList(car) {
  const li = document.createElement('li');
  const card = document.createElement('div');
  card.className = 'card card-body w-50 ml-3 mb-3';
  li.dataset.id = car.ID;
 

  card.innerHTML = `<div class="card-body">
    <ul class="list-group">
    <li class = "list-group-item" style="background-color: ${car.Color.toLowerCase()};" > 
        <strong>Brand:</strong> <span class="brand">${car.Brand}</span>
        <strong>Color:</strong> <span class="color">${car.Color}</span></li>
    </ul>
      <button class="btn btn-primary mt-2">Edit</button>
      <button class="btn btn-danger mt-2">Delete</button>
    </div>`;

  const [edtbtn, btn] = card.querySelectorAll('button');
  // Edit-knapp

  edtbtn.addEventListener('click', () => {

    brandInput.value = car.Brand;
    colorInput.value = car.Color;
    idInput.value = car.ID;
 });
  // Delete-knapp

  btn.addEventListener('click', () => {
    fetch(`http://localhost:3000/cars/${car.ID}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(result => {
        console.log(result);
        li.remove();
        showMessage("Car deleted", "danger");
      })
      .catch(err => {
        console.error(err);
        showMessage("Error deleting car", "warning");
      });
  });
  li.appendChild(card);
  list.appendChild(li);
}

// ✅ Hämta och rendera bilar vid start
fetch('http://localhost:3000/cars')
  .then(response => response.json())
  .then(data => {
    data.forEach(car => addCarToList(car));
  });


function showMessage(text, type) {
  messageDiv.textContent = text;
  messageDiv.className = `alert alert-${type}`;
  messageDiv.classList.remove('d-none');
}

console.log("form:", form);
form?.addEventListener("submit", () => console.log("SUBMIT TRIGGERED"));

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const brand = brandInput.value.trim();
  const color = colorInput.value.trim();
  const id = idInput.value;

  if (!brand || !color) {
    showMessage("Both fields are required", "danger");
    return;
  }
try{
  if(id) {
    fetch(`http://localhost:3000/cars/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brand: brand,
        color: color
      })
    })
      .then(res => res.json())
      .then(result => {
        console.log(result);

        const li = list.querySelector(`li[data-id='${id}']`);
        if (!li) return;
      
        const brandSpan = li.querySelector('.brand');
        const colorSpan = li.querySelector('.color');
        const item = li.querySelector('.list-group-item');

        if (brandSpan) brandSpan.textContent = brand;
        if (colorSpan) colorSpan.textContent = color;

        if (item) item.style.backgroundColor = color.toLowerCase()
            })
            .catch(err => {
              console.error(err);
              showMessage("Error updating car", "warning");
            });
        idInput.value = '';
        showMessage("Car updated", "success");    
        form.reset();
  } else {
  
    const res = await fetch('http://localhost:3000/cars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand, color })
    });
    
    if (!res.ok) {
      showMessage("Error creating car", "warning");
    }

    const data = await res.json();
    console.log("Created:", data);

    addCarToList(data);

    form.reset();
    showMessage("Car created", "success");
    }
  } catch (err) {
    console.error(err);
    showMessage("Error adding car", "danger");
  }
});


