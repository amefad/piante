const backendUrl = '../backend/';

// Sends form data as JSON to PHP file with fetch() method
function sendForm(formId, phpFile, resultId, callback) {
    document.getElementById(formId).addEventListener('submit', function (event) {
        event.preventDefault();
        var formData = new FormData(this);
        var jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });
        const token = localStorage.getItem('token');
        if (token) {
            jsonData['token'] = token;
        }
        console.log(jsonData);
        fetch(backendUrl + phpFile, {
            method: 'POST',
            body: JSON.stringify(jsonData),
            headers: { 'Content-Type': 'application/json'}
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                document.getElementById(resultId).innerHTML = JSON.stringify(data, null, 3);
                if (callback) {
                    callback(data);
                }
            });
    });
}

// Register
sendForm('register', 'register.php', 'register-result');

// Login
sendForm('login', 'login.php', 'login-result', (data) => {
    if (data.status == "success") {
        localStorage.setItem('token', data.token);
    }
});

// Logout
sendForm('logout', 'logout.php', 'logout-result', () => {
    localStorage.removeItem('token');
});

// Loads plants
document.getElementById('load-plants').addEventListener('click', function () {
    fetch(backendUrl + 'load_plants.php')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.getElementById('plants-result').innerText = JSON.stringify(data, null, 3);
        });
});

// Loads one plant
sendForm('load-plant', 'load_plant.php', 'plant-result');

// Sends one plant to database
document.getElementById('send-plant').addEventListener('submit', function (event) {
    event.preventDefault();
    var jsonData = JSON.parse(document.getElementById('plant-json').value);
    jsonData['token'] = localStorage.getItem('token');
    console.log(jsonData);
    fetch(backendUrl + 'send_plant.php', {
        method: 'POST',
        body: JSON.stringify(jsonData),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.getElementById('send-result').innerText = JSON.stringify(data, null, 3);
        });
});

// Upload image
// TODO: da upload_image.php non riceve un JSON, ma un testo
document.getElementById('upload-image').addEventListener('submit', function (event) {
    event.preventDefault();
    var formData = new FormData();
    var fileInput = document.getElementById('image-file');
    formData.append('image', fileInput.files[0]);
    formData.append('plant-id', document.getElementById('plant-id').value);
    const token = localStorage.getItem('token');
    if (token) {
        formData.append('token', token);
    }
    console.log(formData);
    fetch(backendUrl + 'upload_image.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            document.getElementById('upload-result').innerText = data;
        });
});

// Loads one plant to edit
sendForm('edit-plant', 'load_plant.php', 'update-plant-json', (data) => {
    if (data.status == 'success') {
        delete data.plant.date;
        delete data.plant.user;
        delete data.plant.images;
        document.getElementById('update-plant-json').innerHTML = JSON.stringify(data.plant, null, 2);
    }
});

// Sends updated plant to database
document.getElementById('update-plant').addEventListener('submit', function (event) {
    event.preventDefault();
    var jsonData = JSON.parse(document.getElementById('update-plant-json').value);
    jsonData['token'] = localStorage.getItem('token');
    console.log(jsonData);
    fetch(backendUrl + 'update_plant.php', {
        method: 'POST',
        body: JSON.stringify(jsonData),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.getElementById('update-result').innerHTML = JSON.stringify(data, null, 3);
        });
});

// Deletes plant
sendForm('delete-plant', 'delete_plant.php', 'delete-result');