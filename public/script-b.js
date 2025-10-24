// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initMap();
});

function initMap() {
    const locations = [
        { lat: 23.6896, lon: 90.5510, text: "<strong>Garment production</strong><br>Lariz Fashion Ltd.<br>Bandar, Bangladesh" },
        { lat: 23.6170, lon: 90.4802, text: "<strong>Fabric production</strong><br>Fariha Knit Tex Ltd.<br>Narayanganj, Bangladesh" },
        { lat: 30.9052, lon: 75.8539, text: "<strong>Cotton and polyester yarn production</strong><br>Ludhiana<br>Punjab, India" },
        { lat: 30.1549, lon: 76.1978, text: "<strong>Cotton material</strong><br>Samana<br>Punjab, India" },
        { lat: 31.5352, lon: 120.3353, text: "<strong>Polyester material</strong><br>Wuxi<br>Jiangyin, China" },
        { lat: 24.0774, lon: 90.2110, text: "<strong>Viscose yarn production</strong><br>Kaliakair<br>Gazipur, Bangladesh" },
        { lat: 37.7521, lon: 27.4050, text: "<strong>Viscose material</strong><br>Söke<br>Aydın, Turkey" }
    ];
    
    const map = L.map('map', { 
        zoomControl: false,
        dragging: false,
        touchZoom: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false
    }).setView([28, 80], 2);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);
    
    const zoomControl = L.control.zoom({ position: 'topright' }).addTo(map);
    zoomControl._container.style.pointerEvents = 'none';
    zoomControl._container.style.opacity = '0.5';
    
    const connections = [
        { start: 4, end: 2 },
        { start: 3, end: 2 },
        { start: 2, end: 1 },
        { start: 1, end: 0 },
        { start: 6, end: 5 },
        { start: 5, end: 1 }
    ];
    
    connections.forEach(conn => {
        const start = locations[conn.start];
        const end = locations[conn.end];
        
        L.polyline([[start.lat, start.lon], [end.lat, end.lon]], {
            color: '#1a1a1a',
            weight: 2.5,
            opacity: 0.8,
            dashArray: '8, 8'
        }).addTo(map);
    });
    
    const iconPaths = [
        '{{supply_chain_1}}',
        '{{supply_chain_2}}', 
        '{{supply_chain_3}}',
        '{{supply_chain_4}}',
        '{{supply_chain_4b}}',
        '{{supply_chain_3c}}',
        '{{supply_chain_4c}}'
    ];
    
    locations.forEach((loc, index) => {
        const icon = L.divIcon({
            html: `<img src="${iconPaths[index]}" style="width:32px;height:32px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.1));border-radius:50%;">`,
            className: 'custom-marker',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
        
        L.marker([loc.lat, loc.lon], { icon })
            .addTo(map)
            .bindPopup(loc.text, {
                className: 'custom-popup',
                maxWidth: 300,
                closeButton: false
            });
    });
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .custom-marker {
            background: transparent !important;
            border: none !important;
        }
        .custom-popup .leaflet-popup-content-wrapper {
            background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 0;
        }
        .custom-popup .leaflet-popup-content {
            margin: 12px 16px; font-size: 14px; line-height: 1.4;
        }
        .custom-popup .leaflet-popup-tip {
            background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
    `;
    document.head.appendChild(style);

    // Map interaction handling
    const mapContainer = document.getElementById('map');
    const mapOverlay = document.getElementById('mapOverlay');
    let mapEnabled = false;

    mapContainer.addEventListener('click', function() {
        if (!mapEnabled) {
            // Enable map interaction
            map.dragging.enable();
            map.touchZoom.enable();
            map.scrollWheelZoom.enable();
            map.doubleClickZoom.enable();
            map.boxZoom.enable();
            map.keyboard.enable();
            
            // Hide overlay
            mapOverlay.classList.add('hidden');
            mapEnabled = true;
            
            // Enable zoom control
            zoomControl._container.style.pointerEvents = 'auto';
            zoomControl._container.style.opacity = '1';
        }
    });

    // Disable map interaction when clicking outside
    document.addEventListener('click', function(e) {
        if (mapEnabled && !mapContainer.contains(e.target)) {
            // Disable map interaction
            map.dragging.disable();
            map.touchZoom.disable();
            map.scrollWheelZoom.disable();
            map.doubleClickZoom.disable();
            map.boxZoom.disable();
            map.keyboard.disable();
            
            // Show overlay
            mapOverlay.classList.remove('hidden');
            mapEnabled = false;
            
            // Disable zoom control
            zoomControl._container.style.pointerEvents = 'none';
            zoomControl._container.style.opacity = '0.5';
        }
    });
}
