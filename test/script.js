import API_PATH from './global.js';

// Setups one form to send its data as JSON to the API with fetch() method
function setupForm(method, request, formId, resultId, callback, textarea) {
    document.getElementById(formId).addEventListener('submit', function (event) {
        event.preventDefault();
        const resultPlace = document.getElementById(resultId);
        resultPlace.innerHTML = '';
        // JSON data
        var jsonData = {};
        if (textarea) {
            jsonData = JSON.parse(document.getElementById(textarea).value)
        } else {
            const formData = new FormData(this);
            formData.forEach((value, key) => {
                jsonData[key] = value;
            });
        }
        // Fetch options
        const options = { method: method };
        var url = request;
        if ((method == 'GET' || method == 'PUT' || method == 'DELETE') && jsonData['id']) {
            url += '/' + jsonData['id'];
        }
        if (method == 'POST' || method == 'PUT') {
            options.body = JSON.stringify(jsonData);
        }
        // Headers
        const token = localStorage.getItem('token');
        if (token) {
            options.headers = {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        } else {
            options.headers = {
                'Content-Type': 'application/json'
            };
        }
        fetch(API_PATH + url, options)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                resultPlace.innerHTML = JSON.stringify(data, null, 2);
                if (callback) {
                    callback(data);
                }
            });
    });
}

// Post session (login)
setupForm('POST', 'session', 'login', 'login-result', (data) => {
    if (data.token) {
        localStorage.setItem('token', data.token);
    }
});

// Delete session (logout)
setupForm('DELETE', 'session', 'logout', 'logout-result', () => {
    localStorage.removeItem('token');
});


// Post new user
setupForm('POST', 'users', 'register', 'register-result');

// Resend confirmation email
document.getElementById('send-email').addEventListener('submit', function(event) {
    event.preventDefault();
    fetch(API_PATH + 'users?confirm=' + event.target.email.value)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.getElementById('email-result').innerHTML = JSON.stringify(data, null, 2);
        });
});

// Reset password
document.getElementById('reset-password').addEventListener('submit', function(event) {
    event.preventDefault();
    fetch(API_PATH + 'users?reset=' + event.target.email.value)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.getElementById('reset-result').innerHTML = JSON.stringify(data, null, 2);
        });
});

// Get all users
setupForm('GET', 'users', 'get-users', 'users-result');

// Get single user
setupForm('GET', 'users', 'get-user', 'user-result');

// Loads one user to edit
setupForm('GET', 'users', 'edit-user', 'update-user-json', (data) => {
    if (data) {
        delete data.token;
        document.getElementById('update-user-json').innerHTML = JSON.stringify(data, null, 2);
    }
});

// Puts updated user
setupForm('PUT', 'users', 'update-user', 'update-user-result', null, 'update-user-json');

// Delete user
setupForm('DELETE', 'users', 'delete-user', 'delete-user-result', (data) => {
    if (data.message == 'Utente eliminato') {
        localStorage.removeItem('token');
    }
});

// Get all plants
document.getElementById('load-plants').addEventListener('click', function () {
    fetch(API_PATH + 'plants')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.getElementById('plants-result').innerText = JSON.stringify(data, null, 2);
        });
});

// Get one plant
setupForm('GET', 'plants', 'get-plant', 'plant-result');

// Posts one plant
setupForm('POST', 'plants', 'post-plant', 'post-plant-result', null, 'plant-json');

// Loads one plant to edit
setupForm('GET', 'plants', 'edit-plant', 'update-plant-json', (data) => {
    if (data) {
        delete data.date;
        delete data.user;
        delete data.images;
        document.getElementById('update-plant-json').innerHTML = JSON.stringify(data, null, 2);
    }
});

// Puts updated plant
setupForm('PUT', 'plants', 'update-plant', 'update-result', null, 'update-plant-json');

// Deletes one plant
setupForm('DELETE', 'plants', 'delete-plant', 'delete-result');

// Uploads image
document.getElementById('upload-image').addEventListener('submit', function (event) {
    event.preventDefault();
    var formData = new FormData();
    var fileInput = document.getElementById('image-file');
    formData.append('image', fileInput.files[0]);
    formData.append('plant-id', document.getElementById('plant-id').value);
    const options = {
        method: 'POST',
        body: formData
    };
    const token = localStorage.getItem('token');
    if (token) {
        options.headers = { 'Authorization': 'Bearer ' + token }
    }
    fetch(API_PATH + 'images', options)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.getElementById('upload-result').innerHTML = JSON.stringify(data, null, 2);
        });
});

// Deletes image
setupForm('DELETE', 'images', 'delete-image', 'delete-image-result');
