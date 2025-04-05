/**
 * ECODATA CIC Interactive Transport Map
 * Professional implementation with enhanced features
 */

// Configuration Manager
const ConfigManager = {
  TFL_API: {
    APP_ID: 'YOUR_TFL_APP_ID',
    APP_KEY: 'YOUR_TFL_APP_KEY',
    BASE_URL: 'https://api.tfl.gov.uk',
    CACHE_TTL: 300000 // 5 minutes cache
  },
  PARKING_API: {
    BASE_URL: 'https://api.example.com/parking',
    API_KEY: 'YOUR_PARKING_API_KEY',
    CACHE_TTL: 600000 // 10 minutes cache
  },
  MAP_CONFIG: {
    DEFAULT_ZOOM: 16,
    HQ_COORDINATES: [51.528857, -0.090924],
    MAX_ZOOM: 18,
    MIN_ZOOM: 12
  }
};

// Cache Service
const CacheService = {
  storage: new Map(),
  
  set(key, data, ttl) {
    this.storage.set(key, {
      data,
      expires: Date.now() + ttl
    });
  },
  
  get(key) {
    const item = this.storage.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.storage.delete(key);
      return null;
    }
    
    return item.data;
  },
  
  clear() {
    this.storage.clear();
  }
};

// API Service
const ApiService = {
  async fetchTflData(endpoint, params = {}) {
    const cacheKey = `tfl_${endpoint}_${JSON.stringify(params)}`;
    const cachedData = CacheService.get(cacheKey);
    if (cachedData) return cachedData;
    
    try {
      const url = new URL(endpoint, ConfigManager.TFL_API.BASE_URL);
      url.search = new URLSearchParams({
        ...params,
        app_id: ConfigManager.TFL_API.APP_ID,
        app_key: ConfigManager.TFL_API.APP_KEY
      }).toString();
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      CacheService.set(cacheKey, data, ConfigManager.TFL_API.CACHE_TTL);
      return data;
    } catch (error) {
      console.error(`TFL API Error [${endpoint}]:`, error);
      throw error;
    }
  },
  
  async fetchParkingData(endpoint) {
    const cacheKey = `parking_${endpoint}`;
    const cachedData = CacheService.get(cacheKey);
    if (cachedData) return cachedData;
    
    try {
      const response = await fetch(`${ConfigManager.PARKING_API.BASE_URL}/${endpoint}`, {
        headers: { 'Authorization': `Bearer ${ConfigManager.PARKING_API.API_KEY}` }
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      CacheService.set(cacheKey, data, ConfigManager.PARKING_API.CACHE_TTL);
      return data;
    } catch (error) {
      console.error(`Parking API Error [${endpoint}]:`, error);
      throw error;
    }
  }
};

// Map Manager
const MapManager = {
  map: null,
  layers: {
    parking: L.layerGroup(),
    tubeStations: L.layerGroup(),
    busStops: L.layerGroup()
  },
  
  init() {
    this.map = L.map('interactive-map', {
      center: ConfigManager.MAP_CONFIG.HQ_COORDINATES,
      zoom: ConfigManager.MAP_CONFIG.DEFAULT_ZOOM,
      maxZoom: ConfigManager.MAP_CONFIG.MAX_ZOOM,
      minZoom: ConfigManager.MAP_CONFIG.MIN_ZOOM,
      zoomControl: false
    });
    
    // Add tile layer with dark/light theme support
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      detectRetina: true
    }).addTo(this.map);
    
    // Custom zoom control
    L.control.zoom({ position: 'topright' }).addTo(this.map);
    
    // Add HQ marker
    this.addHqMarker();
    
    // Initialize all layers
    Object.values(this.layers).forEach(layer => layer.addTo(this.map));
    
    return this.map;
  },
  
  addHqMarker() {
    const icon = L.divIcon({
      html: '<i class="fas fa-leaf"></i>',
      className: 'ecodata-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });
    
    L.marker(ConfigManager.MAP_CONFIG.HQ_COORDINATES, { icon })
      .addTo(this.map)
      .bindPopup(`
        <div class="map-popup">
          <h3>ECODATA CIC</h3>
          <p>128 City Road<br>London EC1V 2NX</p>
          <button onclick="openDirections()" class="popup-btn">
            <i class="fas fa-directions"></i> Get Directions
          </button>
        </div>
      `)
      .openPopup();
  },
  
  addParkingLocations(locations) {
    this.layers.parking.clearLayers();
    
    locations.forEach(location => {
      const icon = L.divIcon({
        html: location.type === "disabled" ? 
          '<i class="fas fa-wheelchair"></i>' : 
          '<i class="fas fa-parking"></i>',
        className: `parking-marker ${location.type}`,
        iconSize: [36, 36],
        iconAnchor: [18, 36]
      });
      
      L.marker(location.coords, { icon })
        .addTo(this.layers.parking)
        .bindPopup(`
          <div class="map-popup">
            <h4>${location.title}</h4>
            <p>${location.details}</p>
            ${location.available ? `<p>Spaces available: ${location.available}</p>` : ''}
          </div>
        `);
    });
  },
  
  addTubeStations(stations) {
    this.layers.tubeStations.clearLayers();
    
    stations.forEach(station => {
      const icon = L.divIcon({
        html: '<i class="fas fa-train-subway"></i>',
        className: 'tube-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 36]
      });
      
      L.marker(station.coords, { icon })
        .addTo(this.layers.tubeStations)
        .bindPopup(`
          <div class="map-popup">
            <h4>${station.name} Station</h4>
            <p>${station.line} Line</p>
            <p>${station.walkTime} walk to ECODATA</p>
            ${station.status ? `<p class="status ${getStatusClass(station.status)}">${station.status}</p>` : ''}
          </div>
        `);
    });
  },
  
  addBusStops(stops) {
    this.layers.busStops.clearLayers();
    
    stops.forEach(stop => {
      const icon = L.divIcon({
        html: '<i class="fas fa-bus"></i>',
        className: 'bus-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 36]
      });
      
      L.marker(stop.coords, { icon })
        .addTo(this.layers.busStops)
        .bindPopup(`
          <div class="map-popup">
            <h4>${stop.name}</h4>
            <p>Route ${stop.route}</p>
            ${stop.nextArrival ? `<p>Next bus: ${stop.nextArrival} min</p>` : ''}
          </div>
        `);
    });
  },
  
  toggleLayer(layerName, show) {
    if (show) {
      this.map.addLayer(this.layers[layerName]);
    } else {
      this.map.removeLayer(this.layers[layerName]);
    }
  },
  
  fitBounds(layerName) {
    if (this.layers[layerName] && this.layers[layerName].getLayers().length > 0) {
      this.map.fitBounds(this.layers[layerName].getBounds(), { padding: [50, 50] });
    }
  }
};

// Transport Data Service
const TransportService = {
  async loadParkingData() {
    try {
      // In a real implementation, replace with actual API call
      // const data = await ApiService.fetchParkingData('cityroad');
      
      // Mock data for demonstration
      const mockData = [
        {
          coords: [51.5295, -0.0912],
          title: "NCP Car Park City Road",
          details: "3 min walk | £6.50/hour",
          type: "parking",
          available: 24
        },
        {
          coords: [51.5288, -0.0902],
          title: "Disabled Parking",
          details: "2 bays opposite building",
          type: "disabled",
          available: 1
        }
      ];
      
      MapManager.addParkingLocations(mockData);
      return mockData;
    } catch (error) {
      console.error("Failed to load parking data:", error);
      throw error;
    }
  },
  
  async loadTubeStations() {
    try {
      // Get tube status first
      const statusData = await ApiService.fetchTflData('Line/Mode/tube/Status');
      
      // Mock station data (in real app, use TFL API for precise locations)
      const stations = [
        {
          name: "Old Street",
          coords: [51.5255, -0.0876],
          line: "Northern",
          walkTime: "8 min",
          status: this.getTubeStatusDescription(statusData, "northern")
        },
        {
          name: "Angel",
          coords: [51.5322, -0.1058],
          line: "Northern",
          walkTime: "12 min",
          status: this.getTubeStatusDescription(statusData, "northern")
        }
      ];
      
      MapManager.addTubeStations(stations);
      return stations;
    } catch (error) {
      console.error("Failed to load tube stations:", error);
      throw error;
    }
  },
  
  async loadBusStops() {
    try {
      // Get bus arrival data
      const stopCodes = ['490008638N', '490008638S']; // Example stop codes
      const arrivalsData = await Promise.all(
        stopCodes.map(code => ApiService.fetchTflData(`StopPoint/${code}/Arrivals`))
      );
      
      // Mock stop data with real arrival info if available
      const stops = [
        {
          name: "City Road (Stop N)",
          coords: [51.5275, -0.0893],
          route: "43",
          nextArrival: arrivalsData[0]?.[0] ? Math.round(arrivalsData[0][0].timeToStation / 60) : null
        },
        {
          name: "City Road (Stop S)",
          coords: [51.5278, -0.0895],
          route: "205/214",
          nextArrival: arrivalsData[1]?.[0] ? Math.round(arrivalsData[1][0].timeToStation / 60) : null
        }
      ];
      
      MapManager.addBusStops(stops);
      return stops;
    } catch (error) {
      console.error("Failed to load bus stops:", error);
      throw error;
    }
  },
  
  getTubeStatusDescription(statusData, lineId) {
    if (!statusData) return "Status unknown";
    
    const line = statusData.find(item => item.id.toLowerCase() === lineId);
    if (!line || !line.lineStatuses?.[0]) return "Status unknown";
    
    return line.lineStatuses[0].statusSeverityDescription;
  }
};

// UI Controller
const UIController = {
  init() {
    this.setupTabs();
    this.setupThemeToggle();
    this.setupForm();
    this.setupEventListeners();
    this.updateLastUpdatedTime();
  },
  
  setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update UI
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
        
        // Load data if needed
        if (tabId === 'live') {
          this.loadLiveTransportData();
        }
      });
    });
  },
  
  setupThemeToggle() {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;
    
    const icon = toggle.querySelector('i');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    
    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    });
  },
  
  setupForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      try {
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        // Simulate form submission (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success
        this.showFormFeedback('success', 'Thank you! Your message has been sent.');
        form.reset();
      } catch (error) {
        this.showFormFeedback('error', 'Failed to send message. Please try again.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  },
  
  showFormFeedback(type, message) {
    const feedbackEl = document.createElement('div');
    feedbackEl.className = `form-feedback ${type}`;
    feedbackEl.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      <span>${message}</span>
    `;
    
    const form = document.getElementById('contactForm');
    form.prepend(feedbackEl);
    
    // Remove after 5 seconds
    setTimeout(() => feedbackEl.remove(), 5000);
  },
  
  setupEventListeners() {
    // Map control buttons
    document.getElementById('showParkingBtn')?.addEventListener('click', () => {
      const isVisible = MapManager.map.hasLayer(MapManager.layers.parking);
      MapManager.toggleLayer('parking', !isVisible);
    });
    
    document.getElementById('showTubeBtn')?.addEventListener('click', () => {
      const isVisible = MapManager.map.hasLayer(MapManager.layers.tubeStations);
      MapManager.toggleLayer('tubeStations', !isVisible);
      if (!isVisible) MapManager.fitBounds('tubeStations');
    });
    
    document.getElementById('showBusesBtn')?.addEventListener('click', () => {
      const isVisible = MapManager.map.hasLayer(MapManager.layers.busStops);
      MapManager.toggleLayer('busStops', !isVisible);
      if (!isVisible) MapManager.fitBounds('busStops');
    });
    
    // Refresh button
    document.getElementById('refreshDataBtn')?.addEventListener('click', () => {
      CacheService.clear();
      this.loadLiveTransportData();
    });
  },
  
  async loadLiveTransportData() {
    try {
      this.showLoadingState();
      
      const [parkingData, tubeData, busData] = await Promise.all([
        TransportService.loadParkingData(),
        TransportService.loadTubeStations(),
        TransportService.loadBusStops()
      ]);
      
      this.updateTransportUI(parkingData, tubeData, busData);
      this.updateLastUpdatedTime();
    } catch (error) {
      this.showErrorState();
    } finally {
      this.hideLoadingState();
    }
  },
  
  showLoadingState() {
    document.querySelectorAll('.live-data-container').forEach(container => {
      container.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>';
    });
  },
  
  hideLoadingState() {
    document.querySelectorAll('.loading-spinner').forEach(spinner => {
      spinner.remove();
    });
  },
  
  showErrorState() {
    document.querySelectorAll('.live-data-container').forEach(container => {
      container.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-triangle"></i> Failed to load data</div>';
    });
  },
  
  updateTransportUI(parkingData, tubeData, busData) {
    this.updateParkingUI(parkingData);
    this.updateTubeUI(tubeData);
    this.updateBusUI(busData);
  },
  
  updateParkingUI(data) {
    const container = document.getElementById('parking-status-container');
    if (!container) return;
    
    container.innerHTML = data.map(location => `
      <div class="live-item">
        <i class="fas fa-${location.type === 'disabled' ? 'wheelchair' : 'parking'}"></i>
        <div class="live-item-content">
          <div class="live-item-title">${location.title}</div>
          <div class="live-item-detail">${location.details}</div>
        </div>
        <div class="live-item-time">
          <span class="status-dot ${this.getAvailabilityClass(location.available)}"></span>
          ${location.available !== undefined ? location.available + ' spaces' : ''}
        </div>
      </div>
    `).join('');
  },
  
  updateTubeUI(data) {
    const container = document.getElementById('tube-status-container');
    if (!container) return;
    
    container.innerHTML = data.map(station => `
      <div class="live-item">
        <i class="fas fa-train-subway"></i>
        <div class="live-item-content">
          <div class="live-item-title">${station.name} Station</div>
          <div class="live-item-detail">${station.line} Line • ${station.walkTime} walk</div>
        </div>
        <div class="live-item-time">
          <span class="status-dot ${this.getStatusClass(station.status)}"></span>
          ${station.status || 'Status unknown'}
        </div>
      </div>
    `).join('');
  },
  
  updateBusUI(data) {
    const container = document.getElementById('bus-times-container');
    if (!container) return;
    
    container.innerHTML = data.map(stop => `
      <div class="live-item">
        <i class="fas fa-bus"></i>
        <div class="live-item-content">
          <div class="live-item-title">Route ${stop.route}</div>
          <div class="live-item-detail">${stop.name}</div>
        </div>
        <div class="live-item-time">
          ${stop.nextArrival !== null ? stop.nextArrival + ' min' : 'No data'}
        </div>
      </div>
    `).join('');
  },
  
  getStatusClass(status) {
    if (!status) return 'status-unknown';
    if (status.includes('Severe') || status.includes('Closed')) return 'status-severe';
    if (status.includes('Minor') || status.includes('Part')) return 'status-minor';
    return 'status-good';
  },
  
  getAvailabilityClass(available) {
    if (available === undefined) return 'status-unknown';
    if (available === 0) return 'status-severe';
    if (available < 5) return 'status-minor';
    return 'status-good';
  },
  
  updateLastUpdatedTime() {
    const timeElement = document.getElementById('lastUpdatedTime');
    if (timeElement) {
      timeElement.textContent = new Date().toLocaleTimeString();
    }
  }
};

// Helper functions
function openDirections() {
  window.open('https://www.google.com/maps/dir/?api=1&destination=128+City+Road,+London+EC1V+2NX', '_blank');
}

function getStatusClass(severity) {
  if (severity < 5) return 'status-severe';
  if (severity < 9) return 'status-minor';
  return 'status-good';
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  // Initialize map
  MapManager.init();
  
  // Initialize UI
  UIController.init();
  
  // Load initial data
  UIController.loadLiveTransportData();
  
  // Set up auto-refresh every 5 minutes
  setInterval(() => UIController.loadLiveTransportData(), 300000);
});