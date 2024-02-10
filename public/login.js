const form = document.querySelector('form');

form.addEventListener('submit', async (e)=> {
    e.preventDefault();

    const {email, password} = form;

    try {
        const res = await fetch('/auth/login', { 
            body: JSON.stringify({   
            'email' : email.value, 
            'password' : password.value
        }),
            headers : {"Content-Type": 'application/json'},
            method : 'POST'
            }).then(res => {
                console.log(res.json());
            }).catch(err => console.error(err)); 
    } catch (error) {
        console.log(error); 
    }
});

const onReset = () =>{
    messageViews.forEach((view) =>{
        view.textContent = '';
    });
}