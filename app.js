const STORAGE_KEYS = {
  mapboxToken: "north-aster-mapbox-token",
  theme: "north-aster-theme",
  mode: "north-aster-mode",
  view: "north-aster-view",
};

const zoneDefinitions = [
  {
    id: "plant",
    kind: "plant",
    name: "Electrolysis Power Plant",
    shortType: "Hydrogen Core",
    coords: [77.5804, 12.9794],
    x: 280,
    y: 310,
  },
  {
    id: "school",
    kind: "school",
    name: "North Aster School",
    shortType: "Education",
    coords: [77.6088, 12.9881],
    x: 1060,
    y: 220,
  },
  {
    id: "hospital",
    kind: "hospital",
    name: "Aster General Hospital",
    shortType: "Critical Care",
    coords: [77.6154, 12.9656],
    x: 1140,
    y: 610,
  },
  {
    id: "residential",
    kind: "residential",
    name: "Residential Areas",
    shortType: "Urban Living",
    coords: [77.5996, 12.9577],
    x: 760,
    y: 760,
  },
  {
    id: "swing",
    kind: "swing",
    name: "Energy Generating Swing",
    shortType: "Kinetic Park",
    coords: [77.5867, 12.9526],
    x: 420,
    y: 840,
  },
];

const trafficDefinitions = [
  {
    id: "traffic-alpha",
    kind: "traffic",
    name: "Arduino Junction Alpha",
    shortType: "Traffic Node",
    coords: [77.5935, 12.9785],
    x: 620,
    y: 390,
  },
  {
    id: "traffic-beta",
    kind: "traffic",
    name: "Arduino Junction Beta",
    shortType: "Traffic Node",
    coords: [77.6034, 12.9722],
    x: 820,
    y: 520,
  },
  {
    id: "traffic-gamma",
    kind: "traffic",
    name: "Arduino Junction Gamma",
    shortType: "Traffic Node",
    coords: [77.5991, 12.9612],
    x: 760,
    y: 710,
  },
];

const shoppingProducts = [
  {
    id: "prod-energy",
    audience: "Business",
    category: "Energy",
    name: "Hydrogen Buffer Module",
    price: 1850000,
    accent: "Grid upgrade",
    description: "Adds high-capacity storage to smooth plant swings and protect reserve margins.",
  },
  {
    id: "prod-mobility",
    audience: "Business",
    category: "Mobility",
    name: "Autonomous Transit Shuttle",
    price: 2650000,
    accent: "Fleet unit",
    description: "Smart corridor shuttle designed for adaptive routing across the North Aster road grid.",
  },
  {
    id: "prod-healthcare",
    audience: "Business",
    category: "Healthcare",
    name: "Hospital Microgrid Cabinet",
    price: 3290000,
    accent: "Critical care",
    description: "Dedicated backup energy cabinet for intensive care wings and surgical resilience.",
  },
  {
    id: "prod-education",
    audience: "Business",
    category: "Education",
    name: "STEM Immersive Lab Pod",
    price: 1490000,
    accent: "Campus upgrade",
    description: "Interactive smart classroom pod with energy analytics, robotics kits, and telemetry boards.",
  },
  {
    id: "prod-residential",
    audience: "Business",
    category: "Residential",
    name: "Smart Home Control Tower",
    price: 895000,
    accent: "Housing block",
    description: "Apartment-scale demand response and appliance orchestration for peak-hour savings.",
  },
  {
    id: "prod-electronics",
    audience: "Business",
    category: "Electronics",
    name: "City Command Display Wall",
    price: 1245000,
    accent: "Operations suite",
    description: "Large-format monitoring wall for control rooms, analytics centers, and emergency command hubs.",
  },
  {
    id: "prod-clothing",
    audience: "Business",
    category: "Clothing",
    name: "Smart Utility Field Kit",
    price: 185000,
    accent: "Crew apparel",
    description: "Premium field uniform bundle with reflective jackets, sensor pockets, and weather-ready fabrics.",
  },
  {
    id: "prod-security",
    audience: "Business",
    category: "Security",
    name: "Urban Safety Drone Pack",
    price: 2140000,
    accent: "City patrol",
    description: "Autonomous surveillance and response drone fleet for public-safety corridors and event zones.",
  },
  {
    id: "prod-public",
    audience: "Business",
    category: "Public Spaces",
    name: "Interactive Civic Plaza Hub",
    price: 1680000,
    accent: "Community upgrade",
    description: "Large digital plaza installation with wayfinding, event feeds, and environmental telemetry screens.",
  },
  {
    id: "prod-misc",
    audience: "Business",
    category: "Misc",
    name: "Disaster Relief Supply Pod",
    price: 980000,
    accent: "Rapid response",
    description: "Compact city-support unit stocked for emergency shelter operations, backup lighting, and relief logistics.",
  },
  {
    id: "cons-shirt",
    audience: "Consumer",
    category: "Clothing",
    name: "North Aster Smart Cotton Shirt",
    price: 599,
    accent: "Daily wear",
    description: "Comfort-fit city shirt designed for light commutes and everyday resident use.",
  },
  {
    id: "cons-pants",
    audience: "Consumer",
    category: "Clothing",
    name: "Urban Flex Pants",
    price: 899,
    accent: "Resident pick",
    description: "Stretchable everyday pants built for work, college, and casual city travel.",
  },
  {
    id: "cons-jacket",
    audience: "Consumer",
    category: "Clothing",
    name: "Metro Light Jacket",
    price: 1299,
    accent: "Seasonal wear",
    description: "Clean lightweight jacket for breezy evenings and rainy smart-city commutes.",
  },
  {
    id: "cons-earbuds",
    audience: "Consumer",
    category: "Electronics",
    name: "Pulse Wireless Earbuds",
    price: 1499,
    accent: "Audio tech",
    description: "Compact true-wireless earbuds for calls, music, and travel around North Aster.",
  },
  {
    id: "cons-watch",
    audience: "Consumer",
    category: "Electronics",
    name: "Civic Sync Smart Watch",
    price: 3499,
    accent: "Wearable",
    description: "Resident smartwatch with activity tracking, notifications, and daily mobility insights.",
  },
  {
    id: "cons-lamp",
    audience: "Consumer",
    category: "Home",
    name: "Smart Desk Lamp",
    price: 799,
    accent: "Home essential",
    description: "Compact lighting unit with adjustable brightness for bedrooms, study desks, and home offices.",
  },
  {
    id: "cons-blender",
    audience: "Consumer",
    category: "Home",
    name: "Kitchen Blend Mini",
    price: 2199,
    accent: "Appliance",
    description: "Practical countertop blender for quick family meals, juices, and morning shakes.",
  },
  {
    id: "cons-bag",
    audience: "Consumer",
    category: "Accessories",
    name: "Resident Utility Backpack",
    price: 1199,
    accent: "Daily carry",
    description: "Simple commuter backpack for laptops, notebooks, and daily essentials.",
  },
  {
    id: "cons-cycle",
    audience: "Consumer",
    category: "Mobility",
    name: "City Commuter Cycle",
    price: 8999,
    accent: "Personal mobility",
    description: "Practical resident bicycle for shorter smart-city routes and low-cost commuting.",
  },
  {
    id: "cons-bottle",
    audience: "Consumer",
    category: "Misc",
    name: "Thermo Steel Bottle",
    price: 499,
    accent: "Everyday item",
    description: "Durable insulated bottle sized for office, school, and everyday travel.",
  },
];

const trafficCycle = [
  { state: "green", duration: 9 },
  { state: "yellow", duration: 3 },
  { state: "red", duration: 8 },
];

