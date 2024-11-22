$(document).ready(function () {
    // Toggle menu and navbar
    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    // Scroll and load events
    $(window).on('scroll load', function () {
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if (window.scrollY > 60) {
            document.querySelector('#scroll-top').classList.add('active');
        } else {
            document.querySelector('#scroll-top').classList.remove('active');
        }
    });
});

// Handle visibility changes
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === "visible") {
        document.title = "Projects | Portfolio Ehsanul Haque";
        $("#favicon").attr("href", "/assets/images/favicon.png");
    } else {
        document.title = "Come Back To Portfolio";
        $("#favicon").attr("href", "/assets/images/favhand.png");
    }
});

// Fetch projects
async function getProjects() {
    try {
        const response = await fetch("projects.json");
        if (!response.ok) throw new Error("Failed to fetch projects.");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        alert("Failed to load projects. Please try again later.");
        return [];
    }
}

function showProjects(projects) {
    const projectsContainer = document.querySelector(".work .box-container");
    let projectsHTML = "";

    projects.forEach(project => {
        projectsHTML += `
        <div class="grid-item ${project.category}">
            <div class="box tilt" style="width: 380px; margin: 1rem">
                <img draggable="false" src="/assets/images/projects/${project.image}.png" alt="project" />
                <div class="content">
                    <div class="tag">
                        <h3>${project.name}</h3>
                    </div>
                    <div class="desc">
                        <p>${project.desc}</p>
                        <div class="btns">
                            <a href="${project.links.view}" class="btn" target="_blank"><i class="fas fa-eye"></i> View</a>
                            <a href="${project.links.code}" class="btn" target="_blank">Code <i class="fas fa-code"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    });

    projectsContainer.innerHTML = projectsHTML;

    // Initialize Isotope for filtering
    const $grid = $('.box-container').isotope({
        itemSelector: '.grid-item',
        layoutMode: 'fitRows',
    });

    // Filter items on button click
    $('.button-group').on('click', 'button', function () {
        $('.button-group').find('.is-checked').removeClass('is-checked');
        $(this).addClass('is-checked');
        const filterValue = $(this).attr('data-filter');
        $grid.isotope({ filter: filterValue });
    });
}

getProjects().then(data => showProjects(data));

// Tawk.to Live Chat Integration
var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
(function () {
    var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/60df10bf7f4b000ac03ab6a8/1f9jlirg6';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);
})();

// Disable developer tools (not recommended)
document.onkeydown = function (e) {
    // Disable F12
    if (e.code === "F12") {
        return false;
    }

    // Disable Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+Shift+J
    if (e.ctrlKey && e.shiftKey && (e.code === "KeyI" || e.code === "KeyC" || e.code === "KeyJ")) {
        return false;
    }

    // Disable Ctrl+U
    if (e.ctrlKey && e.code === "KeyU") {
        return false;
    }
};

