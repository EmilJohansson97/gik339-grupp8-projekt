//hämta element
const form = document.getElementById("itemForm");
const textfields = document.querySelectorAll(".textield");
const checkbox = document.querySelector(".checkbox");
const resultDiv = document.querySelector(".Result");
const messageDiv = document.querySelector(".message");

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
  const response = await fetch("http://localhost:3000/items", {
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
async function updateItem(id, data) {
  const response = await fetch(`http://localhost:3000/items/${id}`, {
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

  const data = getFormData();

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
