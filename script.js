// ----- DATA -----

const artists = [
  { name: "Riverbend Trio", genre: "Folk", availability: "Fri/Sat evenings", email: "riverbend@example.com", instruments: "Guitar, banjo, vocals", lat: 39.3305, lng: -82.0960, serviceRadius: 25 },
  { name: "DJ Lowkey", genre: "Electronic", availability: "Weekends", email: "djlowkey@example.com", instruments: "Turntables, laptop", lat: 39.3180, lng: -82.1050, serviceRadius: 10 }
];

const venues = [
  { name: "The Union", genre: "Folk/rock", slot: "Sat 8pm", email: "theunion@example.com", lat: 39.3292, lng: -82.1013, type: "Bar" },
  { name: "Casa Nueva", genre: "Any genre", slot: "Fri 9pm", email: "casanueva@example.com", lat: 39.3270, lng: -82.1013, type: "Restaurant" }
];

// ----- MAP STATE -----
// Tracks the map instance and the currently-drawn service radius circle,
// so other functions (outside renderMap) can access and update them.

let map;
let serviceCircle = null;

// ----- ARTIST CARDS -----

function renderArtists() {
    const column = document.getElementById('artist-column');
    artists.forEach((artist, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.id = `artist-card-${index}`;
        card.innerHTML = `
            <h3>${artist.name}</h3>
            <p>${artist.genre} · Available ${artist.availability}</p>
            <p>Instruments: ${artist.instruments}</p>
            <button onclick="requestArtist(${index})">Request this artist</button>
        `;
        column.appendChild(card);
    });
}

function requestArtist(index) {
    const venueName = prompt("Which venue is requesting this artist?");
    if (venueName) {
        const artist = artists[index];
        const card = document.getElementById(`artist-card-${index}`);
        card.innerHTML += `<p>Requested by ${venueName}</p>`;
        alert(`Request sent! Contact ${artist.name} at ${artist.email}`);
    }
}

// ----- VENUE CARDS -----

function renderVenues() {
    const column = document.getElementById('venue-column');
    venues.forEach((venue, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.id = `venue-card-${index}`;
        card.innerHTML = `
            <h3>${venue.name}</h3>
            <p>${venue.genre} · Slot: ${venue.slot}</p>
            <p>Venue type: ${venue.type}</p>
            <button onclick="signUpForSlot(${index})">Sign up for this slot</button>
        `;
        column.appendChild(card);
    });
}

function signUpForSlot(index) {
    const artistName = prompt("What's your artist/band name?");
    if (artistName) {
        const venue = venues[index];
        const card = document.getElementById(`venue-card-${index}`);
        card.innerHTML += `<p>Signed up: ${artistName}</p>`;
        alert(`Signed up! Contact ${venue.name} at ${venue.email}`);
    }
}

// ----- CARD HIGHLIGHTING (used when clicking map pins) -----

function highlightVenueCard(index) {
    document.querySelectorAll('.card').forEach(card => card.style.outline = 'none');
    const card = document.getElementById(`venue-card-${index}`);
    card.style.outline = '3px solid #d85a30';
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function highlightArtistCard(index) {
    document.querySelectorAll('.card').forEach(card => card.style.outline = 'none');
    const card = document.getElementById(`artist-card-${index}`);
    card.style.outline = '3px solid #d85a30';
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ----- MAP -----

function renderMap() {
    map = L.map('map').setView([39.3292, -82.1013], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    map.on('click', () => {
        if (serviceCircle) {
            map.removeLayer(serviceCircle);
            serviceCircle = null;
        }
        document.querySelectorAll('.card').forEach(card => card.style.outline = 'none');
    });

    // Venue pins (default blue markers)
    venues.forEach((venue, index) => {
        L.marker([venue.lat, venue.lng])
            .addTo(map)
            .bindPopup(`<b>${venue.name}</b><br>${venue.genre} · ${venue.slot}`)
            .on('click', () => highlightVenueCard(index));
    });

    // Artist pins (orange dots, distinct from venue pins)
    artists.forEach((artist, index) => {
        L.circleMarker([artist.lat, artist.lng], {
            radius: 8,
            color: '#d85a30',
            fillColor: '#d85a30',
            fillOpacity: 0.8
        })
        .addTo(map)
        .bindPopup(`<b>${artist.name}</b><br>${artist.genre} · Travels up to ${artist.serviceRadius} mi`)
        .on('click', () => showServiceArea(index));
    });
}

function showServiceArea(index) {
    const artist = artists[index];

    if (serviceCircle) {
        map.removeLayer(serviceCircle);
    }

    serviceCircle = L.circle([artist.lat, artist.lng], {
        radius: artist.serviceRadius * 1609.34, // miles to meters
        color: '#d85a30',
        fillColor: '#d85a30',
        fillOpacity: 0.15,
        interactive: false
    }).addTo(map);

    highlightArtistCard(index);
}

// ----- RUN EVERYTHING -----

renderArtists();
renderVenues();
renderMap();