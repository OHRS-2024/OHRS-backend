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
                return res.json();
            }).then(data =>{
                if (data.success) {
                    location.href = data.redirectPage;
                }else{
                    console.log(data.message);
                }
            })
            .catch(err => console.error(err)); 
            
    } catch (error) {
        console.log(error); 
    }
});

const onReset = () =>{
    messageViews.forEach((view) =>{
        view.textContent = '';
    });
}