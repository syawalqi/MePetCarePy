import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv('backend/.env')
url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_ANON_KEY')
s = create_client(url, key)

passwords = ["SecureAdmin123!", "Admin123!", "SecurePassword123!"]
email = "admin_mepet@test.com"

for p in passwords:
    try:
        res = s.auth.sign_in_with_password({"email": email, "password": p})
        if res.user:
            print(f"FOUND: {p}")
            break
    except:
        continue
else:
    print("NOT FOUND")
