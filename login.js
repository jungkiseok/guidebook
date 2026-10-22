(() => {
  const form = document.getElementById('login-form');
  const employee = document.getElementById('employee-id');
  const password = document.getElementById('password');
  const error = document.getElementById('login-error');
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (employee.value.trim() !== 'M50278' || password.value !== '1111') {
      error.textContent = '사번 또는 비밀번호가 올바르지 않습니다.';
      employee.setAttribute('aria-invalid', 'true');
      password.setAttribute('aria-invalid', 'true');
      password.value = '';
      password.focus();
      return;
    }
    try {
      sessionStorage.setItem('jaseng-guide-session', 'signed-in-v1');
    } catch {
      error.textContent = '로그인 정보를 저장할 수 없습니다. 브라우저의 저장소 사용 설정을 확인해 주세요.';
      return;
    }
    password.value = '';
    window.location.replace('index.html');
  });
  form.addEventListener('input', () => {
    error.textContent = '';
    employee.removeAttribute('aria-invalid');
    password.removeAttribute('aria-invalid');
  });
})();
