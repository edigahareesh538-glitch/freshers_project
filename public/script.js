const form = document.getElementById("register_form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button');
    submitBtn.disabled = true;
    submitBtn.innerText = "Processing...";

    const name = document.getElementById("name").value;
    const roll = document.getElementById("roll").value;
    const branch = document.getElementById("branch").value;
    const phone = document.getElementById("phone").value;
    const type = document.getElementById("type").value;

    try {
        const response = await fetch("https://freshers-project.onrender.com/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, roll, branch, phone, type })
        });

        if (response.ok) {
            const data = await response.json();
            alert("Registration Successful!");
            form.reset(); 
        } else {
            alert("Server Error: Registration Failed.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Network issue or Server is down. Please try again later.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Register";
    }
});

