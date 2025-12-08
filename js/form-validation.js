class ContactFormValidator {
  constructor(form_id) {
    this.form = document.getElementById(form_id);
    this.fields = {
      "contact-name": {
        element: document.getElementById("contactName"),
        validate: this.validate_name.bind(this),
      },
      "contact-email": {
        element: document.getElementById("contactEmail"),
        validate: this.validate_email.bind(this),
      },
      "contact-subject": {
        element: document.getElementById("contactSubject"),
        validate: this.validate_subject.bind(this),
      },
      "contact-message": {
        element: document.getElementById("contactMessage"),
        validate: this.validate_message.bind(this),
      },
    };

    this.init();
  }

  init() {
    if (this.form) {
      this.add_real_time_validation();
      this.form.addEventListener("submit", this.handle_submit.bind(this));
    }
  }

  add_real_time_validation() {
    Object.keys(this.fields).forEach((field_name) => {
      const field = this.fields[field_name];

      field.element.addEventListener("blur", () => {
        this.validate_field(field_name);
      });

      field.element.addEventListener("input", () => {
        this.clear_field_error(field_name);
      });
    });
  }

  handle_submit(e) {
    e.preventDefault();
    if (this.validate_all()) {
      this.clear_all_fields();
      this.show_form_success();
    } else {
      this.show_form_error(
        "Please correct the errors in the form before submitting."
      );
    }
  }

  validate_name(name) {
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters.";
    }
    return null;
  }

  validate_email(email) {
    const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email_regex.test(email)) {
      return "Please enter a valid email address.";
    }
    return null;
  }

  validate_subject(subject) {
    if (subject.trim().length < 5) {
      return "Subject must be at least 5 characters.";
    }
    return null;
  }

  validate_message(message) {
    if (message.trim().length < 10) {
      return "Message must be at least 10 characters.";
    }
    return null;
  }

  validate_field(field_name) {
    const field = this.fields[field_name];
    const value = field.element.value;
    const error_message = field.validate(value);
    const error_element = document.getElementById(`${field_name}-error`);

    if (error_message) {
      this.show_field_error(field_name, error_message);
      return false;
    } else {
      this.clear_field_error(field_name);
      this.show_field_success(field_name);
      return true;
    }
  }

  validate_all() {
    let is_valid = true;
    Object.keys(this.fields).forEach((field_name) => {
      if (!this.validate_field(field_name)) {
        is_valid = false;
      }
    });
    return is_valid;
  }

  clear_all_fields() {
    Object.keys(this.fields).forEach((field_name) => {
      const field = this.fields[field_name];
      field.element.value = "";
      this.clear_field_error(field_name);
      field.element.style.border = "2px solid rgba(255, 255, 255, 0.2)";
      field.element.style.background = "rgba(255, 255, 255, 0.05)";
    });
    const existing_message = document.querySelector(".form-message");
    if (existing_message) {
      existing_message.remove();
    }
  }

  show_field_error(field_name, message) {
    const field = this.fields[field_name];
    let error_element = document.getElementById(`${field_name}-error`);

    if (!error_element) {
      error_element = document.createElement("div");
      error_element.id = `${field_name}-error`;
      error_element.className = "error-message";
      field.element.parentNode.insertBefore(
        error_element,
        field.element.nextSibling
      );
    }

    error_element.innerHTML = message;
    field.element.style.border = "2px solid #ff6b6b";
    field.element.style.background = "rgba(255, 107, 107, 0.05)";
    error_element.style.display = "block";
  }

  clear_field_error(field_name) {
    const field = this.fields[field_name];
    const error_element = document.getElementById(`${field_name}-error`);

    if (error_element) {
      error_element.style.display = "none";
    }
    field.element.style.border = "2px solid rgba(255, 255, 255, 0.2)";
    field.element.style.background = "rgba(255, 255, 255, 0.05)";
    this.clear_form_message();
  }

  show_field_success(field_name) {
    const field = this.fields[field_name];
    field.element.style.border = "2px solid #4CAF50";
    field.element.style.background = "rgba(76, 175, 80, 0.05)";
  }

  clear_form_message() {
    const existing_message = document.querySelector(".form-message");
    if (existing_message) {
      existing_message.remove();
    }
  }

  show_form_success() {
    const form_container = this.form.closest(".form-container");
    const message_element = document.createElement("div");
    message_element.className = "form-message success";
    message_element.style.cssText = `
      padding: 15px;
      margin: 20px 0;
      border-radius: 10px;
      text-align: center;
      font-weight: bold;
      background: rgba(76, 175, 80, 0.2);
      color: #4CAF50;
      border: 2px solid #4CAF50;
    `;
    message_element.innerHTML =
      "Thank you! Your message has been sent successfully.";
    form_container.insertBefore(message_element, this.form.nextSibling);

    this.show_message(
      "Thank you! Your message has been sent successfully.",
      "success"
    );
  }

  show_form_error(message) {
    this.show_message(message, "error");
  }

  show_message(message, type) {
    const existing_message = document.querySelector(".form-message");
    if (existing_message) {
      existing_message.remove();
    }

    const message_element = document.createElement("div");
    message_element.className = `form-message ${type}`;
    message_element.style.cssText = `
      padding: 15px;
      margin: 20px 0;
      border-radius: 10px;
      text-align: center;
      font-weight: bold;
      animation: slideIn 0.5s ease;
    `;

    if (type === "success") {
      message_element.style.background = "rgba(76, 175, 80, 0.2)";
      message_element.style.color = "#4CAF50";
      message_element.style.border = "2px solid #4CAF50";
    } else {
      message_element.style.background = "rgba(255, 107, 107, 0.2)";
      message_element.style.color = "#ff6b6b";
      message_element.style.border = "2px solid #ff6b6b";
    }

    message_element.innerHTML = message;
    this.form.parentNode.insertBefore(message_element, this.form);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new ContactFormValidator("contactForm");
});