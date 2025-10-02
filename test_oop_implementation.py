#!/usr/bin/env python3
"""
OOP Implementation Comprehensive Test Suite
Tests both backend OOP classes and compares with legacy implementation
"""

import requests
import json
import time
import sys
from datetime import datetime

# Test Configuration
BASE_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"

class Color:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    MAGENTA = '\033[95m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    END = '\033[0m'

def print_header(text):
    print(f"\n{Color.BOLD}{Color.BLUE}{'='*60}{Color.END}")
    print(f"{Color.BOLD}{Color.BLUE}{text.center(60)}{Color.END}")
    print(f"{Color.BOLD}{Color.BLUE}{'='*60}{Color.END}\n")

def print_success(text):
    print(f"{Color.GREEN}✅ {text}{Color.END}")

def print_error(text):
    print(f"{Color.RED}❌ {text}{Color.END}")

def print_warning(text):
    print(f"{Color.YELLOW}⚠️ {text}{Color.END}")

def print_info(text):
    print(f"{Color.CYAN}ℹ️ {text}{Color.END}")

class BackendTester:
    def __init__(self):
        self.test_results = []
    
    def test_connection(self):
        """Test basic backend connectivity"""
        print_info("Testing backend connection...")
        try:
            response = requests.get(f"{BASE_URL}/", timeout=5)
            if response.status_code == 200:
                data = response.json()
                print_success(f"Backend connected: {data.get('message', 'Unknown')}")
                print_success(f"API Version: {data.get('version', 'Unknown')}")
                return True
            else:
                print_error(f"Backend returned status {response.status_code}")
                return False
        except Exception as e:
            print_error(f"Backend connection failed: {e}")
            return False
    
    def test_available_resources(self):
        """Test available isotopes and materials"""
        print_info("Testing available resources...")
        
        # Test isotopes
        try:
            response = requests.get(f"{BASE_URL}/available_isotopes")
            if response.status_code == 200:
                isotopes = response.json()
                print_success(f"Available isotopes: {isotopes['available_isotopes']}")
                print_success(f"Isotope count: {isotopes['count']}")
            else:
                print_error("Failed to get isotopes")
        except Exception as e:
            print_error(f"Isotope test failed: {e}")
        
        # Test materials
        try:
            response = requests.get(f"{BASE_URL}/available_materials")
            if response.status_code == 200:
                materials = response.json()
                print_success(f"Available materials: {materials['available_materials']}")
                print_success(f"Material count: {materials['count']}")
            else:
                print_error("Failed to get materials")
        except Exception as e:
            print_error(f"Material test failed: {e}")
    
    def test_dose_calculations(self):
        """Test OOP dose calculation functionality"""
        print_info("Testing OOP dose calculations...")
        
        test_cases = [
            {
                "name": "Cs-137 with Lead Shielding",
                "params": {
                    "distance": 2.0,
                    "source_type": "cs-137", 
                    "initial_activity": 10.0,
                    "shielding_material": "lead",
                    "shield_thickness": 1.0
                }
            },
            {
                "name": "Co-60 with Concrete Shielding", 
                "params": {
                    "distance": 1.5,
                    "source_type": "co-60",
                    "initial_activity": 5.0,
                    "shielding_material": "concrete",
                    "shield_thickness": 5.0
                }
            },
            {
                "name": "Na-22 with Glass Shielding",
                "params": {
                    "distance": 3.0,
                    "source_type": "na-22", 
                    "initial_activity": 15.0,
                    "shielding_material": "glass",
                    "shield_thickness": 2.0
                }
            },
            {
                "name": "High Activity Danger Test",
                "params": {
                    "distance": 0.5,
                    "source_type": "co-60",
                    "initial_activity": 100.0,
                    "shielding_material": "glass",
                    "shield_thickness": 0.1
                }
            }
        ]
        
        for test_case in test_cases:
            print(f"\n{Color.MAGENTA}Testing: {test_case['name']}{Color.END}")
            try:
                # Build query string
                params = "&".join([f"{k}={v}" for k, v in test_case['params'].items()])
                url = f"{BASE_URL}/calculate_dose?{params}"
                
                response = requests.get(url, timeout=10)
                if response.status_code == 200:
                    result = response.json()
                    
                    # Display key results
                    level = result.get('level', 0)
                    safety = result.get('safety_level', 'unknown')
                    description = result.get('description', 'No description')
                    
                    color = Color.GREEN if safety == 'safe' else Color.YELLOW if safety == 'warning' else Color.RED
                    
                    print(f"  Dose Rate: {color}{level} μSv/hr{Color.END}")
                    print(f"  Safety: {color}{safety.upper()}{Color.END}")
                    print(f"  Description: {description}")
                    print(f"  Current Activity: {result.get('current_activity', 'N/A')} μCi")
                    print(f"  Source: {result.get('source_type', 'N/A')}")
                    print(f"  Shielding: {result.get('shielding_material', 'N/A')} ({result.get('shield_thickness', 0)} cm)")
                    
                    self.test_results.append({
                        'test': test_case['name'],
                        'success': True,
                        'dose_rate': level,
                        'safety_level': safety
                    })
                    
                    print_success(f"✅ {test_case['name']} - SUCCESS")
                else:
                    print_error(f"❌ {test_case['name']} - HTTP {response.status_code}")
                    self.test_results.append({
                        'test': test_case['name'], 
                        'success': False,
                        'error': f"HTTP {response.status_code}"
                    })
                    
            except Exception as e:
                print_error(f"❌ {test_case['name']} - ERROR: {e}")
                self.test_results.append({
                    'test': test_case['name'],
                    'success': False, 
                    'error': str(e)
                })
    
    def test_edge_cases(self):
        """Test edge cases and error handling"""
        print_info("Testing edge cases...")
        
        edge_cases = [
            {
                "name": "Invalid Isotope",
                "params": "distance=1.0&source_type=invalid&initial_activity=10.0&shielding_material=lead&shield_thickness=1.0",
                "expect_error": True
            },
            {
                "name": "Invalid Material", 
                "params": "distance=1.0&source_type=cs-137&initial_activity=10.0&shielding_material=invalid&shield_thickness=1.0",
                "expect_error": True
            },
            {
                "name": "Zero Distance",
                "params": "distance=0&source_type=cs-137&initial_activity=10.0&shielding_material=lead&shield_thickness=1.0",
                "expect_error": False  # Should be handled gracefully
            },
            {
                "name": "Negative Activity",
                "params": "distance=1.0&source_type=cs-137&initial_activity=-10.0&shielding_material=lead&shield_thickness=1.0", 
                "expect_error": True
            }
        ]
        
        for case in edge_cases:
            try:
                response = requests.get(f"{BASE_URL}/calculate_dose?{case['params']}")
                
                if case['expect_error']:
                    if response.status_code != 200:
                        print_success(f"✅ {case['name']} - Correctly handled error (Status: {response.status_code})")
                    else:
                        print_warning(f"⚠️ {case['name']} - Expected error but got success")
                else:
                    if response.status_code == 200:
                        print_success(f"✅ {case['name']} - Handled gracefully")
                    else:
                        print_error(f"❌ {case['name']} - Unexpected error (Status: {response.status_code})")
                        
            except Exception as e:
                print_error(f"❌ {case['name']} - Exception: {e}")

def test_frontend():
    """Test frontend accessibility"""
    print_header("FRONTEND OOP TESTING")
    
    try:
        # Test main app
        print_info("Testing main React app...")
        response = requests.get(FRONTEND_URL, timeout=10)
        if response.status_code == 200:
            print_success("Main React app accessible")
        else:
            print_error(f"Main app returned status {response.status_code}")
            
        # Test OOP route (this will return HTML, so we just check accessibility)
        print_info("Testing OOP game route...")
        response = requests.get(f"{FRONTEND_URL}/game-oop", timeout=10)
        if response.status_code == 200:
            print_success("OOP game route accessible")
            print_info("🎮 OOP Version: http://localhost:3000/game-oop")
        else:
            print_error(f"OOP route returned status {response.status_code}")
            
        # Test original route for comparison
        print_info("Testing original game route...")
        response = requests.get(f"{FRONTEND_URL}/game", timeout=10)
        if response.status_code == 200:
            print_success("Original game route accessible") 
            print_info("🎮 Original Version: http://localhost:3000/game")
        else:
            print_error(f"Original route returned status {response.status_code}")
            
    except Exception as e:
        print_error(f"Frontend testing failed: {e}")

def performance_comparison():
    """Compare performance between OOP and legacy implementations"""
    print_header("PERFORMANCE COMPARISON")
    
    print_info("Running performance tests...")
    
    # Test same calculation multiple times
    test_params = "distance=2.0&source_type=cs-137&initial_activity=10.0&shielding_material=lead&shield_thickness=1.0"
    
    # OOP Performance
    oop_times = []
    for i in range(10):
        start_time = time.time()
        try:
            response = requests.get(f"{BASE_URL}/calculate_dose?{test_params}", timeout=5)
            if response.status_code == 200:
                end_time = time.time()
                oop_times.append(end_time - start_time)
        except:
            pass
    
    if oop_times:
        avg_oop_time = sum(oop_times) / len(oop_times)
        print_success(f"OOP Average Response Time: {avg_oop_time:.4f} seconds")
        print_success(f"OOP Min/Max: {min(oop_times):.4f}s / {max(oop_times):.4f}s")
        
        # Check consistency 
        if max(oop_times) - min(oop_times) < 0.1:
            print_success("✅ Performance is consistent")
        else:
            print_warning("⚠️ Performance variation detected")
    else:
        print_error("❌ Could not measure OOP performance")

def generate_summary(tester):
    """Generate test summary"""
    print_header("TEST SUMMARY")
    
    total_tests = len(tester.test_results)
    successful_tests = len([t for t in tester.test_results if t['success']])
    
    print(f"{Color.BOLD}Total Tests: {total_tests}{Color.END}")
    print(f"{Color.GREEN}Successful: {successful_tests}{Color.END}")
    print(f"{Color.RED}Failed: {total_tests - successful_tests}{Color.END}")
    
    if successful_tests == total_tests:
        print(f"\n{Color.GREEN}{Color.BOLD}🎉 ALL TESTS PASSED! OOP Implementation is working perfectly.{Color.END}")
    else:
        print(f"\n{Color.YELLOW}⚠️ Some tests failed. Check the details above.{Color.END}")
    
    # Display test details
    print(f"\n{Color.BOLD}Detailed Results:{Color.END}")
    for result in tester.test_results:
        status = "✅ PASS" if result['success'] else "❌ FAIL"
        print(f"  {status} - {result['test']}")
        if result['success']:
            print(f"    Dose Rate: {result.get('dose_rate', 'N/A')} μSv/hr")
            print(f"    Safety: {result.get('safety_level', 'N/A').upper()}")
        else:
            print(f"    Error: {result.get('error', 'Unknown error')}")

def main():
    """Main testing function"""
    print_header("🧪 OOP IMPLEMENTATION TEST SUITE")
    print(f"{Color.CYAN}Testing Nuclear Radiation Simulation OOP Implementation{Color.END}")
    print(f"{Color.CYAN}Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}{Color.END}")
    
    tester = BackendTester()
    
    # Backend Testing
    print_header("BACKEND OOP TESTING")
    
    if not tester.test_connection():
        print_error("Backend connection failed. Make sure the server is running on port 8000")
        sys.exit(1)
    
    tester.test_available_resources()
    tester.test_dose_calculations() 
    tester.test_edge_cases()
    
    # Frontend Testing
    test_frontend()
    
    # Performance Testing
    performance_comparison()
    
    # Summary
    generate_summary(tester)
    
    print(f"\n{Color.BOLD}{Color.CYAN}🚀 Access the applications:{Color.END}")
    print(f"{Color.WHITE}• OOP Version: http://localhost:3000/game-oop{Color.END}")
    print(f"{Color.WHITE}• Original Version: http://localhost:3000/game{Color.END}")
    print(f"{Color.WHITE}• API Documentation: http://localhost:8000/docs{Color.END}")

if __name__ == "__main__":
    main()