const deleteSlot = document.getElementById('delete');
const slots = document.getElementById('slots');
const url = window.location.href;

deleteSlot.addEventListener('click' , (e) => {
    e.preventDefault();

    const arr = url.split('/');
    const id = arr[arr.length-2];
    const slotId = arr[arr.length - 1];
    console.log(id);

    fetch(`http://localhost:2000/interviewerslot/slot/${id}/${slotId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    slots.innerHTML = '';
    value.textContent = 'Slot Deleted'  
})