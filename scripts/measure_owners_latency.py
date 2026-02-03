
import os
import requests
import time
from dotenv import load_dotenv
from supabase import create_client

# Load env
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(base_dir, "backend", ".env"))

API_URL = "http://127.0.0.1:8000"
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

email = "testrecep1@gmail.com"
password = "testrecep123"

def main():
    print("--- Performance Test: GET /owners/ (Optimized) ---\n")
    
    # 1. Login
    print("[1] Authenticating with Supabase...")
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        auth_res = supabase.auth.sign_in_with_password({"email": email, "password": password})
        token = auth_res.session.access_token
        print(f"✅ Logged in as {email}\n")
    except Exception as e:
        print(f"❌ Login failed: {e}")
        return
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Create backend session
    requests.post(f"{API_URL}/users/session", headers=headers, json={"session_token": token})
    
    # 3. Measure API latency (paginated)
    print("[2] Measuring API Latency (Server-Side Pagination)...")
    timings = []
    for i in range(5):
        start = time.time()
        res = requests.get(f"{API_URL}/owners/", headers=headers, params={"page": 1, "limit": 10})
        dur = time.time() - start
        timings.append(dur)
        
        if res.status_code == 200:
            data = res.json()
            item_count = len(data.get('items', []))
            total_count = data.get('total', 0)
            print(f"Request {i+1}: {dur:.4f}s (Status: {res.status_code}, Returned: {item_count}/{total_count} owners)")
        else:
            print(f"Request {i+1}: {dur:.4f}s (Status: {res.status_code})")
            print(f"Error: {res.text}")
    
    avg_time = sum(timings) / len(timings)
    min_time = min(timings)
    max_time = max(timings)
    
    print(f"\n--- Results ---")
    print(f"Average Latency: {avg_time:.4f}s")
    print(f"Min Latency: {min_time:.4f}s")
    print(f"Max Latency: {max_time:.4f}s")
    
    # Comparison to baseline
    baseline = 2.82
    improvement = baseline - avg_time
    reduction_pct = (improvement / baseline) * 100
    
    print(f"\n--- Performance Improvement ---")
    print(f"Baseline (before): ~{baseline}s")
    print(f"Current (after): {avg_time:.4f}s")
    print(f"Improvement: -{improvement:.4f}s ({reduction_pct:.1f}% reduction)")

if __name__ == "__main__":
    main()
