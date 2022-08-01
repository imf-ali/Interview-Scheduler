const namex = document.getElementById('name_input')
const emailx = document.getElementById('email_input')
const passx = document.getElementById('password_input')
const phonex = document.getElementById('phone_input')
const typex = document.getElementById('type_input')
const msgForm = document.querySelector('form')

msgForm.addEventListener('submit' , (e) => {
    e.preventDefault();
    // console.log(passx.value);

    fetch('http://localhost:2000/user/signup' , {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: namex.value,
            email: emailx.value,
            password: passx.value,
            phone: phonex.value,
            type: typex.value   
        })
    })

    window.location.href = 'http://localhost:2000/user/login';
    // window.open('http://localhost:2000/user/login', '_blank');

})
