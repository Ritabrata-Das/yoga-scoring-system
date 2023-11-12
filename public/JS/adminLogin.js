let yss_id = document.getElementById('YSS-ID');
let password = document.getElementById('Password');
let submitBtn = document.getElementById('submitBtn');
let adminLoginForm = document.getElementById('adminLoginForm');

adminLoginForm.addEventListener('submit', async function(e){
    e.preventDefault();
    let response = await fetch('/adminPortal',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'YSS_ID': yss_id.value,
            'password': password.value
        })
    });
    let text = await response.text();
    console.log(text);
    if(text == 'SUCCESS') {
        window.open('/adminPortal?YSS_ID='+yss_id.value);
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
                window.open('/adminLogin');
            }
        });
    }
});