
const protocol = "http://"
const domain = "localhost:"
const port = "6500"
const endPointBase = "/api/v1/"
const profileEndpointURL = `${protocol}${domain}${port}${endPointBase}profile`;
const userAngelsEndpointURL = `${protocol}${domain}${port}${endPointBase}userAngels`;
const modalsBackDrop = document.getElementById("modalsBackDrop")

// const getLocationButton = document.getElementById('getLocationButton');
// const mapElement = document.getElementById('map');
// let map;

// const dangerButton = document.getElementById("dangerButton")
// const medicalButton = document.getElementById("medicalButton")
// const progressBar = document.getElementById("progressBar")
// const panicStatustext = document.getElementById("panicStatustext")
// const locationText = document.getElementById('myApproximateLocation');
// let interval;
// let progress = 0;
// const updateInterval = 100; // ms
// const totalHoldTime = 3000; // ms
// const incrementValue = (updateInterval / totalHoldTime) * 100; // 2%


// Function to initialize the map centered on the user's location
// const initializeMap = (latitude, longitude) => {
//     const userLocation = { lat: latitude, lng: longitude };
//     map = new google.maps.Map(mapElement, {
//         center: userLocation,
//         zoom: 15
//     });
//     new google.maps.Marker({
//         position: userLocation,
//         map: map,
//         title: "You are here"
//     });
// };

// Function to get the user's location
// const getUserLocation = async () => {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(async (position) => {
//             const { latitude, longitude } = position.coords;

//             // Log coordinates
//             console.log('Coordinates:', { lat: latitude, lng: longitude });

//             // Initialize the map centered on the user's location
//             initializeMap(latitude, longitude);

//             // Reverse Geocoding to get the address
//             const geocoder = new google.maps.Geocoder();
//             const latlng = { lat: latitude, lng: longitude };
//             geocoder.geocode({ location: latlng }, (results, status) => {
//                 if (status === 'OK') {
//                     if (results[0]) {
//                         const address = results[0].formatted_address;
//                         console.log('Address:', address);

//                         // Log Google Maps URL
//                         const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
//                         console.log('Google Maps URL:', googleMapsUrl);
//                     } else {
//                         console.log('No results found');
//                     }
//                 } else {
//                     console.log('Geocoder failed due to:', status);
//                 }
//             });

//         }, (error) => {
//             console.error('Error getting location', error);
//         });
//     } else {
//         console.log('Geolocation is not supported by this browser.');
//     }
// };







// Get User Personal Info

/**
 * Function to retrieve user information from the server and populate the UI
 * @param {string} url - The URL for the API endpoint to fetch user information
 * @returns {object} - An object containing the success status and any relevant messages or data
 */
const getUserInfo = async (url = profileEndpointURL) => {
    try {
        // Retrieve the token from local storage
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            return { success: false, message: "No token found" };
        }

        // Make the GET request to the API
        const res = await fetch(url, {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        // Check if the response is OK (status 200-299)
        if (!res.ok) {
            throw new Error(`Failed to fetch user info with status: ${res.status}`);
        }

        const result = await res.json();
        
        // Ensure that the result contains the expected data
        if (!result || typeof result !== 'object') {
            throw new Error("Unexpected response format or empty response");
        }

        console.log(result);

        // Populate user information in the UI
        await populateUserPersonalInformation(result);

        return { success: true, message: "User information retrieved successfully", data: result };

    } catch (error) {
        console.error("Error getting user info", error);
        return { success: false, message: "Error getting user info", error };
    }
};

/**
 * Function to update the user's personal information on the server
 * @param {string} url - The URL for the API endpoint to update user information
 * @param {object} obj - The object containing the updated user information
 * @returns {object} - An object containing the success status and any relevant messages or data
 */
const updateUserPersonalInformation = async (url = profileEndpointURL, obj) => {
    try {
        // Validate the input object
        if (!obj || typeof obj !== 'object') {
            throw new Error("Invalid input object");
        }

        // Retrieve the token from local storage
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            return { success: false, message: "No token found" };
        }

        // Make the PATCH request to the API
        const res = await fetch(url, {
            method: "PATCH",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(obj)
        });

        // Check if the response is OK (status 200-299)
        if (!res.ok) {
            throw new Error(`Failed to update user info with status: ${res.status}`);
        }

        // Parse the JSON response
        const result = await res.json();
        if (!result || typeof result !== 'object') {
            throw new Error("Unexpected response format or empty response");
        }



        console.log(result);

        // Return success message
        return { success: true, message: "User information updated successfully", data: result };

    } catch (error) {
        console.error("Error updating user info", error);
        return { success: false, message: "Error updating user info", error };
    }
};

