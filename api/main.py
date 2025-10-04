"""
Nuclear Radiation Simulation API - Refactored with OOP Design
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any
from api.models.radiation_calculator import RadiationCalculator
from api.models.radioisotope import RadioisotopeFactory
from api.models.shielding import ShieldingFactory

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
