//hämtar element
const form = document.getElementById("itemForm");
const messageDiv = document.getElementById("msg");
const brandInput = document.getElementById("brand");
const colorInput = document.getElementById("color");
const idInput = document.getElementById("carId");

// Skapar en ul för att senare lägga till bilar i och lägger till den i body
const list = document.createElement("ul");
document.body.appendChild(list);
// Fixar stil på listan
list.className = "list-unstyled ms-5 container d-flex flex-column";
list.style.marginInline = "600px";

// Funktion för att lägga till en bil i och skriva ut som en lista
function addCarToList(car) {
  // Skapar li och card div
  const li = document.createElement("li");
  const card = document.createElement("div");

  card.className = "card card-body w-100 ml-3 mb-3 bg-light shadow-lg";
  li.dataset.id = car.ID;

  // Fyller och designar kortet med bilens info, lägger till edit- och delete-knappar
  card.innerHTML = `<div class="card-body">
    <ul class="list-group">
    <li class = "list-group-item" style="background-color: ${car.Color.toLowerCase()};" > 
        <strong>Brand:</strong> <span class="brand">${car.Brand}</span><br>
        <strong>Color:</strong> <span class="color">${car.Color}</span></li>
    </ul>
      <button class="btn btn-outline-success mt-3 mb-3 shadow-lg mt-2">Edit</button>
      <button class="btn btn-outline-danger mt-3 mb-3 shadow-lg mt-2">Delete</button>
    </div>`;

  // Hämtar knapparna och lägger till event listeners
  const [edtbtn, btn] = card.querySelectorAll("button");

  // Eventlyssnare för edit-knappen där inputfälten fylls med bilens data
  edtbtn.addEventListener("click", () => {
    brandInput.value = car.Brand;
    colorInput.value = car.Color;
    idInput.value = car.ID;
  });

  // Eventlyssnare för delete-knappen där bilen tas bort
  btn.addEventListener("click", () => {
    fetch(`http://localhost:3000/cars/${car.ID}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        li.remove();
        showMessage("Car deleted", "danger");
      })
      .catch((err) => {
        console.error(err);
        showMessage("Error deleting car", "warning");
      });
  });
  li.appendChild(card);
  list.appendChild(li);
}
// Hämtar och visar alla bilar vid sidladdning
fetch("http://localhost:3000/cars")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((car) => addCarToList(car));
  });

// Funktion för att visa meddelanden beroende på typ och text
function showMessage(text, type) {
  messageDiv.textContent = text;
  messageDiv.className = `alert alert-${type}`;
  messageDiv.classList.remove("d-none");
}

// Eventlyssnare för formulärets submit-händelse
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  // Hämtar värden från inputfälten
  const brand = brandInput.value.trim();
  const color = colorInput.value.trim();
  const id = idInput.value;

  // Validerar att båda fälten är ifyllda
  if (!brand || !color) {
    showMessage("Both fields are required", "danger");
    return;
  }

  // Försöker antingen uppdatera en befintlig bil eller skapa en ny beroende på om ett ID finns
  try {
    if (id) {
      fetch(`http://localhost:3000/cars/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: brand,
          color: color,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);

          // Uppdaterar bilens info i listan utan att ladda om sidan
          const li = list.querySelector(`li[data-id='${id}']`);
          if (!li) return;

          // Uppdaterar textinnehållet och bakgrundsfärgen
          const brandSpan = li.querySelector(".brand");
          const colorSpan = li.querySelector(".color");
          const item = li.querySelector(".list-group-item");

          // Uppdaterar innehållet i span-elementen
          if (brandSpan) brandSpan.textContent = brand;
          if (colorSpan) colorSpan.textContent = color;

          if (item) item.style.backgroundColor = color.toLowerCase();
        })
        .catch((err) => {
          console.error(err);
          showMessage("Error updating car", "warning");
        });

      // Rensar inputfälten efter uppdatering
      idInput.value = "";
      showMessage("Car updated", "success");
      form.reset();
    } else {
      const res = await fetch("http://localhost:3000/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, color }),
      });

      // Kollar om svaret är okej
      if (!res.ok) {
        showMessage("Error creating car", "warning");
      }
      // Hämtar den skapade bilens data från svaret
      const data = await res.json();
      console.log("Created:", data);

      // Lägger till den nya bilen i listan
      addCarToList(data);

      form.reset();
      showMessage("Car created", "success");
    }
  } catch (err) {
    console.error(err);
    showMessage("Error adding car", "danger");
  }
});
