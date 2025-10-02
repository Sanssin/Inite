/**
 * GameState Class - OOP implementation for game state management
 */

class Position {
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
  }

  equals(other) {
    return this.id === other.id;
  }

  distanceTo(other) {
    return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
  }
}

class Avatar {
  constructor(initialPositionId = 22) {
    this.positionId = initialPositionId;
    this.direction = 'downLeft';
    this.totalDose = 0;
    this.isShielded = false;
  }

  moveTo(newPositionId, newDirection) {
    this.positionId = newPositionId;
    this.direction = newDirection;
  }

  accumulateDose(doseRate) {
    // Convert μSv/hr to μSv/second
    const doseRatePerSecond = doseRate / 3600;
    this.totalDose += doseRatePerSecond;
  }

  setShielded(shielded) {
    this.isShielded = shielded;
  }

  reset() {
    this.positionId = 22;
    this.direction = 'downLeft';
    this.totalDose = 0;
    this.isShielded = false;
  }
}

class Mission {
  constructor(targetPointIds = []) {
    this.targetPoints = new Set(targetPointIds);
    this.visitedPoints = new Set();
    this.isComplete = false;
  }

  visitPoint(pointId) {
    if (this.targetPoints.has(pointId)) {
      this.visitedPoints.add(pointId);
      this.checkCompletion();
      return true; // Point was a target and successfully visited
    }
    return false; // Point was not a target
  }

  checkCompletion() {
    this.isComplete = this.visitedPoints.size === this.targetPoints.size;
  }

  getProgress() {
    return {
      visited: this.visitedPoints.size,
      total: this.targetPoints.size,
      percentage: (this.visitedPoints.size / this.targetPoints.size) * 100
    };
  }

  reset(newTargetPoints = []) {
    this.targetPoints = new Set(newTargetPoints);
    this.visitedPoints.clear();
    this.isComplete = false;
  }
}

class SimulationData {
  constructor() {
    this.level = 0;
    this.stdDev = 0;
    this.description = 'Loading...';
    this.safetyLevel = 'safe';
    this.currentActivity = 0;
    this.sourceType = '';
    this.initialActivity = 0;
    this.productionDate = '';
    this.halfLife = 0;
    this.shieldingMaterial = '';
    this.shieldThickness = 0;
    this.attenuationCoefficient = 0;
    this.hvl = 0;
    this.error = false;
    this.message = '';
  }

  update(data) {
    Object.assign(this, data);
  }

  isValid() {
    return !this.error && this.level !== undefined;
  }

  getSafetyColor() {
    switch (this.safetyLevel) {
      case 'safe': return '#28a745';    // Green
      case 'warning': return '#ffc107'; // Yellow
      case 'danger': return '#dc3545';  // Red
      default: return '#E0CC0B';        // Default
    }
  }
}

class GameState {
  constructor(setupData = null) {
    this.avatar = new Avatar();
    this.mission = new Mission();
    this.simulationData = new SimulationData();
    this.setupData = setupData || this.getDefaultSetup();
    this.coordinates = this.initializeCoordinates();
    this.validIdSet = new Set(this.coordinates.map(coord => coord.id));
    this.shieldedIds = new Set([24, 25, 26, 32, 33, 34, 41, 42, 43, 44, 50, 51, 52, 53, 59, 60, 61, 62, 68, 70, 71]);
    this.isInitialized = false;
  }

  getDefaultSetup() {
    return {
      sourceType: 'cs-137',
      initialActivity: 10,
      shieldingMaterial: 'Timbal (Lead)',
      shieldingThickness: 1
    };
  }

