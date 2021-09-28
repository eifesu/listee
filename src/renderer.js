const fs = require('fs');
const client = require('./client')
    // WhatsApp Imports


// DOM Elements Imports
const loader = document.querySelector('.loader');
const content = document.querySelector('.content');
const first = document.querySelector('#first');
const last = document.querySelector('#last');
const id = document.querySelector('#id');
const gender = document.querySelector('#gender')
const major = document.querySelector('#major');
const phone = document.querySelector('#phone');

// DOM Button Imports
const submitBtn = document.querySelector('#submit');
const resetBtn = document.querySelector('#reset')


console.log("Test");

// Member list from the DOM
const list = document.querySelector('.members')

// Notification Div
const alert = document.querySelector('.alert');
let array = [];

// FUNCTIONS
const unfreeze = () => {
    content.style.display = 'flex';
    loader.style.display = 'none';
}

const freeze = () => {
    content.style.display = 'none';
    loader.style.display = 'block';
}

const init = () => {
    console.log('Initializing the script !')
        // Reading the file 
    fs.readFile('./db.json', (err, data) => {
        if (err) throw err;
        else {
            array = JSON.parse(data);
            console.log(array);
            unfreeze();
            render();
            reset();

        }


    })


}

const render = () => {
    console.log('Rendering changes !')
        // Cleaning the list 
    list.textContent = ``;
    // Rendering the elements of the array...
    for (const element of array) {
        const person = document.createElement('div');
        person.setAttribute('class', 'member');
        person.innerHTML = `
                <div class="pane">
                    <h3>${element.last.toUpperCase()}</h3>
                    <h3>${element.first}</h3>
                </div>
                <div class="pane">
                    <h3>${element.id}</h3>
                    <h3>${element.major}</h3>
                </div>
                <div class="pane">
                    <button data=${element.id} id="edit">
                    <i class="fas fa-feather-alt"></i>
                    <h3>edit<h3>
                    </button>
                    <button data=${element.id} id="remove">
                    <i class="fas fa-trash"></i>
                    <h3>delete<h3>
                    </button>
                    </div>
                
                `

        list.appendChild(person)
    }
    bind();
    save();

}
const insert = () => {



    console.info(`Inserting element ${id.value}`)
    const student = {
        first: first.value.trim(),
        last: last.value.toUpperCase().trim(),
        id: id.value.trim(),
        major: major.value.trim(),
        phone: phone.value.trim(),
        gender: gender.value.trim(),
        timestamp: Date.now().toString(),

    }

    array.push(student);
    render();

}

const update = (id) => {
    array = array.filter(element => element.id != id)
    insert()
}

const kick = (id) => {
    array = array.filter(element => element.id != id);
    render();
}

async function invite(number) {
    console.log(number);
    const sanitized_number = number.toString().replace(/[- )(]/g, ""); // remove unnecessary chars from the number
    const final_number = `225${sanitized_number.substring(sanitized_number.length - 10)}`; // add 91 before the number here 91 is country code of India

    const number_details = await client.getNumberId(final_number); // get mobile number details

    if (number_details) {
        const sendMessageData = await client.sendMessage(number_details._serialized, "This is an automated message sent from the club software ! Welcome to the club ! Join us "); // send message
    } else {
        console.log(final_number, "Mobile number is not registered");
    }
}
// Button handlers
function submit(e) {
    console.log("Submit function called !")
    e.preventDefault();

    if (!(first.value && last.value && id.value && major.value && phone.value && gender.value)) {
        notify("error", "Please fill all the fields !")
    } else if (array.find((element) => element.id == id.value)) {
        notify("error", "A student with that ID already exists !")
        if (window.confirm(`Do you want to overwrite ID ${id.value}`)) {
            update(id.value)
            notify("success", `Successfully updated ID ${id.value}!`)
        }
    } else {
        insert();
        notify("success", `Successfully added ${last.value}!`)
        invite(phone.value);
    }
}

function remove(e) {
    e.preventDefault();
    let data = e.currentTarget.getAttribute("data");
    if (window.confirm(`Do you want to delete ID ${data}`)) {
        kick(data);
        notify("success", `Successfully deleted ID ${data}!`)
    }

}

async function edit(e) {
    console.log("Edit function called !")
    e.preventDefault(e);
    let data = e.currentTarget.getAttribute('data');
    let student = array.find((student) => student.id == data)

    first.value = student.first;
    last.value = student.last;
    major.value = student.major;
    phone.value = student.phone;
    id.value = student.id;


}

const bind = () => {

    console.log("Binding buttons !")
        // Grabbing the buttons
    const editBtn = document.querySelectorAll('#edit');
    const removeBtn = document.querySelectorAll('#remove');


    // Binding the functions to the buttons
    submitBtn.addEventListener("click", submit);
    resetBtn.addEventListener("click", reset);
    editBtn.forEach(btn => btn.addEventListener("click", edit));
    removeBtn.forEach(btn => btn.addEventListener("click", remove));

}

function reset(e) {
    if (e) {
        e.preventDefault();
    }
    first.value = ``;
    last.value = ``;
    id.value = '';
    major.value = '';
    phone.value = '';
}

const notify = (type, msg) => {
    let color = '';
    switch (type) {
        case "success":
            color = '#007236';
            break;
        case "error":
            color = '#962222';
            break;
        case "info":
            color = '#5f5cc7';
            break;
    }

    alert.style.backgroundColor = color;
    alert.textContent = msg;
    alert.classList.add('shake');
    setTimeout(() => {
        alert.classList.remove('shake');
    }, 1000)


}

function save() {

    let data = JSON.stringify(array);
    fs.writeFile('./db.json', data, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Successfully saved array to memory")
        }
    })
}