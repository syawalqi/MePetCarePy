
import os
import sys
import requests
import time
from dotenv import load_dotenv
from supabase import create_client, Client

# Load env from backend directory
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(base_dir, "backend", ".env"))

API_URL = "http://127.0.0.1:8000"
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

email = "testrecep1@gmail.com"
password = "testrecep123"

def main():
    print("--- Performance Trace: Backend (GET /patients/) ---")
    
    # 1. Login
    start_auth = time.time()
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        auth_res = supabase.auth.sign_in_with_password({"email": email, "password": password})
        token = auth_res.session.access_token
    except Exception as e:
        print(f"Login failed: {e}")
        return
    auth_dur = time.time() - start_auth
    print(f"Auth (Supabase): {auth_dur:.4f}s")

    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Create Session (if needed, usually fast)
    requests.post(f"{API_URL}/users/session", headers=headers, json={"session_token": token})

    # 3. Measure API Request (page-based)
    print("\nMeasuring API Latency (Server-Side Pagination)...")
    timings = []
    for i in range(5):
        start = time.time()
        res = requests.get(f"{API_URL}/patients/", headers=headers, params={"page": 1, "limit": 10})
        dur = time.time() - start
        timings.append(dur)
        
        if res.status_code == 200:
            data = res.json()
            item_count = len(data.get('items', []))
            total_count = data.get('total', 0)
            print(f"Request {i+1}: {dur:.4f}s (Status: {res.status_code}, Returned: {item_count}/{total_count} patients)")
        else:
            print(f"Request {i+1}: {dur:.4f}s (Status: {res.status_code})")
            print(f"Error: {res.text}")

    avg_time = sum(timings) / len(timings)
    print(f"\nAverage Backend Latency: {avg_time:.4f}s")
    
    if avg_time > 1.0:
        print("BOTTLENECK: Backend/DB is slow.")
    else:
        print("Backend is FAST. If UI is slow, check Frontend.")

if __name__ == "__main__":
    main()
