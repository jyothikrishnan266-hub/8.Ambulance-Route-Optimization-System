// ========================================
// DATA STORAGE
// ========================================

let ambulances =
    JSON.parse(localStorage.getItem("ambulances")) || [];

let hospitals =
    JSON.parse(localStorage.getItem("hospitals")) || [];

let requests =
    JSON.parse(localStorage.getItem("requests")) || [];

let routeHistory =
    JSON.parse(localStorage.getItem("routeHistory")) || [];


// ========================================
// SAVE DATA
// ========================================

function saveData() {

    localStorage.setItem(
        "ambulances",
        JSON.stringify(ambulances)
    );

    localStorage.setItem(
        "hospitals",
        JSON.stringify(hospitals)
    );

    localStorage.setItem(
        "requests",
        JSON.stringify(requests)
    );

    localStorage.setItem(
        "routeHistory",
        JSON.stringify(routeHistory)
    );
}


// ========================================
// NAVIGATION
// ========================================

function showSection(id) {

    document
        .querySelectorAll(".section")
        .forEach(section => {
            section.classList.remove("active");
        });

    document
        .getElementById(id)
        .classList.add("active");

    updateAll();
}


// ========================================
// AMBULANCE REGISTRATION
// ========================================

document
    .getElementById("ambulanceForm")
    .addEventListener("submit", function(e) {

        e.preventDefault();

        const ambulance = {

            id: Date.now(),

            number:
                document
                    .getElementById("ambulanceNumber")
                    .value
                    .trim(),

            driver:
                document
                    .getElementById("driverName")
                    .value
                    .trim(),

            phone:
                document
                    .getElementById("driverPhone")
                    .value
                    .trim(),

            type:
                document
                    .getElementById("ambulanceType")
                    .value,

            location:
                document
                    .getElementById("ambulanceLocation")
                    .value
                    .trim(),

            status: "available"
        };

        ambulances.push(ambulance);

        saveData();

        this.reset();

        updateAll();

        alert("Ambulance registered successfully.");
    });


// ========================================
// DISPLAY AMBULANCES
// ========================================

function renderAmbulances() {

    const table =
        document.getElementById("ambulanceTable");

    table.innerHTML = "";

    ambulances.forEach(ambulance => {

        table.innerHTML += `

            <tr>

                <td>${ambulance.number}</td>

                <td>${ambulance.driver}</td>

                <td>${ambulance.phone}</td>

                <td>${ambulance.type}</td>

                <td>${ambulance.location}</td>

                <td class="${ambulance.status}">
                    ${ambulance.status}
                </td>

                <td>

                    <button
                        onclick="toggleAmbulance(${ambulance.id})">

                        ${
                            ambulance.status === "available"
                            ? "Set Busy"
                            : "Set Available"
                        }

                    </button>

                </td>

            </tr>
        `;
    });
}


// ========================================
// AMBULANCE AVAILABILITY
// ========================================

function toggleAmbulance(id) {

    const ambulance =
        ambulances.find(a => a.id === id);

    if (!ambulance) return;

    ambulance.status =
        ambulance.status === "available"
        ? "busy"
        : "available";

    saveData();

    updateAll();
}


// ========================================
// HOSPITAL REGISTRATION
// ========================================

document
    .getElementById("hospitalForm")
    .addEventListener("submit", function(e) {

        e.preventDefault();

        const hospital = {

            id: Date.now(),

            name:
                document
                    .getElementById("hospitalName")
                    .value
                    .trim(),

            location:
                document
                    .getElementById("hospitalLocation")
                    .value
                    .trim(),

            beds:
                Number(
                    document
                        .getElementById("hospitalBeds")
                        .value
                ),

            emergency:
                document
                    .getElementById("emergencyFacility")
                    .value
        };

        hospitals.push(hospital);

        saveData();

        this.reset();

        updateAll();

        alert("Hospital registered successfully.");
    });


// ========================================
// DISPLAY HOSPITALS
// ========================================

function renderHospitals() {

    const table =
        document.getElementById("hospitalTable");

    table.innerHTML = "";

    hospitals.forEach(hospital => {

        table.innerHTML += `

            <tr>

                <td>${hospital.name}</td>

                <td>${hospital.location}</td>

                <td>${hospital.beds}</td>

                <td>${hospital.emergency}</td>

            </tr>
        `;
    });
}