const dom = {
  body: document.body,
  navButtons: Array.from(document.querySelectorAll(".nav-button")),
  dashboardView: document.getElementById("dashboardView"),
  mapView: document.getElementById("mapView"),
  shoppingView: document.getElementById("shoppingView"),
  liveClock: document.getElementById("liveClock"),
  dayNightToggle: document.getElementById("dayNightToggle"),
  tokenToggle: document.getElementById("tokenToggle"),
  tokenPanel: document.getElementById("tokenPanel"),
  mapboxTokenInput: document.getElementById("mapboxTokenInput"),
  saveToken: document.getElementById("saveToken"),
  clearToken: document.getElementById("clearToken"),
  mapboxRoot: document.getElementById("mapboxRoot"),
  fallbackMap: document.getElementById("fallbackMap"),
  fallbackViewport: document.getElementById("fallbackViewport"),
  zoneLayer: document.getElementById("zoneLayer"),
  modeLabel: document.getElementById("modeLabel"),
  mapSource: document.getElementById("mapSource"),
  totalGenerated: document.getElementById("totalGenerated"),
  totalConsumed: document.getElementById("totalConsumed"),
  reserveBuffer: document.getElementById("reserveBuffer"),
  serviceHealth: document.getElementById("serviceHealth"),
  reserveDetail: document.getElementById("reserveDetail"),
  sustainabilityScore: document.getElementById("sustainabilityScore"),
  sustainabilityBand: document.getElementById("sustainabilityBand"),
  sustainabilityCopy: document.getElementById("sustainabilityCopy"),
  graphCanvas: document.getElementById("energyGraph"),
  energyBalanceLabel: document.getElementById("energyBalanceLabel"),
  energyGeneratedBar: document.getElementById("energyGeneratedBar"),
  energyConsumedBar: document.getElementById("energyConsumedBar"),
  energyGeneratedMeta: document.getElementById("energyGeneratedMeta"),
  energyConsumedMeta: document.getElementById("energyConsumedMeta"),
  pieCanvas: document.getElementById("energyPieChart"),
  energyMixLegend: document.getElementById("energyMixLegend"),
  graphDelta: document.getElementById("graphDelta"),
  alertsList: document.getElementById("alertsList"),
  alertCount: document.getElementById("alertCount"),
  suggestionText: document.getElementById("suggestionText"),
  cityStatusTag: document.getElementById("cityStatusTag"),
  priorityTag: document.getElementById("priorityTag"),
  shoppingAudienceTabs: document.getElementById("shoppingAudienceTabs"),
  shoppingFilters: document.getElementById("shoppingFilters"),
  shoppingGrid: document.getElementById("shoppingGrid"),
  cartCount: document.getElementById("cartCount"),
  cartTotal: document.getElementById("cartTotal"),
  zonePanel: document.getElementById("zonePanel"),
  zonePanelContent: document.getElementById("zonePanelContent"),
  closePanel: document.getElementById("closePanel"),
  zoomIn: document.getElementById("zoomIn"),
  zoomOut: document.getElementById("zoomOut"),
  resetView: document.getElementById("resetView"),
  modeButtons: Array.from(document.querySelectorAll(".mode-button")),
};

const cityState = {
  theme: localStorage.getItem(STORAGE_KEYS.theme) || "night",
  mode: localStorage.getItem(STORAGE_KEYS.mode) || "normal",
  activeView: localStorage.getItem(STORAGE_KEYS.view) || "dashboard",
  mapSource: "fallback",
  selectedZoneId: "plant",
  selectedShopAudience: "Consumer",
  selectedShopCategory: "All",
  plant: {
    productionLevel: 68,
    hydrogenRate: 0,
    energyOutput: 0,
    efficiency: 89,
  },
  swing: {
    totalGenerated: 380,
    pulseEnergy: 0,
    swingCount: 0,
    lastBurst: 0,
  },
  hospital: {
    demand: 178,
    allocation: 178,
    performance: 100,
    batteryAssist: false,
  },
  school: {
    demand: 118,
    allocation: 118,
    performance: 100,
    ecoMode: false,
  },
  residential: {
    demand: 278,
    allocation: 278,
    comfort: 100,
    demandResponse: false,
    trend: 14,
  },
  traffic: trafficDefinitions.map((item, index) => ({
    ...item,
    auto: true,
    phaseIndex: index % trafficCycle.length,
    timer: trafficCycle[index % trafficCycle.length].duration,
    state: trafficCycle[index % trafficCycle.length].state,
    flow: 62 - index * 8,
    powerUse: 18,
  })),
  reserveBuffer: 180,
  totalGenerated: 0,
  totalConsumed: 0,
  totalDemand: 0,
  serviceHealth: 100,
  alertFeed: [],
  notices: [],
  history: [],
  cart: [],
  viewport: {
    scale: 1,
    x: 0,
    y: 0,
    dragging: false,
    dragStartX: 0,
    dragStartY: 0,
  },
  map: {
    instance: null,
    markers: [],
    token: localStorage.getItem(STORAGE_KEYS.mapboxToken) || "",
  },
};

const allZones = [...zoneDefinitions, ...trafficDefinitions];
const fallbackMarkers = new Map();
const mapboxMarkers = new Map();
let simulationInterval = null;
let trafficInterval = null;
let clockInterval = null;

function init() {
  applyTheme(cityState.theme);
  updateMode(cityState.mode, false);
  setActiveView(cityState.activeView, false);
  dom.mapboxTokenInput.value = cityState.map.token;
  renderFallbackMarkers();
  renderShoppingFilters();
  renderShoppingCards();
  bindEvents();
  if (cityState.activeView === "map") {
    openZonePanel(cityState.selectedZoneId);
  }
  initMapbox();
  startLoops();
  simulationTick();
  syncDashboard();
}

function bindEvents() {
  dom.navButtons.forEach((button) => {
    button.addEventListener("click", () => setActiveView(button.dataset.view));
  });
  dom.dayNightToggle.addEventListener("click", toggleTheme);
  dom.tokenToggle.addEventListener("click", () => {
    dom.tokenPanel.classList.toggle("hidden");
  });
  dom.saveToken.addEventListener("click", () => {
    cityState.map.token = dom.mapboxTokenInput.value.trim();
    localStorage.setItem(STORAGE_KEYS.mapboxToken, cityState.map.token);
    initMapbox(true);
  });
  dom.clearToken.addEventListener("click", () => {
    cityState.map.token = "";
    localStorage.removeItem(STORAGE_KEYS.mapboxToken);
    teardownMapbox();
    setMapSource("Local control grid");
  });
  dom.closePanel.addEventListener("click", () => dom.zonePanel.classList.add("hidden"));
  dom.modeButtons.forEach((button) => {
    button.addEventListener("click", () => updateMode(button.dataset.mode));
  });
  dom.zoomIn.addEventListener("click", () => adjustViewportZoom(0.16));
  dom.zoomOut.addEventListener("click", () => adjustViewportZoom(-0.16));
  dom.resetView.addEventListener("click", resetViewport);

  const viewport = dom.fallbackViewport;
  viewport.addEventListener("pointerdown", (event) => {
    if (cityState.mapSource === "mapbox") {
      return;
    }
    cityState.viewport.dragging = true;
    viewport.classList.add("dragging");
    cityState.viewport.dragStartX = event.clientX - cityState.viewport.x;
    cityState.viewport.dragStartY = event.clientY - cityState.viewport.y;
    viewport.setPointerCapture(event.pointerId);
  });
  viewport.addEventListener("pointermove", (event) => {
    if (!cityState.viewport.dragging || cityState.mapSource === "mapbox") {
      return;
    }
    cityState.viewport.x = event.clientX - cityState.viewport.dragStartX;
    cityState.viewport.y = event.clientY - cityState.viewport.dragStartY;
    applyViewportTransform();
  });
  viewport.addEventListener("pointerup", (event) => {
    cityState.viewport.dragging = false;
    viewport.classList.remove("dragging");
    viewport.releasePointerCapture(event.pointerId);
  });
  viewport.addEventListener("pointerleave", () => {
    cityState.viewport.dragging = false;
    viewport.classList.remove("dragging");
  });
  dom.fallbackMap.addEventListener(
    "wheel",
    (event) => {
      if (cityState.mapSource === "mapbox") {
        return;
      }
      event.preventDefault();
      const direction = event.deltaY > 0 ? -0.12 : 0.12;
      adjustViewportZoom(direction);
    },
    { passive: false }
  );
}

