let groupNameInput = document.getElementById('GroupNameInput');



function group_writer(json, date, cutOffDate) {
    console.log(json);
    console.log(json.length);
    var diff_year = cutOffDate.getFullYear() - date.getFullYear();
    var diff_month = cutOffDate.getMonth() - date.getMonth();
    var diff_day = cutOffDate.getDate() - date.getDate();
    var gender = document.querySelector('input[name="gender"]:checked').value;

    if (diff_month > 0 || (diff_month == 0 && diff_day > 0)) {
        diff_year++;
    }
    for (var i = 0; i < json.length; i++) {
        // if (parseInt(date.getFullYear()) < parseInt(cutOffDate.getFullYear())-json[i].MinAge && parseInt(date.getFullYear()) > parseInt(cutOffDate.getFullYear())-json[i].MaxAge) {
        //     console.log('fired');
        //     groupNameInput.setAttribute('value',json[i].GroupName);
        //     break;
        // } else if(parseInt(date.getFullYear()) == parseInt(cutOffDate.getFullYear())-json[i].MinAge) {
        //     if(parseInt(date.getMonth()) < parseInt(cutOffDate.getMonth())) {
        //         groupNameInput.setAttribute('value',json[i].GroupName);
        //         break;
        //     } else if(parseInt(date.getMonth()) == parseInt(cutOffDate.getMonth())) {
        //         if(parseInt(date.getDate()) <= parseInt(cutOffDate.getDate())) {
        //             groupNameInput.setAttribute('value',json[i].GroupName);
        //             break;
        //         }
        //     }
        // } else if(parseInt(date.getFullYear()) == parseInt(cutOffDate.getFullYear())-json[i].MaxAge) {
        //     if(parseInt(date.getMonth()) > parseInt(cutOffDate.getMonth())) {
        //         groupNameInput.setAttribute('value',json[i].GroupName);
        //         break;
        //     } else if(parseInt(date.getMonth()) == parseInt(cutOffDate.getMonth())) {
        //         if(parseInt(date.getDate()) >= parseInt(cutOffDate.getDate())) {
        //             groupNameInput.setAttribute('value',json[i].GroupName);
        //             break;
        //         }
        //     }
        // }

        if (diff_year >= json[i].MinAge && diff_year <= json[i].MaxAge && json[i].Sex == gender) {
            console.log('fired');
            groupNameInput.setAttribute('value', json[i].GroupName);
        }
    }
}

const groupInterval = setInterval(() => {
    let dob = document.getElementById('dob');
    let yss_id = document.getElementById('YSS_Competition_ID');
    let cutOffDate = new Date(document.getElementById('cutOffDate').innerHTML);
    var date = new Date(dob.value);
    // console.log(date);
    console.log(cutOffDate);
    // console.log(yss_id.innerHTML);
    // var differenceInTime = cutOffDate.getTime() - date.getTime();
    // var differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    // var diffInMonths = Math.floor(differenceInDays / 30);
    // var diffInYears = Math.floor(diffInMonths / 12);
    // console.log(diffInYears);
    console.log(yss_id.innerHTML);
    fetch('/getGroupCriteria?YSS_ID=' + yss_id.innerHTML)
        .then(response => response.json())
        .then(json => group_writer(json, date, cutOffDate));

    // if(group == 'sub-junior') {
    //   if(diffInYears >= 8 && diffInYears <= 12) {
    //     return_data.push(names[i][0]);
    //   }
    // } else if(group == 'junior') {
    //   if(diffInYears >=13 && diffInYears <= 16) {
    //     return_data.push(names[i][0]);
    //   }
    // } else {
    //   if(diffInYears >= 17) {
    //     return_data.push(names[i][0]);
    //   }
    // }



}, 1000);

let competitionRegistrationBtn = document.getElementById('competitionRegistrationForm');

// alert("sdhvhsk");
competitionRegistrationBtn.addEventListener("submit", async function (e) {
    e.preventDefault();
    clearInterval(groupInterval);
    let yss_id = document.getElementById('YSS_Competition_ID').innerHTML;
    let fullName = document.getElementById('fullName').value;
    let organisationName = document.getElementById('organisationName').value;
    let dob = document.getElementById('dob').value;
    let groupNameInputValue = document.getElementById('GroupNameInput').value;
    var sex = document.querySelector('input[name="gender"]:checked').value;
    // alert("svk");
    // console.warn('Hello');
    let response = await fetch('/registerCandidate', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'YSS_ID': yss_id,
            'YSS_CANDIDATE_ID': document.getElementById('YSS_ID').value,
            'groupName': groupNameInputValue,
            'fullName': fullName,
            'organisation': organisationName,
            'dob': dob,
            'sex': sex
        })
    });
    let text = await response.text();
    console.log(text);
    if(text == 'SUCCESS') {
        swal({
            title: 'Registration Successful',
            text: 'You are successfully registered to the competition',
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
});
