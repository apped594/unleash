
// document.addEventListener('DOMContentLoaded', () => {
//     // Check if token exists in localStorage
//     const token = localStorage.getItem('token');

//     if (token) {
//         // Redirect to home page if token exists
//         window.location.href = '/home.html';
//     }
// })

///// Allows all the open modals to collapse when n navigation type button is clicked

const alertMessagesColour = "#d40f0f";
const closeAllModals = ()=>{

    const buttons = document.querySelectorAll(".navbtn");

    buttons.forEach(button =>{

    button.addEventListener("click", e=> {

        let modals = document.getElementsByClassName("loginPageOpen")

        Array.from(modals).forEach(m =>{
            m.classList.remove("loginPageOpen")
        });
    })
})

}


const closeAllInfoModals = ()=>{

    const buttons = document.querySelectorAll(".navbtn");

    buttons.forEach(button =>{

    button.addEventListener("click", e=> {

        let modals = document.getElementsByClassName("infoModalsOpen")

        Array.from(modals).forEach(m =>{
            m.classList.remove("infoModalsOpen")
        });
    })
})

}
closeAllModals()
closeAllInfoModals()





///// This assigns a click event to open up the loginPage to all the buttons that needs to go to the login screen

const loginButtonarr = document.getElementsByClassName("loginButton")

for(let i = 0; i < loginButtonarr.length;i++) {
    loginButtonarr[i].addEventListener("click", e=>{
        document.getElementById("loginPage")
        .classList.add("loginPageOpen")
        loginEmail.value = "";
        loginPassword.value = "";
        loginPassword.type ="password";
    })
}

///// This adds a event listenere to all the registe nav buttons that need to go to the register page

const registerButtonarr = document.getElementsByClassName("registerButton")

for(let i = 0; i < registerButtonarr.length;i++) {

    registerButtonarr[i].addEventListener("click", e=>{
        
        document.getElementById("registerPageConfirmEmail")
        .classList.add("loginPageOpen")
        emailInput.value = "";
        loginPassword.type ="password";
        firstName.value = "";
    })
}



///// Confirm Email
const emailInput = document.getElementById("createEmail")
const continueButton = document.getElementById("continue")
const otpInput = document.getElementById("otp")
const otpSubmitButton = document.getElementById("otpSubmit")
const OTPMessage = document.getElementById("emailTo")
let OTP = "";

continueButton.addEventListener("click",async e=>{
    e.preventDefault();
    
  try {

    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    let enterEmailMessage = document.getElementById("enterEmailMessage")
    if (!emailRegex.test(emailInput.value)) {
        enterEmailMessage.innerText = "Email not valid"
        enterEmailMessage.style.color = alertMessagesColour
        emailInput.value="";
        return
        }
        enterEmailMessage.innerText="Step 1/3";
    document.getElementById("otpPage")
    .classList.add("loginPageOpen")
    OTPMessage.innerText=`OTP - ${emailInput.value}`
    OTPMessage.style.color = alertMessagesColour 
    duplicateEmailModal.classList.remove("infoModalsOpen")

    OTP = await createOTP()
    
    await sendOTP(baseURL,OTP)
    
  } catch (error) {
    console.log(error)
    
  }
    
    

})

const createOTP = async()=>{
   return String(Math.floor(1000 + Math.random() * 9000));

}

const baseURL = "http://localhost:6500/api/v1/otp/";

const sendOTP = async (baseURL,otp)=>{

    try {

        const res = await fetch(baseURL,{

            method: "POST",
            mode: "cors",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"OTP": otp})
        })
        
    } catch (error) {
        console.log(error)
        
    }

    

}



otpSubmitButton.addEventListener("click", e=>{

    
      if (OTP !== otpInput.value) {

    
    OTPMessage.innerText='Invalid OTP'
    document.getElementById("emailTo").style.color = alertMessagesColour
    otpInput.value="";

     return

     }

    document.getElementById("registerPageCreatePassword")
    .classList.add("loginPageOpen")
    otpInput.value="";
    document.getElementById("otpPage")
    .classList.remove("loginPageOpen")
    document.getElementById("registerPageConfirmEmail")
    .classList.remove("loginPageOpen")
    
})

const otpResendButton = document.getElementById("otpResend")

otpResendButton.addEventListener("click", async e=>{
    e.preventDefault();

    OTPMessage.innerText=`OTP - ${emailInput.value}`
    OTPMessage.style.color = alertMessagesColour

    try {

        OTP = await createOTP();
        await sendOTP(baseURL,OTP)

    
        
    } catch (error) {
        console.log(error);
    }

    
    
    
    
    
})

/////Password created

const completeRegistrationButton = document.getElementById("completeRegistration")
const loginMessage = document.getElementById("loginMessage")
const firstName = document.getElementById("name")
const createPasswordInput = document.getElementById("createPassword")
const confirmPasswordInput = document.getElementById("confirmPassword")
const completeAccountMessage = document.getElementById("completeAccountMessage")
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const createPasswordToggle = document.getElementById("createPasswordToggle")
const confirmPasswordToggle = document.getElementById("confirmPasswordToggle")

