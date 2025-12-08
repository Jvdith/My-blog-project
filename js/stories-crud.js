class StoriesManager {
  constructor() {
    this.stories = this.load_stories();
    this.editing_story_id = null;
    this.is_manage_page = window.location.pathname.includes('manage-stories');
    this.init();
  }

  init() {
    if (this.is_manage_page) {
      this.render_management_stories();
      this.setup_edit_modal();
    } else {
      this.render_stories();
      this.add_manage_button();
    }
    this.setup_story_form();
  }

  load_stories() {
    const stored_stories = localStorage.getItem("fashion-stories");
    if (stored_stories) {
      return JSON.parse(stored_stories);
    } else {
      const default_stories = [];
      this.save_stories(default_stories);
      return default_stories;
    }
  }

  generate_id() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  save_stories(stories = this.stories) {
    localStorage.setItem("fashion-stories", JSON.stringify(stories));
  }

  // CREATE
  add_story(story_data) {
    const new_story = {
      id: this.generate_id(),
      title: story_data.title,
      author: story_data.author,
      description: story_data.description,
      date: new Date().toISOString(),
    };

    this.stories.unshift(new_story);
    this.save_stories();
    if (this.is_manage_page) {
      this.render_management_stories();
    } else {
      this.render_stories();
    }
    return true;
  }

  // READ
  get_story_by_id(story_id) {
    return this.stories.find(story => story.id === story_id);
  }

  // UPDATE
  update_story(story_id, updated_data) {
    const story_index = this.stories.findIndex(story => story.id === story_id);
    if (story_index !== -1) {
      this.stories[story_index] = {
        ...this.stories[story_index],
        ...updated_data
      };
      this.save_stories();
      this.render_management_stories();
      return true;
    }
    return false;
  }

  // DELETE
  delete_story(story_id) {
    // Crear confirmación personalizada sin alert()
    const confirmation = this.create_custom_confirmation(
      "Are you sure you want to delete this story?",
      () => {
        this.stories = this.stories.filter((story) => story.id !== story_id);
        this.save_stories();
        this.render_management_stories();
      }
    );
  }

  // Renderizar stories en la página principal
  render_stories() {
    const container = document.getElementById("storiesContainer");
    if (!container) return;

    if (this.stories.length === 0) {
      container.innerHTML =
        '<p class="no-stories">No stories yet. Be the first to share your story!</p>';
      return;
    }

    container.innerHTML = this.stories
      .map(
        (story) => `
      <div class="story-card">
        <h3>${this.escape_html(story.title)}</h3>
        <p class="story-description">${this.escape_html(this.truncate_text(story.description, 200))}</p>
        <span class="story-author">By ${this.escape_html(story.author)}</span>
        <small class="story-date">${this.format_date(story.date)}</small>
      </div>
    `
      )
      .join("");
  }

  // Añadir botón de gestión a la página principal
  add_manage_button() {
    const stories_section = document.querySelector(".stories-section");
    if (stories_section) {
      const manage_button = document.createElement("a");
      manage_button.href = "manage-stories.html";
      manage_button.className = "manage-stories-btn";
      manage_button.innerHTML = '<i class="fas fa-edit"></i> Manage Stories';
      stories_section.appendChild(manage_button);
    }
  }

  // Renderizar stories en la página de gestión
  render_management_stories() {
    const container = document.getElementById("managementStoriesContainer");
    if (!container) return;

    if (this.stories.length === 0) {
      container.innerHTML =
        '<p class="no-stories">You haven\'t shared any stories yet.</p>';
      return;
    }

    container.innerHTML = this.stories
      .map(
        (story) => `
      <div class="management-story-card">
        <h4>${this.escape_html(story.title)}</h4>
        <p>${this.escape_html(this.truncate_text(story.description, 150))}</p>
        <div class="story-meta">
          <span class="story-author">By ${this.escape_html(story.author)}</span>
          <span class="story-date">${this.format_date(story.date)}</span>
        </div>
        <div class="story-actions">
          <button onclick="stories_manager.open_edit_modal('${story.id}')" class="edit-btn">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button onclick="stories_manager.delete_story('${story.id}')" class="delete-btn">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
    `
      )
      .join("");
  }

  // Setup del formulario de creación
  setup_story_form() {
    const story_form = document.getElementById("storyForm");
    if (story_form) {
      story_form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handle_story_submit(e);
      });
    }
  }

  // Setup del modal de edición
  setup_edit_modal() {
    const modal = document.getElementById("editModal");
    const close_btn = document.querySelector(".close-modal");
    const cancel_btn = document.querySelector(".cancel-btn");
    const edit_form = document.getElementById("editStoryForm");

    if (close_btn) {
      close_btn.addEventListener("click", () => this.close_edit_modal());
    }

    if (cancel_btn) {
      cancel_btn.addEventListener("click", () => this.close_edit_modal());
    }

    if (edit_form) {
      edit_form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handle_edit_submit(e);
      });
    }

    // Cerrar modal al hacer clic fuera
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.close_edit_modal();
        }
      });
    }
  }

  // Abrir modal de edición
  open_edit_modal(story_id) {
    const story = this.get_story_by_id(story_id);
    if (!story) return;

    this.editing_story_id = story_id;

    document.getElementById("editStoryTitle").value = story.title;
    document.getElementById("editStoryAuthor").value = story.author;
    document.getElementById("editStoryDescription").value = story.description;

    const modal = document.getElementById("editModal");
    if (modal) {
      modal.style.display = "flex";
      document.body.style.overflow = "hidden";
    }
  }

  // Cerrar modal de edición
  close_edit_modal() {
    const modal = document.getElementById("editModal");
    if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
    this.editing_story_id = null;
    document.getElementById("editStoryForm").reset();
  }

  // Manejar envío del formulario de creación
  handle_story_submit(event) {
    const form_data = {
      title: document.getElementById("storyTitle").value.trim(),
      author: document.getElementById("storyAuthor").value.trim(),
      description: document.getElementById("storyDescription").value.trim(),
    };

    if (!this.validate_form_data(form_data)) {
      this.show_error_message("Please fill in all fields.");
      return;
    }

    if (this.add_story(form_data)) {
      this.show_story_success();
      document.getElementById("storyForm").reset();
    }
  }

  // Manejar envío del formulario de edición
  handle_edit_submit(event) {
    if (!this.editing_story_id) return;

    const form_data = {
      title: document.getElementById("editStoryTitle").value.trim(),
      author: document.getElementById("editStoryAuthor").value.trim(),
      description: document.getElementById("editStoryDescription").value.trim(),
    };

    if (!this.validate_form_data(form_data)) {
      this.show_error_message("Please fill in all fields.");
      return;
    }

    if (this.update_story(this.editing_story_id, form_data)) {
      this.show_update_success();
      this.close_edit_modal();
    }
  }

  // Validar datos del formulario
  validate_form_data(data) {
    return data.title && data.author && data.description;
  }

  // Crear confirmación personalizada
  create_custom_confirmation(message, on_confirm) {
    // Crear overlay
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    `;

    // Crear modal de confirmación
    const modal = document.createElement("div");
    modal.style.cssText = `
      background: linear-gradient(to left, #686b35, #ced18f);
      padding: 30px;
      border-radius: 20px;
      color: #000000;
      max-width: 400px;
      width: 90%;
      text-align: center;
    `;

    modal.innerHTML = `
      <h3 style="margin-top: 0; color: #22211f;">Confirm Deletion</h3>
      <p style="margin-bottom: 25px; font-size: 1.1rem;">${message}</p>
      <div style="display: flex; gap: 15px; justify-content: center;">
        <button id="confirmCancel" style="
          background-color: #6c757d;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'Indie Flower', cursive;
          font-size: 1rem;
        ">Cancel</button>
        <button id="confirmDelete" style="
          background-color: #6b354a;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'Indie Flower', cursive;
          font-size: 1rem;
        ">Delete</button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Agregar event listeners
    document.getElementById("confirmCancel").addEventListener("click", () => {
      document.body.removeChild(overlay);
    });

    document.getElementById("confirmDelete").addEventListener("click", () => {
      document.body.removeChild(overlay);
      on_confirm();
    });
  }

  // Mostrar mensaje de error personalizado
  show_error_message(message) {
    // Crear mensaje de error temporal
    const error_msg = document.createElement("div");
    error_msg.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #6b354a;
      color: white;
      padding: 15px 25px;
      border-radius: 10px;
      z-index: 2000;
      font-family: 'Indie Flower', cursive;
      font-size: 1rem;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
    error_msg.textContent = message;
    
    document.body.appendChild(error_msg);
    
    // Remover después de 3 segundos
    setTimeout(() => {
      if (error_msg.parentNode) {
        document.body.removeChild(error_msg);
      }
    }, 3000);
  }

  // Helper functions
  escape_html(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  truncate_text(text, max_length) {
    if (text.length <= max_length) return text;
    return text.substr(0, max_length) + "...";
  }

  format_date(date_string) {
    const date = new Date(date_string);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }

  show_story_success() {
    const submit_btn = document.querySelector("#storyForm .submit-btn");
    const original_text = submit_btn.innerHTML;

    submit_btn.innerHTML = '<i class="fas fa-check"></i> Story Shared!';
    submit_btn.style.background = "linear-gradient(45deg, #4CAF50, #45a049)";

    setTimeout(() => {
      submit_btn.innerHTML = original_text;
      submit_btn.style.background = "#000000";
    }, 2000);

    // Scroll a la sección de stories
    if (!this.is_manage_page) {
      const stories_section = document.getElementById("stories");
      if (stories_section) {
        stories_section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  show_update_success() {
    const update_btn = document.querySelector("#editStoryForm .update-btn");
    const original_text = update_btn.innerHTML;

    update_btn.innerHTML = '<i class="fas fa-check"></i> Updated!';
    update_btn.style.background = "linear-gradient(45deg, #4CAF50, #45a049)";

    setTimeout(() => {
      update_btn.innerHTML = original_text;
      update_btn.style.background = "#4a6b35";
    }, 2000);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  window.stories_manager = new StoriesManager();
});