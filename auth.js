(() => {
  let signedIn = false;
  try { signedIn = sessionStorage.getItem('jaseng-guide-session') === 'signed-in-v1'; } catch {}
  if (!signedIn) {
    document.documentElement.style.visibility = 'hidden';
    window.location.replace('login.html');
  }
})();
