// const token = require('../login');

const email = document.getElementById('email_input');
const password = document.getElementById('password_input');
const namex = document.getElementById('name_input');
const phone = document.getElementById('phone_input');
const msgForm = document.querySelector('form');
const content = document.getElementById('data');
const vanish = document.getElementById('vanish_div');

msgForm.addEventListener('submit', (e) => {
    e.preventDefault();

    fetch('/user/onboardInterviewer' , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value,
            name: namex.value,
            phone: phone.value
        })
    }).then((res) => {
        res.json().then((data) => {
            console.log(data);
            vanish.innerHTML = '';
            content.textContent = data.message;
        })
    })

    
})