const button = document.querySelector('#demo-button');
const status = document.querySelector('#status');

button?.addEventListener('click', () => {
  if (status) status.textContent = 'Interaction works. Replace this starter with your product.';
});
