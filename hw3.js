/*
    Program name: scripts.js
    Author: Cergio Manuel A Batang
    Date Created: Feb 27, 2026
    Date last edited: Feb 27, 2026
    Version: 1.0
    Description: JS external file for patient form
*/

// Dynamic Date Display
// Gets todays date and display it on header

const d = new Date();
let text = d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
});
document.getElementById("today").innerHTML = text;

//Returns today's date formatted as YYYY-MM-DD for use in input[type=date]

function getTodayStr() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

// Returns the date 120 years ago formatted as YYYY-MM-DD
function get120YearsAgoStr() {
    const now = new Date();
    now.setFullYear(now.getFullYear() - 120);
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

// Set DOB date limits dynamically once DOM is ready
document.getElementById("dob").max = getTodayStr();
document.getElementById("dob").min = get120YearsAgoStr();

// User ID inline warning as user types
document.getElementById("uid").addEventListener("input", function () {
    let val = this.value.trim();
    if (val === "") {
        clearError("uid");
        return;
    }
    if (/^\d/.test(val)) {
        showError("uid", "User ID cannot start with a number.");
    } else if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(val)) {
        showError("uid", "Only letters, numbers, underscores, and dashes allowed. No spaces.");
    } else if (val.length < 5) {
        showError("uid", "User ID must be at least 5 characters.");
    } else {
        clearError("uid");
    }
});

