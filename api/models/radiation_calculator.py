"""
Radiation Calculator - Main OOP class for radiation dose calculations
"""
from typing import Dict, Any, Optional
import math
from .radioisotope import Radioisotope, RadioisotopeFactory
from .shielding import ShieldingMaterial, ShieldingFactory


class SafetyLevel:
    """Enum-like class for safety levels"""
    SAFE = "safe"
    WARNING = "warning"
    DANGER = "danger"


class RadiationCalculator:
    """Main class for radiation dose calculations using OOP principles"""
    
    # Safety thresholds (μSv/hr)
    DANGER_THRESHOLD = 7.5
    WARNING_THRESHOLD = 2.5
    FLUCTUATION_FACTOR = 0.04
    MINIMUM_DISTANCE = 0.5
    
    def __init__(self):
        self.isotope: Optional[Radioisotope] = None
        self.shielding: Optional[ShieldingMaterial] = None
    
    def setup_source(self, isotope_type: str, initial_activity: float, 
                    production_date: Optional[str] = None) -> None:
        """Setup radiation source"""
        self.isotope = RadioisotopeFactory.create_isotope(
            isotope_type, initial_activity, production_date
        )
    
    def setup_shielding(self, material_type: str, thickness: float = 0) -> None:
        """Setup shielding material"""
        self.shielding = ShieldingFactory.create_shielding(material_type, thickness)
    
    def calculate_dose_rate(self, distance: float) -> Dict[str, Any]:
        """Calculate dose rate at given distance with current setup"""
        if self.isotope is None:
            raise ValueError("No radiation source configured")
        
        if self.shielding is None:
            raise ValueError("No shielding material configured")
        
        # Handle minimum distance for safety
        if distance < self.MINIMUM_DISTANCE:
            return self._create_danger_response()
        
        # Calculate unshielded dose rate
        unshielded_dose = self.isotope.unshielded_dose_rate(distance)
        
        # Apply shielding
        shielded_dose = self.shielding.apply_shielding(
            unshielded_dose, self.isotope.isotope_name.lower()
        )
        
        # Calculate fluctuation
        std_dev = self.FLUCTUATION_FACTOR * math.sqrt(shielded_dose)
        
        # Determine safety level
        safety_level, status_text = self._determine_safety_level(shielded_dose)
        
        return {
            "level": round(shielded_dose, 2),
            "std_dev": round(std_dev, 4),
            "description": status_text,
            "safety_level": safety_level,
            "current_activity": round(self.isotope.current_activity(), 2),
            "source_type": self.isotope.isotope_name,
            "initial_activity": self.isotope.initial_activity,
            "production_date": self.isotope.production_date.strftime("%Y-%m-%d"),
            "half_life": self.isotope.half_life_years,
            "shielding_material": self.shielding.material_name,
            "shield_thickness": self.shielding.thickness,
            "attenuation_coefficient": self.shielding.get_attenuation_coefficient(
                self.isotope.isotope_name.lower()
            ),
            "hvl": round(self.shielding.calculate_hvl(self.isotope.isotope_name.lower()), 2)
        }
    
    def _determine_safety_level(self, dose_rate: float) -> tuple[str, str]:
        """Determine safety level based on dose rate"""
        if dose_rate >= self.DANGER_THRESHOLD:
            return (SafetyLevel.DANGER, "BAHAYA: Laju paparan sangat tinggi.")
        elif dose_rate >= self.WARNING_THRESHOLD:
            return (SafetyLevel.WARNING, "PERINGATAN: Laju paparan cukup tinggi.")
        else:
            return (SafetyLevel.SAFE, "AMAN: Laju paparan di bawah batas aman.")
    
    def _create_danger_response(self) -> Dict[str, Any]:
        """Create response for dangerous proximity to source"""
        return {
            "level": 1000.0,
            "std_dev": 0.0,
            "description": "Laju Paparan: >1000 μSv/jam. BAHAYA: Anda terlalu dekat dengan sumber radiasi. Segera menjauh!",
            "safety_level": SafetyLevel.DANGER,
            "current_activity": self.isotope.current_activity() if self.isotope else 0,
            "source_type": self.isotope.isotope_name if self.isotope else "Unknown",
            "initial_activity": self.isotope.initial_activity if self.isotope else 0,
            "production_date": self.isotope.production_date.strftime("%Y-%m-%d") if self.isotope else "",
            "half_life": self.isotope.half_life_years if self.isotope else 0,
            "shielding_material": self.shielding.material_name if self.shielding else "None",
            "shield_thickness": self.shielding.thickness if self.shielding else 0,
            "attenuation_coefficient": 0,
            "hvl": 0
        }
    
    def get_source_info(self) -> Dict[str, Any]:
        """Get information about current source"""
        if self.isotope is None:
            return {}
        
        return {
            "isotope_name": self.isotope.isotope_name,
            "initial_activity": self.isotope.initial_activity,
            "current_activity": self.isotope.current_activity(),
            "production_date": self.isotope.production_date.strftime("%Y-%m-%d"),
            "half_life": self.isotope.half_life_years,
            "gamma_constant": self.isotope.gamma_constant
        }
    
    def get_shielding_info(self) -> Dict[str, Any]:
        """Get information about current shielding"""
        if self.shielding is None:
            return {}
        
        isotope_type = self.isotope.isotope_name.lower() if self.isotope else "cs-137"
        
        return {
            "material_name": self.shielding.material_name,
            "thickness": self.shielding.thickness,
            "attenuation_coefficient": self.shielding.get_attenuation_coefficient(isotope_type),
            "hvl": self.shielding.calculate_hvl(isotope_type)
        }