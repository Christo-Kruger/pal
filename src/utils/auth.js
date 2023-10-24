import jwtDecode from 'jwt-decode';

export function getUserRole() {
  const token = localStorage.getItem('token');

  
  if (!token) {
    console.error('No token in local storage');
    return null;
  }

  try {
    const decodedToken = jwtDecode(token);
   
    return decodedToken.role; // Access the 'role' property from the decoded token
  } catch (error) {
    console.error('Error decoding token', error);
    return null;
  }
}


export function getAuthToken() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('No token in local storage');
    return null;
  }

  return token;
}

export function getAttendedPresentation() {
  const token = localStorage.getItem('token');

  
  if (!token) {
    console.error('No token in local storage');
    return null;
  }

  try {
    const decodedToken = jwtDecode(token);
    
    return decodedToken.attendedPresentation; // Access the 'attendedPresentation' property from the decoded token
  } catch (error) {
    console.error('Error decoding token', error);
    return null;
  }
}
export function getAuthHeader() {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('No token in local storage');
    return null;
  }

  // Return the token in the 'Authorization' header with 'Bearer' prefix
  return { headers: { 'Authorization': `Bearer ${token}` } };
}


export function getUserId() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('No token in local storage');
    return null;
  }

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken._id; // Update this to match the property name in your token
  } catch (error) {
    console.error('Error decoding token', error);
    return null;
  }
}

export function getUserName() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('No token in local storage');
    return null;
  }

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.name; // Update this to match the property name in your token
  } catch (error) {
    console.error('Error decoding token', error);
    return null;
  }
}

export function getUserPhone() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('No token in local storage');
    return null;
  }

  try {
    const decodedToken = jwtDecode(token);
    console.log(decodedToken); // log the entire decoded token
    return decodedToken.phone; 
  } catch (error) {
    console.error('Error decoding token', error);
    return null;
  }
}

export function getUserCampus() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('No token in local storage');
    return null;
  }

  try {
    const decodedToken = jwtDecode(token);
  
    return decodedToken.campus; 
  } catch (error) {
    console.error('Error decoding token', error);
    return null;
  }
}

export function getUserEmail() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('No token in local storage');
    return null;
  }

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.email; 
  } catch (error) {
    console.error('Error decoding token', error);
    return null;
  }
}

//Get Child ageGroup

