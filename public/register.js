const form = document.querySelector('form');

form.addEventListener('submit', async (e)=> {
    e.preventDefault();
    const {firstName, lastName, email, gender, password, passwordRepeat} = form;

    try {
        const res = await fetch('/auth/register', { 
            body: JSON.stringify({   
            'firstName' : firstName.value, 
            'lastName' : lastName.value, 
            'email' : email.value, 
            'gender' : gender.value, 
            'password' : password.value,
            'passwordRepeat' : passwordRepeat.value,
        }),
            headers : {"Content-Type": 'application/json'},
            method : 'POST'
            }).then(res => {
                return res.json();
            }).then(data => {
                showMessages(data);
                // console.log(data);
            }).catch(err => console.error(err)); 
    } catch (error) {
        console.log(error); 
    }
})


const showMessages = (data) =>{

    const result = data.result.response;
    const messageViews = document.querySelectorAll('form > p');

    const messages = [
    "Only characters are allowed!",
    "Only characters are allowed!",
    "User already exists with the given email!",
    "Password must contain atleast 1 uppercase, symbol and number.",
    "Passwords do not match!"];

    if (data.result.error) {
        messageViews.forEach((view, index) =>{
            view.textContent = result[index] === 0 ? messages[index] : "";
        })
        document.getElementById('registration-status').style.display = 'block';
        document.getElementById('registration-status').textContent = data.result.message;
        window.scrollY(0);
    }else{
        form.reset();
        messageViews.forEach(v => v.textContent = '');
        document.getElementById('registration-status').style.display = 'block';
        document.getElementById('registration-status').textContent = data.result.message;
        window.scrollY(0);
    }
}


const onReset = () =>{
    document.getElementById('registration-status').style.display = 'block';
    messageViews.forEach((view) =>{
        view.textContent = '';
    });
}