  initializeCoordinates() {
    return [
      { id: 1, x: 14, y: 20.5 }, { id: 2, x: 15.9, y: 19.5 },
      { id: 3, x: 17.5, y: 18.5 }, { id: 4, x: 19.4, y: 17.5 },
      { id: 5, x: 21, y: 16.5 }, { id: 6, x: 22.6, y: 15.5 },
      { id: 7, x: 24.2, y: 14.5 }, { id: 8, x: 26.1, y: 13.5 },
      { id: 10, x: 12.3, y: 19.5 }, { id: 11, x: 14.1, y: 18.5 },
      { id: 12, x: 15.8, y: 17.5 }, { id: 13, x: 17.6, y: 16.5 },
      { id: 14, x: 19.3, y: 15.5 }, { id: 15, x: 21.1, y: 14.5 },
      { id: 16, x: 22.9, y: 13.5 }, { id: 17, x: 24.5, y: 12.5 },
      { id: 19, x: 10.6, y: 18.5 }, { id: 20, x: 12.3, y: 17.5 },
      { id: 21, x: 14, y: 16.7 }, { id: 22, x: 15.9, y: 15.5 },
      { id: 24, x: 19.1, y: 13.7 }, { id: 25, x: 21, y: 12.5 }, 
      { id: 26, x: 22.8, y: 11.5 }, { id: 28, x: 8.9, y: 17.5 }, 
      { id: 29, x: 10.5, y: 16.7 }, { id: 30, x: 12.2, y: 15.5 }, 
      { id: 31, x: 14.1, y: 14.5 }, { id: 32, x: 15.7, y: 13.5 }, 
      { id: 33, x: 17.2, y: 12.7 }, { id: 34, x: 19.1, y: 11.5 }, 
      { id: 37, x: 7.2, y: 16.7 }, { id: 38, x: 9, y: 15.7 }, 
      { id: 39, x: 10.6, y: 14.5 }, { id: 40, x: 12.4, y: 13.5 }, 
      { id: 41, x: 14, y: 12.5 }, { id: 42, x: 15.9, y: 11.5 },
      { id: 43, x: 17.5, y: 10.5 }, { id: 44, x: 19.2, y: 9.5 }, 
      { id: 46, x: 5.5, y: 15.7 }, { id: 47, x: 7.2, y: 14.7 }, 
      { id: 48, x: 8.7, y: 13.6 }, { id: 49, x: 10.7, y: 12.5 }, 
      { id: 50, x: 12.4, y: 11.7 }, { id: 51, x: 14.1, y: 10.5 }, 
      { id: 52, x: 15.9, y: 9.5 }, { id: 53, x: 17.5, y: 8.7 }, 
      { id: 55, x: 3.7, y: 14.7 }, { id: 56, x: 5.4, y: 13.7 }, 
      { id: 57, x: 7.1, y: 12.7 }, { id: 58, x: 9, y: 11.5 }, 
      { id: 59, x: 10.7, y: 10.7 }, { id: 60, x: 12.5, y: 9.5 }, 
      { id: 61, x: 14.1, y: 8.7 }, { id: 62, x: 15.9, y: 7.7 }, 
      { id: 65, x: 3.6, y: 12.7 }, { id: 66, x: 5.5, y: 11.7 }, 
      { id: 68, x: 8.9, y: 9.6 }, { id: 70, x: 12.5, y: 7.7 }, 
      { id: 71, x: 14.1, y: 6.7 },
    ];
  }

  initializeMission() {
    const allCoordinateIds = this.coordinates.map(c => c.id);
    const shuffled = [...allCoordinateIds].sort(() => 0.5 - Math.random());
    // Exclude starting point and points very close to the source for fairness
    const excludedPoints = new Set([22, 13, 14, 15, 21, 23, 30, 31, 32]);
    const possiblePoints = shuffled.filter(id => !excludedPoints.has(id));
    this.mission.reset(possiblePoints.slice(0, 5));
  }

  canMoveTo(positionId) {
    return this.validIdSet.has(positionId);
  }

  moveAvatar(newPositionId, direction) {
    if (!this.canMoveTo(newPositionId)) {
      return false;
    }

    this.avatar.moveTo(newPositionId, direction);
    this.avatar.setShielded(this.shieldedIds.has(newPositionId));
    
    // Check if this position is a mission target
    if (this.mission.visitPoint(newPositionId)) {
      // Emit event or callback for mission progress
      this.onMissionProgress?.();
    }

    return true;
  }

  getCurrentPosition() {
    return this.coordinates.find(coord => coord.id === this.avatar.positionId);
  }

  getLogicalDistance() {
    // Calculate logical distance from source (position 14 is assumed as source reference)
    const avatarLogicalCoord = this.calculateLogicalCoordinate(this.avatar.positionId);
    if (!avatarLogicalCoord) return 0.1;
    
    const distance = Math.sqrt(Math.pow(avatarLogicalCoord.lx, 2) + Math.pow(avatarLogicalCoord.ly, 2));
    return distance === 0 ? 0.1 : distance;
  }

  calculateLogicalCoordinate(positionId) {
    // This is a simplified version - you may want to implement the full BFS algorithm from original code
    const sourceId = 14; // Assuming 14 is the source position
    const sourceCoord = this.coordinates.find(c => c.id === sourceId);
    const avatarCoord = this.coordinates.find(c => c.id === positionId);
    
    if (!sourceCoord || !avatarCoord) return null;
    
    // Simple coordinate difference (you can improve this with actual grid logic)
    return {
      lx: Math.round((avatarCoord.x - sourceCoord.x) / 2),
      ly: Math.round((avatarCoord.y - sourceCoord.y) / 2)
    };
  }

  updateSimulationData(data) {
    this.simulationData.update(data);
  }

  getHudData() {
    const position = this.getCurrentPosition();
    const distance = this.getLogicalDistance();
    const shieldThickness = this.avatar.isShielded ? this.setupData.shieldingThickness : 0;

    return {
      ...this.simulationData,
      distance: distance,
      shield_thickness: shieldThickness,
      total_dose: this.avatar.totalDose,
      fluctuatingDoseRate: this.simulationData.level,
      targetPoints: Array.from(this.mission.targetPoints),
      visitedPoints: this.mission.visitedPoints
    };
  }

  reset() {
    this.avatar.reset();
    this.initializeMission();
    this.simulationData = new SimulationData();
  }

  // Event handlers (to be set by the component using this class)
  onMissionProgress = null;
  onMissionComplete = null;
  onDoseUpdate = null;
}

export { GameState, Avatar, Mission, SimulationData, Position };