function startLoops() {
  clearInterval(simulationInterval);
  clearInterval(trafficInterval);
  clearInterval(clockInterval);

  simulationInterval = setInterval(simulationTick, 1600);
  trafficInterval = setInterval(updateTrafficSignals, 1000);
  clockInterval = setInterval(updateClock, 1000);
  updateClock();
}

function updateClock() {
  const now = new Date();
  dom.liveClock.textContent = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function toggleTheme() {
  cityState.theme = cityState.theme === "night" ? "day" : "night";
  localStorage.setItem(STORAGE_KEYS.theme, cityState.theme);
  applyTheme(cityState.theme);
  if (cityState.map.instance) {
    cityState.map.instance.setStyle(getMapboxStyle());
    cityState.map.instance.once("style.load", () => {
      addMapboxDecorations();
    });
  }
}

function applyTheme(theme) {
  dom.body.classList.toggle("theme-day", theme === "day");
  dom.body.classList.toggle("theme-night", theme !== "day");
  dom.dayNightToggle.textContent = theme === "day" ? "Switch to Night Mode" : "Switch to Day Mode";
  drawEnergyGraph();
  drawEnergyPieChart();
}

function setActiveView(view, persist = true) {
  cityState.activeView = view;
  if (persist) {
    localStorage.setItem(STORAGE_KEYS.view, view);
  }
  dom.dashboardView.classList.toggle("active", view === "dashboard");
  dom.mapView.classList.toggle("active", view === "map");
  dom.shoppingView.classList.toggle("active", view === "shopping");
  dom.navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
  if (view !== "map") {
    dom.zonePanel.classList.add("hidden");
  }
  if (view === "map" && cityState.map.instance) {
    setTimeout(() => cityState.map.instance.resize(), 50);
  }
}

function updateMode(mode, announce = true) {
  cityState.mode = mode;
  localStorage.setItem(STORAGE_KEYS.mode, mode);
  const labelMap = {
    normal: "Normal Mode",
    powerSaving: "Power Saving Mode",
    emergency: "Emergency Mode",
  };
  dom.modeLabel.textContent = labelMap[mode];
  dom.modeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });
  if (announce) {
    pushAlert(`${labelMap[mode]} engaged`, mode === "emergency" ? "critical" : "info");
    simulationTick();
  }
}

function simulationTick() {
  const modeFactor = cityState.mode === "emergency" ? 1.12 : cityState.mode === "powerSaving" ? 0.94 : 1;

  cityState.plant.efficiency = clamp(
    83 + cityState.plant.productionLevel * 0.16 + randomBetween(-2.5, 2.5) - (cityState.mode === "emergency" ? 1.6 : 0),
    77,
    97
  );
  cityState.plant.hydrogenRate = Math.round(cityState.plant.productionLevel * 2.05 * modeFactor + randomBetween(-10, 10));
  cityState.plant.energyOutput = Math.round(cityState.plant.hydrogenRate * 4.7 * (cityState.plant.efficiency / 100));

  cityState.swing.pulseEnergy = Math.max(0, cityState.swing.pulseEnergy - randomBetween(8, 16));
  const swingOutput = Math.round(cityState.swing.pulseEnergy * 1.25);

  cityState.residential.trend = clamp(cityState.residential.trend + randomBetween(-6, 9), 0, 80);

  cityState.hospital.demand = Math.round(
    168 + randomBetween(-10, 16) + (cityState.mode === "emergency" ? 18 : 0) + (cityState.hospital.batteryAssist ? -12 : 0)
  );
  cityState.school.demand = Math.round(
    (cityState.theme === "day" ? 126 : 88) +
      randomBetween(-10, 10) +
      (cityState.school.ecoMode ? -18 : 0) +
      (cityState.mode === "powerSaving" ? -12 : 0)
  );
  cityState.residential.demand = Math.round(
    230 +
      cityState.residential.trend +
      (cityState.theme === "day" ? 12 : 42) +
      (cityState.residential.demandResponse ? -42 : 0) +
      (cityState.mode === "powerSaving" ? -28 : 0) +
      randomBetween(-12, 14)
  );

  const trafficDemand = cityState.traffic.reduce((sum, junction) => sum + junction.powerUse, 0);
  cityState.totalGenerated = cityState.plant.energyOutput + swingOutput;
  cityState.totalDemand = cityState.hospital.demand + cityState.school.demand + cityState.residential.demand + trafficDemand;

  const available = cityState.totalGenerated + Math.min(cityState.reserveBuffer, 120);
  const allocations = allocateEnergy(available, trafficDemand);

  cityState.hospital.allocation = allocations.hospital;
  cityState.school.allocation = allocations.school;
  cityState.residential.allocation = allocations.residential;

  const totalTrafficAllocation = allocations.traffic;
  const trafficRatio = trafficDemand > 0 ? totalTrafficAllocation / trafficDemand : 1;
  cityState.traffic.forEach((junction) => {
    junction.flow = trafficLightFlow(junction.state, trafficRatio, junction.auto);
  });

  cityState.totalConsumed = allocations.hospital + allocations.school + allocations.residential + totalTrafficAllocation;
  cityState.reserveBuffer = clamp(
    cityState.reserveBuffer + (cityState.totalGenerated - cityState.totalConsumed) * 0.22,
    0,
    480
  );

  cityState.hospital.performance = clamp(Math.round((allocations.hospital / cityState.hospital.demand) * 100), 22, 100);
  cityState.school.performance = clamp(Math.round((allocations.school / cityState.school.demand) * 100), 20, 100);
  cityState.residential.comfort = clamp(
    Math.round((allocations.residential / cityState.residential.demand) * 100),
    18,
    100
  );
  cityState.serviceHealth = Math.round(
    cityState.hospital.performance * 0.46 +
      trafficRatio * 100 * 0.28 +
      cityState.school.performance * 0.12 +
      cityState.residential.comfort * 0.14
  );

  deriveAlerts(trafficRatio);
  updateSuggestion(trafficRatio);
  cityState.history.push({
    generated: cityState.totalGenerated,
    consumed: cityState.totalConsumed,
    reserve: cityState.reserveBuffer,
  });
  if (cityState.history.length > 42) {
    cityState.history.shift();
  }

  syncDashboard();
  renderFallbackMarkers();
  syncMapboxMarkers();
  drawEnergyGraph();
  if (!dom.zonePanel.classList.contains("hidden")) {
    renderZonePanel(cityState.selectedZoneId);
  }
}

