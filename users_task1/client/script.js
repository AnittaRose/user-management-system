
async function add(event) {
    event.preventDefault();

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    if (!email || !password) {
        return alert('Please fill out both fields.');
    }

    let requestData = JSON.stringify({ email, password });
    console.log("requestData", requestData);

    try {
        let response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: requestData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let parsedResponse = await response.json();
        if (!parsedResponse.data) {
            throw new Error('Invalid response structure');
        }

        let { user_type, token, id } = parsedResponse.data;

        let tokenKey = id;
        localStorage.setItem(tokenKey, token);

        let loginCountKey = `${id}_login_count`;
        let loginCount = parseInt(localStorage.getItem(loginCountKey) || 0);

        if (loginCount === 0) {
            localStorage.setItem(loginCountKey, 1);
            alert("This is your first login. Please reset your password.");
            window.location = `resetpassword.html?login=${tokenKey}&id=${id}`;
            return;
        } else {
            loginCount += 1;
            localStorage.setItem(loginCountKey, loginCount);
        }

        console.log(`User has logged in ${loginCount} times`);

        if (user_type === 'Admin') {
            window.location = `admin.html?login=${tokenKey}`;
        } else if (user_type === "Employee") {
            window.location = `sample.html?login=${tokenKey}&id=${id}`;
        }

    } catch (error) {
        console.error("Login failed:", error);
        alert('Failed to login. Please try again.');
    }
}

