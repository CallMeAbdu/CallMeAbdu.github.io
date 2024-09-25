function updateTime() {
    let currentTimeDisplay = document.getElementById('currentTime');
    let currentDate = new Date();
    
    // Get current time with second precision
    let currentHour = String(currentDate.getHours()).padStart(2, '0');
    let currentMinute = String(currentDate.getMinutes()).padStart(2, '0');
    let currentSecond = String(currentDate.getSeconds()).padStart(2, '0');
    
    // Format the time
    let currentTimeString = `${currentHour}:${currentMinute}:${currentSecond}`;
    
    // Update the time in the HTML
    currentTimeDisplay.textContent = currentTimeString;
  }
  
  // Update the time when page is loaded
  updateTime();
  
  // Update the time every second
  setInterval(updateTime, 1000);

  function validateFindPetForm() {
    const friendType = document.querySelector('input[name="friend"]:checked');
    const gender = document.querySelector('input[name="gender"]:checked');

    if (friendType === null) {
        alert("Please select your type of friend.");
        return false;
    }

    if(gender === null){
      alert("Please choose a gender.");
    }

    return true;
}

function validateGiveAwayForm(){
  const friendType = document.querySelector('input[name="friend"]:checked');
  const breed = document.querySelector('select[name="breed"]').value;
  const ageCategory = document.querySelector('select[name="ageCategory"]').value;
  const gender = document.querySelector('input[name="gender"]:checked');
  const brag  = document.getElementById("describeFriend").value.trim();
  const firstName = document.getElementById("firstName").value.trim();
  const familyName = document.getElementById("familyName").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!friendType) {
    alert("Please select a friend type");
    return false;
  }

  if (breed === 'dogBreeds' || breed === 'catBreeds') {
    alert('Please select a breed.');
    return false;
}

if (!ageCategory) {
    alert('Please select an age category.');
    return false;
}

if (!gender) {
    alert('Please select a gender.');
    return false;
}

if (!brag.trim()) {
    alert('Please provide information about the pet.');
    return false;
}

if (!firstName.trim()) {
    alert('Please enter your first name.');
    return false;
}

if (!familyName.trim()) {
    alert('Please enter your family name.');
    return false;
}

if (!email.trim()) {
    alert('Please enter your email.');
    return false;
}

  if( brag === ''){
    alert("You need to describe your pet");
    return false;
  }

  return true;
}

function validateCreateAccountForm() {
  // Get form inputs
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const regexUsername = /^[a-zA-Z0-9]+$/;
  if(!regexUsername.test(username)){
      showMessage('Username must contain letters (both upper and lower case) and digits only.');
      return false;
  }

  const regexPassword = /^(?=.*[a-zA-Z])(?=.*\d).{4,}$/;
  if(regexPassword.test(password)){
      showMessage('Password must be at least 4 characters long, containing at least one letter and one digit.');
      return false;
  }

  return true; // Form is valid
}

function validateLoginForm() {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  const regexUsername = /^[a-zA-Z0-9]+$/;
  if (!regexUsername.test(username)) {
      alert('Username must contain letters (both upper and lower case) and digits only.');
      return false;
  }

  const regexPassword = /^(?=.*[a-zA-Z])(?=.*\d).{4,}$/;
  if (!regexPassword.test(password)) {
      alert('Password must be at least 4 characters long, containing at least one letter and one digit.');
      return false;
  }

  return true;
}