function allocateEnergy(available, trafficDemand) {
  const emergency = cityState.mode === "emergency";
  const powerSaving = cityState.mode === "powerSaving";
  let hospital = 0;
  let school = 0;
  let residential = 0;
  let traffic = 0;

  const take = (amount) => {
    const slice = Math.max(0, Math.min(available, amount));
    available -= slice;
    return slice;
  };

  if (emergency) {
    hospital = take(cityState.hospital.demand);
    traffic = take(trafficDemand);
    school = take(cityState.school.demand * 0.76);
    residential = take(cityState.residential.demand);
  } else if (powerSaving) {
    hospital = take(cityState.hospital.demand);
    traffic = take(trafficDemand);
    school = take(cityState.school.demand * 0.88);
    residential = take(cityState.residential.demand);
  } else {
    const totalWeightedDemand =
      cityState.hospital.demand * 1.12 +
      cityState.school.demand +
      cityState.residential.demand * 0.96 +
      trafficDemand * 1.08;
    const ratio = totalWeightedDemand > 0 ? Math.min(1, available / totalWeightedDemand) : 1;
    hospital = Math.min(cityState.hospital.demand, cityState.hospital.demand * ratio * 1.12);
    school = Math.min(cityState.school.demand, cityState.school.demand * ratio);
    residential = Math.min(cityState.residential.demand, cityState.residential.demand * ratio * 0.96);
    traffic = Math.min(trafficDemand, trafficDemand * ratio * 1.08);
    available = Math.max(0, available - (hospital + school + residential + traffic));
  }

  if (available > 0) {
    residential += take(cityState.residential.demand - residential);
    school += take(cityState.school.demand - school);
    hospital += take(cityState.hospital.demand - hospital);
    traffic += take(trafficDemand - traffic);
  }

  return {
    hospital: Math.round(hospital),
    school: Math.round(school),
    residential: Math.round(residential),
    traffic: Math.round(traffic),
  };
}

function updateTrafficSignals() {
  cityState.traffic.forEach((junction) => {
    if (!junction.auto) {
      return;
    }
    junction.timer -= 1;
    if (junction.timer <= 0) {
      junction.phaseIndex = (junction.phaseIndex + 1) % trafficCycle.length;
      junction.state = trafficCycle[junction.phaseIndex].state;
      junction.timer = trafficCycle[junction.phaseIndex].duration;
    }
  });
  renderFallbackMarkers();
  syncMapboxMarkers();
  if (!dom.zonePanel.classList.contains("hidden") && cityState.selectedZoneId.startsWith("traffic")) {
    renderZonePanel(cityState.selectedZoneId);
  }
}

function deriveAlerts(trafficRatio) {
  const alerts = [];

  if (cityState.hospital.performance < 92) {
    alerts.push({
      title: "Hospital Low Power",
      body: `Critical care performance reduced to ${cityState.hospital.performance}%`,
      tone: cityState.hospital.performance < 70 ? "critical" : "warning",
    });
  }

  if (cityState.school.performance < 85) {
    alerts.push({
      title: "School Energy Constraint",
      body: `Campus systems running at ${cityState.school.performance}% capacity`,
      tone: "warning",
    });
  }

  if (cityState.residential.comfort < 78) {
    alerts.push({
      title: "Residential Demand Spike",
      body: `Household comfort dropped to ${cityState.residential.comfort}%`,
      tone: cityState.residential.comfort < 60 ? "critical" : "warning",
    });
  }

  if (cityState.reserveBuffer < 60) {
    alerts.push({
      title: "Reserve Buffer Low",
      body: `Battery reserve is down to ${Math.round(cityState.reserveBuffer)} kWh`,
      tone: cityState.reserveBuffer < 30 ? "critical" : "warning",
    });
  }

  if (trafficRatio < 0.9) {
    alerts.push({
      title: "Traffic Power Reduction",
      body: "Intersection throughput is being throttled by low power availability",
      tone: "warning",
    });
  }

  if (cityState.mode === "emergency") {
    alerts.unshift({
      title: "Emergency Priority Routing",
      body: "Hospital and traffic systems are receiving first allocation",
      tone: "critical",
    });
  }

  cityState.notices = cityState.notices
    .map((notice) => ({ ...notice, ttl: notice.ttl - 1 }))
    .filter((notice) => notice.ttl > 0);
  cityState.alertFeed = [...cityState.notices, ...alerts].slice(0, 6);
}

function updateSuggestion(trafficRatio) {
  let message = "City load is balanced. Maintain electrolysis output and monitor residential demand peaks.";
  let status = "Balanced";
  let priority = "Hospital secured";

  if (cityState.reserveBuffer < 60) {
    message = "Increase electrolysis production by 8% or trigger the energy swing to rebuild reserve buffer.";
    status = "Reserve pressure";
    priority = "Buffer recovery";
  }

  if (cityState.residential.comfort < 78) {
    message = "Reduce residential consumption through demand response to protect stable service across the grid.";
    status = "Demand surge";
    priority = "Residential trim";
  }

  if (cityState.hospital.performance < 90 || trafficRatio < 0.92) {
    message = "Switch to Emergency Mode to keep hospital services and Arduino traffic controllers fully powered.";
    status = "Critical priority";
    priority = "Safeguard care";
  }

  if (cityState.mode === "powerSaving" && cityState.reserveBuffer > 140) {
    message = "Reserve levels have recovered. You can return to Normal Mode without risking the hospital corridor.";
    status = "Stable reserve";
    priority = "Mode normalization";
  }

  dom.suggestionText.textContent = message;
  dom.cityStatusTag.textContent = status;
  dom.priorityTag.textContent = priority;
}

function syncDashboard() {
  const sustainabilityScore = Math.round(
    clamp(
      cityState.serviceHealth * 0.4 +
        clamp((cityState.totalGenerated / Math.max(cityState.totalConsumed, 1)) * 100, 0, 120) * 0.24 +
        clamp((cityState.reserveBuffer / 240) * 100, 0, 100) * 0.2 +
        cityState.plant.efficiency * 0.16,
      0,
      100
    )
  );
  const band =
    sustainabilityScore >= 82 ? "Excellent" :
    sustainabilityScore >= 68 ? "Stable" :
    sustainabilityScore >= 50 ? "Watch" : "Critical";

  dom.totalGenerated.textContent = `${Math.round(cityState.totalGenerated)} kW`;
  dom.totalConsumed.textContent = `${Math.round(cityState.totalConsumed)} kW`;
  dom.reserveBuffer.textContent = `${Math.round(cityState.reserveBuffer)} kWh`;
  dom.serviceHealth.textContent = `${cityState.serviceHealth}%`;
  dom.sustainabilityScore.textContent = String(sustainabilityScore);
  dom.sustainabilityBand.textContent = band;
  dom.sustainabilityCopy.textContent =
    sustainabilityScore >= 82
      ? "North Aster is running with strong reserve depth, healthy priority services, and efficient hydrogen conversion."
      : sustainabilityScore >= 68
        ? "The city is sustainable overall, but reserve and demand balance should keep being watched."
        : sustainabilityScore >= 50
          ? "Sustainability is under pressure. Trim non-critical loads and strengthen generation."
          : "System sustainability is stressed. Prioritize hospital, traffic, and reserve recovery immediately.";
  dom.reserveDetail.textContent =
    cityState.reserveBuffer < 60 ? "Reserve requires intervention" : "Reserve holding steady";
  dom.alertCount.textContent = `${cityState.alertFeed.length} active`;
  dom.graphDelta.textContent =
    cityState.totalGenerated >= cityState.totalConsumed ? "Generation lead" : "Demand lead";
  const balanceMax = Math.max(cityState.totalGenerated, cityState.totalConsumed, 1);
  const generatedWidth = (cityState.totalGenerated / balanceMax) * 100;
  const consumedWidth = (cityState.totalConsumed / balanceMax) * 100;
  dom.energyBalanceLabel.textContent = `${Math.round(cityState.totalGenerated)} kW vs ${Math.round(cityState.totalConsumed)} kW`;
  dom.energyGeneratedBar.style.width = `${generatedWidth}%`;
  dom.energyConsumedBar.style.width = `${consumedWidth}%`;
  dom.energyGeneratedMeta.textContent = `Generated: ${Math.round(cityState.totalGenerated)} kW`;
  dom.energyConsumedMeta.textContent = `Consumed: ${Math.round(cityState.totalConsumed)} kW`;

  dom.alertsList.innerHTML = cityState.alertFeed
    .map(
      (alert) => `
        <article class="alert-card ${alert.tone}">
          <strong>${alert.title}</strong>
          <span>${alert.body}</span>
        </article>
      `
    )
    .join("");

  if (!dom.alertsList.innerHTML.trim()) {
    dom.alertsList.innerHTML = `
      <article class="alert-card">
        <strong>All Systems Stable</strong>
        <span>North Aster is operating without active warnings.</span>
      </article>
    `;
  }

  drawEnergyPieChart();
}