// Password inline warning as user types
document.getElementById("pword").addEventListener("input", function () {
    let pw = this.value;
    if (pw === "") { clearError("pword"); return; }
 
    if (pw.length < 8) {
        showError("pword", "Password must be at least 8 characters.");
    } else if (!/[A-Z]/.test(pw)) {
        showError("pword", "Password needs at least 1 uppercase letter.");
    } else if (!/[a-z]/.test(pw)) {
        showError("pword", "Password needs at least 1 lowercase letter.");
    } else if (!/[0-9]/.test(pw)) {
        showError("pword", "Password needs at least 1 number.");
    } else if (!/[!@#%^&*()\-_+=]/.test(pw)) {
        showError("pword", "Password needs at least 1 special character (!@#% etc).");
    } else {
        clearError("pword");
    }
});

// Range Slider Live Value 
// Updates displayed number next to the slider as the user drags it

let slider = document.getElementById("range");
let output = document.getElementById("range-slider");

// Set initial display value when page loads
output.innerHTML = slider.value;

// Update displayed value whenever slider moves
slider.oninput = function () {
    let display = Math.min(Math.max(this.value, 1), 10);
    output.innerHTML = display;
};

// Shows an error message below a field and marks the field red
function showError(fieldId, message){
    const errEl = document.getElementById(fieldId + "-error");
    if(errEl){
        errEl.textContent = message;
        errEl.classList.add("show");
    }
    const input = document.getElementById(fieldId);
    if (input) {
        input.style.borderColor = "#b30000";
        input.style.backgroundColor = "#fff5f5";
    }
}

// Clears error message and resets field border color
function clearError(fieldId) {
    const errEl = document.getElementById(fieldId + "-error");
    if (errEl) errEl.classList.remove("show");
    const input = document.getElementById(fieldId);
    if (input) {
        input.style.borderColor = "#1a6b9a";
        input.style.backgroundColor= "#f9fdff";
    }
}

// Marks a field green to indicate it passed validation
function showSucess(fieldId) {
    const errEl = document.getElementById(fieldId + "-error");
    if (errEl) errEl.classList.remove("show");
    const input = document.getElementById(fieldId);
    if (input) {
        input.style.borderColor = "#2e7d32";
        input.style.backgroundColor = "#f0fff0";
    }
}
// Password Match Validation

let form = document.querySelector("form");

form.addEventListener("submit", function (event) {
    let pass1 = document.getElementById("pword").value;
    let pass2 = document.getElementById("pword2").value;

    if (pass1 !== pass2) {
        // Stop form from submitting if passwords don't match
        event.preventDefault();
        showError("pword2", "Passwords do not match. Please re-enter your password.")
        document.getElementById("pword2").focus();
    }
    else {
        clearError("pword2");
    }
});

// also check the confirm password field in real time when user types in it
document.getElementById("pword2").addEventListener("input", function () {
    let pass1 = document.getElementById("pword").value;
    let pass2 = this.value;

    if (pass2.length > 0 && pass1 !== pass2) {
        showError("pword2", "Passwords do not match.");
    } else {
        clearError("pword2");
    }
});

//Show review

function showReview() {
    
    //personal info
    let fname = document.getElementById("fname").value.trim();
    let mi = document.getElementById("mi").value.trim();
    let lname = document.getElementById("lname").value.trim();

    //build full name in one string
    let fullname = fname;
    if (mi !== "") fullname += " " + mi + ".";
    fullname += " " + lname;

    //Gender: find whichever radio button is selected
    let genderEl = document.querySelector('input[name="pgender"]:checked');
    let gender = genderEl ? genderEl.value : "Not Selected";

    let dob = document.getElementById("dob").value;

    //SSN: mask on
    let ssnRaw  = document.getElementById("ssn").value;
    let ssnShow = "";
    if (ssnRaw.length > 0) {
        ssnShow = ssnRaw.slice(0, -4).replace(/[0-9]/g, "*") + ssnRaw.slice(-4);
    }


    // Contact info
    let addr1 = document.getElementById("address1").value.trim();
    let addr2 = document.getElementById("address2").value.trim();   
    let city  = document.getElementById("city").value.trim();    
    let state = document.getElementById("state").value;
    let zip   = document.getElementById("zip").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();

    // Build full address in one line 

    let fullAddr;
    if (!addr1 && !city && !state && !zip) {
        fullAddr = "Not entered";
    } else {
        fullAddr = addr1 || "(no street)";
        if (addr2 !== "") fullAddr += ", " + addr2;
        fullAddr += ", " + (city || "(no city)") + ", " + (state || "(no state)") + " " + (zip || "");
        fullAddr = fullAddr.trim().replace(/,\s*$/, "");
    }

    // Patient History

    let vaxEl  = document.querySelector('input[name="vaccinated"]:checked');
    let vax    = vaxEl ? vaxEl.value : "Not answered";
 
    let insEl  = document.querySelector('input[name="insurance"]:checked');
    let ins    = insEl ? insEl.value : "Not answered";
 
    let smkEl  = document.querySelector('input[name="smoker"]:checked');
    let smk    = smkEl ? smkEl.value : "Not answered";

    //checkboxes
  let histBoxes  = document.querySelectorAll('input[name="history"]:checked');
    let histValues = [];
    histBoxes.forEach(function(box) {
    histValues.push(box.value);
    });
    let histDisplay = histValues.length > 0 ? histValues.join(", ") : "None selected";

    // notes textarea

    let notes   = document.getElementById("notes").value.replace(/"/g, "'").trim();
    let notesDisplay = notes !== "" ? notes : "None provided";

    // slider value
    let painVal = document.getElementById("range").value;
 
    // Account Info
    let uid    = document.getElementById("uid").value.trim();
    let pwLen  = document.getElementById("pword").value.length;
 

    // show password as dots
    let pwShow = pwLen > 0 ? "•".repeat(pwLen) + " (hidden for security)" : "Not entered";

    // Build HTML review table

 let tableHTML = `
        <tr>
            <th colspan="2" style="text-align:center; background-color:#1a6b9a; color:white; padding:10px; font-size:1.1em;">
                — PLEASE REVIEW THIS INFORMATION —
            </th>
        </tr>
 
        <!-- Personal Info section header -->
        <tr>
            <th colspan="2" style="background-color:#ddeef8; color:#1a3a52; text-align:left; padding:6px 10px;">
                Personal Information
            </th>
        </tr>
        <tr>
            <td class="review-label">Full Name</td>
            <td class="review-value">${fullname}</td>
        </tr>
        <tr>
            <td class="review-label">Gender</td>
            <td class="review-value">${gender}</td>
        </tr>
        <tr>
            <td class="review-label">Date of Birth</td>
            <td class="review-value">${dob !== "" ? dob : "Not entered"}</td>
        </tr>
        <tr>
            <td class="review-label">SSN / ID #</td>
            <td class="review-value">${ssnShow !== "" ? ssnShow : "Not entered"}</td>
        </tr>
 
        <!-- Contact Info section header -->
        <tr>
            <th colspan="2" style="background-color:#ddeef8; color:#1a3a52; text-align:left; padding:6px 10px;">
                Contact Information
            </th>
        </tr>
        <tr>
            <td class="review-label">Address</td>
            <td class="review-value">${fullAddr}</td>
        </tr>
        <tr>
            <td class="review-label">Email Address</td>
            <td class="review-value">${email !== "" ? email : "Not entered"}</td>
        </tr>
        <tr>
            <td class="review-label">Phone Number</td>
            <td class="review-value">${phone !== "" ? phone : "Not entered"}</td>
        </tr>
 
        <!-- Patient History section header -->
        <tr>
            <th colspan="2" style="background-color:#ddeef8; color:#1a3a52; text-align:left; padding:6px 10px;">
                Patient History
            </th>
        </tr>
        <tr>
            <td class="review-label">Vaccinated?</td>
            <td class="review-value">${vax}</td>
        </tr>
        <tr>
            <td class="review-label">Has Insurance?</td>
            <td class="review-value">${ins}</td>
        </tr>
        <tr>
            <td class="review-label">Smoker?</td>
            <td class="review-value">${smk}</td>
        </tr>
        <tr>
            <td class="review-label">Conditions / History</td>
            <td class="review-value">${histDisplay}</td>
        </tr>
        <tr>
            <td class="review-label">Pain Level</td>
            <td class="review-value">${painVal} / 10</td>
        </tr>
        <tr>
            <td class="review-label">Notes / Symptoms</td>
            <td class="review-value">${notesDisplay}</td>
        </tr>
 
        <!-- Account section header -->
        <tr>
            <th colspan="2" style="background-color:#ddeef8; color:#1a3a52; text-align:left; padding:6px 10px;">
                Account Information
            </th>
        </tr>
        <tr>
            <td class="review-label">User ID</td>
            <td class="review-value">${uid !== "" ? uid : "Not entered"}</td>
        </tr>
        <tr>
            <td class="review-label">Password</td>
            <td class="review-value">${pwShow}</td>
        </tr>
    `;

    // Inject HTML into review table and show panel
    document.getElementById("review-table").innerHTML = tableHTML;
    document.getElementById("review-panel").style.display = "block";

    // Scroll the page down smoothly so the user can see the review section
    document.getElementById("review-panel").scrollIntoView({ behavior: "smooth" });

}

// First Name inline warning as user types
document.getElementById("fname").addEventListener("input", function () {
    let val = this.value.trim();
    let namePattern = /^[A-Za-z'\-]+$/;

    if (val === "") {
        showError("fname", "First name cannot be empty.");
        return;
    }
    if (!namePattern.test(val)) {
        showError("fname", "Letters, apostrophes, and dashes only.");
    } else if (val.length < 1) {
        showError("fname", "First name must be at least 1 character.");
    } else if (val.length > 30) {
        showError("fname", "First name cannot exceed 30 characters.");
    } else {
        clearError("fname");
    }
});

// First Name check on blur (when user leaves the field)
document.getElementById("fname").addEventListener("blur", function () {
    let val = this.value.trim();
    if (val === "") {
        showError("fname", "First name cannot be empty.");
    }
});

// Middle Initial check on blur (optional field)
document.getElementById("mi").addEventListener("blur", function () {
    let val = this.value.trim();

    if (val === "") {
        clearError("mi");
        return;
    }
    if (!/^[A-Za-z]$/.test(val)) {
        showError("mi", "Middle initial must be a single letter.");
    } else {
        clearError("mi");
    }
});

// Last Name inline warning as user types
document.getElementById("lname").addEventListener("input", function () {
    let val = this.value.trim();
    let namePattern = /^[A-Za-z'\-]+$/;

    if (val === "") {
        showError("lname", "Last name cannot be empty.");
        return;
    }
    if (!namePattern.test(val)) {
        showError("lname", "Letters, apostrophes, and dashes only.");
    } else if (val.length > 30) {
        showError("lname", "Last name cannot exceed 30 characters.");
    } else {
        clearError("lname");
    }
});

// Last Name check on blur
document.getElementById("lname").addEventListener("blur", function () {
    let val = this.value.trim();
    if (val === "") {
        showError("lname", "Last name cannot be empty.");
    }
});

// Date of Birth check when date changes
document.getElementById("dob").addEventListener("change", function () {
    let val = this.value;

    if (val === "") {
        showError("dob", "Date of birth is required.");
        return;
    }
    let selected = new Date(val);
    let today = new Date();
    let minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 120);

    if (selected > today) {
        showError("dob", "Date of birth cannot be in the future.");
    } else if (selected < minDate) {
        showError("dob", "Date of birth cannot be more than 120 years ago.");
    } else {
        clearError("dob");
    }
});

// SSN inline warning and auto-dash formatting as user types
document.getElementById("ssn").addEventListener("input", function () {
    let val = this.value.replace(/\D/g, ""); // strip non-digits

    // auto insert dashes after 3rd and 5th digit
    if (val.length > 5) {
        val = val.slice(0, 3) + "-" + val.slice(3, 5) + "-" + val.slice(5, 9);
    } else if (val.length > 3) {
        val = val.slice(0, 3) + "-" + val.slice(3);
    }
    this.value = val;

    let digits = this.value.replace(/\D/g, "");
    if (digits.length < 9) {
        showError("ssn", "SSN must be 9 digits (e.g. 123-45-6789).");
    } else {
        clearError("ssn");
    }
});

// Address Line 1 check on blur
document.getElementById("address1").addEventListener("blur", function () {
    let val = this.value.trim();

    if (val === "") {
        showError("address1", "Address is required.");
    } else if (val.length < 2) {
        showError("address1", "Address must be at least 2 characters.");
    } else {
        clearError("address1");
    }
});

// Address Line 2 check on blur (optional, but if entered must be 2-30 chars)
document.getElementById("address2").addEventListener("blur", function () {
    let val = this.value.trim();

    if (val === "") {
        clearError("address2");
        return;
    }
    if (val.length < 2) {
        showError("address2", "If entered, must be at least 2 characters.");
    } else {
        clearError("address2");
    }
});

// City check on blur
document.getElementById("city").addEventListener("blur", function () {
    let val = this.value.trim();

    if (val === "") {
        showError("city", "City is required.");
    } else if (val.length < 2) {
        showError("city", "City must be at least 2 characters.");
    } else {
        clearError("city");
    }
});

// State check when dropdown changes
document.getElementById("state").addEventListener("change", function () {
    if (this.value === "") {
        showError("state", "Please select a state.");
    } else {
        clearError("state");
    }
});

// Zip Code inline warning as user types
document.getElementById("zip").addEventListener("input", function () {
    let val = this.value.trim();

    if (!/^\d{0,5}$/.test(val)) {
        showError("zip", "Zip code must be digits only.");
    } else if (val.length < 5) {
        showError("zip", "Zip code must be exactly 5 digits.");
    } else {
        clearError("zip");
    }
});

// Zip Code check on blur
document.getElementById("zip").addEventListener("blur", function () {
    let val = this.value.trim();
    if (val.length !== 5 || !/^\d{5}$/.test(val)) {
        showError("zip", "Zip code must be exactly 5 digits.");
    } else {
        clearError("zip");
    }
});

// Email inline warning as user types
document.getElementById("email").addEventListener("input", function () {
    let val = this.value.toLowerCase(); // force lowercase
    this.value = val;
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (val === "") {
        clearError("email");
        return;
    }
    if (!emailPattern.test(val)) {
        showError("email", "Email must be in the format name@domain.tld");
    } else {
        clearError("email");
    }
});

// Email check on blur
document.getElementById("email").addEventListener("blur", function () {
    let val = this.value.trim();
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (val === "") {
        showError("email", "Email address is required.");
    } else if (!emailPattern.test(val)) {
        showError("email", "Email must be in the format name@domain.tld");
    } else {
        clearError("email");
    }
});

// Phone inline warning and auto-dash formatting as user types
document.getElementById("phone").addEventListener("input", function () {
    let val = this.value.replace(/\D/g, ""); // strip non-digits

    // auto insert dashes after 3rd and 6th digit
    if (val.length > 6) {
        val = val.slice(0, 3) + "-" + val.slice(3, 6) + "-" + val.slice(6, 10);
    } else if (val.length > 3) {
        val = val.slice(0, 3) + "-" + val.slice(3);
    }
    this.value = val;

    let digits = this.value.replace(/\D/g, "");
    if (digits.length < 10) {
        showError("phone", "Phone must be 10 digits (e.g. 832-555-0100).");
    } else {
        clearError("phone");
    }
});

// validateEverything - called by the Validate button
// runs all field checks and only shows Submit if everything passes
function validateEverything() {
    let valid = true;

    // check first name
    let fname = document.getElementById("fname").value.trim();
    if (fname === "" || !/^[A-Za-z'\-]+$/.test(fname)) {
        showError("fname", "First name is required. Letters, apostrophes, and dashes only.");
        valid = false;
    } else {
        clearError("fname");
    }

    // check middle initial (optional)
    let mi = document.getElementById("mi").value.trim();
    if (mi !== "" && !/^[A-Za-z]$/.test(mi)) {
        showError("mi", "Middle initial must be a single letter.");
        valid = false;
    } else {
        clearError("mi");
    }

    // check last name
    let lname = document.getElementById("lname").value.trim();
    if (lname === "" || !/^[A-Za-z'\-]+$/.test(lname)) {
        showError("lname", "Last name is required. Letters, apostrophes, and dashes only.");
        valid = false;
    } else {
        clearError("lname");
    }
    
    // check gender
    let gender = document.querySelector('input[name="pgender"]:checked');
    if (!gender) {
    showError("pgender", "Please select a gender.");
    valid = false;
    } else {
    clearError("pgender");
    }

    // check date of birth
    let dob = document.getElementById("dob").value;
    if (dob === "") {
        showError("dob", "Date of birth is required.");
        valid = false;
    } else {
        let selected = new Date(dob);
        let today = new Date();
        let minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 120);
        if (selected > today) {
            showError("dob", "Date of birth cannot be in the future.");
            valid = false;
        } else if (selected < minDate) {
            showError("dob", "Date of birth cannot be more than 120 years ago.");
            valid = false;
        } else {
            clearError("dob");
        }
    }

    // check SSN
    let ssnDigits = document.getElementById("ssn").value.replace(/\D/g, "");
    if (ssnDigits.length !== 9) {
        showError("ssn", "SSN must be 9 digits (e.g. 123-45-6789).");
        valid = false;
    } else {
        clearError("ssn");
    }

    // check address line 1
    let addr1 = document.getElementById("address1").value.trim();
    if (addr1.length < 2) {
        showError("address1", "Address is required (at least 2 characters).");
        valid = false;
    } else {
        clearError("address1");
    }

    // check address line 2 (optional)
    let addr2 = document.getElementById("address2").value.trim();
    if (addr2 !== "" && addr2.length < 2) {
        showError("address2", "If entered, must be at least 2 characters.");
        valid = false;
    } else {
        clearError("address2");
    }

    // check city
    let city = document.getElementById("city").value.trim();
    if (city.length < 2) {
        showError("city", "City is required (at least 2 characters).");
        valid = false;
    } else {
        clearError("city");
    }

    // check state
    let state = document.getElementById("state").value;
    if (state === "") {
        showError("state", "Please select a state.");
        valid = false;
    } else {
        clearError("state");
    }

    // check zip
    let zip = document.getElementById("zip").value.trim();
    if (!/^\d{5}$/.test(zip)) {
        showError("zip", "Zip code must be exactly 5 digits.");
        valid = false;
    } else {
        clearError("zip");
    }

    // check email
    let email = document.getElementById("email").value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError("email", "Email must be in the format name@domain.tld");
        valid = false;
    } else {
        clearError("email");
    }

    // check phone
    let phoneDigits = document.getElementById("phone").value.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
        showError("phone", "Phone must be 10 digits (e.g. 832-555-0100).");
        valid = false;
    } else {
        clearError("phone");
    }

    // check user ID
    let uid = document.getElementById("uid").value.trim();
    if (uid === "") {
        showError("uid", "User ID is required.");
        valid = false;
    } else if (/^\d/.test(uid)) {
        showError("uid", "User ID cannot start with a number.");
        valid = false;
    } else if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(uid)) {
        showError("uid", "Only letters, numbers, underscores, and dashes allowed. No spaces.");
        valid = false;
    } else if (uid.length < 5 || uid.length > 20) {
        showError("uid", "User ID must be between 5 and 20 characters.");
        valid = false;
    } else {
        clearError("uid");
    }

    // check password
    let pw = document.getElementById("pword").value;
    if (pw.length < 8) {
        showError("pword", "Password must be at least 8 characters.");
        valid = false;
    } else if (!/[A-Z]/.test(pw)) {
        showError("pword", "Password needs at least 1 uppercase letter.");
        valid = false;
    } else if (!/[a-z]/.test(pw)) {
        showError("pword", "Password needs at least 1 lowercase letter.");
        valid = false;
    } else if (!/[0-9]/.test(pw)) {
        showError("pword", "Password needs at least 1 number.");
        valid = false;
    } else if (!/[!@#%^&*()\-_+=]/.test(pw)) {
        showError("pword", "Password needs at least 1 special character (!@#% etc).");
        valid = false;
    } else if (pw === uid) {
        showError("pword", "Password cannot be the same as your User ID.");
        valid = false;
    } else {
        clearError("pword");
    }

    // check confirm password
    let pw2 = document.getElementById("pword2").value;
    if (pw2 === "") {
        showError("pword2", "Please confirm your password.");
        valid = false;
    } else if (pw !== pw2) {
        showError("pword2", "Passwords do not match.");
        valid = false;
    } else {
        clearError("pword2");
    }

    // show submit only if everything passed, otherwise show alert
    if (valid) {
        document.getElementById("submitBtn").disabled = false;
        document.getElementById("submitBtn").style.display = "inline";
    } else {
        showAlert();
    }
}

// showAlert - displays the alert popup when validateEverything finds errors
function showAlert() {
    let alertBox = document.getElementById("alert-box");
    let closeBtn = document.getElementById("close-alert");

    // show the overlay
    alertBox.style.display = "block";

    // clicking OK closes it
    closeBtn.onclick = function () {
        alertBox.style.display = "none";
    };
}
