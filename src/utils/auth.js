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
export function getAuthHeader() {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('No token in local storage');
    return null;
  }

  return { headers: { 'x-auth-token': token } };
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
    console.log(decodedToken); // log the entire decoded token
    return decodedToken.campus; 
  } catch (error) {
    console.error('Error decoding token', error);
    return null;
  }
}
