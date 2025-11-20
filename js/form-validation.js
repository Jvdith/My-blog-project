class ContactFormValidator {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.fields = {
      contactName: {
        element: document.getElementById("contactName"),
        validate: this.validateName.bind(this),
      },
      contactEmail: {
        element: document.getElementById("contactEmail"),
        validate: this.validateEmail.bind(this),
      },
      contactSubject: {
        element: document.getElementById("contactSubject"),
        validate: this.validateSubject.bind(this),
      },
      contactMessage: {
        element: document.getElementById("contactMessage"),
        validate: this.validateMessage.bind(this),
      },
    };

    this.init();
  }

  init() {
    if (this.form) {
      this.addRealTimeValidation();
      this.form.addEventListener("submit", this.handleSubmit.bind(this));
    }
  }

  addRealTimeValidation() {
    Object.keys(this.fields).forEach((fieldName) => {
      const field = this.fields[fieldName];

      field.element.addEventListener("blur", () => {
        this.validateField(fieldName);
      });

      field.element.addEventListener("input", () => {
        this.clearFieldError(fieldName);
      });
    });
  }

  validateField(fieldName) {
    const field = this.fields[fieldName];
    const value = field.element.value.trim();
    const isValid = field.validate(value);

    if (!isValid.valid) {
      this.showFieldError(fieldName, isValid.message);
      return false;
    } else {
      this.showFieldSuccess(fieldName);
      return true;
    }
  }

  validateName(name) {
    if (name.length === 0) {
      return { valid: false, message: "Name is required" };
    }
    if (name.length < 2) {
      return {
        valid: false,
        message: "Name must be at least 2 characters long",
      };
    }
    if (name.length > 50) {
      return { valid: false, message: "Name cannot exceed 50 characters" };
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      return {
        valid: false,
        message: "Name can only contain letters and spaces",
      };
    }
    return { valid: true };
  }

  validateEmail(email) {
    if (email.length === 0) {
      return { valid: false, message: "Email is required" };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, message: "Please enter a valid email address" };
    }
    return { valid: true };
  }

  validateSubject(subject) {
    if (subject.length === 0) {
      return { valid: false, message: "Please select a subject" };
    }
    return { valid: true };
  }

  validateMessage(message) {
    if (message.length === 0) {
      return { valid: false, message: "Message is required" };
    }
    if (message.length < 10) {
      return {
        valid: false,
        message: "Message must be at least 10 characters long",
      };
    }
    if (message.length > 500) {
      return { valid: false, message: "Message cannot exceed 500 characters" };
    }
    return { valid: true };
  }

  showFieldError(fieldName, message) {
    this.clearFieldError(fieldName);

    const field = this.fields[fieldName];
    const errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.style.cssText = `
      color: #ff6b6b;
      font-size: 0.9rem;
      margin-top: 5px;
      padding: 5px 10px;
      background: rgba(255, 107, 107, 0.1);
      border-radius: 5px;
      border-left: 3px solid #ff6b6b;
    `;
    errorElement.textContent = message;

    field.element.parentNode.appendChild(errorElement);
    field.element.style.border = "2px solid #ff6b6b";
    field.element.style.background = "rgba(255, 107, 107, 0.05)";
  }

  showFieldSuccess(fieldName) {
    const field = this.fields[fieldName];
    field.element.style.border = "2px solid #4CAF50";
    field.element.style.background = "rgba(76, 175, 80, 0.05)";
  }

  clearFieldError(fieldName) {
    const field = this.fields[fieldName];
    const existingError =
      field.element.parentNode.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    let isFormValid = true;

    Object.keys(this.fields).forEach((fieldName) => {
      const isValid = this.validateField(fieldName);
      if (!isValid) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      this.submitContactForm();
    } else {
      this.showFormError(
        "Please correct the errors before sending your message"
      );
    }

    return false;
  }

  submitContactForm() {
    const formData = {
      name: this.fields.contactName.element.value.trim(),
      email: this.fields.contactEmail.element.value.trim(),
      subject: this.fields.contactSubject.element.value,
      message: this.fields.contactMessage.element.value.trim(),
    };

    const submitBtn = this.form.querySelector(".submit-btn");
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      this.showSuccessMessage();
      this.form.reset();

      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 2000);
  }

  showSuccessMessage() {
    this.showMessage(
      "Thank you! Your message has been sent successfully.",
      "success"
    );
  }

  showFormError(message) {
    this.showMessage(message, "error");
  }

  showMessage(message, type) {
    const existingMessage = document.querySelector(".form-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    const messageElement = document.createElement("div");
    messageElement.className = `form-message ${type}`;
    messageElement.style.cssText = `
      padding: 15px;
      margin: 20px 0;
      border-radius: 10px;
      text-align: center;
      font-weight: bold;
      animation: slideIn 0.5s ease;
    `;

    if (type === "success") {
      messageElement.style.background = "rgba(76, 175, 80, 0.2)";
      messageElement.style.color = "#4CAF50";
      messageElement.style.border = "2px solid #4CAF50";
    } else {
      messageElement.style.background = "rgba(255, 107, 107, 0.2)";
      messageElement.style.color = "#ff6b6b";
      messageElement.style.border = "2px solid #ff6b6b";
    }

    messageElement.textContent = message;
    this.form.insertBefore(messageElement, this.form.firstChild);

    setTimeout(() => {
      if (messageElement.parentNode) {
        messageElement.remove();
      }
    }, 5000);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  window.contactFormValidator = new ContactFormValidator("contactForm");
});