const firstName = document.getElementById("name")
const contactNumber = document.getElementById("contactNumber")
const idNumber = document.getElementById("idNumber")

const updatePersonalInformationButton = document.getElementById("updatePersonalInformationButton")
const nameTitle = document.getElementById("userFirstName")

/**
 * Function to populate the user's personal information in the UI
 * @param {object} result - The object containing the user's personal information
 */
const populateUserPersonalInformation = async (result) => {
    try {
        // Check if the result object is valid
        if (!result || typeof result !== 'object') {
            throw new Error("Invalid result object");
        }

        
        // Populate the UI with the retrieved user information
        firstName.value = result.name;
        contactNumber.value = result.contactNumber;
        idNumber.value = result.idNumber;
        
        nameTitle.innerText = firstName.value;

        console.log("User personal information populated successfully");

    } catch (error) {
        console.error("Error populating user personal information", error);
    }
};

// Event listener for the "Update" button click event
updatePersonalInformationButton.addEventListener("click", async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
        // Prepare the data object to be sent to the server
        const updatedData = {
            name: firstName.value,
            contactNumber: contactNumber.value,
            idNumber: idNumber.value,
            
        };

        // Call the function to update the user's personal information
        const result = await updateUserPersonalInformation(profileEndpointURL, updatedData);

        // Check if the update was successful
        if (result.success) {
            // Update the displayed name in the UI
            nameTitle.innerText = firstName.value;
            alert("Personal information updated successfully");
        } else {
            // Handle the case where the update failed
            alert(`Failed to update personal information: ${result.message}`);
        }
    } catch (error) {
        // Log any unexpected errors that occur during the process
        console.error("Error updating personal information", error);
        alert("An unexpected error occurred while updating personal information");
    }
});


/**
 * Function to get all locations for a user
 * @param {string} url - The base URL for the API endpoint
 * @returns {Array} - An array containing success status and the locations or an error message
 */