function drawEnergyGraph() {
  const canvas = dom.graphCanvas;
  const context = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  context.clearRect(0, 0, width, height);

  context.fillStyle = cityState.theme === "day" ? "rgba(230, 245, 255, 0.8)" : "rgba(4, 12, 24, 0.85)";
  context.fillRect(0, 0, width, height);

  const gradient = context.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "rgba(103, 241, 255, 0.35)");
  gradient.addColorStop(1, "rgba(103, 241, 255, 0.02)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.strokeStyle = cityState.theme === "day" ? "rgba(18, 82, 138, 0.18)" : "rgba(255, 255, 255, 0.08)";
  for (let index = 1; index < 5; index += 1) {
    const y = (height / 5) * index;
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }

  if (cityState.history.length < 2) {
    return;
  }

  const maxValue = Math.max(
    ...cityState.history.flatMap((item) => [item.generated, item.consumed, item.reserve + 120]),
    480
  );

  drawGraphLine(context, cityState.history.map((item) => item.generated), width, height, maxValue, "#67f1ff");
  drawGraphLine(context, cityState.history.map((item) => item.consumed), width, height, maxValue, "#ffcf5a");
  drawGraphLine(context, cityState.history.map((item) => item.reserve), width, height, maxValue, "#7effad");
}

function drawGraphLine(context, values, width, height, maxValue, color) {
  const step = width / Math.max(1, values.length - 1);
  context.beginPath();
  context.lineWidth = 3;
  context.strokeStyle = color;
  values.forEach((value, index) => {
    const x = step * index;
    const y = height - (value / maxValue) * (height - 20) - 10;
    if (index === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  });
  context.stroke();
}

function drawEnergyPieChart() {
  const canvas = dom.pieCanvas;
  const context = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 108;
  const innerRadius = 54;
  const parts = [
    { label: "Hydrogen Plant", value: Math.max(cityState.plant.energyOutput, 1), color: "#67f1ff" },
    { label: "Swing Energy", value: Math.max(Math.round(cityState.swing.pulseEnergy * 1.25), 1), color: "#20d6b5" },
    { label: "Hospital", value: Math.max(cityState.hospital.allocation, 1), color: "#ff6f91" },
    { label: "School", value: Math.max(cityState.school.allocation, 1), color: "#ffcf5a" },
    { label: "Residential", value: Math.max(cityState.residential.allocation, 1), color: "#6ca9ff" },
    {
      label: "Traffic",
      value: Math.max(cityState.traffic.reduce((sum, junction) => sum + junction.powerUse, 0), 1),
      color: "#9b8cff",
    },
  ];
  const total = parts.reduce((sum, part) => sum + part.value, 0);

  context.clearRect(0, 0, width, height);
  context.fillStyle = cityState.theme === "day" ? "rgba(230, 245, 255, 0.35)" : "rgba(6, 16, 32, 0.55)";
  context.fillRect(0, 0, width, height);

  let currentAngle = -Math.PI / 2;
  parts.forEach((part) => {
    const slice = (part.value / total) * Math.PI * 2;
    context.beginPath();
    context.moveTo(centerX, centerY);
    context.arc(centerX, centerY, radius, currentAngle, currentAngle + slice);
    context.closePath();
    context.fillStyle = part.color;
    context.globalAlpha = 0.92;
    context.fill();
    currentAngle += slice;
  });

  context.globalAlpha = 1;
  context.beginPath();
  context.fillStyle = cityState.theme === "day" ? "rgba(239, 248, 255, 0.92)" : "rgba(10, 20, 38, 0.95)";
  context.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = cityState.theme === "day" ? "#0b2840" : "#edf8ff";
  context.font = "700 22px Oxanium";
  context.textAlign = "center";
  context.fillText(`${Math.round(cityState.totalGenerated)}kW`, centerX, centerY - 6);
  context.font = "500 12px Space Grotesk";
  context.fillStyle = cityState.theme === "day" ? "#5c7893" : "#94aecd";
  context.fillText("live energy mix", centerX, centerY + 16);

  dom.energyMixLegend.innerHTML = parts
    .map(
      (part) => `
        <div class="energy-legend-item">
          <span class="energy-dot" style="background:${part.color}"></span>
          <span>${part.label}</span>
          <strong>${Math.round(part.value)} kW</strong>
        </div>
      `
    )
    .join("");
}

function renderFallbackMarkers() {
  allZones.forEach((zone) => {
    const status = getZoneStatus(zone.id);
    if (!fallbackMarkers.has(zone.id)) {
      const button = document.createElement("button");
      button.className = `zone-marker ${zone.kind}`;
      button.type = "button";
      button.style.left = `${zone.x}px`;
      button.style.top = `${zone.y}px`;
      button.addEventListener("click", () => {
        focusZone(zone);
        openZonePanel(zone.id);
      });
      dom.zoneLayer.appendChild(button);
      fallbackMarkers.set(zone.id, button);
    }
    const marker = fallbackMarkers.get(zone.id);
    marker.classList.toggle("active", cityState.selectedZoneId === zone.id);
    marker.innerHTML = markerTemplate(zone, status);
  });
}

function markerTemplate(zone, status) {
  const trafficBars =
    zone.kind === "traffic"
      ? `
        <div class="traffic-lanes">
          <div class="traffic-lane"><span style="width:${Math.max(10, status.flow)}%"></span></div>
          <div class="traffic-lane"><span style="width:${Math.max(8, status.flow - 14)}%"></span></div>
          <div class="traffic-lane"><span style="width:${Math.max(12, status.flow - 6)}%"></span></div>
        </div>
      `
      : "";

  return `
    <span class="zone-ring"></span>
    <div class="zone-card">
      <div class="zone-header">
        <strong>${zone.name}</strong>
      </div>
      <div class="zone-type">${zone.shortType}</div>
      <div class="zone-status">
        <span class="zone-indicator ${status.light || ""}"></span>
        <span>${status.label}</span>
      </div>
      ${trafficBars}
    </div>
  `;
}

function getZoneStatus(zoneId) {
  if (zoneId === "plant") {
    return {
      label: `${Math.round(cityState.plant.energyOutput)} kW online`,
      light: cityState.reserveBuffer < 60 ? "yellow" : "green",
      flow: 0,
    };
  }
  if (zoneId === "hospital") {
    return {
      label: cityState.hospital.performance < 90 ? "Low Power" : "Critical care stable",
      light: cityState.hospital.performance < 70 ? "red" : cityState.hospital.performance < 90 ? "yellow" : "green",
      flow: 0,
    };
  }
  if (zoneId === "school") {
    return {
      label: cityState.school.performance < 85 ? "Reduced performance" : "Campus active",
      light: cityState.school.performance < 65 ? "red" : cityState.school.performance < 85 ? "yellow" : "green",
      flow: 0,
    };
  }
  if (zoneId === "residential") {
    return {
      label: `${cityState.residential.comfort}% comfort`,
      light: cityState.residential.comfort < 70 ? "red" : cityState.residential.comfort < 86 ? "yellow" : "green",
      flow: 0,
    };
  }
  if (zoneId === "swing") {
    return {
      label: `${Math.round(cityState.swing.lastBurst)} kW burst`,
      light: cityState.swing.lastBurst > 0 ? "green" : "yellow",
      flow: 0,
    };
  }

  const traffic = cityState.traffic.find((item) => item.id === zoneId);
  return {
    label: `${traffic.state.toUpperCase()} • ${traffic.auto ? `${traffic.timer}s` : "manual"} • ${traffic.flow}% flow`,
    light: traffic.state,
    flow: traffic.flow,
  };
}

function renderZonePanel(zoneId) {
  if (dom.zonePanel.classList.contains("hidden")) {
    return;
  }

  const zone = allZones.find((item) => item.id === zoneId);
  if (!zone) {
    return;
  }

  cityState.selectedZoneId = zoneId;
  dom.zonePanelContent.innerHTML = zonePanelTemplate(zone);
  attachZonePanelEvents(zone);
}

function openZonePanel(zoneId) {
  setActiveView("map");
  cityState.selectedZoneId = zoneId;
  dom.zonePanel.classList.remove("hidden");
  renderFallbackMarkers();
  syncMapboxMarkers();
  renderZonePanel(zoneId);
}

function zonePanelTemplate(zone) {
  const status = getZoneStatus(zone.id);
  const intro = `
    <p class="eyebrow">${zone.shortType}</p>
    <h2>${zone.name}</h2>
    <p class="control-copy">${status.label}. This panel updates live every few seconds and pushes state changes back into the city model immediately.</p>
  `;

  if (zone.id === "plant") {
    return `
      ${intro}
      <div class="control-grid">
        <div class="control-stat"><span>Hydrogen Production</span><strong>${cityState.plant.hydrogenRate} kg/h</strong></div>
        <div class="control-stat"><span>Energy Output</span><strong>${cityState.plant.energyOutput} kW</strong></div>
        <div class="control-stat"><span>Efficiency</span><strong>${cityState.plant.efficiency.toFixed(1)}%</strong></div>
        <div class="control-stat"><span>Contribution</span><strong>${Math.round((cityState.plant.energyOutput / Math.max(cityState.totalGenerated, 1)) * 100)}%</strong></div>
      </div>
      <div class="control-section">
        <span class="section-label">Production Control</span>
        <label class="slider-group">
          <span>Electrolysis intensity: <strong>${cityState.plant.productionLevel}%</strong></span>
          <input id="plantProductionRange" type="range" min="30" max="100" value="${cityState.plant.productionLevel}">
        </label>
        <div class="control-actions">
          <button id="boostPlant" class="action-button" type="button">Boost +10%</button>
          <button id="stabilizePlant" class="action-button ghost" type="button">Stabilize</button>
        </div>
      </div>
    `;
  }

  if (zone.id === "swing") {
    return `
      ${intro}
      <div class="control-grid">
        <div class="control-stat"><span>Total Generated</span><strong>${Math.round(cityState.swing.totalGenerated)} kWh</strong></div>
        <div class="control-stat"><span>Current Burst</span><strong>${Math.round(cityState.swing.lastBurst)} kW</strong></div>
        <div class="control-stat"><span>Usage Count</span><strong>${cityState.swing.swingCount}</strong></div>
        <div class="control-stat"><span>Grid Impact</span><strong>${cityState.swing.lastBurst > 0 ? "Active" : "Standby"}</strong></div>
      </div>
      <div class="control-section">
        <div class="control-banner positive">
          <strong>Human Interaction Channel</strong>
          <span>Each trigger simulates kinetic capture and raises the live energy pool immediately.</span>
        </div>
        <div class="control-actions">
          <button id="generateEnergy" class="action-button" type="button">Generate Energy</button>
          <button id="generateEnergyBurst" class="action-button ghost" type="button">Large Crowd Burst</button>
        </div>
      </div>
    `;
  }

  if (zone.id === "hospital") {
    const tone = cityState.hospital.performance < 90 ? "critical" : "positive";
    return `
      ${intro}
      <div class="control-grid">
        <div class="control-stat"><span>Demand</span><strong>${cityState.hospital.demand} kW</strong></div>
        <div class="control-stat"><span>Allocated</span><strong>${cityState.hospital.allocation} kW</strong></div>
        <div class="control-stat"><span>Performance</span><strong>${cityState.hospital.performance}%</strong></div>
        <div class="control-stat"><span>Status</span><strong>${cityState.hospital.performance < 90 ? "Low Power" : "Priority secured"}</strong></div>
      </div>
      <div class="control-section">
        <div class="control-banner ${tone}">
          <strong>${cityState.hospital.performance < 90 ? "Hospital Alert" : "Resilience Active"}</strong>
          <span>${cityState.hospital.performance < 90 ? "Reduced performance is impacting non-critical systems." : "Critical care is receiving stable grid priority."}</span>
        </div>
        <div class="control-actions">
          <button id="hospitalBattery" class="${cityState.hospital.batteryAssist ? "action-button" : "action-button ghost"}" type="button">
            ${cityState.hospital.batteryAssist ? "Battery Assist On" : "Enable Battery Assist"}
          </button>
          <button id="hospitalEmergencyMode" class="action-button ghost" type="button">Force Emergency Mode</button>
        </div>
      </div>
    `;
  }

  if (zone.id === "school") {
    const tone = cityState.school.performance < 85 ? "warning" : "positive";
    return `
      ${intro}
      <div class="control-grid">
        <div class="control-stat"><span>Demand</span><strong>${cityState.school.demand} kW</strong></div>
        <div class="control-stat"><span>Allocated</span><strong>${cityState.school.allocation} kW</strong></div>
        <div class="control-stat"><span>Performance</span><strong>${cityState.school.performance}%</strong></div>
        <div class="control-stat"><span>Campus Mode</span><strong>${cityState.school.ecoMode ? "Eco" : "Learning"}</strong></div>
      </div>
      <div class="control-section">
        <div class="control-banner ${tone}">
          <strong>${cityState.school.performance < 85 ? "School Low Power" : "Campus Stable"}</strong>
          <span>${cityState.school.performance < 85 ? "Lighting and digital labs are reduced to protect city stability." : "Classrooms and STEM labs are fully online."}</span>
        </div>
        <div class="control-actions">
          <button id="schoolEcoMode" class="${cityState.school.ecoMode ? "action-button" : "action-button ghost"}" type="button">
            ${cityState.school.ecoMode ? "Eco Mode Enabled" : "Enable Eco Mode"}
          </button>
        </div>
      </div>
    `;
  }

  if (zone.id === "residential") {
    const tone = cityState.residential.comfort < 80 ? "warning" : "positive";
    return `
      ${intro}
      <div class="control-grid">
        <div class="control-stat"><span>Demand</span><strong>${cityState.residential.demand} kW</strong></div>
        <div class="control-stat"><span>Allocated</span><strong>${cityState.residential.allocation} kW</strong></div>
        <div class="control-stat"><span>Comfort Index</span><strong>${cityState.residential.comfort}%</strong></div>
        <div class="control-stat"><span>Trend</span><strong>${cityState.residential.trend > 40 ? "Rising" : "Moderate"}</strong></div>
      </div>
      <div class="control-section">
        <div class="control-banner ${tone}">
          <strong>${cityState.residential.comfort < 80 ? "Load Pressure" : "Neighbourhood Stable"}</strong>
          <span>${cityState.residential.comfort < 80 ? "Home systems are seeing constrained comfort as demand climbs." : "Residential usage remains within comfortable city limits."}</span>
        </div>
        <div class="control-actions">
          <button id="residentialResponse" class="${cityState.residential.demandResponse ? "action-button" : "action-button ghost"}" type="button">
            ${cityState.residential.demandResponse ? "Demand Response Active" : "Trigger Demand Response"}
          </button>
        </div>
      </div>
    `;
  }

  const traffic = cityState.traffic.find((item) => item.id === zone.id);
  return `
    ${intro}
    <div class="control-grid">
      <div class="control-stat"><span>Signal State</span><strong>${traffic.state.toUpperCase()}</strong></div>
      <div class="control-stat"><span>Cycle Timer</span><strong>${traffic.auto ? `${traffic.timer}s` : "Manual"}</strong></div>
      <div class="control-stat"><span>Traffic Flow</span><strong>${traffic.flow}%</strong></div>
      <div class="control-stat"><span>Control Mode</span><strong>${traffic.auto ? "Automatic" : "Manual override"}</strong></div>
    </div>
    <div class="control-section">
      <div class="control-banner ${traffic.auto ? "positive" : "warning"}">
        <strong>${traffic.auto ? "Arduino Cycle Running" : "Manual Override Active"}</strong>
        <span>Signals rotate through red, yellow, and green every few seconds unless you override them manually.</span>
      </div>
      <div class="control-actions">
        <button id="trafficAutoToggle" class="${traffic.auto ? "action-button" : "action-button ghost"}" type="button">
          ${traffic.auto ? "Automatic Mode On" : "Return to Automatic"}
        </button>
      </div>
      <div class="manual-controls">
        <button class="manual-button" data-traffic-state="red" type="button">Red</button>
        <button class="manual-button" data-traffic-state="yellow" type="button">Yellow</button>
        <button class="manual-button" data-traffic-state="green" type="button">Green</button>
      </div>
    </div>
  `;
}

function attachZonePanelEvents(zone) {
  if (zone.id === "plant") {
    document.getElementById("plantProductionRange")?.addEventListener("input", (event) => {
      cityState.plant.productionLevel = Number(event.target.value);
      simulationTick();
    });
    document.getElementById("boostPlant")?.addEventListener("click", () => {
      cityState.plant.productionLevel = clamp(cityState.plant.productionLevel + 10, 30, 100);
      simulationTick();
      openZonePanel("plant");
    });
    document.getElementById("stabilizePlant")?.addEventListener("click", () => {
      cityState.plant.productionLevel = 70;
      simulationTick();
      openZonePanel("plant");
    });
  }

  if (zone.id === "swing") {
    document.getElementById("generateEnergy")?.addEventListener("click", () => triggerSwing(42));
    document.getElementById("generateEnergyBurst")?.addEventListener("click", () => triggerSwing(88));
  }

  if (zone.id === "hospital") {
    document.getElementById("hospitalBattery")?.addEventListener("click", () => {
      cityState.hospital.batteryAssist = !cityState.hospital.batteryAssist;
      simulationTick();
      openZonePanel("hospital");
    });
    document.getElementById("hospitalEmergencyMode")?.addEventListener("click", () => {
      updateMode("emergency");
      openZonePanel("hospital");
    });
  }

  if (zone.id === "school") {
    document.getElementById("schoolEcoMode")?.addEventListener("click", () => {
      cityState.school.ecoMode = !cityState.school.ecoMode;
      simulationTick();
      openZonePanel("school");
    });
  }

  if (zone.id === "residential") {
    document.getElementById("residentialResponse")?.addEventListener("click", () => {
      cityState.residential.demandResponse = !cityState.residential.demandResponse;
      simulationTick();
      openZonePanel("residential");
    });
  }

  if (zone.kind === "traffic") {
    const traffic = cityState.traffic.find((item) => item.id === zone.id);
    document.getElementById("trafficAutoToggle")?.addEventListener("click", () => {
      traffic.auto = !traffic.auto;
      if (traffic.auto) {
        const cycleState = trafficCycle[traffic.phaseIndex];
        traffic.state = cycleState.state;
        traffic.timer = cycleState.duration;
      }
      renderZonePanel(zone.id);
      renderFallbackMarkers();
      syncMapboxMarkers();
    });
    document.querySelectorAll("[data-traffic-state]").forEach((button) => {
      button.addEventListener("click", () => {
        traffic.auto = false;
        traffic.state = button.dataset.trafficState;
        traffic.timer = 0;
        renderZonePanel(zone.id);
        renderFallbackMarkers();
        syncMapboxMarkers();
      });
    });
  }
}

function triggerSwing(amount) {
  cityState.swing.swingCount += 1;
  cityState.swing.lastBurst = amount;
  cityState.swing.pulseEnergy += amount;
  cityState.swing.totalGenerated += amount * 0.85;
  pushAlert(`Energy swing generated ${amount} kW burst`, "info");
  simulationTick();
  openZonePanel("swing");
}

function pushAlert(message, tone) {
  cityState.notices.unshift({
    title: tone === "critical" ? "Critical Update" : "System Update",
    body: message,
    tone: tone === "critical" ? "critical" : tone === "warning" ? "warning" : "info",
    ttl: 4,
  });
  cityState.notices = cityState.notices.slice(0, 3);
  cityState.alertFeed = [...cityState.notices, ...cityState.alertFeed].slice(0, 6);
}

function renderShoppingFilters() {
  const audienceProducts = shoppingProducts.filter((item) => item.audience === cityState.selectedShopAudience);
  const categories = ["All", ...new Set(audienceProducts.map((item) => item.category))];

  dom.shoppingAudienceTabs.innerHTML = ["Consumer", "Business"]
    .map(
      (audience) => `
        <button class="audience-button ${audience === cityState.selectedShopAudience ? "active" : ""}" data-audience="${audience}" type="button">
          ${audience}
        </button>
      `
    )
    .join("");

  dom.shoppingAudienceTabs.querySelectorAll("[data-audience]").forEach((button) => {
    button.addEventListener("click", () => {
      cityState.selectedShopAudience = button.dataset.audience;
      cityState.selectedShopCategory = "All";
      renderShoppingFilters();
      renderShoppingCards();
    });
  });

  dom.shoppingFilters.innerHTML = categories
    .map(
      (category) => `
        <button class="filter-button ${category === cityState.selectedShopCategory ? "active" : ""}" data-category="${category}" type="button">
          ${category}
        </button>
      `
    )
    .join("");

  dom.shoppingFilters.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      cityState.selectedShopCategory = button.dataset.category;
      renderShoppingFilters();
      renderShoppingCards();
    });
  });
}

