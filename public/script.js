fetch('http://localhost:3000/cars')
    .then(response => response.json())
    .then(data => {
        const list = document.createElement('ul');

        data.forEach(car => {
            const li = document.createElement('li');
            li.textContent = `${car.Color}- ${car.Brand}`;
        

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
            });
        });

        li.appendChild(btn);
        list.appendChild(li);

        });
       
        document.body.appendChild(list);
    });
    
//hämta element
const form = document.getElementById("itemForm");
const textfields = document.querySelectorAll(".textfield");
const checkbox = document.querySelector(".checkbox");
const resultDiv = document.querySelector(".Result");
const messageDiv = document.querySelector(".message");
const idInput = document.getElementById("carid");
const brandInput = document.getElementById("brand");
const colorInput = document.getElementById("color");

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
async function createItem(data) {
  const response = await fetch("http://localhost:3000/cars", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Kunde inte skapa objekt");
  }
}
async function updateItem(ID, data) {
  const response = await fetch(`http://localhost:3000/cars/${ID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Kunde inte uppdatera objekt");
  }
}
form.addEventListener("submit", async (event) => {
  event.preventDefault();
    const brand = brandInput.value.trim();
    const color = colorInput.value.trim();
    let res;


    if (ID) {

    res = await fetch(`http://localhost:3000/cars/${ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json",},
        body: JSON.stringify({id: Number(ID), brand, color}),
      });
    } else {
    res = await fetch("http://localhost:3000/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json",},
        body: JSON.stringify({brand, color}),
      });
    }
  if (!response.ok) {
    throw new Error("Kunde inte skapa objekt");
  }
  const data = await res.json();

  try {
    if (editId) {
      await updateItem(editId, data);
      showMessage("Objektet uppdaterades!");
    } else {
      await createItem(data);
      showMessage("Objektet skapades!");
    }
    form.reset();
    resultDiv.textContent = "";
    resultDiv.style.backgroundColor = "";
    editId = null;
  } catch (error) {
    showMessage(error.message, "error");
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
