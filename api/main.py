"""
Nuclear Radiation Simulation API - Refactored with OOP Design
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any
from models.radiation_calculator import RadiationCalculator
from models.radioisotope import RadioisotopeFactory
from models.shielding import ShieldingFactory

app = FastAPI(
    title="Nuclear Radiation Simulation API",
    description="OOP-based API for nuclear radiation dose calculations",
    version="2.0.0"
)

# CORS Configuration - Updated to include HTTP origins for development
origins = [
    "http://localhost:3000",
    "http://localhost",
    "https://localhost:3000", 
    "https://localhost",
    "https://31.97.110.213:3000",
    "https://31.97.110.213",
    "https://inite-polteknuklir.site:3000", 
    "https://inite-polteknuklir.site",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global calculator instance (in production, this could be a singleton or per-session)
calculator = RadiationCalculator()


@app.get("/", response_model=Dict[str, Any])
def read_root():
    """API root endpoint with information"""
    return {
        "message": "Nuclear Radiation Simulation API - OOP Implementation",
        "version": "2.0.0",
        "endpoints": {
            "/calculate_dose": "Calculate radiation dose rate",
            "/available_isotopes": "Get available isotope types",
            "/available_materials": "Get available shielding materials",
            "/source_info": "Get current source information",
            "/shielding_info": "Get current shielding information"
        }
    }


@app.get("/calculate_dose")
def calculate_dose(
    distance: float,
    source_type: str,
    initial_activity: float,
    shielding_material: str,
    shield_thickness: float = 0,
) -> Dict[str, Any]:
    """
    Calculate radiation dose rate using OOP-based radiation physics model
    
    Args:
        distance: Distance from source in meters
        source_type: Type of radioisotope (cs-137, co-60, na-22)
        initial_activity: Initial activity in µCi
        shielding_material: Type of shielding material
        shield_thickness: Thickness of shielding in cm
    
    Returns:
        Dict containing dose calculations and safety information
    """
    try:
        # Setup radiation source using OOP factory pattern
        calculator.setup_source(source_type, initial_activity)
        
        # Setup shielding using OOP factory pattern
        calculator.setup_shielding(shielding_material, shield_thickness)
        
        # Calculate dose rate using OOP calculator
        result = calculator.calculate_dose_rate(distance)
        
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.get("/available_isotopes")
def get_available_isotopes() -> Dict[str, Any]:
    """Get list of available radioisotope types"""
    try:
        isotopes = RadioisotopeFactory.get_available_isotopes()
        return {
            "available_isotopes": isotopes,
            "count": len(isotopes)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/available_materials")
def get_available_materials() -> Dict[str, Any]:
    """Get list of available shielding materials"""
    try:
        materials = ShieldingFactory.get_available_materials()
        material_names = [material(0).material_name for material in materials]
        return {
            "available_materials": material_names,
            "count": len(material_names)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/source_info")
def get_source_info() -> Dict[str, Any]:
    """Get information about currently configured radiation source"""
    try:
        return calculator.get_source_info()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/isotope_details")
def get_isotope_details() -> Dict[str, Any]:
    """Get detailed information about all available isotopes"""
    try:
        isotope_types = RadioisotopeFactory.get_available_isotopes()
        isotope_details = {}
        
        for isotope_type in isotope_types:
            # Create a temporary isotope instance to get its properties
            temp_isotope = RadioisotopeFactory.create_isotope(isotope_type, 1.0)
            production_date = RadioisotopeFactory.DEFAULT_PRODUCTION_DATES.get(isotope_type, "2020-01-01")
            
            isotope_details[isotope_type] = {
                "name": temp_isotope.isotope_name,
                "half_life_years": temp_isotope.half_life_years,
                "gamma_constant": temp_isotope.gamma_constant,
                "gamma_energy": temp_isotope.gamma_energy_kev,
                "production_date": production_date,
                "symbol": isotope_type.upper()
            }
        
        return {
            "isotope_details": isotope_details,
            "count": len(isotope_details)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/material_details")
def get_material_details(source_type: str = "cs-137") -> Dict[str, Any]:
    """Get detailed information about all available materials for a specific source"""
    try:
        material_classes = ShieldingFactory.get_available_materials()
        material_details = {}
        
        for material_class in material_classes:
            # Create a temporary material instance to get its properties
            temp_material = material_class(0)
            material_key = temp_material.material_name.lower().split(' ')[0]
            
            # Calculate HVL for the specified source
            hvl = temp_material.calculate_hvl(source_type)
            attenuation_coef = temp_material.get_attenuation_coefficient(source_type)
            
            material_details[material_key] = {
                "name": temp_material.material_name,
                "density": temp_material.density_g_cm3,
                "atomic_number": temp_material.atomic_number,
                "hvl": hvl,
                "attenuation_coefficient": attenuation_coef,
                "key": material_key
            }
        
        return {
            "material_details": material_details,
            "source_type": source_type,
            "count": len(material_details)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/shielding_info")
def get_shielding_info() -> Dict[str, Any]:
    """Get information about currently configured shielding"""
    try:
        return calculator.get_shielding_info()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Legacy endpoint for backward compatibility (optional)
@app.get("/legacy/calculate_dose")
def legacy_calculate_dose(
    distance: float,
    source_type: str,
    initial_activity: float,
    shielding_material: str,
    shield_thickness: float = 0,
):
    """Legacy endpoint for backward compatibility"""
    return calculate_dose(distance, source_type, initial_activity, 
                         shielding_material, shield_thickness)