function renderShoppingCards() {
  const visibleProducts = shoppingProducts.filter((product) => {
    const audienceMatch = product.audience === cityState.selectedShopAudience;
    const categoryMatch = cityState.selectedShopCategory === "All" || product.category === cityState.selectedShopCategory;
    return audienceMatch && categoryMatch;
  });

  dom.shoppingGrid.innerHTML = visibleProducts
    .map(
      (product) => `
        <article class="shop-card">
          <div class="shop-topline">
            <div>
              <span class="shop-badge">${product.audience} • ${product.category}</span>
              <strong>${product.name}</strong>
            </div>
            <span class="shop-price">${formatCurrency(product.price)}</span>
          </div>
          <span>${product.accent}</span>
          <p class="shop-copy">${product.description}</p>
          <div class="shop-actions">
            <button class="shop-button" data-add-product="${product.id}" type="button">Add to Cart</button>
          </div>
        </article>
      `
    )
    .join("");

  if (!visibleProducts.length) {
    dom.shoppingGrid.innerHTML = `
      <article class="shop-card">
        <div class="shop-topline">
          <div>
            <span class="shop-badge">${cityState.selectedShopAudience}</span>
            <strong>No products in this filter</strong>
          </div>
        </div>
        <p class="shop-copy">Try another category or switch between Consumer and Business tabs.</p>
      </article>
    `;
  }

  dom.shoppingGrid.querySelectorAll("[data-add-product]").forEach((button) => {
    button.addEventListener("click", () => {
      const product = shoppingProducts.find((item) => item.id === button.dataset.addProduct);
      cityState.cart.push(product);
      syncCart();
      pushAlert(`${product.name} added to shopping basket`, "info");
      syncDashboard();
    });
  });

  syncCart();
}

