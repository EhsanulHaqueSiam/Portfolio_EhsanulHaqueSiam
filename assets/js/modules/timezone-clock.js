/**
 * Timezone Clock & Map Module
 * Updates the Dhaka timezone clock and initializes interactive world map
 */

let map = null;

/**
 * Initialize Leaflet.js world map
 */
const initWorldMap = () => {
    const mapContainer = document.getElementById('worldMap');
    if (!mapContainer || !window.L) return;

    // Dhaka coordinates
    const dhakaLat = 23.8103;
    const dhakaLng = 90.4125;

    // Initialize map centered on world view
    map = L.map('worldMap', {
        center: [20, 50],
        zoom: 2,
        minZoom: 2,
        maxZoom: 6,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        dragging: true
    });

    // Dark themed map tiles (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    // Custom marker icon with pulsing effect
    const pulseIcon = L.divIcon({
        className: 'pulse-marker',
        html: `
            <div class="marker-pin">
                <div class="pulse-ring"></div>
                <div class="pulse-ring delay"></div>
                <div class="marker-dot"></div>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    // Add marker for Dhaka
    const marker = L.marker([dhakaLat, dhakaLng], { icon: pulseIcon }).addTo(map);

    // Custom popup
    marker.bindPopup(`
        <div class="map-popup">
            <strong>📍 Dhaka, Bangladesh</strong>
            <p>My current location</p>
        </div>
    `, {
        className: 'custom-popup'
    });

    // Animate to Dhaka after a delay
    setTimeout(() => {
        map.flyTo([dhakaLat, dhakaLng], 4, {
            duration: 2
        });
    }, 1500);
};

/**
 * Format time for display
 */
const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12

    return {
        time: `${hours}:${minutes}`,
        period: period
    };
};

/**
 * Get availability status based on time
 */
const getAvailabilityStatus = (hours) => {
    // Working hours: 9 AM - 10 PM (Dhaka time)
    if (hours >= 9 && hours < 22) {
        return { status: 'Available', class: '' };
    } else if (hours >= 22 || hours < 1) {
        return { status: 'Limited Availability', class: 'busy' };
    } else {
        return { status: 'Offline (Sleeping)', class: 'offline' };
    }
};

/**
 * Update the clock display
 */
const updateClock = () => {
    const timeElement = document.getElementById('dhakaTime');
    const statusElement = document.getElementById('availabilityStatus');

    if (!timeElement) return;

    // Get Dhaka time (UTC+6)
    const now = new Date();
    const dhakaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }));

    const formatted = formatTime(dhakaTime);
    const availability = getAvailabilityStatus(dhakaTime.getHours());

    // Update time display
    const timeValue = timeElement.querySelector('.time-value');
    const timePeriod = timeElement.querySelector('.time-period');

    if (timeValue) timeValue.textContent = formatted.time;
    if (timePeriod) timePeriod.textContent = formatted.period;

    // Update availability status
    if (statusElement) {
        statusElement.textContent = availability.status;

        const statusDot = statusElement.previousElementSibling;
        if (statusDot) {
            statusDot.className = 'status-dot ' + availability.class;
        }
    }
};

/**
 * Initialize the timezone clock and map
 */
export const initTimezoneClock = () => {
    // Initialize the interactive map
    initWorldMap();

    // Initial clock update
    updateClock();

    // Update every minute
    setInterval(updateClock, 60000);

    // Quick updates for immediate feedback
    let quickUpdates = 0;
    const quickInterval = setInterval(() => {
        updateClock();
        quickUpdates++;
        if (quickUpdates >= 3) {
            clearInterval(quickInterval);
        }
    }, 1000);
};
