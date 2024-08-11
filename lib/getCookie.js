export function getCookie(name) {
  const cookies = `;${document.cookie}`;
  const cookie = cookies.split(`; ${name}=`);
  if (cookie.length === 2) {
    return cookie.pop().split(';').shift();
  } else {
    return null;
  }
}