function syncCart() {
  const total = cityState.cart.reduce((sum, product) => sum + product.price, 0);
  dom.cartCount.textContent = `${cityState.cart.length} item${cityState.cart.length === 1 ? "" : "s"}`;
  dom.cartTotal.textContent = total > 0 ? formatCurrency(total) : "Rs 0";
}

function adjustViewportZoom(amount) {
  cityState.viewport.scale = clamp(cityState.viewport.scale + amount, 0.82, 2.5);
  applyViewportTransform();
}

function applyViewportTransform() {
  dom.fallbackViewport.style.transform = `translate(${cityState.viewport.x}px, ${cityState.viewport.y}px) scale(${cityState.viewport.scale})`;
}

function resetViewport() {
  cityState.viewport.scale = 1;
  cityState.viewport.x = 0;
  cityState.viewport.y = 0;
  applyViewportTransform();
  if (cityState.map.instance) {
    cityState.map.instance.flyTo({
      center: [77.598, 12.971],
      zoom: 13.2,
      pitch: 60,
      bearing: -18,
      speed: 0.8,
    });
  }
}

function focusZone(zone) {
  cityState.selectedZoneId = zone.id;
  renderFallbackMarkers();
  if (cityState.mapSource !== "mapbox") {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    cityState.viewport.scale = 1.32;
    cityState.viewport.x = centerX - zone.x * cityState.viewport.scale;
    cityState.viewport.y = centerY - zone.y * cityState.viewport.scale;
    applyViewportTransform();
  }
  if (cityState.map.instance) {
    cityState.map.instance.flyTo({
      center: zone.coords,
      zoom: zone.kind === "traffic" ? 15.5 : 14.8,
      pitch: 64,
      bearing: -20,
      speed: 0.9,
      essential: true,
    });
  }
}

