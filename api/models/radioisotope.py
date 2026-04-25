"""
Radioisotope Model - OOP Implementation for Nuclear Physics Calculations
"""
from abc import ABC, abstractmethod
from typing import Optional
import datetime


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
    def gamma_energy_kev(self) -> str:
        """Primary gamma energy in keV"""
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
        return "Cesium-137"
    
    @property
    def gamma_energy_kev(self) -> str:
        return "662 keV"


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
        return "Cobalt-60"
    
    @property
    def gamma_energy_kev(self) -> str:
        return "1.17 & 1.33 MeV"


class Sodium22(Radioisotope):
    """Natrium-22 radioisotope implementation"""
    
    @property
    def half_life_years(self) -> float:
        return 2.6
    
    @property
    def gamma_constant(self) -> float:
        return 0.58
    
    @property
    def isotope_name(self) -> str:
        return "Natrium-22"
    
    @property
    def gamma_energy_kev(self) -> str:
        return "511 keV & 1.27 MeV"

class Americium241(Radioisotope):
    """Americium-241"""
    
    @property
    def half_life_years(self) -> float:
        return 432.2
    
    @property
    def gamma_constant(self) -> float:
        return 0.318
    
    @property
    def isotope_name(self) -> str:
        return "Am-241"
    
    @property  
    def gamma_energy_kev(self) -> str:
        return "59.5 keV"


class Uranium235(Radioisotope):
    """Uranium-235"""

    @property
    def half_life_years(self) -> float:
        return 7.04e8

    @property
    def gamma_constant(self) -> float:
        # Source: Gamma-Ray-Dose-Constants.pdf (RadResponder), U-235 = 0.338883 rem/hr at 1 m per 1 Ci
        return 0.338883

    @property
    def isotope_name(self) -> str:
        return "Uranium-235"

    @property
    def gamma_energy_kev(self) -> str:
        # Source: IAEA Livechart decay_rads (U-235), dominant line ~185.713 keV
        return "185.7 keV"


class Thorium232(Radioisotope):
    """Thorium-232"""

    @property
    def half_life_years(self) -> float:
        return 1.40e10

    @property
    def gamma_constant(self) -> float:
        # Source: Gamma-Ray-Dose-Constants.pdf (RadResponder), Th-232 = 0.068376 rem/hr at 1 m per 1 Ci
        return 0.068376

    @property
    def isotope_name(self) -> str:
        return "Thorium-232"

    @property
    def gamma_energy_kev(self) -> str:
        # Source: IAEA Livechart decay_rads (Th-232), prominent line ~63.81 keV
        return "63.8 keV"


class Plutonium239(Radioisotope):
    """Plutonium-239"""

    @property
    def half_life_years(self) -> float:
        return 24110.0

    @property
    def gamma_constant(self) -> float:
        # Source: Gamma-Ray-Dose-Constants.pdf (RadResponder), Pu-239 = 0.0301365 rem/hr at 1 m per 1 Ci
        return 0.0301365

    @property
    def isotope_name(self) -> str:
        return "Plutonium-239"

    @property
    def gamma_energy_kev(self) -> str:
        # Source: IAEA Livechart decay_rads (Pu-239), representative line ~51.624 keV
        return "51.6 keV"


class Iodine131(Radioisotope):
    """Iodine-131"""

    @property
    def half_life_years(self) -> float:
        return 8.0252 / 365.25

    @property
    def gamma_constant(self) -> float:
        # Source: Gamma-Ray-Dose-Constants.pdf (RadResponder), I-131 = 0.282939 rem/hr at 1 m per 1 Ci
        return 0.282939

    @property
    def isotope_name(self) -> str:
        return "Iodine-131"

    @property
    def gamma_energy_kev(self) -> str:
        # Source: IAEA Livechart decay_rads (I-131), dominant line ~364.489 keV
        return "364.5 keV"


class RadioisotopeFactory:
    """Factory class to create radioisotope instances"""

    TODAY_DATE_STR = datetime.date.today().strftime("%Y-%m-%d")
    
    # Default production dates
    DEFAULT_PRODUCTION_DATES = {
        "cs-137": "2017-09-01",
        "co-60": "2025-05-01",
        "na-22": "2026-01-01",
        "am-241": "2024-06-01",
        "u-235": "2015-01-01",
        "th-232": "2015-01-01",
        "pu-239": "2020-01-01",
        "i-131": TODAY_DATE_STR,
    }
    
    _isotope_classes = {
        "cs-137": Cesium137,
        "co-60": Cobalt60,
        "na-22": Sodium22,
        "am-241": Americium241,
        "u-235": Uranium235,
        "th-232": Thorium232,
        "pu-239": Plutonium239,
        "i-131": Iodine131,
    }

    ISOTOPE_ALIASES = {
        "cesium-137": "cs-137",
        "cobalt-60": "co-60",
        "natrium-22": "na-22",
        "sodium-22": "na-22",
        "americium-241": "am-241",
        "uranium-235": "u-235",
        "thorium-232": "th-232",
        "plutonium-239": "pu-239",
        "iodine-131": "i-131",
        "iodin-131": "i-131",
    }
    
    @classmethod
    def create_isotope(cls, isotope_type: str, initial_activity: float, 
                      production_date: Optional[str] = None) -> Radioisotope:
        """Create a radioisotope instance of the specified type"""
        isotope_type = cls.ISOTOPE_ALIASES.get(isotope_type.lower(), isotope_type.lower())
        
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