createPasswordToggle.addEventListener("click",e=>{
    createPasswordInput.type = "text";

})

confirmPasswordToggle.addEventListener("click",e=>{
    confirmPasswordInput.type = "text";

})

const passwordInfoButton = document.getElementById("passwordInfoButton")
const passwordRequirementsPage = document.getElementById("passwordRequirementsPage")


passwordInfoButton.addEventListener("click",e=>{

    passwordRequirementsPage.classList.add("infoModalsOpen")

    const closePasswordRequirementsButton = document.getElementById("closePasswordRequirementsButton")

    closePasswordRequirementsButton.addEventListener("click",e=>{
        passwordRequirementsPage.classList.remove("infoModalsOpen")
    })
})

completeRegistrationButton.addEventListener("click", async e=>{

    e.preventDefault();
    

    if (!createPasswordInput.value || !firstName.value){

        completeAccountMessage.innerText = "Name and Password Required"
        completeAccountMessage.style.color = alertMessagesColour
        return
    }
    if (!passwordRegex.test(createPassword.value)) {
        completeAccountMessage.innerText = "Password Not Strong Enough"
        completeAccountMessage.style.color = alertMessagesColour
        createPasswordInput.value="";
        confirmPasswordInput.value="";
        return
        }

    if (createPasswordInput.value !== confirmPasswordInput.value){

        completeAccountMessage.innerText = "Passwords Do Not Match"
        completeAccountMessage.style.color = alertMessagesColour;
        return
    }


     await registerUser(registerURL,{"name": firstName.value,"email": emailInput.value,"password": createPasswordInput.value})

     

})
const duplicateEmailModal = document.getElementById("duplicateEmailModal")

const registerURL = "http://localhost:6500/api/v1/auth/register"

const registerUser = async (url,user)=>{

    try {

        const res = await fetch(url, {
            method: "POST",
            mode: "cors",
            headers:{
                "Content-Type": "application/json"
            },

            body: JSON.stringify(user)
        })

        const result = await res.json()
        console.log(result)

        if (res.ok) {
            // Store the token in localStorage or sessionStorage
            localStorage.setItem('token', result.token); // Example using localStorage

            // Optionally, perform additional actions upon successful registration
            console.log('Registration successful:', result);

            document.getElementById("registerPageCreatePassword")
            .classList.remove("loginPageOpen")

            loginMessage.innerText =`Please Login ${firstName.value}`
            loginMessage.style.color = alertMessagesColour
     
            createPasswordInput.type = "password";
            confirmPasswordInput.type = "password";
            loginEmail.value = "";
            loginPassword.value = "";

            firstName.value = "";
            createPasswordInput.value = "";
            confirmPasswordInput.value = "";
            emailInput.value = "";
            loginPassword.type = "password"
    

            document.getElementById("loginPage")
            .classList.add("loginPageOpen")

            // Redirect or update UI as needed
            // Example: Redirect to home.html after registration
            
         } else {

            
            if (result.msg === "Duplicate value entered for email field") {

                duplicateEmailModal.classList.add("infoModalsOpen")

                document.getElementById("duplicateEmailMessage").innerText = `${emailInput.value} already exist`
                document.getElementById("duplicateEmailMessage").style.color = alertMessagesColour;


    
            }

         }

    } catch (error) {
        console.error('Error during registration:', error);

        
    }
};



const loginURL = "http://localhost:6500/api/v1/auth/login";
 

const loginUser = async(url,user)=>{

    try {

        const token = localStorage.getItem('token');
        const res = await fetch(url,{

            method: "POST",
            mode: "cors",
            headers:{

                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`

            },
            body: JSON.stringify(user)

        })

        const result = await res.json();
        console.log(result)
        if (res.ok) {
            // Update token in localStorage with new token received from login
            localStorage.setItem('token', result.token);
            
            // Optionally, perform actions upon successful login
            console.log('Login successful:', result);

            // Redirect or update UI as needed
            // Example: Redirect to home.html after successful login
            window.location.href = '/home.html';
            firstName.value = "";
            createPasswordInput.value = "";
            confirmPasswordInput.value = "";
            emailInput.value = "";
            loginPassword.type = "password"
            duplicateEmailModal.classList.remove("infoModalsOpen")
            
        } else {
            loginMessage.innerText = result.msg
            loginMessage.style.color = alertMessagesColour;
        }

    } catch (error) {
        console.error('Error during login:', error);
    }


}


const submitLoginButton = document.getElementById("submitLoginButton")
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword")
const loginPasswordToggle = document.getElementById("loginPasswordToggle")

loginPasswordToggle.addEventListener("click", e=>{
    loginPassword.type ="text";
})

submitLoginButton.addEventListener("click", async e=>{
    
    e.preventDefault();

    if (!loginEmail.value || !loginPassword.value){
    loginMessage.innerText = 'Supply email and Password'
     loginMessage.style.color = alertMessagesColour
        
        return
    }

    await loginUser(loginURL,{"email": loginEmail.value,"password": loginPassword.value})

}) 















