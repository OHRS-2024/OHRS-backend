const messages = [
 "User already exists with this email!",
 "Password must contain atleast 1 character, number and symbol!",
 "Invalid email format!",
 "No input provided!"
]

let errors = [false, false, false, false];

const onSubmit = async (e) =>{

    e.preventDefault();
    const form = document.querySelector('form');
    const emailInput  = form.querySelectorAll('input')[0];
    const passInput  = form.querySelectorAll('input')[1];
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    
    form.querySelectorAll('input').forEach(item => {
        item.value === "" ? item.nextSibling.textContent = messages.NO_INPUT : 
        item.nextSibling.textContent = null;
    });

    emailInput.value.match(emailRegex) ? 
    emailInput.nextSibling.textContent = null :
    emailInput.nextSibling.textContent = messages.INVALID_EMAIL;

    passInput.value.match("^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?/\|]).{6,}$") ?
    passInput.nextSibling.textContent = messages.WEAK_PASS : 
    passInput.nextSibling.textContent = null; 

}

const showMessages = async (code) =>{

}

const submit = async () =>{
    try {
        const res = await fetch('/auth/register', { 
            body: JSON.stringify({   
            'firstName' : firstName.value, 
            'lastName' : lastName.value, 
            'email' : email.value, 
            'gender' : gender.value, 
            'password' : password.value 
        }),
            headers : {"Content-Type": 'application/json'},

            method : 'POST'
            })
            .then(res => console.log(res))
            .catch(err => console.error(err)); 

    } catch (error) {
        console.log(error); 
    }
}