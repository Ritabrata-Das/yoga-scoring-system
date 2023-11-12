let submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('mousein', (event) => {
    console.log('Hover Event Triggered........');
    submitBtn.classList.remove('btn-warning');
    submitBtn.classList.add('btn-outline-warning');
});



let judgeLoginForm = document.getElementById('judgeLoginForm');
let yss_id = document.querySelector('#YSS-ID');
let password = document.querySelector('#Password');

judgeLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
            if (xhr.responseText == "SUCCESS") {
                window.open('/groupSelection?YSS_ID=' + yss_id.value);
            } else {
                swal({
                    title: 'Wrong YSS ID or Password',
                    text: "Please enter correct YSS ID and password",
                    icon: 'error',
                    buttons: {
                        again: {
                            text: 'Try again',
                            value: 'again'
                        }
                    }
                }).then((result) => {
                    if (result == 'again') {
                        window.open('/judgeLogin');
                    }
                });
            }
        }
    }

    xhr.open('POST', '/judgeLoginSubmit', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(`{"YSS_ID" : "${yss_id.value}","password" : "${password.value}"}`);
});
