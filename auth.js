// ==========================================
// LOGIN
// ==========================================

const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("error");

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        errorMessage.textContent = "";

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const { error } =
            await supabaseClient.auth.signInWithPassword({
                email,
                password
            });

        if (error) {
            errorMessage.textContent = error.message;
            return;
        }

        window.location.href = "index.html";
    });

}


// ==========================================
// PROTECT PAGES
// ==========================================

async function requireLogin() {

    const {
        data: { user },
        error
    } = await supabaseClient.auth.getUser();

    if (error || !user) {

        // User isn't logged in
        window.location.href = "login.html";

        return false;
    }

    return true;
}