const emailx = document.getElementById('email_input');
const passx = document.getElementById('password_input');
const msgForm = document.querySelector('form')

msgForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(emailx.value);
    console.log(passx.value);

    fetch('/user/login' , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Authentication: 'Bearer Token',
        },
        body: JSON.stringify({
            email: emailx.value,
            password: passx.value,
        })
    }).then((res) => {
        res.json().then((data) => {
            console.log(data);
            token = data.token
            
            if(data.type == 'ta_exec'){
                window.location.href = 'http://localhost:2000/user/ta_landing';
            }
            else{
                window.location.href = 'http://localhost:2000/interviewerslot/interviewerLanding';
            }
        })
    })

})