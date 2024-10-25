
async function add(event) {
    event.preventDefault();
    console.log('Reached.....');

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let data = {
        email,
        password
    };

    console.log('data', data);

    let stringdata = JSON.stringify(data);
    console.log("string_data :", stringdata);

    try {
        let response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'  
            },
            body: stringdata
        });

        console.log('response', response);

        let parsed =  await response.json();
        console.log('parsed',parsed);

        let token_data = parsed.data;
        console.log('token_data',token_data);

        let user_type = token_data.user_type;


        let token = token_data.token;

        let id =token_data.id;
        console.log("id",id)

        let token_key = id;
        
        
        localStorage.setItem(token_key, token);
        console.log("token_key",token_key)


        if(user_type === 'Admin'){
            alert('admin logging successfull')
            window.location = `admin.html?login=${token_key}`
        }
        else if(user_type === 'Employee'){
            alert('emplozee login successfull')
            window.location = `employee.html?login=${token_key}&id=${id}`
        }
        
       
    } catch (error) {
        console.log("error :", error);
    }

} 
function addpage(event){
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
        console.log("response",response)
        let parsed_responce =await response.json()
        console.log("parsed_responce",parsed_responce)

        if(response.status===200){
            if(user_type === 'Admin'){
                alert('admin added successfull')
            }
            else if(user_type === 'Employee'){
                alert("Employee was successfully created")
            }
            window.location=`admin.html?login=${token_key}`
        }else{
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
    console.log('params',params);

    let token_key = params.get('login');
    console.log("token_key",token_key);

    let token = localStorage.getItem(token_key)

    try {
        let response = await fetch(`/user`,{
            method : 'GET',
            headers : {
                'Authorization' : `Bearer ${token}`
            }
        });

        let parsed_Response = await response.json();
        console.log("parsed_Response",parsed_Response);

        let data = parsed_Response.data;
        console.log("data",data)

        const tableBody = document.getElementById('userTable');
        let row='';
        for(let i=0; i<data.length ; i++){

        
            row += `
                <tr>

                    <td class="hov">${data[i]._id}</td>
                    <td class="hov">${data[i].username}</td>
                    <td class="hov">${data[i].email}</td>
                    <td><button class="custom-btn btn-16" onclick="singleData('${data[i]._id}')" >view</button></td>
                   
                </tr>
            `;

            // tableBody.appendChild(row);
            tableBody.innerHTML =row;

        }
        

    } catch (error) {
        console.log("error",error);
    }
    
}
function singleData(id){
    let params = new URLSearchParams(window.location.search);
    console.log("params",params);

    let token_key = params.get('login');
    console.log('token_key',token_key);

   
    window.location = `viewpage.html?login=${token_key}&id=${id}`


}
async function usersignout(){
    console.log("Reached........... at log out");

    let params = new URLSearchParams(window.location.search);
    console.log("params",params);

    let token_key = params.get('login');
    console.log("token_key",token_key);

    if(token_key){
        let token = localStorage.getItem(token_key);
        console.log("token",token);

        if(token){
            localStorage.removeItem(token_key);
            window.location.href = "index.html";
        }else{
            console.log("Token not found");
        }
    }else{
        console.log("No login parameter found in the URL");
    }
}
async function viewemployees(){
    let params = new URLSearchParams(window.location.search)

    let id = params.get('id');
    console.log('id',id)

    let token_key = params.get('login');

    let token = localStorage.getItem(token_key);

    console.log("token",token)

    try {
        let response = await fetch(`/users/${id}`,{
            method : 'GET',
            headers : {
                'Authorization' : `Bearer ${token}`
            }
        })
        console.log("response",response);

        let parsed_response = await response.json();
        console.log("parsed_response: ",parsed_response);

        let data = parsed_response.data;
        console.log("data: ",data);


        let container = document.getElementById('datacontainer');

            let view_employe = `
            <div class="">
                    <div class="d-flex justify-content-evenly">
                        <div class="pt-4"><img src ="https://img.freepik.com/free-vector/follow-me-social-business-theme-design_24877-50426.jpg?ga=GA1.1.392549930.1719407083&semt=ais_hybrid" style="width :400px";></div>
                            <div class="pt-5 users-2 px-5">
                                <div class="p-3 pt-3 text-center link-dark fw-bold fs-5">Name: ${data.username}</div>
                                <div class="p-3 pt-3 text-center link-dark fw-bold fs-5">Email: ${data.email}</div>
                                <div class="p-3 pt-3 text-center link-dark fw-bold fs-5">User_type: ${data.user_type.user_type}</div>
                                <div class="d-flex justify-content-center pt-4">
                                    <div class="text-center"><button onclick="deleteuser('${data._id}')" class="custom-btn btn-16">Delete</button></div>
                                    <div class="text-center"><button onclick="updateuser ('${data._id}')" class="custom-btn btn-16">Update</button></div>
                                </div>
                            </div>
                    </div>
                </div>
                
            `
            container.innerHTML=view_employe;



    } catch (error) {
        console.log("error:",error);
    }
}
async function deleteuser(id) {
    let params = new URLSearchParams(window.location.search)
    let token_key = params.get('login');
    let token = localStorage.getItem(token_key);

    console.log("reached.....")

    try {
        let response = await fetch(`/user/${id}`,{
            method: 'DELETE',
            headers:{
                'Authorization' : `Bearer ${token}`
            }
        });
        console.log("response",response);
        

        if(response.status===200){
            alert("successfully deleted");
            window.location=`admin.html?login=${token_key}`
        }else{
            alert("something went wrong");
        }
    } catch (error) {
        console.log("error",error);
    }
}
function updateuser(id){
    let params = new URLSearchParams(window.location.search);
    console.log("params",params);

    let token_key = params.get('login');
    console.log("token_key",token_key);

    let token = localStorage.getItem(token_key)
    window.location=`update.html?login=${token_key}&id=${id}`
}
async function employeedata(){

    let params = new URLSearchParams(window.location.search)

    let id = params.get('id');
    console.log('id',id)

    let token_key = params.get('login');

    let token = localStorage.getItem(token_key);

    console.log("token",token)

    try {
        let response = await fetch(`/users/${id}`,{
            method : 'GET',
            headers : {
                'Authorization' : `Bearer ${token}`
            }
        })
        console.log("response",response);

        let parsed_response = await response.json();
        console.log("parsed_response: ",parsed_response);

        let data = parsed_response.data;
        console.log("data: ",data);


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
            container.innerHTML=view_employe;

        

    } catch (error) {
        console.log("error:",error);
    }
}
async function viewPort(){
    let params = new URLSearchParams(window.location.search)

    let id = params.get('id');
    console.log('id',id)

    let token_key = params.get('login');

    let token = localStorage.getItem(token_key);

    console.log("token",token)

    try {
        let response = await fetch(`/users/${id}`,{
            method : 'GET',
            headers : {
                'Authorization' : `Bearer ${token}`
            }
        })
        console.log("response",response);

        let parsed_response = await response.json();
        console.log("parsed_response: ",parsed_response);

        let data = parsed_response.data;
        console.log("data: ",data);


        let container = document.getElementById('Port');

            let view_employe = `
                  <div class=" d-flex main position-absolute top-50 start-50 translate-middle">
                        <div class="user-details p-4 pt-5 ">
                            <div class=" fw-bold link-light text-center fs-5 pt-5 nam">Name: ${data.username}</div>
                            <div class=" fw-bold link-light text-center pt-4 fs-5 nam">Email:${data.email}</div>
                            <div class=" fw-bold link-light text-center pt-4 fs-5 nam">User_type: ${data.user_type.user_type}</div>
                            <div class="text-center pt-3"><button onclick="resetuser ('${data._id}')" class="btn btn-secondary link-light px-3">Reset</button></div>
                        </div>
                        <div class="text-center pt-5  employee"><img src="https://img.freepik.com/free-vector/illustrated-business-person-meditating_23-2148908281.jpg?t=st=1728994299~exp=1728997899~hmac=77d6b9a8768609ce1202ce445a049ce23e31ed9679cb8ded918ce25ec5a95acf&w=740" class="user"></div>

                    </div>
            `
            container.innerHTML=view_employe;



    } catch (error) {
        console.log("error:",error);
    }
}
async function editusers() { //onload
    
    let params = new URLSearchParams(window.location.search);

    let id = params.get('id');

    let token_key = params.get('login');

    let token = localStorage.getItem(token_key)

    try {
        let response = await fetch(`/users/${id}`,{
            method: 'GET',
            headers: {
                'Authorization' : `Bearer ${token}`,
                "Content-Type" : "Application/json",
            }

        });
        console.log("response : ",response);

        let parsed_Response = await response.json();
        console.log("parsed_response",parsed_Response);

        let data = parsed_Response.data;
        console.log("data",data);

        let username = document.getElementById('username');
        username.value= data.username;

        let email = document.getElementById('email');
        email.value = data.email;

        let user_type =document.getElementById('user_type');
        user_type.value = data.user_type;

        


    } catch (error) {
        console.log("error",error);
    }
}
async function UpdateData(event){
        event.preventDefault()

        let  params = new  URLSearchParams(window.location.search);
        console.log("params",params);

        let id = params.get('id');

        let token_key = params.get('login');
        console.log("token_key",token_key);

        let token = localStorage.getItem(token_key);

        let username = document.getElementById('username').value
        let email = document.getElementById('email').value
        let user_type =document.getElementById('user_type').value
        // let password = document.getElementById('password');

        let data = {
            username,
            email,
            user_type
        }

        let strdata = JSON.stringify(data);


        try {
            let response = await fetch(`/user/${id}`,{
                method: 'PUT',
                headers: {
                    "Content-Type" : "Application/json",
                    "Authorization" : `Bearer ${token}`
                },
                body : strdata,
            })

            console.log('response',response);

            let parsed_Response = await response.json();
            console.log("parsed_response",parsed_Response);


            if(response.status===200){
                alert('Employee sucessfully Updated...');
                window.location = `admin.html?login=${token_key}`
            }else{
                alert('update failed')
            }
        } catch (error) {
            console.log('error',error);
        }
}
function resetuser(id){

    console.log("Reached at resetCall");
    let params = new URLSearchParams(window.location.search);

    let token_key = params.get('login');

    window.location = `resetpassword.html?login=${token_key}&id=${id}`;

}
async function userpassword(event){
    event.preventDefault();


    console.log("Reached at resetPassword");

    let params = new URLSearchParams(window.location.search);
    console.log("params" ,params)
    let token_key = params.get('login');
    console.log("token_key",token_key)
    let token = localStorage.getItem(token_key);
    console.log("token",token)
    let id = params.get('id');
    console.log("id",id)

    let password =document.getElementById('Password').value
    let newpassword= document.getElementById('newpassword').value

    let data ={
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
            body :str
        });

        console.log("response",response)

        let data = await response.json(); 
        console.log("Response data:", data);
    if(response.status===200){
        alert("password reset successfully...")
        window.location.href = "index.html";  
    }else{
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
async function sendemail(event){
    event.preventDefault()
    let email = document.getElementById('email').value

    let data ={
        email
    }

    let stringdata = JSON.stringify(data);
    console.log("data",stringdata);

    try {
        let forgot = await fetch('/forgot-password',{
            method: 'POST',
            headers : {
                'Content-Type' : 'application/json'

            },
            body : stringdata
        });
        console.log("forgot",forgot);

        if(forgot.status === 200){
            alert("email sending successfully....")
        }else{
            alert("email sending failed")
        }
        
    } catch (error) {
        console.log("errror",error);
    }

}
async function forgot(event){
    event.preventDefault()
    let password = document.getElementById('password').value

    let datas ={
        password
    }

    let strdata = JSON.stringify(datas);
    console.log("strdata",strdata);

    let params = new URLSearchParams(window.location.search)

    let token = params.get('token')
    try {
        let forgot_reset = await fetch('/reset-password',{
            method:'PATCH',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
            body:strdata
        })

        console.log('forgot_reset',forgot_reset);

        if(forgot_reset.status === 200){
            alert("password reset successfully....")
            window.location.href=`index.html`
        }else{
            alert("password reset fail...")
        }
    } catch (error) {
        console.log('error',error);
    }

}

