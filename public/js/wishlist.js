document.addEventListener("DOMContentLoaded", () => {
    const wishlistToggles = document.querySelectorAll(".wishlist-toggle");

    wishlistToggles.forEach(toggle => {
        toggle.addEventListener("click", async (e) => {
            e.preventDefault(); // Prevent default link behavior if inside an anchor tag
            e.stopPropagation(); // Stop the click from navigating to the listing page
            
            const listingId = toggle.getAttribute("data-id");
            const icon = toggle.querySelector("i");
            
            try {
                const response = await fetch(`/wishlist/${listingId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                });
                
                if (response.redirected) {
                    // User is not logged in, redirect to login page
                    window.location.href = response.url;
                    return;
                }
                
                if (response.ok) {
                    const result = await response.json();
                    if (result.added) {
                        icon.classList.remove("fa-regular", "text-white", "text-dark");
                        icon.classList.add("fa-solid", "text-danger");
                    } else {
                        icon.classList.remove("fa-solid", "text-danger");
                        // For show page, it's text-dark, for index it's text-white
                        if (toggle.closest('.card-img-overlay')) {
                            icon.classList.add("fa-regular", "text-white");
                        } else {
                            icon.classList.add("fa-regular", "text-dark");
                        }
                    }
                }
            } catch (err) {
                console.error("Error toggling wishlist:", err);
            }
        });
    });
});