function initMapbox(forceRetry = false) {
  if (!window.mapboxgl || !cityState.map.token) {
    if (forceRetry && !cityState.map.token) {
      setMapSource("Local control grid");
    }
    return;
  }

  try {
    if (cityState.map.instance) {
      teardownMapbox();
    }
    mapboxgl.accessToken = cityState.map.token;
    cityState.map.instance = new mapboxgl.Map({
      container: dom.mapboxRoot,
      style: getMapboxStyle(),
      center: [77.598, 12.971],
      zoom: 13.2,
      pitch: 60,
      bearing: -18,
      antialias: true,
    });

    cityState.map.instance.on("load", () => {
      dom.mapboxRoot.classList.remove("hidden");
      dom.fallbackMap.style.opacity = "0.3";
      dom.tokenPanel.classList.add("hidden");
      addMapboxDecorations();
      setMapSource("Mapbox 3D live map");
    });

    cityState.map.instance.on("error", () => {
      teardownMapbox();
      setMapSource("Local control grid");
    });
  } catch (error) {
    teardownMapbox();
    setMapSource("Local control grid");
  }
}

function teardownMapbox() {
  cityState.map.markers.forEach((marker) => marker.remove());
  cityState.map.markers = [];
  mapboxMarkers.clear();
  if (cityState.map.instance) {
    cityState.map.instance.remove();
    cityState.map.instance = null;
  }
  dom.mapboxRoot.classList.add("hidden");
  dom.fallbackMap.style.opacity = "1";
  cityState.mapSource = "fallback";
}

function addMapboxDecorations() {
  if (!cityState.map.instance) {
    return;
  }

  const map = cityState.map.instance;

  if (map.getLayer("road-network-line")) {
    map.removeLayer("road-network-line");
  }
  if (map.getSource("road-network")) {
    map.removeSource("road-network");
  }

  map.addSource("road-network", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [
              [77.578, 12.979],
              [77.588, 12.978],
              [77.594, 12.978],
              [77.603, 12.973],
              [77.615, 12.966],
            ],
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [
              [77.586, 12.953],
              [77.594, 12.962],
              [77.599, 12.971],
              [77.609, 12.988],
            ],
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [
              [77.59, 12.957],
              [77.598, 12.958],
              [77.607, 12.958],
            ],
          },
        },
      ],
    },
  });

  map.addLayer({
    id: "road-network-line",
    type: "line",
    source: "road-network",
    paint: {
      "line-color": cityState.theme === "day" ? "#177eff" : "#67f1ff",
      "line-width": 5,
      "line-opacity": 0.78,
      "line-blur": 0.4,
    },
  });

  if (map.getLayer("3d-buildings")) {
    map.removeLayer("3d-buildings");
  }

  const labelLayerId = map
    .getStyle()
    .layers.find((layer) => layer.type === "symbol" && layer.layout && layer.layout["text-field"])?.id;

  if (labelLayerId && map.getSource("composite")) {
    map.addLayer(
      {
        id: "3d-buildings",
        source: "composite",
        "source-layer": "building",
        filter: ["==", "extrude", "true"],
        type: "fill-extrusion",
        minzoom: 12,
        paint: {
          "fill-extrusion-color": cityState.theme === "day" ? "#9fd5ff" : "#16304d",
          "fill-extrusion-height": ["get", "height"],
          "fill-extrusion-base": ["get", "min_height"],
          "fill-extrusion-opacity": 0.72,
        },
      },
      labelLayerId
    );
  }

  syncMapboxMarkers(true);
}

function syncMapboxMarkers(force = false) {
  if (!cityState.map.instance) {
    return;
  }

  if (force) {
    cityState.map.markers.forEach((marker) => marker.remove());
    cityState.map.markers = [];
    mapboxMarkers.clear();
  }

  allZones.forEach((zone) => {
    const status = getZoneStatus(zone.id);
    let marker = mapboxMarkers.get(zone.id);
    if (!marker || force) {
      if (marker) {
        marker.remove();
      }
      const element = document.createElement("button");
      element.type = "button";
      element.className = `zone-marker ${zone.kind}`;
      element.innerHTML = markerTemplate(zone, status);
      element.addEventListener("click", () => {
        focusZone(zone);
        openZonePanel(zone.id);
      });
      marker = new mapboxgl.Marker({ element, anchor: "center" })
        .setLngLat(zone.coords)
        .addTo(cityState.map.instance);
      mapboxMarkers.set(zone.id, marker);
      cityState.map.markers.push(marker);
    } else {
      marker.getElement().classList.toggle("active", cityState.selectedZoneId === zone.id);
      marker.getElement().innerHTML = markerTemplate(zone, status);
    }
  });
}

function setMapSource(label) {
  cityState.mapSource = label.includes("Mapbox") ? "mapbox" : "fallback";
  dom.mapSource.textContent = label;
  dom.fallbackMap.style.opacity = cityState.mapSource === "mapbox" ? "0.3" : "1";
}

function getMapboxStyle() {
  return cityState.theme === "day" ? "mapbox://styles/mapbox/navigation-day-v1" : "mapbox://styles/mapbox/dark-v11";
}

function trafficLightFlow(state, ratio, autoMode) {
  const base = state === "green" ? 84 : state === "yellow" ? 38 : 12;
  const controlFactor = autoMode ? 1 : 0.92;
  return Math.round(clamp(base * ratio * controlFactor, 6, 100));
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

init();
