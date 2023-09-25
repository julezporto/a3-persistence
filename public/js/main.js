// FRONT-END (CLIENT) JAVASCRIPT HERE

// populate plant table
function populatePlantTable(plantData) {
  const tableBody = document.querySelector("#plantTableBody");
  //tableBody.innerHTML = "";

  plantData.forEach((plant) => {
    const row = document.createElement("tr");

    const indexCell = document.createElement("td");
    indexCell.innerText = plant._id;

    const nameCell = document.createElement("td");
    nameCell.innerText = plant.plantName;

    const typeCell = document.createElement("td");
    typeCell.innerText = plant.plantType;

    const lastWateredCell = document.createElement("td");
    lastWateredCell.innerText = plant.lastWatered;

    const nextWaterCell = document.createElement("td");
    nextWaterCell.innerText = plant.nextWater;

    const editCell = document.createElement("td");
    editCell.innerHTML = '<button class="edit-button">Edit</button>';

    const deleteCell = document.createElement("td");
    deleteCell.innerHTML = '<button class="delete-button">Delete</button>';

    row.appendChild(indexCell);
    row.appendChild(nameCell);
    row.appendChild(typeCell);
    row.appendChild(lastWateredCell);
    row.appendChild(nextWaterCell);
    row.appendChild(editCell);
    row.appendChild(deleteCell);

    tableBody.appendChild(row);

    editCell.querySelector(".edit-button").addEventListener("click", () => {
      editPlant(editCell.querySelector(".edit-button"));
    });

    deleteCell.querySelector(".delete-button").addEventListener("click", () => {
      deletePlant(deleteCell.querySelector(".delete-button"));
    });
  });
}

/*
// initially load plants
const loadPlants = async function () {
  try {
    const response = await fetch("/getPlantData", {
      method: "GET",
    });

    if (!response.ok) {
      console.error("Failed to load plant data.");
      return;
    }

    const plantData = await response.json();

    populatePlantTable(plantData);
  } catch (error) {
    console.error("Error:", error);
  }
}; */

// add new plant
const submit = async (event) => {
  event.preventDefault();

  const inputNum = document.querySelector("#plantNum");
  const inputName = document.querySelector("#plantName");
  const inputType = document.querySelector("#plantType");
  const inputDate = document.querySelector("#lastWatered");

  const json = {
    plantNum: "",
    plantName: inputName.value,
    plantType: inputType.value,
    lastWatered: inputDate.value,
    nextWater: "",
  };

  const body = JSON.stringify(json);

  try {
    const response = await fetch("/addPlant", {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Failed to submit plant data.");
      return;
    }

    const form = document.querySelector("#newPlantForm");
    form.reset();

    // Parse the response
    const result = await response.json();
    console.log("Response from server:", result);

    const tableBody = document.querySelector("#plantTableBody");
    tableBody.innerHTML = "";

    // Check if the response contains an insertedId
    if (Array.isArray(result) && result.length > 0) {
      // Populate the plant table with the retrieved data
      populatePlantTable(result);
    } else {
      console.error("Invalid response from the server.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

// delete a plant row
const deletePlant = async (button) => {
  const row = button.closest("tr");
  //console.log("ROW",row)
  const cell = row.getElementsByTagName("td")[0];
  //console.log(cell.textContent)
  if (row) {
    const plantId = cell.textContent;
    //console.log("FULL ASK", cell.textContent);
    //console.log("ID", plantId);

    const response = await fetch("/deletePlant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plantId }),
    });

    if (response.ok) {
      const tableBody = document.querySelector("#plantTableBody");
      tableBody.removeChild(row);
    } else {
      console.error("Plant data delete failed.");
    }
  }
};

// edit a plant row
const editPlant = async (button) => {
  const row = button.closest("tr");
  if (row) {
    const editForm = document.querySelector("#editPlantForm");
    const editName = editForm.querySelector("#editPlantName");
    const editType = editForm.querySelector("#editPlantType");
    const editDate = editForm.querySelector("#editLastWatered");

    // grab original values
    const originalData = {
      plantId: row.cells[0].textContent,
      plantName: row.cells[1].textContent,
      plantType: row.cells[2].textContent,
      lastWatered: row.cells[3].textContent,
    };

    // fill edit form with original values
    editName.value = originalData.plantName;
    editType.value = originalData.plantType;
    editDate.value = originalData.lastWatered;

    // display edit form
    editForm.style.display = "block";

    const updateButton = editForm.querySelector("#updateButton");
    updateButton.addEventListener("click", (event) => {
      update(event, originalData);
    });
  }
};

// update plant row edit
const update = async (event, originalData) => {
  event.preventDefault();

  const editForm = document.querySelector("#editPlantForm");

  const inputName = document.querySelector("#editPlantName");
  const inputType = document.querySelector("#editPlantType");
  const inputDate = document.querySelector("#editLastWatered");

  const json = {
    _id: originalData.plantId,
    plantName: inputName.value,
    plantType: inputType.value,
    lastWatered: inputDate.value,
  };

  const body = JSON.stringify(json);

  try {
    const response = await fetch(`/editPlant`, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.error("Plant data update failed.");
      return;
    }

    const form = document.querySelector("#editPlantForm");
    form.reset();

    
    
    
    
    
    // need to display all plants
    // Parse the response
    const tableBody = document.querySelector("#plantTableBody");
    tableBody.innerHTML = "";

    const result = await fetch("/getPlants");
    
    const data = await result.json();
    
    console.log("Response from server:", data);

    // Check if the response contains an insertedId
    if (Array.isArray(data) && data.length > 0) {
      // Populate the plant table with the retrieved data
      populatePlantTable(data);
    } else {
      console.error("Invalid response from the server.");
    }
    
    
        

    // hide edit form once done
    form.style.display = "none";

    // edit button listener
    const editButtons = document.querySelectorAll(".edit-button");
    editButtons.forEach((button) => {
      button.addEventListener("click", () => {
        editPlant(button);
      });
    });

    // delete button listener
    const deleteButtons = document.querySelectorAll(".delete-button");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", () => {
        deletePlant(button);
      });
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

// initialize the page
window.onload = function () {
  const submitButton = document.getElementById("submitButton");
  submitButton.onclick = submit;

};
