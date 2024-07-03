// Handle login form submission
const handleLogin = async (event) => {
  event.preventDefault();
  const formData = new FormData(document.getElementById("loginForm"));
  const username = formData.get("username");
  const password = formData.get("password");

  try {
    const response = await fetch("/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      window.location.href = "/";
    } else {
      document.getElementById("loginMessage").textContent = data.message;
    }
  } catch (error) {
    console.error("Error logging in:", error);
    document.getElementById("loginMessage").textContent =
      "Error logging in. Please try again.";
  }
};

// Handle signup form submission
const handleSignup = async (event) => {
  event.preventDefault();
  const formData = new FormData(document.getElementById("signupForm"));
  const username = formData.get("username");
  const password = formData.get("password");

  try {
    const response = await fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
      window.location.href = "/";
    } else {
      document.getElementById("signupMessage").textContent = data.message;
    }
  } catch (error) {
    console.error("Error signing up:", error);
    document.getElementById("signupMessage").textContent =
      "Error signing up. Please try again.";
  }
};

// Attach event listeners to login and signup forms
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", handleSignup);
  }
});

// Function to fetch home page data
const fetchHomePageData = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch("/", {
      method: "GET",
      headers: headers,
    });

    // if (response.ok) {
    //   const data = await response.json();
    //   console.log("User data:", data);
    //   // Handle rendering of logged-in or login page based on response
    // } else {
    //   console.error("Failed to fetch home page data:", response.statusText);
    //   // Handle error and redirect to login page if necessary
    // }
  } catch (error) {
    console.error("Error fetching home page data:", error);
  }
};

// Call fetchHomePageData when the DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
  fetchHomePageData();
});
