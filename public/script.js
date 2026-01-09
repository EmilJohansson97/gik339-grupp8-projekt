//hämta element
const form = document.getElementById("itemForm");
const messageDiv = document.getElementById('msg');
const brandInput = document.getElementById('brand');
const colorInput = document.getElementById('color');
const idInput = document.getElementById('carId');

// ✅ Global lista (bara en)
const list = document.createElement('ul');
document.body.appendChild(list);

// ✅ Lägg till en bil i listan (återanvänds av GET + POST)
function addCarToList(car) {
  const li = document.createElement('li');
  li.dataset.id = car.ID;
  li.textContent = `${car.Brand} - ${car.Color} `;

  // Edit-knapp
  const edtbtn = document.createElement('button');
  edtbtn.textContent = "Edit";

  edtbtn.addEventListener('click', () => {

    brandInput.value = car.Brand;
    colorInput.value = car.Color;
    idInput.value = car.ID;
 });
  // Delete-knapp
  const btn = document.createElement('button');
  btn.textContent = "Delete";

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

  li.appendChild(edtbtn);
  li.appendChild(btn);
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
        if (li) li.firstChild.textContent = `${brand} - ${color} `;
       
        showMessage("Car updated", "success");
        idInput.value = "";
        form.reset();
      })
      .catch(err => {
        console.error(err);
        showMessage("Error updating car", "warning");
      });
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


