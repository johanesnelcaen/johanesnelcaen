document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  const messageDiv = document.getElementById("form-message");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          form.reset();
          messageDiv.innerText = "✅ Message envoyé avec succès !";
          messageDiv.style.display = "block";
          messageDiv.style.color = "green";
        } else {
          messageDiv.innerText = "❌ Une erreur est survenue. Réessayez.";
          messageDiv.style.display = "block";
          messageDiv.style.color = "red";
        }
      } catch (error) {
        messageDiv.innerText = "❌ Erreur réseau.";
        messageDiv.style.display = "block";
        messageDiv.style.color = "red";
      }
    });
  }
});
