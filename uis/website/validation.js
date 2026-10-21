const form = document.querySelector("#talent-form");
const formFields = document.querySelector("#form-fields");
const successMessage = document.querySelector("#success-message");
const comments = document.querySelector("#comments");
const commentsCounter = document.querySelector("#comments-counter");

const fieldErrors = {
  fullName: {
    element: document.querySelector("#full-name"),
    error: document.querySelector("#full-name-error"),
    validate: (field) => {
      const words = field.value.trim().split(/\s+/).filter(Boolean);
      return words.length >= 2 ? "" : "El nombre debe contener al menos nombre y apellido";
    },
  },
  email: {
    element: document.querySelector("#email"),
    error: document.querySelector("#email-error"),
    validate: (field) => {
      const validEmail = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(field.value.trim());
      return validEmail
        ? ""
        : "Ingresa un email válido (ejemplo: nombre@empresa.com)";
    },
  },
  phone: {
    element: document.querySelector("#phone"),
    error: document.querySelector("#phone-error"),
    validate: (field) => {
      const normalizedPhone = field.value.trim().replace(/\s/g, "");
      const validPhone = /^\+[1-9]\d{6,14}$/.test(normalizedPhone);
      return validPhone
        ? ""
        : "El teléfono debe incluir código de país (ejemplo: +34 612 345 678)";
    },
  },
  country: {
    element: document.querySelector("#country"),
    error: document.querySelector("#country-error"),
    validate: (field) => ["España", "Estados Unidos", "Otro"].includes(field.value)
      ? ""
      : "Selecciona tu país de residencia",
  },
  experience: {
    element: document.querySelector("#experience"),
    error: document.querySelector("#experience-error"),
    validate: (field) => {
      const years = Number(field.value);
      return field.value !== "" && Number.isFinite(years) && years >= 0 && years <= 50
        ? ""
        : "Los años de experiencia deben estar entre 0 y 50";
    },
  },
  sector: {
    element: document.querySelector("#sector"),
    error: document.querySelector("#sector-error"),
    validate: (field) => [
      "Tecnología",
      "Retail",
      "Servicios Financieros",
      "Consultoría",
      "Otro",
    ].includes(field.value)
      ? ""
      : "Selecciona el sector de tu interés",
  },
  englishLevel: {
    element: document.querySelector("#english-level"),
    error: document.querySelector("#english-level-error"),
    validate: (field) => ["Básico", "Intermedio", "Avanzado", "Nativo"].includes(field.value)
      ? ""
      : "Indica tu nivel de inglés",
  },
  availability: {
    elements: [...form.querySelectorAll('input[name="availability"]')],
    error: document.querySelector("#availability-error"),
    validate: (elements) => elements.some((field) => (
      field.checked && ["Inmediata", "1 mes", "2-3 meses", "Solo explorando"].includes(field.value)
    ))
      ? ""
      : "Selecciona tu disponibilidad",
  },
  linkedin: {
    element: document.querySelector("#linkedin"),
    error: document.querySelector("#linkedin-error"),
    validate: (field) => {
      if (!field.value.trim()) return "";
      try {
        const url = new URL(field.value.trim());
        return ["http:", "https:"].includes(url.protocol)
          ? ""
          : "Si incluyes LinkedIn, debe ser una URL válida";
      } catch {
        return "Si incluyes LinkedIn, debe ser una URL válida";
      }
    },
  },
  comments: {
    element: comments,
    error: document.querySelector("#comments-error"),
    validate: (field) => field.value.length <= 500
      ? ""
      : `Los comentarios no pueden exceder 500 caracteres (quedan ${Math.max(0, 500 - field.value.length)})`,
  },
  dataPolicy: {
    element: document.querySelector("#data-policy"),
    error: document.querySelector("#data-policy-error"),
    validate: (field) => field.checked
      ? ""
      : "Debes aceptar la política de tratamiento de datos para continuar",
  },
};

const fieldNames = new Map();
for (const [name, field] of Object.entries(fieldErrors)) {
  if (field.element) fieldNames.set(field.element, name);
  for (const element of field.elements ?? []) fieldNames.set(element, name);
}

const touchedFields = new Set();
let attemptedSubmit = false;

function updateDescription(field, errorElement, hasError) {
  const descriptions = (field.getAttribute("aria-describedby") ?? "")
    .split(/\s+/)
    .filter((id) => id && id !== errorElement.id);

  if (hasError) descriptions.push(errorElement.id);

  if (descriptions.length) {
    field.setAttribute("aria-describedby", descriptions.join(" "));
  } else {
    field.removeAttribute("aria-describedby");
  }

  if (hasError) {
    field.setAttribute("aria-invalid", "true");
  } else {
    field.removeAttribute("aria-invalid");
  }
}

function setError(field, errorElement, message) {
  errorElement.textContent = message;
  errorElement.hidden = !message;

  if (field instanceof HTMLElement) {
    updateDescription(field, errorElement, Boolean(message));
    return;
  }

  for (const radio of field) {
    updateDescription(radio, errorElement, Boolean(message));
  }

  document.querySelector("#availability-group")
    .classList.toggle("rounded-lg", Boolean(message));
}

function validateField(name) {
  const definition = fieldErrors[name];
  const value = definition.elements ?? definition.element;
  const message = definition.validate(value);
  setError(value, definition.error, message);
  return !message;
}

function updateCommentsCounter() {
  const remaining = Math.max(0, 500 - comments.value.length);
  commentsCounter.textContent = `${remaining} ${remaining === 1 ? "carácter restante" : "caracteres restantes"}`;
}

function clearSuccessMessage() {
  successMessage.hidden = true;
}

function resetValidationState() {
  touchedFields.clear();
  attemptedSubmit = false;

  for (const [name, definition] of Object.entries(fieldErrors)) {
    setError(definition.elements ?? definition.element, definition.error, "");
    for (const field of definition.elements ?? [definition.element]) {
      field.setCustomValidity("");
    }
    if (name === "availability") {
      for (const field of definition.elements) field.removeAttribute("aria-invalid");
    }
  }

  updateCommentsCounter();
  clearSuccessMessage();
}

formFields.disabled = false;

form.addEventListener("input", (event) => {
  const name = fieldNames.get(event.target);
  if (name === "comments") updateCommentsCounter();
  if (name && (touchedFields.has(name) || attemptedSubmit)) validateField(name);
  clearSuccessMessage();
});

form.addEventListener("change", (event) => {
  const name = fieldNames.get(event.target);
  if (name && (touchedFields.has(name) || attemptedSubmit)) validateField(name);
});

form.addEventListener("focusout", (event) => {
  const name = fieldNames.get(event.target);
  if (!name) return;
  touchedFields.add(name);
  validateField(name);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  attemptedSubmit = true;

  let firstInvalid = null;
  for (const [name, definition] of Object.entries(fieldErrors)) {
    touchedFields.add(name);
    const isValid = validateField(name);
    if (!isValid && firstInvalid === null) {
      firstInvalid = definition.elements?.[0] ?? definition.element;
    }
  }

  if (firstInvalid) {
    clearSuccessMessage();
    firstInvalid.focus();
    return;
  }

  successMessage.hidden = false;
  successMessage.focus();
});

form.addEventListener("reset", () => {
  window.setTimeout(resetValidationState, 0);
});

updateCommentsCounter();
