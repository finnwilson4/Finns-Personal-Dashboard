document.addEventListener("DOMContentLoaded", () => {

    const logoutButton = document.getElementById("logout-button");

    if (!logoutButton) return;

    logoutButton.addEventListener("click", async () => {

        const { error } = await supabaseClient.auth.signOut();

        if (error) {
            console.error("Error logging out:", error);
            alert("Failed to log out. Please try again.");
            return;
        }

        window.location.href = "login.html";
    });

});