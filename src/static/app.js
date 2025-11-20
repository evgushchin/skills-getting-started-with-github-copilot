document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        // Create participants section
        let participantsSection;
        if (details.participants.length > 0) {
          const ul = document.createElement("ul");
          ul.className = "participants-list";
          details.participants.forEach(email => {
            const li = document.createElement("li");
            const span = document.createElement("span");
            span.className = "participant-email";
            span.textContent = email;
            const btn = document.createElement("button");
            btn.className = "delete-participant";
            btn.title = "Remove";
            btn.innerHTML = "&#128465;";
            btn.setAttribute("data-activity", name);
            btn.setAttribute("data-email", email);
            li.appendChild(span);
            li.appendChild(btn);
            ul.appendChild(li);
          });
          participantsSection = ul;
        } else {
          const p = document.createElement("p");
          p.className = "no-participants";
          p.textContent = "No participants yet. Be the first to sign up!";
          participantsSection = p;
        }

        // Build activity card content safely
        const h4 = document.createElement("h4");
        h4.textContent = name;
        const descP = document.createElement("p");
        descP.textContent = details.description;
        const schedP = document.createElement("p");
        const schedStrong = document.createElement("strong");
        schedStrong.textContent = "Schedule:";
        schedP.appendChild(schedStrong);
        schedP.appendChild(document.createTextNode(" " + details.schedule));
        const availP = document.createElement("p");
        const availStrong = document.createElement("strong");
        availStrong.textContent = "Availability:";
        availP.appendChild(availStrong);
        availP.appendChild(document.createTextNode(` ${spotsLeft} spots left`));
        const partSectionDiv = document.createElement("div");
        partSectionDiv.className = "participants-section";
        const partCountP = document.createElement("p");
        const partCountStrong = document.createElement("strong");
        partCountStrong.textContent = `Participants (${details.participants.length}):`;
        partCountP.appendChild(partCountStrong);
        partSectionDiv.appendChild(partCountP);
        partSectionDiv.appendChild(participantsSection);

        activityCard.appendChild(h4);
        activityCard.appendChild(descP);
        activityCard.appendChild(schedP);
        activityCard.appendChild(availP);
        activityCard.appendChild(partSectionDiv);
        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });

      // Add event listeners for delete buttons
      document.querySelectorAll('.delete-participant').forEach(btn => {
        btn.addEventListener('click', async () => {
          const activity = btn.getAttribute('data-activity');
          const email = btn.getAttribute('data-email');
          if (!confirm(`Remove ${email} from ${activity}?`)) return;
          try {
            const response = await fetch(`/activities/${encodeURIComponent(activity)}/unregister?email=${encodeURIComponent(email)}`, {
              method: 'DELETE',
            });
            const result = await response.json();
            if (response.ok) {
              fetchActivities();
            } else {
              alert(result.detail || 'Failed to remove participant.');
            }
          } catch (err) {
            alert('Error removing participant.');
          }
        });
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
        fetchActivities(); // Refresh activities list after signup
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
