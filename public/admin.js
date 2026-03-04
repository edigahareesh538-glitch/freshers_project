// Base URL for the API - Ensure it starts with https://
const API_URL = "https://freshers-project.onrender.com";

// Function to print/download the table
function downloadbtn() {
    window.print();
}

// Function to fetch all participants and display in the table
async function fetchParticipants() {
    try {
        const response = await fetch(`${API_URL}/participants`);
        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.json();
        const tableBody = document.getElementById("tableBody");
        tableBody.innerHTML = ""; // Clear old data

        data.forEach(participant => {
            const row = `
            <tr>
                <td>${participant.name}</td>
                <td>${participant.roll}</td>
                <td>${participant.branch}</td>
                <td>${participant.phone}</td>
                <td>${participant.type}</td>
            </tr>`;
            tableBody.innerHTML += row;
        });
        
        fetchTotalCount(); // Automatically update the count whenever table refreshes
    } catch (error) {
        console.error("Error fetching participants:", error);
    }
}

// Search student details by Roll Number
async function searchByRoll() {
    const roll = document.getElementById("rollInput").value.trim().toUpperCase();
    const resultDiv = document.getElementById("removing_num");

    if (!roll) {
        alert("Please enter a roll number");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/participants/roll/${roll}`);
        
        if (!res.ok) {
            resultDiv.innerText = "Student not found";
            return;
        }

        const data = await res.json();

        // Display user details with Delete and Update buttons
        resultDiv.innerHTML = `
        <div style="background:#f4f4f4; padding:10px; border-radius:5px; margin-top:10px;">
            <p><b>Name:</b> ${data.name}</p>
            <p><b>Branch:</b> ${data.branch}</p>
            <p><b>Phone:</b> ${data.phone}</p>
            <p><b>Type:</b> ${data.type}</p>
            <button onclick="deleteUser('${data._id}')">Delete</button>
            <button onclick="showUpdateForm('${data._id}', '${data.name}', '${data.branch}', '${data.phone}', '${data.type}')">Update</button>
        </div>`;
    } catch (error) {
        console.error("Error searching user:", error);
        resultDiv.innerText = "Error connecting to server";
    }
}

// Delete a specific user by ID
async function deleteUser(id) {
    const confirmDelete = confirm("Are you sure you want to delete this student?");
    if (!confirmDelete) return;

    try {
        const res = await fetch(`${API_URL}/participants/${id}`, {
            method: "DELETE"
        });
        const data = await res.json();
        
        alert(data.message); // Show message from server
        fetchParticipants(); // Refresh main table
        document.getElementById("removing_num").innerHTML = ""; // Clear search result
    } catch (error) {
        alert("Delete failed. Try again.");
    }
}

// Logic for Updating user details
let currentUpdateId = null;

function showUpdateForm(id, name, branch, phone, type) {
    currentUpdateId = id;

    document.getElementById("updateName").value = name;
    document.getElementById("updateBranch").value = branch;
    document.getElementById("updatePhone").value = phone;
    document.getElementById("updateType").value = type;
    
    document.getElementById("updateForm").style.display = "block";
}

async function saveUpdate() {
    const updatedData = {
        name: document.getElementById("updateName").value,
        branch: document.getElementById("updateBranch").value,
        phone: document.getElementById("updatePhone").value,
        type: document.getElementById("updateType").value
    };

    try {
        const res = await fetch(`${API_URL}/participants/${currentUpdateId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        });

        const data = await res.json();
        alert(data.message);

        document.getElementById("updateForm").style.display = "none";
        fetchParticipants(); // Refresh table after update
    } catch (error) {
        alert("Update failed!");
    }
}

// Fetch the total count of participants
async function fetchTotalCount() {
    try {
        const res = await fetch(`${API_URL}/participants/count`);
        const data = await res.json();
        document.getElementById("totalCount").innerText = data.total || 0;
    } catch (error) {
        console.error("Count fetch failed:", error);
    }
}

// Initial calls to load data when page opens
fetchParticipants();
fetchTotalCount();

// Delete ALL data from the database
document.getElementById("del_all_data").addEventListener("click", async () => {
    const confirmDelete = confirm("Are you sure you want to delete ALL data? This cannot be undone.");
    if (!confirmDelete) return;

    try {
        const res = await fetch(`${API_URL}/participants`, {
            method: "DELETE"
        });

        const data = await res.json();
        alert(data.message);

        fetchParticipants();      // Refresh table
        fetchTotalCount();        // Update count
    } catch (error) {
        alert("Action failed!");
    }
});