// ========================================
// EMERGENCY REQUEST
// ========================================

document
    .getElementById("emergencyForm")
    .addEventListener("submit", function(e) {

        e.preventDefault();

        const request = {

            id: Date.now(),

            patient:
                document
                    .getElementById("patientName")
                    .value
                    .trim(),

            contact:
                document
                    .getElementById("patientContact")
                    .value
                    .trim(),

            location:
                document
                    .getElementById("emergencyLocation")
                    .value
                    .trim(),

            type:
                document
                    .getElementById("emergencyType")
                    .value,

            priority:
                Number(
                    document
                        .getElementById("emergencyPriority")
                        .value
                ),

            status: "pending",

            createdAt:
                new Date().toISOString()
        };

        requests.push(request);

        saveData();

        this.reset();

        updateAll();

        document.getElementById("requestResult")
            .innerHTML = `

                <div class="route-result">

                    <h3>🚨 Emergency Request Created</h3>

                    <p>
                        <strong>Patient:</strong>
                        ${request.patient}
                    </p>

                    <p>
                        <strong>Emergency:</strong>
                        ${request.type}
                    </p>

                    <p>
                        <strong>Priority:</strong>
                        ${priorityName(request.priority)}
                    </p>

                    <p>
                        Request ID:
                        ${request.id}
                    </p>

                </div>
            `;
    });


// ========================================
// PRIORITY QUEUE
// ========================================

function priorityName(priority) {

    if (priority === 1)
        return "Critical";

    if (priority === 2)
        return "High";

    return "Normal";
}


function priorityClass(priority) {

    if (priority === 1)
        return "critical";

    if (priority === 2)
        return "high";

    return "normal";
}


function getPriorityRequests() {

    return requests
        .filter(request =>
            request.status === "pending"
        )
        .sort(
            (a, b) =>
                a.priority - b.priority
        );
}


// ========================================
// ROUTE DROPDOWNS
// ========================================

function loadRouteDropdowns() {

    const requestSelect =
        document.getElementById("routeRequest");

    const ambulanceSelect =
        document.getElementById("routeAmbulance");

    requestSelect.innerHTML =
        `<option value="">
            Select Emergency Request
        </option>`;

    ambulanceSelect.innerHTML =
        `<option value="">
            Select Ambulance
        </option>`;

    getPriorityRequests()
        .forEach(request => {

            requestSelect.innerHTML += `

                <option value="${request.id}">

                    ${request.patient}
                    -
                    ${priorityName(request.priority)}

                </option>
            `;
        });

    ambulances
        .filter(a => a.status === "available")
        .forEach(ambulance => {

            ambulanceSelect.innerHTML += `

                <option value="${ambulance.id}">

                    ${ambulance.number}
                    -
                    ${ambulance.location}

                </option>
            `;
        });
}


// ========================================
// GRAPH FOR ROUTING
// ========================================

const roadGraph = {

    "Emergency": {
        "Hospital A": 8,
        "Hospital B": 12,
        "Hospital C": 18
    },

    "Hospital A": {
        "Hospital B": 5,
        "Hospital C": 10,
        "Emergency": 8
    },

    "Hospital B": {
        "Hospital A": 5,
        "Hospital C": 6,
        "Emergency": 12
    },

    "Hospital C": {
        "Hospital A": 10,
        "Hospital B": 6,
        "Emergency": 18
    }
};


// ========================================
// DIJKSTRA ALGORITHM
// ========================================

function dijkstra(graph, start, end, trafficFactor) {

    const distances = {};

    const previous = {};

    const unvisited = [];

    Object.keys(graph).forEach(node => {

        distances[node] = Infinity;

        previous[node] = null;

        unvisited.push(node);
    });

    distances[start] = 0;

    while (unvisited.length > 0) {

        unvisited.sort(
            (a, b) =>
                distances[a] -
                distances[b]
        );

        const current =
            unvisited.shift();

        if (current === end)
            break;

        Object.keys(graph[current] || {})
            .forEach(neighbor => {

                const distance =
                    graph[current][neighbor]
                    * trafficFactor;

                const newDistance =
                    distances[current] + distance;

                if (
                    newDistance <
                    distances[neighbor]
                ) {

                    distances[neighbor] =
                        newDistance;

                    previous[neighbor] =
                        current;
                }
            });
    }

    const path = [];

    let current = end;

    while (current !== null) {

        path.unshift(current);

        current =
            previous[current];
    }

    return {

        distance:
            distances[end],

        path: path
    };
}


