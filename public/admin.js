//the button which acts to download the all data in table
function downloadbtn(){
            window.print();
        }


async function fetchParticipants() {
    const response =await fetch("http://freshers-project.onrender.com/participants");
    const data=await response.json();
    const tableBody=document.getElementById("tableBody");
    tableBody.innerHTML="";
    data.forEach(participant => {
        const row=
        `<tr>
            <td>${participant.name}</td>
            <td>${participant.roll}</td>
            <td>${participant.branch}</td>
            <td>${participant.phone}</td>
            <td>${participant.type}</td>
        </tr>`;
        tableBody.innerHTML+=row;
        
    });
    
}
fetchParticipants();
setInterval(fetchParticipants,3000);



//student details checking search bar logic
async function searchByRoll() {
    const roll = document.getElementById("rollInput").value.trim().toUpperCase();
        if(!roll){
            alert("Please enter a roll number");
            return;
        }
    try{
        const res = await fetch(`http://freshers-project.onrender.com/participants/roll/${roll}`);
        const resultDiv=document.getElementById("removing_num");
        if (!res.ok) {
            resultDiv.innerText = "Student not found";
            return;
        }

        const data = await res.json();
        //here to display the removing user details are shown

        document.getElementById("removing_num").innerHTML = `
        <div style="background:#f4f4f4; padding:10px; border-radius:5px;margin-top:10px;">
            <p><b>Name:</b> ${data.name}</p>
            <p><b>Branch:</b> ${data.branch}</p>
            <p><b>Phone:</b> ${data.phone}</p>
            <p><b>Type:</b> ${data.type}</p>
            <button onclick="deleteUser('${data._id}')">Delete</button>
            <button onclick="showUpdateForm('${data._id}', '${data.name}', '${data.branch}', '${data.phone}', '${data.type}')">Update</button>
        `;
    }catch(error){
        console.error("Error:",error);
        resultDiv.innerText ="error connecting to server";
    }
}
//here the function used for delete the user in table
async function deleteUser(id) {
    const confirmDelete = confirm("Are you sure?");

    if (!confirmDelete) return;

    const res= await fetch(`http://freshers-project.onrender.com/participants/${id}`, {
        method: "DELETE"
    });
    const data=await res.json();
    alert(data.message);

    alert("Deleted successfully");
    fetchParticipants(); // refresh main table
    document.getElementById("removing_num").innerHTML = "";
}

//update user details
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

    const res = await fetch(`freshers-project.onrender.com/participants/${currentUpdateId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
    });

    const data = await res.json();
    alert(data.message);

    document.getElementById("updateForm").style.display = "none";
    fetchParticipants();
}

//this function is used for count of participators
async function fetchTotalCount() {
    const res = await fetch("freshers-project.onrender.com/participants/count");
    const data = await res.json();
    document.getElementById("totalCount").innerText = data.total;
}
fetchParticipants();
fetchTotalCount()
document.getElementById("del_all_data").addEventListener("click", async () => {

    const confirmDelete = confirm("Are you sure you want to delete ALL data?");
    if (!confirmDelete) return;

    const res = await fetch("freshers-project.onrender.com/participants", {
        method: "DELETE"
    });

    const data = await res.json();
    alert(data.message);

    fetchParticipants();      // refresh table
    fetchTotalCount();        // update count
});




