"""
Radioisotope Model - OOP Implementation for Nuclear Physics Calculations
"""
from abc import ABC, abstractmethod
from typing import Dict, Optional
import datetime
import math


class Radioisotope(ABC):
    """Abstract base class for radioisotopes"""
    
    def __init__(self, initial_activity: float, production_date: str):
        self.initial_activity = initial_activity
        self.production_date = datetime.datetime.strptime(production_date, "%Y-%m-%d").date()
    
    @property
    @abstractmethod
    def half_life_years(self) -> float:
        """Half-life in years"""
        pass
    
    @property
    @abstractmethod
    def gamma_constant(self) -> float:
        """Gamma constant for dose rate calculation"""
        pass
    
    @property
    @abstractmethod
    def isotope_name(self) -> str:
        """Name of the isotope"""
        pass
    
    def current_activity(self, calculation_date: Optional[datetime.date] = None) -> float:
        """Calculate current activity based on radioactive decay"""
        if calculation_date is None:
            calculation_date = datetime.date.today()
        
        time_elapsed_years = (calculation_date - self.production_date).days / 365.25
        return self.initial_activity * (0.5 ** (time_elapsed_years / self.half_life_years))
    
    def unshielded_dose_rate(self, distance: float) -> float:
        """Calculate unshielded dose rate at given distance"""
        if distance < 0.1:
            distance = 0.1  # Minimum distance for safety
        
        current_activity = self.current_activity()
        return (self.gamma_constant * current_activity) / (distance ** 2)


class Cesium137(Radioisotope):
    """Cesium-137 radioisotope implementation"""
    
    @property
    def half_life_years(self) -> float:
        return 30.17
    
    @property
    def gamma_constant(self) -> float:
        return 0.327
    
    @property
    def isotope_name(self) -> str:
        return "Cs-137"


class Cobalt60(Radioisotope):
    """Cobalt-60 radioisotope implementation"""
    
    @property
    def half_life_years(self) -> float:
        return 5.27
    
    @property
    def gamma_constant(self) -> float:
        return 1.32
    
    @property
    def isotope_name(self) -> str:
        return "Co-60"


class Sodium22(Radioisotope):
    """Sodium-22 radioisotope implementation"""
    
    @property
    def half_life_years(self) -> float:
        return 2.6
    
    @property
    def gamma_constant(self) -> float:
        return 0.58
    
    @property
    def isotope_name(self) -> str:
        return "Na-22"


class RadioisotopeFactory:
    """Factory class to create radioisotope instances"""
    
    # Default production dates
    DEFAULT_PRODUCTION_DATES = {
        "cs-137": "1999-09-01",
        "co-60": "2018-01-01",
        "na-22": "2019-01-01",
    }
    
    _isotope_classes = {
        "cs-137": Cesium137,
        "co-60": Cobalt60,
        "na-22": Sodium22,
    }
    
    @classmethod
    def create_isotope(cls, isotope_type: str, initial_activity: float, 
                      production_date: Optional[str] = None) -> Radioisotope:
        """Create a radioisotope instance of the specified type"""
        isotope_type = isotope_type.lower()
        
        if isotope_type not in cls._isotope_classes:
            raise ValueError(f"Unsupported isotope type: {isotope_type}")
        
        if production_date is None:
            production_date = cls.DEFAULT_PRODUCTION_DATES.get(isotope_type, "2020-01-01")
        
        isotope_class = cls._isotope_classes[isotope_type]
        return isotope_class(initial_activity, production_date)
    
    @classmethod
    def get_available_isotopes(cls) -> list:
        """Get list of available isotope types"""
        return list(cls._isotope_classes.keys())