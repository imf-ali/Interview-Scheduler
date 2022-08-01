// const token = require('../login');

const email = document.getElementById('email_input');
const password = document.getElementById('password_input');
const namex = document.getElementById('name_input');
const phone = document.getElementById('phone_input');
const resume = document.getElementById('resume_input');
const msgForm = document.querySelector('form');
const putdata = document.getElementById('data');
const vanish = document.getElementById('vanish_div');

msgForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const file = resume.files[0];
    console.log(file)

    // const data = new FormData();
    // data.append('resume_link', file);

    // fetch('/candidate/onboardCandidate' , {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         // Authorization: `Bearer ${token}`,
    //     },
    //     body: data
    // }).then((res) => {
    //     res.json().then((data) => {
    //         // console.log(data);
    //         // vanish.innerHTML = '';
    //         // putdata.textContent = data.message;
    //     })
    // })

    vanish.innerHTML = '';
    putdata.textContent = 'Candidate Onboarded Successfully!';
})