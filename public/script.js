//hämta element
const form = document.getElementById("itemForm");
const textfields = document.querySelectorAll(".textfield");
const checkbox = document.querySelector(".checkbox");
const resultDiv = document.querySelector(".Result");
const messageDiv = document.querySelector(".message");
const brandInput = document.getElementById('brand');
const colorInput = document.getElementById('color');
const idInput = document.getElementById('id');

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
    const brand = brandInput.value.trim();
    const color = colorInput.value.trim();

    if (!brand || !color) {
      alert("Fyll i både brand och color i input-fälten först.");
      return;
    }

    fetch('http://localhost:3000/cars', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: car.ID,
        brand: brand,
        color: color
      })
    })
      .then(res => res.json())
      .then(result => {
        console.log(result);
        li.firstChild.textContent = `${brand} - ${color} `;
      })
      .catch(err => {
        console.error(err);
        alert("Error updating car");
      });
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
      })
      .catch(err => {
        console.error(err);
        alert("Error deleting car");
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

let editId = null;

function handleInput(event) {
  if (event.target.name === "content") {
    resultDiv.textContent = event.target.value;
  }
}
textfields.forEach((field) => {
  field.addEventListener("input", handleInput);
});

function getFormData() {
  const data = {};
  textfields.forEach((field) => {
    data[field.name] = field.value;
  });
  data.published = checkbox.checked;
  return data;
}

function showMessage(text, type = "success") {
  messageDiv.textContent = text;
  messageDiv.className = type;
}

console.log("form:", form);
form?.addEventListener("submit", () => console.log("SUBMIT TRIGGERED"));

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const brand = brandInput.value.trim();
  const color = colorInput.value.trim();

  if (!brand || !color) {
    showMessage("Both fields are required", "danger");
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/cars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand, color })
    });

    if (!res.ok) {
      throw new Error("Kunde inte skapa objekt");
    }

    const data = await res.json();
    console.log("Created:", data);

    // ✅ Lägg till nya bilen direkt i listan
    addCarToList(data);

    form.reset();
    showMessage("Car created", "success");

  } catch (err) {
    console.error(err);
    showMessage("Error adding car");
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
