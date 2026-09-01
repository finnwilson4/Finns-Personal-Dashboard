const SUPABASE_URL = "https://dpgpkhzlpsbrypfribuc.supabase.co";

const SUPABASE_KEY = "sb_publishable_kI5Pt0JK7VEa_XSjPgc-FQ_6vBRP-H9";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// Load the current user's dashboard data from Supabase
async function loadDashboardData() {
    const {
        data: { user },
        error: userError
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
        console.error("No authenticated user found.");
        return null;
    }

    const { data, error } = await supabaseClient
        .from("dashboard_data")
        .select("data")
        .eq("user_id", user.id)
        .maybeSingle();

    if (error) {
        console.error("Error loading dashboard data:", error);
        return null;
    }

    return data ? data.data : null;
}


// Save the current user's dashboard data to Supabase
async function saveDashboardData(dashboardData) {
    const {
        data: { user },
        error: userError
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
        console.error("No authenticated user found.");
        return false;
    }

    const { error } = await supabaseClient
        .from("dashboard_data")
        .upsert({
            user_id: user.id,
            data: dashboardData,
            updated_at: new Date().toISOString()
        });

    if (error) {
        console.error("Error saving dashboard data:", error);
        return false;
    }

    return true;
}

async function updateDashboardSection(section, value) {

    const {
        data: { user },
        error: userError
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
        console.error("No authenticated user found.");
        return false;
    }

    // Get the latest dashboard data
    const { data: row, error: loadError } = await supabaseClient
        .from("dashboard_data")
        .select("data")
        .eq("user_id", user.id)
        .maybeSingle();

    if (loadError) {
        console.error("Error loading dashboard data:", loadError);
        return false;
    }

    const dashboardData = row?.data || {};

    // Change only this section
    dashboardData[section] = value;

    // Save the updated dashboard
    const { error: saveError } = await supabaseClient
        .from("dashboard_data")
        .upsert({
            user_id: user.id,
            data: dashboardData,
            updated_at: new Date().toISOString()
        });

    if (saveError) {
        console.error("Error saving dashboard data:", saveError);
        return false;
    }

    return true;
}