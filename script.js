let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

// Admin password
let adminPassword = "1234";

// HashMap
let complaintMap = new Map();


// Student Page
function showStudent() {
    document.getElementById("student").style.display = "block";
    document.getElementById("admin").style.display = "none";
}


// Admin Page
function showAdmin() {

    let password = prompt("Enter Admin Password:");

    if (password != adminPassword) {
        alert("Wrong Password!");
        return;
    }

    document.getElementById("student").style.display = "none";
    document.getElementById("admin").style.display = "block";

    displayComplaints();
}


// Submit Complaint
function submitComplaint() {

    let name = document.getElementById("name").value;
    let category = document.getElementById("category").value;
    let text = document.getElementById("complaint").value;
    let priority = document.getElementById("priority").value;

    if (name == "" || text == "") {
        alert("Please fill all fields");
        return;
    }

    let complaint = {
        id: Date.now(),
        name: name,
        category: category,
        text: text,
        priority: Number(priority),
        status: "Pending"
    };

    complaints.push(complaint);

    // Add to HashMap
    complaintMap.set(complaint.id, complaint);

    localStorage.setItem("complaints", JSON.stringify(complaints));

    document.getElementById("message").innerText =
        "Complaint submitted successfully!";

    document.getElementById("name").value = "";
    document.getElementById("complaint").value = "";
}


// Priority Queue
function priorityQueue(data) {

    return data.sort(function(a, b) {
        return b.priority - a.priority;
    });

}


// Display Complaints
function displayComplaints() {

    let list = document.getElementById("complaintList");

    list.innerHTML = "";

    let sortedComplaints = priorityQueue([...complaints]);

    if (sortedComplaints.length == 0) {
        list.innerHTML = "<p>No complaints available.</p>";
        return;
    }

    sortedComplaints.forEach(function(c) {

        let priorityName;

        if (c.priority == 3)
            priorityName = "High";
        else if (c.priority == 2)
            priorityName = "Medium";
        else
            priorityName = "Low";

        let greenLight = "";

        if (c.status == "Resolved") {
            greenLight = "<span class='green-light'></span>";
        }

        list.innerHTML += `
            <div class="complaint">

                ${greenLight}

                <h3>Complaint ID: ${c.id}</h3>

                <p><b>Student:</b> ${c.name}</p>

                <p><b>Category:</b> ${c.category}</p>

                <p><b>Complaint:</b> ${c.text}</p>

                <p><b>Priority:</b> ${priorityName}</p>

                <p><b>Status:</b> ${c.status}</p>

                <button onclick="resolveComplaint(${c.id})">
                    Mark Resolved
                </button>

                <button onclick="deleteComplaint(${c.id})">
                    Delete
                </button>

            </div>
        `;
    });
}


// Resolve Complaint
function resolveComplaint(id) {

    // Get complaint from HashMap
    let complaint = complaintMap.get(id);

    if (complaint) {
        complaint.status = "Resolved";
    }

    localStorage.setItem("complaints", JSON.stringify(complaints));

    displayComplaints();
}


// Delete Complaint
function deleteComplaint(id) {

    complaints = complaints.filter(function(c) {
        return c.id != id;
    });

    // Remove from HashMap
    complaintMap.delete(id);

    localStorage.setItem("complaints", JSON.stringify(complaints));

    displayComplaints();
}