// ========================================
// CALCULATE ROUTE
// ========================================

function calculateRoute() {

    const requestId =
        Number(
            document
                .getElementById("routeRequest")
                .value
        );

    const ambulanceId =
        Number(
            document
                .getElementById("routeAmbulance")
                .value
        );

    const trafficFactor =
        Number(
            document
                .getElementById("trafficLevel")
                .value
        );

    if (!requestId || !ambulanceId) {

        alert(
            "Select an emergency request and ambulance."
        );

        return;
    }

    if (hospitals.length === 0) {

        alert(
            "Please register hospitals first."
        );

        return;
    }

    const request =
        requests.find(
            r => r.id === requestId
        );

    const ambulance =
        ambulances.find(
            a => a.id === ambulanceId
        );

    // Find nearest hospital using distance
    let bestHospital = null;

    let bestRoute = null;

    hospitals.forEach(hospital => {

        const hospitalName =
            hospital.name;

        let route;

        if (
            roadGraph["Emergency"] &&
            roadGraph["Emergency"][hospitalName]
        ) {

            route =
                dijkstra(
                    roadGraph,
                    "Emergency",
                    hospitalName,
                    trafficFactor
                );

        } else {

            // Simulated distance when
            // hospital is not in graph
            const distance =
                5 + Math.random() * 20;

            route = {

                distance: distance *
                    trafficFactor,

                path: [
                    "Emergency",
                    hospitalName
                ]
            };
        }

        if (
            !bestRoute ||
            route.distance <
            bestRoute.distance
        ) {

            bestRoute = route;

            bestHospital = hospital;
        }
    });

    const speed = 40;

    const estimatedTime =
        Math.ceil(
            (bestRoute.distance / speed)
            * 60
        );

    ambulance.status = "busy";

    request.status = "assigned";

    request.assignedAmbulance =
        ambulance.id;

    request.assignedHospital =
        bestHospital.id;

    saveData();

    document
        .getElementById("routeResult")
        .innerHTML = `

            <h3>🚑 Optimized Route Found</h3>

            <div class="route-box">

                <div>
                    Hospital
                    <strong>
                        ${bestHospital.name}
                    </strong>
                </div>

                <div>
                    Distance
                    <strong>
                        ${bestRoute.distance.toFixed(1)} km
                    </strong>
                </div>

                <div>
                    Estimated Time
                    <strong>
                        ${estimatedTime} min
                    </strong>
                </div>

            </div>

            <br>

            <p>
                <strong>Patient:</strong>
                ${request.patient}
            </p>

            <p>
                <strong>Ambulance:</strong>
                ${ambulance.number}
            </p>

            <p>
                <strong>Traffic Factor:</strong>
                ${trafficFactor}x
            </p>

            <p>
                <strong>Route:</strong>
                ${bestRoute.path.join(" → ")}
            </p>

            <button
                onclick="completeTrip(
                    ${request.id},
                    ${ambulance.id},
                    ${bestHospital.id},
                    ${bestRoute.distance},
                    ${estimatedTime},
                    ${trafficFactor}
                )">

                Complete Trip

            </button>
        `;

    updateAll();
}


// ========================================
// COMPLETE TRIP
// ========================================

