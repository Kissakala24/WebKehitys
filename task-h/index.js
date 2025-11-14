/*
author: Eetu Liukkonen
date: 2025-11-14
*/
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm");
  const tableBody = document.querySelector("#timetable tbody");

  const nameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phoneNum");
  const birthInput = document.getElementById("birthdate");
  const termsInput = document.getElementById("terms");
  const timestampInput = document.getElementById("timestamp");

  const errors = {
    name: document.getElementById("nameError"),
    email: document.getElementById("emailError"),
    phone: document.getElementById("telephoneError"),
    birth: document.getElementById("birthdateError"),
    terms: document.getElementById("termsError"),
  };

  const clearErrors = () => {
    Object.values(errors).forEach(el => el.textContent = "");
    [nameInput, emailInput, phoneInput, birthInput].forEach(el => el.classList.remove("invalid"));
  };

  const setError = (input, errorEl, msg) => {
    errorEl.textContent = msg;
    input?.classList.add("invalid");
  };

  const validateName = (name) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length < 2) return "Enter your full name";
    if (parts.some(p => p.length < 2)) return "Each name part must be at least 2 letters";
    if (!/^[A-Za-zÄÖÅäöå\s'-]+$/.test(name)) return "Invalid characters in name";
    return "";
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Invalid email address";

  const validatePhone = (phone) => /^\+?\d{7,15}$/.test(phone) ? "" : "Phone number must be 7–15 digits";

  const validateBirth = (birthdate) => {
    if (!birthdate) return "Enter your birth date";
    const birth = new Date(birthdate);
    const now = new Date();
    if (birth >= now) return "Birth date cannot be in the future";

    const age = now.getFullYear() - birth.getFullYear() - (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0);
    if (age < 13) return "You must be at least 13 years old";
    if (age > 120) return "Invalid birth date";
    return "";
  };


  const validateForm = () => {
    clearErrors();
    let valid = true;

    const nameErr = validateName(nameInput.value.trim());
    if (nameErr) { setError(nameInput, errors.name, nameErr); valid = false; }

    const emailErr = validateEmail(emailInput.value.trim());
    if (emailErr) { setError(emailInput, errors.email, emailErr); valid = false; }

    const phoneErr = validatePhone(phoneInput.value.trim());
    if (phoneErr) { setError(phoneInput, errors.phone, phoneErr); valid = false; }

    const birthErr = validateBirth(birthInput.value.trim());
    if (birthErr) { setError(birthInput, errors.birth, birthErr); valid = false; }

    if (!termsInput.checked) {
      errors.terms.textContent = "You must accept the terms";
      valid = false;
    }

    return valid;
  };

  const addRow = (data) => {
    const tr = document.createElement("tr");
    const cells = [
      data.timestamp,
      data.name,
      data.email,
      data.phone,
      data.birth,
      data.terms ? "Yes" : "No"
    ];

    for (const text of cells) {
      const td = document.createElement("td");
      td.textContent = text;
      tr.appendChild(td);
    }
    tableBody.appendChild(tr);
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm()) {
      const invalid = document.querySelector(".invalid");
      if (invalid) invalid.focus();
      return;
    }

    timestampInput.value = new Date().toLocaleString();

    addRow({
      timestamp: timestampInput.value,
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      birth: birthInput.value,
      terms: termsInput.checked,
    });

    form.reset();
    nameInput.focus();
  });

  form.addEventListener("reset", clearErrors);
});