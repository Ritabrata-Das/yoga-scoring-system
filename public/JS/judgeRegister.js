let judgeRegisterForm = document.getElementById('judgeRegisterForm');
let name = document.getElementById('name');
let mobileNumber = document.getElementById('mobileNumber');
let password = document.getElementById('password');

let nameInvalid = document.getElementById('name-invalid');
let mobInvalid = document.getElementById('mob-invalid');
let passwordInvalid = document.getElementById('password-invalid');

name.addEventListener('focus', (e) => {
    if (name.classList.contains('is-invalid')) {
        name.classList.remove('is-invalid');
    }
    if (name.classList.contains('is-valid')) {
        name.classList.remove('is-valid');
    }
});

mobileNumber.addEventListener('focus', (e) => {
    if (mobileNumber.classList.contains('is-invalid')) {
        mobileNumber.classList.remove('is-invalid');
    }
    if (mobileNumber.classList.contains('is-valid')) {
        mobileNumber.classList.remove('is-valid');
    }
});

password.addEventListener('focus', (e) => {
    if (password.classList.contains('is-invalid')) {
        password.classList.remove('is-invalid');
    }
    if (password.classList.contains('is-valid')) {
        password.classList.remove('is-valid');
    }
});


judgeRegisterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let flag = [];
    if (name.value == '') {
        nameInvalid.innerHTML = 'Please enter your name';
        name.classList.add('is-invalid');
        flag.push(0);
    } else {
        name.classList.add('is-valid');
        flag.push(1);
    }
    if (mobileNumber.value == '') {
        mobInvalid.innerHTML = 'Please enter your mobile number';
        mobileNumber.classList.add('is-invalid');
        flag.push(0);
    } else if (mobileNumber.value.length > 0 && (mobileNumber.value.length < 10 || mobileNumber.value.length > 10)) {
        mobInvalid.innerHTML = 'Mobile Number must be of 10 digits';
        mobileNumber.classList.add('is-invalid');
        flag.push(0);
    } else {
        mobileNumber.classList.add('is-valid');
        flag.push(1);
    }
    if (password.value == '') {
        passwordInvalid.innerHTML = 'Please enter your password';
        password.classList.add('is-invalid');
        flag.push(0);
    } else {
        password.classList.add('is-valid');
        flag.push(1);
    }

    if (flag.indexOf(0) == -1) {
        let response = await fetch('/judgeRegistrationDB', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'judgeName': name.value,
                'password': password.value,
                'mobile': mobileNumber.value
            })
        });
        let text = await response.text();
        console.log(text);
        if (text == 'ERROR') {
            swal({
                title: 'Oops',
                text: "Something went wrong",
                icon: 'error',
                buttons: {
                    again: {
                        text: 'Try again',
                        value: 'again'
                    }
                }
            }).then((result) => {
                if (result == 'again') {
                    window.open('/judgeRegister');
                }
            });
        } else {
            let html = document.createElement('font');
            html.innerHTML = `You are successfully registered<br><b>YSS ID - ${text}</b>`;
            swal({
                title: 'Registration Successful',
                content: html,
                icon: 'success',
                buttons: {
                    back: {
                        text: 'Go Back To Home Page',
                        value: 'back'
                    }
                }
            }).then((result) => {
                if (result == 'back') {
                    window.open('/home');
                }
            });
        }
    }

});