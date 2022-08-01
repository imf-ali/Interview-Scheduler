const start_date_input = document.getElementById('start_date_input')
const start_time_input = document.getElementById('start_time_input')
const end_date_input = document.getElementById('end_date_input')
const end_time_input = document.getElementById('end_time_input')
const populateData = document.getElementById('populateData');
const msgForm = document.querySelector('form')

console.log(window.location.href);

const url = window.location.href;

msgForm.addEventListener('submit' , async(e) => {
    e.preventDefault();
    // console.log(passx.value);
    const form = {
        starttime: start_date_input.value + "T" + start_time_input.value,
        endtime: end_date_input.value + "T" + end_time_input.value
    }

    console.log(form);
    const arr = url.split('/');
    const id = arr[arr.length-1];
    console.log(id);

    fetch(`http://localhost:2000/interviewerslot/slot/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            slot: [
                form
            ]
        })
    })

    msgForm.innerHTML = '';
    populateData.textContent = 'Slot Updated';
})