function addpage(event) {
    event.preventDefault()

    let params = new URLSearchParams(window.location.search);
    console.log(params)

    let token_key = params.get('login');
    console.log(token_key)

    window.location = `addpage.html?login=${token_key}`
}
async function adduser(event) {
    event.preventDefault();
    console.log('Form submission started...');

    const params = new URLSearchParams(window.location.search);
    console.log('params', params);

    const token_key = params.get('login');
    console.log("token_key", token_key);

    const token = localStorage.getItem(token_key);

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    // const password = document.getElementById('password').value;
    const user_type = document.getElementById('user_type').value;

    if (!username) {
        alert('Please fill out the username field');
    } else if (!email) {
        alert('Please fill out the email field');
    } else if (!user_type) {
        alert('please fill out the user_type field')
    }

    const data = { username, email, user_type };
    console.log("data", data);

    const strdata = JSON.stringify(data);
    console.log('strdata', strdata);

    try {
        const response = await fetch('/user', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: strdata,
        });
        console.log("response", response)
        let parsed_responce = await response.json()
        console.log("parsed_responce", parsed_responce)

        if (response.status === 200) {
            if (user_type === 'Admin') {
                alert('admin added successfull')
            }
            else if (user_type === 'Employee') {
                alert("Employee was successfully created")
            }
            window.location = `admin.html?login=${token_key}`
        } else {
            alert("something went worng")
        }

    } catch (error) {
        console.error("Fetch error:", error);

    }
}
async function listView(event) {
    event.preventDefault();
    console.log("reached list view ..............................")


    let params = new URLSearchParams(window.location.search);
    console.log('params', params);

    let token_key = params.get('login');
    console.log("token_key", token_key);

    let token = localStorage.getItem(token_key)

    try {
        let response = await fetch(`/user`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        let parsed_Response = await response.json();
        console.log("parsed_Response", parsed_Response);

        let data = parsed_Response.data;
        console.log("data", data)

        const tableBody = document.getElementById('userTable');
        let row = '';
        for (let i = 0; i < data.length; i++) {


            row += `
            <div class="pt-3  pb-3">
                <tr class="shadow-lg box rounded">

                    
                    <td class="link-dark">${data[i].username}</td>
                    <td class="link-dark">${data[i].email}</td>
                    <td><button class="bttn px-5 p-2" onclick="singleData('${data[i]._id}')" >view</button></td>
                   
                </tr>
            </div>
            `;

            // tableBody.appendChild(row);
            tableBody.innerHTML = row;

        }


    } catch (error) {
        console.log("error", error);
    }

}
function singleData(id) {
    let params = new URLSearchParams(window.location.search);
    console.log("params", params);

    let token_key = params.get('login');
    console.log('token_key', token_key);


    window.location = `viewpage.html?login=${token_key}&id=${id}`


}
async function usersignout() {
    console.log("Reached........... at log out");

    let params = new URLSearchParams(window.location.search);
    console.log("params", params);

    let token_key = params.get('login');
    console.log("token_key", token_key);

    if (token_key) {
        let token = localStorage.getItem(token_key);
        console.log("token", token);

        if (token) {
            localStorage.removeItem(token_key);
            window.location.href = "index.html";
        } else {
            console.log("Token not found");
        }
    } else {
        console.log("No login parameter found in the URL");
    }
}
async function viewemployees() {
    let params = new URLSearchParams(window.location.search)

    let id = params.get('id');
    console.log('id', id)

    let token_key = params.get('login');

    let token = localStorage.getItem(token_key);

    console.log("token", token)

    try {
        let response = await fetch(`/users/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        console.log("response", response);

        let parsed_response = await response.json();
        console.log("parsed_response: ", parsed_response);

        let data = parsed_response.data;
        console.log("data: ", data);


        let container = document.getElementById('datacontainer');

        let view_employe = `
                        
                                    <div class="p-4">
                                        <div class="link-light">Name: ${data.username}</div>
                                        <div class="link-light">Email:${data.email}</div>
                                        <div class="link-light">User_type:${data.user_type}</div>
                                        <div class="d-flex">
                                            <div class=" pt-3"><button onclick="deleteuser('${data._id}')" class="custom px-3">Delete</button></div>
                                            <div class="p-2 pt-3"><button onclick="updateuser ('${data._id}')" class="custom px-3">Update</button></div>
                                        </div>
                                    </div>
            `
        container.innerHTML = view_employe;



    } catch (error) {
        console.log("error:", error);
    }
}
async function deleteuser(id) {
    let params = new URLSearchParams(window.location.search)
    let token_key = params.get('login');
    let token = localStorage.getItem(token_key);

    console.log("reached.....")

    try {
        let response = await fetch(`/user/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log("response", response);


        if (response.status === 200) {
            alert("successfully deleted");
            window.location = `admin.html?login=${token_key}`
        } else {
            alert("something went wrong");
        }
    } catch (error) {
        console.log("error", error);
    }
}
function updateuser(id) {
    let params = new URLSearchParams(window.location.search);
    console.log("params", params);

    let token_key = params.get('login');
    console.log("token_key", token_key);

    let token = localStorage.getItem(token_key)
    window.location = `update.html?login=${token_key}&id=${id}`
}
async function employeedata() {

    let params = new URLSearchParams(window.location.search)

    let id = params.get('id');
    console.log('id', id)

    let token_key = params.get('login');

    let token = localStorage.getItem(token_key);

    console.log("token", token)

    try {
        let response = await fetch(`/users/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        console.log("response", response);

        let parsed_response = await response.json();
        console.log("parsed_response: ", parsed_response);

        let data = parsed_response.data;
        console.log("data: ", data);


        let container = document.getElementById('datacontainer');

        let view_employe = `
                <div class="shadow p-3  bg-body rounded position-absolute top-50 start-50 translate-middle w-50 text-center pt-5" >
                    <div class="p-2 fs-4 fw-bold">Name: ${data.username}</div>
                    <div class="p-2 fs-4 fw-bold">Email: ${data.email}</div>
                    <div class="p-2 fs-4 fw-bold">User_type: ${data.user_type.user_type}</div>
                    <div class="d-flex pt-3 justify-content-center">
                        <div class="p-2"><button onclick="deleteuser('${data._id}')" class="custom-btn btn-5">Delete</button></div>
                        <div class="p-2"><button onclick="updateuser ('${data._id}')" class="custom-btn btn-5">Update</button></div>
                    </div>
                </div>
            `
        container.innerHTML = view_employe;



    } catch (error) {
        console.log("error:", error);
    }
}
async function viewPort() {
    let params = new URLSearchParams(window.location.search)

    let id = params.get('id');
    console.log('id', id)

    let token_key = params.get('login');

    let token = localStorage.getItem(token_key);

    console.log("token", token)

    try {
        let response = await fetch(`/users/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        console.log("response", response);

        let parsed_response = await response.json();
        console.log("parsed_response: ", parsed_response);

        let data = parsed_response.data;
        console.log("data: ", data);


        let container = document.getElementById('Port');

        let view_employe = `
                   
            <div class="card position-absolute top-50 start-50 translate-middle">
                <div class="card__img"><svg xmlns="http://www.w3.org/2000/svg" width="100%"><rect fill="#ffffff" width="540" height="450"></rect><defs><linearGradient id="a" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="0" y2="100%" gradientTransform="rotate(222,648,379)"><stop offset="0" stop-color="#ffffff"></stop><stop offset="1" stop-color="#FC726E"></stop></linearGradient><pattern patternUnits="userSpaceOnUse" id="b" width="300" height="250" x="0" y="0" viewBox="0 0 1080 900"><g fill-opacity="0.5"><polygon fill="#444" points="90 150 0 300 180 300"></polygon><polygon points="90 150 180 0 0 0"></polygon><polygon fill="#AAA" points="270 150 360 0 180 0"></polygon><polygon fill="#DDD" points="450 150 360 300 540 300"></polygon><polygon fill="#999" points="450 150 540 0 360 0"></polygon><polygon points="630 150 540 300 720 300"></polygon><polygon fill="#DDD" points="630 150 720 0 540 0"></polygon><polygon fill="#444" points="810 150 720 300 900 300"></polygon><polygon fill="#FFF" points="810 150 900 0 720 0"></polygon><polygon fill="#DDD" points="990 150 900 300 1080 300"></polygon><polygon fill="#444" points="990 150 1080 0 900 0"></polygon><polygon fill="#DDD" points="90 450 0 600 180 600"></polygon><polygon points="90 450 180 300 0 300"></polygon><polygon fill="#666" points="270 450 180 600 360 600"></polygon><polygon fill="#AAA" points="270 450 360 300 180 300"></polygon><polygon fill="#DDD" points="450 450 360 600 540 600"></polygon><polygon fill="#999" points="450 450 540 300 360 300"></polygon><polygon fill="#999" points="630 450 540 600 720 600"></polygon><polygon fill="#FFF" points="630 450 720 300 540 300"></polygon><polygon points="810 450 720 600 900 600"></polygon><polygon fill="#DDD" points="810 450 900 300 720 300"></polygon><polygon fill="#AAA" points="990 450 900 600 1080 600"></polygon><polygon fill="#444" points="990 450 1080 300 900 300"></polygon><polygon fill="#222" points="90 750 0 900 180 900"></polygon><polygon points="270 750 180 900 360 900"></polygon><polygon fill="#DDD" points="270 750 360 600 180 600"></polygon><polygon points="450 750 540 600 360 600"></polygon><polygon points="630 750 540 900 720 900"></polygon><polygon fill="#444" points="630 750 720 600 540 600"></polygon><polygon fill="#AAA" points="810 750 720 900 900 900"></polygon><polygon fill="#666" points="810 750 900 600 720 600"></polygon><polygon fill="#999" points="990 750 900 900 1080 900"></polygon><polygon fill="#999" points="180 0 90 150 270 150"></polygon><polygon fill="#444" points="360 0 270 150 450 150"></polygon><polygon fill="#FFF" points="540 0 450 150 630 150"></polygon><polygon points="900 0 810 150 990 150"></polygon><polygon fill="#222" points="0 300 -90 450 90 450"></polygon><polygon fill="#FFF" points="0 300 90 150 -90 150"></polygon><polygon fill="#FFF" points="180 300 90 450 270 450"></polygon><polygon fill="#666" points="180 300 270 150 90 150"></polygon><polygon fill="#222" points="360 300 270 450 450 450"></polygon><polygon fill="#FFF" points="360 300 450 150 270 150"></polygon><polygon fill="#444" points="540 300 450 450 630 450"></polygon><polygon fill="#222" points="540 300 630 150 450 150"></polygon><polygon fill="#AAA" points="720 300 630 450 810 450"></polygon><polygon fill="#666" points="720 300 810 150 630 150"></polygon><polygon fill="#FFF" points="900 300 810 450 990 450"></polygon><polygon fill="#999" points="900 300 990 150 810 150"></polygon><polygon points="0 600 -90 750 90 750"></polygon><polygon fill="#666" points="0 600 90 450 -90 450"></polygon><polygon fill="#AAA" points="180 600 90 750 270 750"></polygon><polygon fill="#444" points="180 600 270 450 90 450"></polygon><polygon fill="#444" points="360 600 270 750 450 750"></polygon><polygon fill="#999" points="360 600 450 450 270 450"></polygon><polygon fill="#666" points="540 600 630 450 450 450"></polygon><polygon fill="#222" points="720 600 630 750 810 750"></polygon><polygon fill="#FFF" points="900 600 810 750 990 750"></polygon><polygon fill="#222" points="900 600 990 450 810 450"></polygon><polygon fill="#DDD" points="0 900 90 750 -90 750"></polygon><polygon fill="#444" points="180 900 270 750 90 750"></polygon><polygon fill="#FFF" points="360 900 450 750 270 750"></polygon><polygon fill="#AAA" points="540 900 630 750 450 750"></polygon><polygon fill="#FFF" points="720 900 810 750 630 750"></polygon><polygon fill="#222" points="900 900 990 750 810 750"></polygon><polygon fill="#222" points="1080 300 990 450 1170 450"></polygon><polygon fill="#FFF" points="1080 300 1170 150 990 150"></polygon><polygon points="1080 600 990 750 1170 750"></polygon><polygon fill="#666" points="1080 600 1170 450 990 450"></polygon><polygon fill="#DDD" points="1080 900 1170 750 990 750"></polygon></g></pattern></defs><rect x="0" y="0" fill="url(#a)" width="100%" height="100%"></rect><rect x="0" y="0" fill="url(#b)" width="100%" height="100%"></rect></svg></div>
                <div class="card__avatar"><svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><circle cx="64" cy="64" fill="#ff8475" r="60"></circle><circle cx="64" cy="64" fill="#f85565" opacity=".4" r="48"></circle><path d="m64 14a32 32 0 0 1 32 32v41a6 6 0 0 1 -6 6h-52a6 6 0 0 1 -6-6v-41a32 32 0 0 1 32-32z" fill="#7f3838"></path><path d="m62.73 22h2.54a23.73 23.73 0 0 1 23.73 23.73v42.82a4.45 4.45 0 0 1 -4.45 4.45h-41.1a4.45 4.45 0 0 1 -4.45-4.45v-42.82a23.73 23.73 0 0 1 23.73-23.73z" fill="#393c54" opacity=".4"></path><circle cx="89" cy="65" fill="#fbc0aa" r="7"></circle><path d="m64 124a59.67 59.67 0 0 0 34.69-11.06l-3.32-9.3a10 10 0 0 0 -9.37-6.64h-43.95a10 10 0 0 0 -9.42 6.64l-3.32 9.3a59.67 59.67 0 0 0 34.69 11.06z" fill="#4bc190"></path><path d="m45 110 5.55 2.92-2.55 8.92a60.14 60.14 0 0 0 9 1.74v-27.08l-12.38 10.25a2 2 0 0 0 .38 3.25z" fill="#356cb6" opacity=".3"></path><path d="m71 96.5v27.09a60.14 60.14 0 0 0 9-1.74l-2.54-8.93 5.54-2.92a2 2 0 0 0 .41-3.25z" fill="#356cb6" opacity=".3"></path><path d="m57 123.68a58.54 58.54 0 0 0 14 0v-25.68h-14z" fill="#fff"></path><path d="m64 88.75v9.75" fill="none" stroke="#fbc0aa" stroke-linecap="round" stroke-linejoin="round" stroke-width="14"></path><circle cx="39" cy="65" fill="#fbc0aa" r="7"></circle><path d="m64 91a25 25 0 0 1 -25-25v-16.48a25 25 0 1 1 50 0v16.48a25 25 0 0 1 -25 25z" fill="#ffd8c9"></path><path d="m91.49 51.12v-4.72c0-14.95-11.71-27.61-26.66-28a27.51 27.51 0 0 0 -28.32 27.42v5.33a2 2 0 0 0 2 2h6.81a8 8 0 0 0 6.5-3.33l4.94-6.88a18.45 18.45 0 0 1 1.37 1.63 22.84 22.84 0 0 0 17.87 8.58h13.45a2 2 0 0 0 2.04-2.03z" fill="#bc5b57"></path><path d="m62.76 36.94c4.24 8.74 10.71 10.21 16.09 10.21h5" style="fill:none;stroke-linecap:round;stroke:#fff;stroke-miterlimit:10;stroke-width:2;opacity:.1"></path><path d="m71 35c2.52 5.22 6.39 6.09 9.6 6.09h3" style="fill:none;stroke-linecap:round;stroke:#fff;stroke-miterlimit:10;stroke-width:2;opacity:.1"></path><circle cx="76" cy="62.28" fill="#515570" r="3"></circle><circle cx="52" cy="62.28" fill="#515570" r="3"></circle><ellipse cx="50.42" cy="69.67" fill="#f85565" opacity=".1" rx="4.58" ry="2.98"></ellipse><ellipse cx="77.58" cy="69.67" fill="#f85565" opacity=".1" rx="4.58" ry="2.98"></ellipse><g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="m64 67v4" stroke="#fbc0aa" stroke-width="4"></path><path d="m55 56h-9.25" opacity=".2" stroke="#515570" stroke-width="2"></path><path d="m82 56h-9.25" opacity=".2" stroke="#515570" stroke-width="2"></path></g><path d="m64 84c5 0 7-3 7-3h-14s2 3 7 3z" fill="#f85565" opacity=".4"></path><path d="m65.07 78.93-.55.55a.73.73 0 0 1 -1 0l-.55-.55c-1.14-1.14-2.93-.93-4.27.47l-1.7 1.6h14l-1.66-1.6c-1.34-1.4-3.13-1.61-4.27-.47z" fill="#f85565"></path></svg></div>
                <div class="sub text-center">
                    <div class="">Name: ${data.username}</div>
                    <div class="">Email: ${data.email}</div>
                    <div class="">User_type: ${data.user_type.user_type}</div>
                </div>
            </div>
            `
        container.innerHTML = view_employe;



    } catch (error) {
        console.log("error:", error);
    }
}
async function editusers() { //onload

    let params = new URLSearchParams(window.location.search);

    let id = params.get('id');

    let token_key = params.get('login');

    let token = localStorage.getItem(token_key)

    try {
        let response = await fetch(`/users/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "Application/json",
            }

        });
        console.log("response : ", response);

        let parsed_Response = await response.json();
        console.log("parsed_response", parsed_Response);

        let data = parsed_Response.data;
        console.log("data", data);

        let username = document.getElementById('username');
        username.value = data.username;

        let email = document.getElementById('email');
        email.value = data.email;

        let user_type = document.getElementById('user_type');
        user_type.value = data.user_type;



    } catch (error) {
        console.log("error", error);
    }
}
async function UpdateData(event) {
    event.preventDefault()

    let params = new URLSearchParams(window.location.search);
    console.log("params", params);

    let id = params.get('id');

    let token_key = params.get('login');
    console.log("token_key", token_key);

    let token = localStorage.getItem(token_key);

    let username = document.getElementById('username').value
    let email = document.getElementById('email').value
    let user_type = document.getElementById('user_type').value
    // let password = document.getElementById('password');



    let data = {
        username,
        email,
        user_type
    }

    let strdata = JSON.stringify(data);


    try {
        let response = await fetch(`/user/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "Application/json",
                "Authorization": `Bearer ${token}`
            },
            body: strdata,
        })

        console.log('response', response);

        let parsed_Response = await response.json();
        console.log("parsed_response", parsed_Response);


        if (response.status === 200) {

            if (!username) {
                alert('Please fill out the username field');
            } else if (!email) {
                alert('Please fill out the email field');
            } else if (!user_type) {
                alert('please fill out the user_type field')
            }
            alert('Employee sucessfully Updated...');
            window.location = `admin.html?login=${token_key}`
        } else {
            alert('update failed')
        }
    } catch (error) {
        console.log('error', error);
    }
}
function resetuser() {

    console.log("Reached at resetCall");
    let params = new URLSearchParams(window.location.search);

    let token_key = params.get('login');
    let id = params.get('id');


    window.location = `resetpassword.html?login=${token_key}&id=${id}`;

}
async function userpassword(event) {
    event.preventDefault();


    console.log("Reached at resetPassword");

    let params = new URLSearchParams(window.location.search);
    console.log("params", params)
    let token_key = params.get('login');
    console.log("token_key", token_key)
    let token = localStorage.getItem(token_key);
    console.log("token", token)
    let id = params.get('id');
    console.log("id", id)

    let password = document.getElementById('Password').value
    let newpassword = document.getElementById('newpassword').value

    let data = {
        password,
        newpassword
    }

    let str = JSON.stringify(data)

    try {
        let response = await fetch(`/resetPassword/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: str
        });

        console.log("response", response)

        let data = await response.json();
        console.log("Response data:", data);
        if (response.status === 200) {
            alert("password reset successfully...")
            window.location.href = "index.html";
        } else {
            alert("reset failed....")
        }

    } catch (error) {
        console.error("Error:", error);
    }

}
async function signout() {
    console.log("Reached..... at log out");

    let params = new URLSearchParams(window.location.search);
    console.log('params', params);

    let token_key = params.get('login');
    console.log("token_key:", token_key);

    if (token_key) {
        let token = localStorage.getItem(token_key);
        console.log("token", token);

        if (token) {
            localStorage.removeItem(token_key);
            window.location.href = "index.html";
        } else {
            console.log("Token not found");
        }
    } else {
        console.log("No login parameter found in the URL");
    }
}
async function sendemail(event) {
    event.preventDefault()
    let email = document.getElementById('email').value

    let data = {
        email
    }

    let stringdata = JSON.stringify(data);
    console.log("data", stringdata);

    try {
        let forgot = await fetch('/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'

            },
            body: stringdata
        });
        console.log("forgot", forgot);

        if (forgot.status === 200) {
            alert("email sending successfully....")
        } else {
            alert("email sending failed")
        }

    } catch (error) {
        console.log("errror", error);
    }

}
async function forgot(event) {
    event.preventDefault()
    let password = document.getElementById('password').value

    let datas = {
        password
    }

    let strdata = JSON.stringify(datas);
    console.log("strdata", strdata);

    let params = new URLSearchParams(window.location.search)

    let token = params.get('token')
    try {
        let forgot_reset = await fetch('/reset-password', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: strdata
        })

        console.log('forgot_reset', forgot_reset);

        if (forgot_reset.status === 200) {
            alert("password reset successfully....")
            window.location.href = `index.html`
        } else {
            alert("password reset fail...")
        }
    } catch (error) {
        console.log('error', error);
    }

}

async function logout() {
    console.log("Reached..... at log out");

    let params = new URLSearchParams(window.location.search);
    console.log('params', params);

    let token_key = params.get('login');
    console.log("token_key:", token_key);

    if (token_key) {
        let token = localStorage.getItem(token_key);
        console.log("token", token);

        if (token) {
            localStorage.removeItem(token_key);
            window.location.href = "index.html";
        } else {
            console.log("Token not found");
        }
    } else {
        console.log("No login parameter found in the URL");
    }
}

function userView() {
    console.log("reached.....");

    let params = new URLSearchParams(window.location.search);
    console.log('params', params);
    let id = params.get('id');

    let token_key = params.get('login');
    console.log("token_key", token_key);

    window.location = `employee.html?login=${token_key}&id=${id}`


}
