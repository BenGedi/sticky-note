export function debounce(cb, delay = 1000) {
  let timeout

  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => cb(...args), delay)
  }
}

export function isLightColor(hex) {
  // convert hex to RGB
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  let hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  // using the HSP value, determine whether the color is light or dark
  return (hsp > 127.5)
}

export function generateUID() {
  let uid = '';
  const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 24; i++) {
    uid += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return uid;
}