const form = document.getElementById("register_form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const roll = document.getElementById("roll").value;
    const branch = document.getElementById("branch").value;
    const phone = document.getElementById("phone").value;
    const type = document.getElementById("type").value;

    const response = await fetch("http://freshers-project.onrender.com:5000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name,roll,branch, phone ,type})
    });

    const data = await response.json();
    alert("Registration Successfully")
});