function completeTrip(
    requestId,
    ambulanceId,
    hospitalId,
    distance,
    time,
    traffic
) {

    const request =
        requests.find(
            r => r.id === requestId
        );

    const ambulance =
        ambulances.find(
            a => a.id === ambulanceId
        );

    const hospital =
        hospitals.find(
            h => h.id === hospitalId
        );

    if (!request ||
        !ambulance ||
        !hospital)
        return;

    request.status = "completed";

    ambulance.status = "available";

    if (hospital.beds > 0) {
        hospital.beds--;
    }

    routeHistory.push({

        id: Date.now(),

        patient:
            request.patient,

        ambulance:
            ambulance.number,

        hospital:
            hospital.name,

        distance:
            Number(distance.toFixed(1)),

        traffic:
            traffic,

        time:
            time,

        priority:
            request.priority,

        date:
            new Date().toLocaleString()
    });

    saveData();

    updateAll();

    document.getElementById("routeResult")
        .innerHTML = `

            <div class="route-result">

                <h3>✅ Trip Completed</h3>

                <p>
                    Patient:
                    <strong>${request.patient}</strong>
                </p>

                <p>
                    Hospital:
                    <strong>${hospital.name}</strong>
                </p>

                <p>
                    Ambulance:
                    <strong>${ambulance.number}</strong>
                </p>

            </div>
        `;
}


// ========================================
// ROUTE HISTORY
// ========================================

function renderHistory() {

    const table =
        document.getElementById("historyTable");

    table.innerHTML = "";

    routeHistory
        .slice()
        .reverse()
        .forEach(trip => {

            table.innerHTML += `

                <tr>

                    <td>${trip.patient}</td>

                    <td>${trip.ambulance}</td>

                    <td>${trip.hospital}</td>

                    <td>${trip.distance} km</td>

                    <td>${trip.traffic}x</td>

                    <td>${trip.time} min</td>

                    <td>${trip.date}</td>

                </tr>
            `;
        });
}


// ========================================
// REPORTS
// ========================================

function updateReports() {

    const total =
        routeHistory.length;

    document.getElementById("totalTrips")
        .textContent = total;

    if (total === 0) {

        document.getElementById("averageDistance")
            .textContent = "0 km";

        document.getElementById("averageTime")
            .textContent = "0 min";

    } else {

        const distance =
            routeHistory.reduce(
                (sum, trip) =>
                    sum + trip.distance,
                0
            );

        const time =
            routeHistory.reduce(
                (sum, trip) =>
                    sum + trip.time,
                0
            );

        document.getElementById("averageDistance")
            .textContent =
            (distance / total).toFixed(1)
            + " km";

        document.getElementById("averageTime")
            .textContent =
            Math.round(time / total)
            + " min";
    }

    const critical =
        routeHistory.filter(
            trip => trip.priority === 1
        ).length;

    document.getElementById("criticalTrips")
        .textContent = critical;
}


// ========================================
// DASHBOARD
// ========================================

function updateDashboard() {

    document.getElementById("totalAmbulances")
        .textContent =
        ambulances.length;

    document.getElementById("availableAmbulances")
        .textContent =
        ambulances.filter(
            a => a.status === "available"
        ).length;

    document.getElementById("totalHospitals")
        .textContent =
        hospitals.length;

    document.getElementById("totalRequests")
        .textContent =
        requests.length;

    const active =
        requests
            .filter(
                r =>
                    r.status === "pending" ||
                    r.status === "assigned"
            )
            .sort(
                (a, b) =>
                    a.priority - b.priority
            )[0];

    if (active) {

        document.getElementById("emergencyStatus")
            .innerHTML = `

                🚨 Active Emergency

                <br><br>

                Patient:
                <strong>
                    ${active.patient}
                </strong>

                <br>

                Type:
                ${active.type}

                <br>

                Priority:
                <span class="${priorityClass(active.priority)}">
                    ${priorityName(active.priority)}
                </span>

            `;

    } else {

        document.getElementById("emergencyStatus")
            .textContent =
            "No active emergency request";
    }
}


// ========================================
// PRINT REPORT
// ========================================

function printReport() {

    window.print();
}


// ========================================
// CLEAR DATA
// ========================================

function clearData() {

    if (
        !confirm(
            "Delete all ambulance, hospital, emergency and route data?"
        )
    ) {
        return;
    }

    ambulances = [];

    hospitals = [];

    requests = [];

    routeHistory = [];

    saveData();

    updateAll();
}


// ========================================
// UPDATE EVERYTHING
// ========================================

function updateAll() {

    renderAmbulances();

    renderHospitals();

    loadRouteDropdowns();

    renderHistory();

    updateReports();

    updateDashboard();
}


// ========================================
// INITIALIZE
// ========================================

updateAll();