//hämta element
const form = document.getElementById("itemForm");
const textfields = document.querySelectorAll(".textfield");
const checkbox = document.querySelector(".checkbox");
const resultDiv = document.querySelector(".Result");
const messageDiv = document.getElementById('msg');
const brandInput = document.getElementById('brand');
const colorInput = document.getElementById('color');
const idInput = document.getElementById('carId');

let editId = null;
// ✅ Global lista (bara en)
const list = document.createElement('ul');
document.body.appendChild(list);

// ✅ Lägg till en bil i listan (återanvänds av GET + POST)
function addCarToList(car) {
  const li = document.createElement('li');
  li.textContent = `${car.Brand} - ${car.Color} `;

  // Edit-knapp
  const edtbtn = document.createElement('button');
  edtbtn.textContent = "Edit";

  edtbtn.addEventListener('click', () => {

    brandInput.value = car.Brand;
    colorInput.value = car.Color;

  
  });
    // let brand = brandInput.value.trim();
    // let color = colorInput.value.trim();

    // if(!color) {
    //   color = car.Color;
    // }

    // if(!brand) {
    //   brand = car.Brand;
    // }

    // fetch('http://localhost:3000/cars', {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     id: car.ID,
    //     brand: brand,
    //     color: color
    //   })
    // })
    //   .then(res => res.json())
    //   .then(result => {
    //     console.log(result);
    //     li.firstChild.textContent = `${brand} - ${color} `;
    //     car.Brand = brand;
    //     car.Color = color;
    //     showMessage("Car updated", "success");
    //   })
    //   .catch(err => {
    //     console.error(err);
    //     showMessage("Error updating car", "warning");
    //   });
    //   form.reset();
  

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
    fetch('http://localhost:3000/cars', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: Number(id), 
        brand: brand,
        color: color
      })
    })
      .then(res => res.json())
      .then(result => {
        console.log(result);
        li.firstChild.textContent = `${brand} - ${color} `;
        car.Brand = brand;
        car.Color = color;
        showMessage("Car updated", "success");
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

function fillForm(item) {
  textfields.forEach((field) => {
    field.value = item[field.name] || "";
  });
  checkbox.checked = item.published;
  resultDiv.textContent = item.content;
  resultDiv.computedStyleMap.backgroundColor = item.color;

  editId = item.id;
}