const getUserAngels = async(url=userAngelsEndpointURL)=> {

    try {

        const token = localStorage.getItem("token")
        //Make msure we get the token
        if (!token) {
            console.error("No token found");  
            return;
        }

        const res = await fetch(url,{

            method: "GET",
            mode: "cors",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        let result = await res.json()

        // Check if result.locations is defined and is an array
        if (result.angels && Array.isArray(result.angels)) {
            await renderAngels(result.angels);
            return result
        } else {
            console.error("Invalid angels data received", result);
        }
        
    } catch (error) {
        console.error("error geting user info",error)
        
    }

};

/**
 * Function to create a new user location
 * @param {string} url - The base URL for the API endpoint
 * @param {Object} data - The data for the new location
 * @returns {Object} - An object containing success status and the created location or an error message
 */

const createAngels = async(userAngelsEndpointURL,data)=>{

    try {
        
        // Retrieve the token from local storage
        const token = localStorage.getItem("token")
        if (!token) {
            console.error("No token found");
            return { success: false, message: "No token found" };
        }

        // Make the POST request to the API
        const res = await fetch(userAngelsEndpointURL,{
            method: "POST",
            mode:"cors",
            headers:{
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                    },
            body:JSON.stringify(data)
        })


        // Check if the response is OK (status 200-299)
        if (!res.ok) {
            throw new Error(`Failed to create angel with status: ${res.status}`);
        }

        // Parse the response JSON
        const result = await res.json();
        console.log("angel created:", result);

        await renderAngels([result.angel], true);
        
        return { success: true, angel: result.angel, message: "Angel created successfully" };
        
        // await getUserLocations()
            
    } catch (error) {
        console.error("error creating angel",error)
        return { success: false, message: "Error creating angel", error };
    }
};


/**
 * Function to update an existing user location
 * @param {string} url - The base URL for the API endpoint
 * @param {Object} data - The data to update the location with
 * @param {string} id - The ID of the location to be updated
 * @returns {Object} - An object containing success status and the updated location or an error message
 */
const updateAngel = async (url = userAngelsEndpointURL, data, id) => {
    try {
        // Retrieve the token from local storage
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            return { success: false, message: "No token found" };
        }

        // Make the PATCH request to the API
        const res = await fetch(`${url}/${id}`, {
            method: "PATCH",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        // Check if the response is OK (status 200-299)
        if (!res.ok) {
            throw new Error(`Failed to update location with status: ${res.status}`);
        }

        // Parse the response JSON
        const result = await res.json();
        console.log("Location updated:", result);

    
        return { success: true, angel: result.angel, message: "Angel updated successfully" };
    } catch (error) {
        console.error("Error updating Angel", error);
        return { success: false, message: "Error updating Angel", error };
    }
};


/**
 * Function to update the specific angel in the DOM
 * @param {Object} angel - The updated angel object
 */
const updateAngelInDOM = (angel) => {
    const angelElement = document.querySelector(`[data-id='${angel._id}']`).closest('.singleLocationContainer');
    if (angelElement) {
        const label = angelElement.querySelector('.myAngelsLabels');
        const contactNumberInput = angelElement.querySelector('input[name="updatecontactNumber"]');

        // Update the display name and contact number in the DOM
        if (label) {
            label.innerText = angel.displayName;
        }
        if (contactNumberInput) {
            contactNumberInput.value = angel.contactNumber;
        }
    }
};

// Send Panic To Angles Function

// Function to get the user's location and send the panic SMS
// const sendPanicSMS = async (url = `${protocol}${domain}${port}${endPointBase}sendPanicSMS`,panicData) => {
//     // const message = `I need your help! My current location is: ${googleMapsUrl}`;
    
//     try {

        
//         const token = localStorage.getItem("token");

//         if (!token) {
//             throw new Error("No token found");
//         }

//         const getAngelsResponse = await fetch(userAngelsEndpointURL,{

//             method: "GET",
//             mode: "cors",
//             headers:{
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${token}`
//             }
//         })

//         if (!getAngelsResponse.ok) {
//             throw new Error(`HTTP error! status: ${getAngelsResponse.status}`);
//         }

//         let angelsData =  await getAngelsResponse.json()
//         // console.log(angelsData)

//         if (angelsData.angels && Array.isArray(angelsData.angels)) {

//             const sendPanicSMSResponse = await fetch(url, {
//                 method: 'POST',
//                 mode: 'cors',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: JSON.stringify({panicData,angelsData})
//             });
//             console.log({panicData,angelsData})
    
//             const responseText = await sendPanicSMSResponse.text();  // Get the raw text response
    
//             try {
//                 const result = JSON.parse(responseText);  // Attempt to parse the response as JSON
//                 if (result.success) {
//                     console.log("Panic SMS sent successfully:", result.message);
//                 } else {
//                     throw new Error(result.message || "Failed to send Panic SMS");
//                 }
//             } catch (jsonParseError) {
//                 console.error("Error parsing JSON response:", jsonParseError);
//                 console.error("Raw response:", responseText);  // Log the raw response for debugging
//                 throw new Error("Invalid JSON response from server");
//             }

//         }

//     } catch (error) {
//         console.error("Error sending panic SMS:", error.message);
//     }
// };


/**
 * Function to delete a user angel
 * @param {string} url - The base URL for the API endpoint
 * @param {string} id - The ID of the angel to be deleted
 * @returns {Object} - An object containing success status and a message
 */
const  deleteAngel = async(url=userAngelsEndpointURL,id)=>{

    try {

        // Retrieve the token from local storage
        const token = localStorage.getItem("token")
        if (!token) {
            console.error("No token found");
            return;
        }

        // Make the DELETE request to the API
        const res = await fetch(`${url}/${id}`,{
            method: "DELETE",
            mode:"cors",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }, 
        });

        // Check if the response is OK (status 200-299)
        if (!res.ok) {
            throw new Error(`Failed to delete angel with status: ${res.status}`);
        }

        console.log(`angel with id ${id} deleted successfully`);

        

        // Return success message
        return { success: true, message: "angel deleted successfully" };

    } catch (error) {
        console.error("error deleting angel",error)
        return { success: false, message: "Error deleting angel", error };

    }
 };





  /**
 * Function to render angels
 * @param {Array} angelsArr - The array of angels to render
 * @param {Boolean} append - Flag to indicate if we should append to the existing list or replace it
 */
  const renderAngels = async (angelsArr, append = false) => {
    const myAngelsWrapper = document.getElementById("myAngelsWrapper");

    if (!append) {
        myAngelsWrapper.innerHTML = ''; // Clear existing locations only if not appending
    }

    angelsArr.forEach(angel => {

        const singleAngelContainer = document.createElement("div");
        singleAngelContainer.classList.add("singleAngelContainer");
        singleAngelContainer.innerHTML = `
            <p class="myAngelsLabels">${angel.displayName}</p>
            <button class="view-angel viewAngelsButton" data-id="${angel._id}">View</button>
        `
        myAngelsWrapper.appendChild(singleAngelContainer);
        
        // Create and configure the modal for each location
        const viewAngelModal = document.createElement('div');
        viewAngelModal.classList.add('addAngelsModal');
        viewAngelModal.id = `modal_${angel._id}`; // Unique ID for the modal
    

        // Add modal content
        const modalTitle = document.createElement("p");
        modalTitle.innerText = "Angel Details";

        const userAngelForm = document.createElement("form");
        userAngelForm.method = "dialog"; // Closes the dialog when submitted

        const updateDisplayNameInput = document.createElement("input");
        updateDisplayNameInput.classList.add("form-inputs");
        updateDisplayNameInput.name = "updateDisplayName";
        updateDisplayNameInput.placeholder = "Display Name";
        updateDisplayNameInput.value = angel.displayName;

        const updateAngelContactNumberInput = document.createElement("input");
        updateAngelContactNumberInput.classList.add("form-inputs");
        updateAngelContactNumberInput.name = "updateAngelContactNumber";
        updateAngelContactNumberInput.placeholder = "contact number";
        updateAngelContactNumberInput.value = angel.contactNumber;

        const updateUserAngelButton = document.createElement("button");
        updateUserAngelButton.dataset.id = angel._id;
        updateUserAngelButton.classList.add("appActionButton", "appActionButtonNormal", "productActionButtons");
        updateUserAngelButton.type = "submit";
        updateUserAngelButton.innerText = "Update";

        const deleteUserAngelButton = document.createElement('button');
        deleteUserAngelButton.dataset.id = angel._id;
        deleteUserAngelButton.classList.add("appActionButton", "dangerousButtons","productActionButtons");
        deleteUserAngelButton.innerText = "Delete";


        // Create additional elements for spacing and close button
        
        const br = document.createElement("br")
        const closeUserAngelModalButton = document.createElement("button");
        closeUserAngelModalButton.classList.add("appActionButton", "closeModalButtons");
        closeUserAngelModalButton.type = "button";
        closeUserAngelModalButton.innerText = "Close";


         // Append elements to the form
         userAngelForm.appendChild(updateDisplayNameInput);
         userAngelForm.appendChild(updateAngelContactNumberInput);
         userAngelForm.appendChild(updateUserAngelButton);
         userAngelForm.appendChild(br.cloneNode()); // Append a clone of the br element
         userAngelForm.appendChild(br.cloneNode()); // Append a clone of the br element
         userAngelForm.appendChild(deleteUserAngelButton);
         userAngelForm.appendChild(br.cloneNode()); // Append a clone of the br element
         userAngelForm.appendChild(br.cloneNode()); // Append a clone of the br element
         userAngelForm.appendChild(br.cloneNode()); // Append a clone of the br element
         userAngelForm.appendChild(closeUserAngelModalButton);

        // Append form and title to the modal
        viewAngelModal.appendChild(modalTitle);
        viewAngelModal.appendChild(userAngelForm);

        // Append the modal to the document
        document.body.appendChild(viewAngelModal);

        // Add event listener to the "View" button
        const viewAngelButton = singleAngelContainer.querySelector('.view-angel')
        viewAngelButton.addEventListener('click', () => {
        modalsBackDrop.style.display = "block";
        viewAngelModal.style.display = "block";
        
        });

        // Handle form submission for updating the angel
        userAngelForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission
            // const instanceKey = `location_${angel._id}`
            // if (!placeSelected[instanceKey]) {
            //     alert('Please select a valid address from the suggestions.');
            //     updateAddressInput.value = '';
            //     return;
            // }
            // if (!placeDetails[instanceKey]) {
            //     alert('Unexpected error: Place details not found.');
            //     return;
            // }

            try{

                // const address = placeDetails[instanceKey].formatted_address;
                // const coordinates = {
                //     lat: placeDetails[instanceKey].geometry.location.lat(),
                //     lng: placeDetails[instanceKey].geometry.location.lng()
                // }

                const data = {
                    displayName: updateDisplayNameInput.value,
                    contactNumber: updateAngelContactNumberInput.value,
                    // coordinates: coordinates
                }

                // Call updateLocation function and handle the result
                const result = await updateAngel(userAngelsEndpointURL, data, updateUserAngelButton.dataset.id);
                if (result.success) {
                    modalsBackDrop.style.display = "none";
                    viewAngelModal.style.display = "none";
                    alert(result.message);
                } else {
                    alert(`Failed to update location: ${result.message}`);
                }

               
            }catch (error) {
                console.error("Error updating location", error);
            }
        });

        
        deleteUserAngelButton.addEventListener("click", async (e) => {
            try {
              const result = await deleteAngel(userAngelsEndpointURL, deleteUserAngelButton.dataset.id);
              if (result.success) {
                // Hide modal and backdrop on success
                modalsBackDrop.style.display = "none";
                viewAngelModal.style.display = "none";
                // Find and remove the corresponding location element from the DOM
                const angelElement = document.querySelector(`[data-id="${deleteUserAngelButton.dataset.id}"]`).closest('.singleAngelContainer');
            if (angelElement) {
                angelElement.remove();
            }
                // Display success message
                alert(result.message);
            } else {
                // Display error message on failure
                alert(`Failed to delete location: ${result.message}`);
            }
            } catch (error) {
              console.error("error deleting location", error);
            }
          });

        closeUserAngelModalButton.addEventListener("click", () => {
            modalsBackDrop.style.display = "none";
            viewAngelModal.style.display = "none";
        });
               
  });

};

//  Complete profile prompts

const completeUserProfileAlertModal = document.getElementById('completeUserProfilAlertModal');
const personalInformationAlertButton = document.getElementById('personalInformationAlertButton');
const angelInformationAlertButton = document.getElementById('angelInformationAlertButton');
const skipCompleteProfileButton = document.getElementById('skipCompleteProfileButton');

// Function to check if the profile has been completed in order to request a quote
const isUserProfileComplete = async()=>{

    try {

        const token = localStorage.getItem("token")
        const userPersonalInfoRes = await fetch(profileEndpointURL,{
            method: "GET",
            mode: "cors",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

        const userPersonalInfoResult = await userPersonalInfoRes.json()
        
        
        const userAngelsRes = await fetch(userAngelsEndpointURL,{
            method: "GET",
            mode: "cors",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

        const  userAngelsResult = await userAngelsRes.json()

        console.log(userAngelsResult.angels.length)

        if(userAngelsResult.angels.length == 0   || userPersonalInfoResult.contactNumber === "" || userPersonalInfoResult.idNumber === "" )
            
        {
            modalsBackDrop.style.display = "block"
            completeUserProfileAlertModal.style.display= "block"
            return false


        }else{
            return true
        }
        
    } catch (error) {
        console.error("error geting user info",error)
        
    }

}
    


personalInformationAlertButton.addEventListener("click",e =>{

resetProfilePage()
profilePage.classList.add("menuPageOpen")
userInfoSection.classList.add("profileSectionOpen")
modalsBackDrop.style.display = "none"
completeUserProfileAlertModal.style.display = "none";

})

angelInformationAlertButton.addEventListener("click", e=>{

resetProfilePage()
profilePage.classList.add("menuPageOpen")
removeProfileContainerVisibleStates()
removeProfileContainerButtonsActiveState()
userInfoSection.classList.add("profileSectionOpen")
userAngelsContainer.classList.add("visibleState")
userAngelsButton.classList.add("activeFilterState")
modalsBackDrop.style.display = "none"
completeUserProfileAlertModal.style.display = "none";

})
    

skipCompleteProfileButton.addEventListener('click', () => {
    modalsBackDrop.style.display = "none"
    completeUserProfileAlertModal.style.display = "none";
});


 // Function to get the user's location
//  const getUserLocation = async () => {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(async (position) => {
//             const { latitude, longitude } = position.coords;

//             // Log coordinates
//             console.log('Coordinates:', { lat: latitude, lng: longitude });

//             // Initialize the map centered on the user's location
//             // initializeMap(latitude, longitude);

//             // Reverse Geocoding to get the address
//             const geocoder = new google.maps.Geocoder();
//             const latlng = { lat: latitude, lng: longitude };
//             geocoder.geocode({ location: latlng }, (results, status) => {
//                 if (status === 'OK') {
//                     if (results[0]) {
//                         const address = results[0].formatted_address;
//                         console.log('Address:', address);
//                         locationText.textContent = `${address}`; // Update location text
//                         // Log Google Maps URL
//                         const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
//                         console.log('Google Maps URL:', googleMapsUrl);
//                     } else {
//                         console.log('No results found');
//                     }
//                 } else {
//                     console.log('Geocoder failed due to:', status);
//                 }
//             });

//         }, (error) => {
//             console.error('Error getting location', error);
//         });
//     } else {
//         console.log('Geolocation is not supported by this browser.');
//     }
// };




// const getUserLocation = async () => {

//     try {
//         if (!navigator.geolocation) {
//             throw new Error('Geolocation is not supported by this browser.');
//         }

//         // Use a promise wrapper to await the geolocation API
//         const position = await new Promise((resolve, reject) => {
//             navigator.geolocation.getCurrentPosition(resolve, reject);
//         });

//         const { latitude, longitude } = position.coords;

//         // Initialize the geocoder and perform reverse geocoding
//         const geocoder = new google.maps.Geocoder();
//         const latlng = { lat: latitude, lng: longitude };

//         // Use a promise wrapper to await the geocoding result
//         const results = await new Promise((resolve, reject) => {
//             geocoder.geocode({ location: latlng }, (results, status) => {
//                 if (status === 'OK' && results[0]) {
//                     resolve(results[0]);
//                 } else {
//                     reject('Geocoder failed or no results found');
//                 }
//             });
//         });

//         const address = results.formatted_address;
//         const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

//         // Update location text
//         locationText.textContent = address;

//         // Return the location data
//         return { address, googleMapsUrl };

//     } catch (error) {
//         console.error(error.message);
//         throw error;  // Re-throw the error so it can be handled by the caller
//     }
// };







document.addEventListener("DOMContentLoaded", async()=>{


    

    //////////////////////

    // Initialize the fixed input field for adding locations
    const userAddAngelForm = document.getElementById('userAddAngelsForm');
    const userAngelDisplayNameInput = document.getElementById("userAngelDisplayNameInput");
    const userAngelContactNumberInput = document.getElementById("userAngelContactNumberInput");
    const openUserAngelsButton = document.getElementById("openUserAngelsButton");
    const modalsBackDrop = document.getElementById("modalsBackDrop");
    const userAddAngelsModal = document.getElementById("userAddAngelsModal");
    const closeAddUserAngelsModal = document.getElementById('closeAddUserAngelsModal');


    // Open the modal when the open button is clicked
    openUserAngelsButton.addEventListener('click', () => {
        modalsBackDrop.style.display = "block";
        userAddAngelsModal.style.display ="block";
    
  
    });

    // Close the modal when the close button is clicked
    closeAddUserAngelsModal.addEventListener('click', () => {
        modalsBackDrop.style.display = "none";
        userAddAngelsModal.style.display = "none";
    });

     // Handle the form submission for adding locations
     userAddAngelForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // if (!placeSelected[fixedInputKey]) {
            
        //     alert('Please select a valid address from the suggestions.');
        //     userLocationAddressInput.value = '';
        //     return;
        // }

        // if (!placeDetails[fixedInputKey]) {

        //     alert('Unexpected error: Place details not found.');
        //     return;
        // } 
        
        
        //   Preperaing the data object we will be sending in the body to create this location
        try {

            // const address = placeDetails[fixedInputKey].formatted_address;
            // const coordinates = {
            //     lat: placeDetails[fixedInputKey].geometry.location.lat(),
            //     lng: placeDetails[fixedInputKey].geometry.location.lng()
            // };


            //   Preperaing the data object we will be sending in the body to create this location
            const data = {
                displayName: userAngelDisplayNameInput.value,
                contactNumber: userAngelContactNumberInput.value,
                // coordinates: coordinates
            };

            //Send data to the server
            const result = await createAngels(userAngelsEndpointURL, data);
            if (result.success) {
                // Reset form inputs
                userAngelDisplayNameInput.value = "";
                userAngelContactNumberInput.value = "";
                modalsBackDrop.style.display = "none";
                userAddAngelsModal.style.display = "none";
                alert(result.message);
            } else {
                alert(`Failed to create angel: ${result.message}`);
            }

        }catch (error) {
            console.error("Error creating angel", error);
        }


        
    })

   

    await getUserInfo()
    await getUserAngels()
    await  isUserProfileComplete()

})





// Menu page and Buttons

const menuButton = document.getElementById("menuButton")
const menuPage = document.getElementById("menuPage")
const closeMenuButton = document.getElementById("closeMenuButton")

menuButton.addEventListener("click",e=>{

    menuPage.classList.add("menuPageOpen")

})

closeMenuButton.addEventListener("click", e=>{
    menuPage.classList.remove("menuPageOpen")
})

// Notification page and button

const notificationsButton = document.getElementById("notificationsButton")
const notificationsPage = document.getElementById("notificationsPage")
const closeNotificationsButton = document.getElementById("closeNotificationsButton")

notificationsButton.addEventListener("click",e=>{

    notificationsPage.classList.add("menuPageOpen")

})

closeNotificationsButton.addEventListener("click", e=>{
    notificationsPage.classList.remove("menuPageOpen")
})

// PROFILE PAGE----------------------------------------------------------------------------
//-----

const profileButton = document.getElementById("profileButton")
const profilePage = document.getElementById("profilePage")
const closeProfileButton = document.getElementById("closeProfileButton")

const userInfoSection = document.getElementById("userInfoSection")
const personalProfileFilter = document.getElementById("personalProfileFilter")

const userInformationContainer = document.getElementById("userInformationContainer")
const userAngelsContainer = document.getElementById("userAngelsContainer")

const userInfoButton = document.getElementById("userInfoButton")
const userAngelsButton = document.getElementById("userAngelsButton")

const closeAllProfileFilterPages =()=>{

    let modals = document.getElementsByClassName("profileSectionOpen")

    Array.from(modals).forEach(m =>{
        m.classList.remove("profileSectionOpen")
    }); 
    
}

const removeProfileTypeFilterButtonsActiveState = ()=>{

    let filterButtons = document.getElementsByClassName("profileTypeActiveFilterState")
    
    Array.from(filterButtons).forEach(m =>{
        m.classList.remove("profileTypeActiveFilterState")
        
    });
    
    }

    const resetProfilePage = ()=>{

        closeAllProfileFilterPages()
        removeProfileTypeFilterButtonsActiveState()
        removeProfileContainerVisibleStates()
        removeProfileContainerButtonsActiveState()
        personalProfileFilter.classList.add("profileTypeActiveFilterState")
        userInformationContainer.classList.add("visibleState")
        userInfoButton.classList.add("activeFilterState")
        
    }

    const resetProfileSections = ()=>{
        closeAllProfileFilterPages()
        removeProfileTypeFilterButtonsActiveState()
        removeProfileContainerVisibleStates()
        removeProfileContainerButtonsActiveState()
        companyInformationContainer.classList.add("visibleState")
        companyInfoButton.classList.add("activeFilterState")
    
    
    }

    const removeProfileContainerVisibleStates = ()=>{

        let containers = document.getElementsByClassName("visibleState")
        
        Array.from(containers).forEach(m =>{
            m.classList.remove("visibleState")
            
        });
        
    }

    const removeProfileContainerButtonsActiveState = ()=>{

        let filterButtons = document.getElementsByClassName("activeFilterState")
        
        Array.from(filterButtons).forEach(m =>{
            m.classList.remove("activeFilterState")
            
        });
        
    }

profileButton.addEventListener("click",e=>{

    profilePage.classList.add("menuPageOpen")
    resetProfilePage()
    profilePage.classList.add("menuPageOpen")
    userInfoSection.classList.add("profileSectionOpen")

})

closeProfileButton.addEventListener("click", e=>{
    profilePage.classList.remove("menuPageOpen")
    resetProfilePage()
})

//profile type section hero
personalProfileFilter.addEventListener("click",e=>{

    resetProfilePage()
    personalProfileFilter.classList.add("profileTypeActiveFilterState")
    userInfoSection.classList.add("profileSectionOpen")
    
})

userAngelsButton.addEventListener("click",e=>{
    removeProfileContainerVisibleStates()
    removeProfileContainerButtonsActiveState()
    // userInfoButton.classList.remove("userInfoFilterActiveState")

    userAngelsContainer.classList.add("visibleState")
    userAngelsButton.classList.add("activeFilterState")
})

userInfoButton.addEventListener("click",e=>{
    removeProfileContainerVisibleStates()
    removeProfileContainerButtonsActiveState()
    userInfoButton.classList.add("activeFilterState")
    userInformationContainer.classList.add("visibleState")

})




