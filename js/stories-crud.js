class StoriesManager {
  constructor() {
    this.stories = this.loadStories();
    this.init();
  }

  init() {
    this.renderStories();
    this.setupStoryForm();
  }

  loadStories() {
    const storedStories = localStorage.getItem("fashionStories");
    if (storedStories) {
      return JSON.parse(storedStories);
    } else {
      const defaultStories = [];
      this.saveStories(defaultStories);
      return defaultStories;
    }
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  saveStories(stories = this.stories) {
    localStorage.setItem("fashionStories", JSON.stringify(stories));
  }

  addStory(storyData) {
    const newStory = {
      id: this.generateId(),
      title: storyData.title,
      author: storyData.author,
      description: storyData.description,
      date: new Date().toISOString(),
    };

    this.stories.unshift(newStory);
    this.saveStories();
    this.renderStories();
    return true;
  }

  deleteStory(storyId) {
    this.stories = this.stories.filter((story) => story.id !== storyId);
    this.saveStories();
    this.renderStories();
  }

  renderStories() {
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
        <h3>${this.escapeHtml(story.title)}</h3>
        <p class="story-description">${this.escapeHtml(story.description)}</p>
        <span class="story-author">By ${this.escapeHtml(story.author)}</span>
        <br>
        <button onclick="storiesManager.deleteStory('${
          story.id
        }')" class="delete-story-btn">
          <i class="fas fa-trash"></i> Delete Story
        </button>
      </div>
    `
      )
      .join("");
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  setupStoryForm() {
    const storyForm = document.getElementById("storyForm");
    if (storyForm) {
      storyForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleStorySubmit(e);
      });
    }
  }

  handleStorySubmit(event) {
    const formData = {
      title: document.getElementById("storyTitle").value.trim(),
      author: document.getElementById("storyAuthor").value.trim(),
      description: document.getElementById("storyDescription").value.trim(),
    };

    if (!formData.title || !formData.author || !formData.description) {
      alert("Please fill in all fields");
      return;
    }

    if (this.addStory(formData)) {
      this.showStorySuccess();
      document.getElementById("storyForm").reset();
    }
  }

  showStorySuccess() {
    const submitBtn = document.querySelector("#storyForm .submit-btn");
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<i class="fas fa-check"></i> Story Shared!';
    submitBtn.style.background = "linear-gradient(45deg, #4CAF50, #45a049)";

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.style.background = "#000000";
    }, 2000);

    const storiesSection = document.getElementById("stories");
    if (storiesSection) {
      storiesSection.scrollIntoView({ behavior: "smooth" });
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  window.storiesManager = new StoriesManager();
});
