"""
Shielding Model - OOP Implementation for Radiation Shielding Calculations
"""
from abc import ABC, abstractmethod
from typing import Dict
import math


class ShieldingMaterial(ABC):
    """Abstract base class for shielding materials"""
    
    def __init__(self, thickness: float = 0):
        self.thickness = thickness
    
    @property
    @abstractmethod
    def material_name(self) -> str:
        """Name of the shielding material"""
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
        "na-22": 0.5
    }
    
    @property
    def material_name(self) -> str:
        return "Timbal (Lead)"
    
    def get_attenuation_coefficient(self, isotope_type: str) -> float:
        isotope_type = isotope_type.lower()
        return self.ATTENUATION_COEFFICIENTS.get(isotope_type, 1.0)


class Concrete(ShieldingMaterial):
    """Concrete shielding material"""
    
    ATTENUATION_COEFFICIENTS = {
        "cs-137": 0.15,
        "co-60": 0.1,
        "na-22": 0.09
    }
    
    @property
    def material_name(self) -> str:
        return "Beton (Concrete)"
    
    def get_attenuation_coefficient(self, isotope_type: str) -> float:
        isotope_type = isotope_type.lower()
        return self.ATTENUATION_COEFFICIENTS.get(isotope_type, 0.1)


class Glass(ShieldingMaterial):
    """Glass shielding material"""
    
    ATTENUATION_COEFFICIENTS = {
        "cs-137": 0.086,
        "co-60": 0.063,
        "na-22": 0.12
    }
    
    @property
    def material_name(self) -> str:
        return "Kaca (Glass)"
    
    def get_attenuation_coefficient(self, isotope_type: str) -> float:
        isotope_type = isotope_type.lower()
        return self.ATTENUATION_COEFFICIENTS.get(isotope_type, 0.08)


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