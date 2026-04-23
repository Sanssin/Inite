"""
Shielding Model - OOP Implementation for Radiation Shielding Calculations
"""
from abc import ABC, abstractmethod
import math

ISOTOPE_ALIASES = {
    "cesium-137": "cs-137",
    "cobalt-60": "co-60",
    "natrium-22": "na-22",
    "sodium-22": "na-22",
    "americium-241": "am-241",
    "am-241": "am-241",
    "uranium-235": "u-235",
    "thorium-232": "th-232",
    "plutonium-239": "pu-239",
    "iodine-131": "i-131",
    "iodin-131": "i-131",
}


def normalize_isotope_key(isotope_type: str) -> str:
    """Normalize isotope label to internal key form."""
    normalized = isotope_type.lower().strip()
    return ISOTOPE_ALIASES.get(normalized, normalized)


class ShieldingMaterial(ABC):
    """Abstract base class for shielding materials"""
    
    def __init__(self, thickness: float = 0):
        self.thickness = thickness
    
    @property
    @abstractmethod
    def material_name(self) -> str:
        """Name of the shielding material"""
        pass
    
    @property
    @abstractmethod
    def density_g_cm3(self) -> float:
        """Material density in g/cm³"""
        pass
    
    @property
    @abstractmethod
    def atomic_number(self) -> str:
        """Atomic number range or specific value"""
        pass
    
    @abstractmethod
    def get_attenuation_coefficient(self, isotope_type: str) -> float:
        """Get attenuation coefficient for specific isotope"""
        pass
    
    def calculate_shielding_factor(self, isotope_type: str) -> float:
        """Calculate shielding factor based on material and thickness"""
        if self.thickness <= 0:
            return 1.0  # No shielding
        
        mu = self.get_attenuation_coefficient(isotope_type)
        return math.exp(-mu * self.thickness)
    
    def calculate_hvl(self, isotope_type: str) -> float:
        """Calculate Half-Value Layer (HVL) for the material"""
        mu = self.get_attenuation_coefficient(isotope_type)
        return (math.log(2) / mu) if mu > 0 else 0
    
    def apply_shielding(self, unshielded_dose_rate: float, isotope_type: str) -> float:
        """Apply shielding to reduce dose rate"""
        shielding_factor = self.calculate_shielding_factor(isotope_type)
        return unshielded_dose_rate * shielding_factor


class Lead(ShieldingMaterial):
    """Lead shielding material"""
    
    ATTENUATION_COEFFICIENTS = {
        "cs-137": 1.2,
        "co-60": 0.7,
        "na-22": 0.5,
        "am-241": 1.5,
        "u-235": 14.6165,
        "th-232": 51.3171,
        "pu-239": 85.6233,
        "i-131": 3.3221,
    }
    
    @property
    def material_name(self) -> str:
        return "Timbal (Lead)"
    
    @property
    def density_g_cm3(self) -> float:
        return 11.34
    
    @property
    def atomic_number(self) -> str:
        return "82"
    
    def get_attenuation_coefficient(self, isotope_type: str) -> float:
        return self.ATTENUATION_COEFFICIENTS.get(normalize_isotope_key(isotope_type), 1.0)


class Concrete(ShieldingMaterial):
    """Concrete shielding material"""
    
    ATTENUATION_COEFFICIENTS = {
        "cs-137": 0.15,
        "co-60": 0.1,
        "na-22": 0.09,
        "am-241": 0.2,
        "u-235": 0.3050,
        "th-232": 0.5835,
        "pu-239": 0.7567,
        "i-131": 0.2347,
    }
    
    @property
    def material_name(self) -> str:
        return "Beton (Concrete)"
    
    @property
    def density_g_cm3(self) -> float:
        return 2.3
    
    @property
    def atomic_number(self) -> str:
        return "~11-14"
    
    def get_attenuation_coefficient(self, isotope_type: str) -> float:
        return self.ATTENUATION_COEFFICIENTS.get(normalize_isotope_key(isotope_type), 0.1)


class Glass(ShieldingMaterial):
    """Lead-glass shielding material"""
    
    ATTENUATION_COEFFICIENTS = {
        "cs-137": 0.086,
        "co-60": 0.063,
        "na-22": 0.12,
        "am-241": 0.11,
        "u-235": 6.2303,
        "th-232": 21.5644,
        "pu-239": 35.8393,
        "i-131": 1.5241,
    }
    
    @property
    def material_name(self) -> str:
        return "Kaca Timbal (Lead Glass)"
    
    @property
    def density_g_cm3(self) -> float:
        return 6.22
    
    @property
    def atomic_number(self) -> str:
        return "~14, 22, 82"
    
    def get_attenuation_coefficient(self, isotope_type: str) -> float:
        return self.ATTENUATION_COEFFICIENTS.get(normalize_isotope_key(isotope_type), 0.08)

class Steel(ShieldingMaterial):
    """Steel shielding material"""
    
    # Koefisien atenuasi untuk setiap isotop
    ATTENUATION_COEFFICIENTS = {
        "cs-137": 0.95,
        "co-60": 0.52,
        "na-22": 0.45,
        "am-241": 1.2,
        "u-235": 1.2593,
        "th-232": 8.5473,
        "pu-239": 14.4103,
        "i-131": 0.7822,
    }
    
    @property
    def material_name(self) -> str:
        return "Baja (Steel)"
    
    @property
    def density_g_cm3(self) -> float:
        return 7.85
    
    @property
    def atomic_number(self) -> str:
        return "26"
    
    def get_attenuation_coefficient(self, isotope_type: str) -> float:
        return self.ATTENUATION_COEFFICIENTS.get(normalize_isotope_key(isotope_type), 0.8)

class ShieldingFactory:
    """Factory class to create shielding material instances"""
    
    _material_classes = {
        "timbal": Lead,
        "lead": Lead,
        "pb": Lead,
        "beton": Concrete,
        "concrete": Concrete,
        "kaca": Glass,
        "glass": Glass,
        "baja": Steel,
        "steel": Steel,
    }
    
    @classmethod
    def create_shielding(cls, material_type: str, thickness: float = 0) -> ShieldingMaterial:
        """Create a shielding material instance of the specified type"""
        material_type = material_type.lower()
        
        if material_type not in cls._material_classes:
            raise ValueError(f"Unsupported shielding material: {material_type}")
        
        material_class = cls._material_classes[material_type]
        return material_class(thickness)
    
    @classmethod
    def get_available_materials(cls) -> list:
        """Get list of available shielding materials"""
        return list(set(cls._material_classes.values()))
