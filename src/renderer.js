
const init = () => {

    console.log("Loaded initialization script !");

    // Grabbing the from elements
    const first = document.querySelector('#first');
    const last = document.querySelector('#last');
    const id = document.querySelector('#id');
    const gender = document.querySelector('#gender')
    const major = document.querySelector('#major');
    const phone = document.querySelector('#phone');
    
    const submitBtn = document.querySelector('#submit');
    
    // Submit function
    function submit(e) {
        e.preventDefault();
        const student = {
            first : first.value,
            last : last.value,
            id : id.value,
            major : major.value,
            phone: phone.value,
            gender: gender.value
        }  
        console.log(student);
    }
    
    submitBtn.addEventListener("click", (e) => submit(e))
    




}

init();