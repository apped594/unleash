const https = require('https');


// Middleware function to send an SMS to all guardian angels
const sendPanicSMS = async (req, res) => {
    try {
        
        const {panicData,angelsData} = req.body; // The message content comes from the request body
        const smsResults = []; // Array to store the result of each SMS operation

        // Step 3: Loop through each angel and send the SMS
        for (const angel of angelsData.angels) {
            const contactNumber = angel.contactNumber; // Extract the contact number of the angel

            // SMSPortal API credentials
            const apiKey = 'cdd2a3b4-3848-4954-8a3d-01b181181ee7';
            const apiSecret = 'eFGKn02KCDU1TO/d/Q+2DxH1wQT9dwhb';
            const accountApiCredentials = `${apiKey}:${apiSecret}`;
            const base64Credentials = Buffer.from(accountApiCredentials).toString('base64'); // Encode the credentials in base64 format

            // Prepare the data for the SMSPortal API request
            const requestData = JSON.stringify({
                messages: [{
                    content: `${panicData.genericMessage} ${panicData.mapsUrl}`, // The message content to be sent
                    destination: contactNumber // The phone number of the angel
                }]
            });

            // Configure the HTTPS request options
            const options = {
                hostname: 'rest.smsportal.com',
                path: '/bulkmessages',
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${base64Credentials}`, // Use Basic Authentication with the encoded credentials
                    'Content-Type': 'application/json', // Set the content type to JSON
                    'Content-Length': requestData.length // Set the content length header
                }
            };

            // Function to send the SMS using the HTTPS request
            const sendSMS = () => new Promise((resolve, reject) => {
                const request = https.request(options, (response) => {
                    let data = '';

                    // Collect the data chunks from the response
                    response.on('data', (chunk) => {
                        data += chunk;
                    });

                    // Once the response ends, parse the data and resolve or reject the promise based on the status code
                    response.on('end', () => {
                        if (response.statusCode >= 200 && response.statusCode < 300) {
                            resolve(JSON.parse(data)); // Parse the JSON response data and resolve the promise
                        } else {
                            reject(new Error(`Failed to send SMS with status: ${response.statusCode}`)); // Reject the promise if the status code indicates a failure
                        }
                    });
                });

                // Handle any errors that occur during the HTTPS request
                request.on('error', (error) => {
                    reject(error);
                });

                // Write the request data (message content and destination) and end the request
                request.write(requestData);
                request.end();
            });

            // Try to send the SMS and store the result in the smsResults array
            try {
                const result = await sendSMS(); // Await the sendSMS function and get the result
                smsResults.push({ angel: angel.displayName, success: true, result }); // Push a success entry to the smsResults array
            } catch (error) {
                smsResults.push({ angel: angel.displayName, success: false, error: error.message }); // Push a failure entry to the smsResults array
            }
        }

        // Step 4: Respond with the results of the SMS operations
        res.status(200).json({
            success: true, // Indicate that the SMS operations were initiated successfully
            message: "Panic SMS sent to guardian angels", // Message for the response
            results: smsResults // Include the detailed results for each angel
        });

    } catch (error) {
        // If an error occurs during the process, log the error and send a failure response
        console.error('Error sending panic SMS:', error);
        res.status(500).json({ success: false, message: "Error sending panic SMS", error: error.message });
    }
};

// Export the sendPanicSMS middleware function to be used in other parts of the application
module.exports = sendPanicSMS;
