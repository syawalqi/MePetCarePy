import os
from sqlalchemy import text
from app.database import engine
from dotenv import load_dotenv

# Load .env
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(base_dir, "backend", ".env"))

def fix_invalid_data():
    print("Checking for owners with invalid phone numbers...")
    try:
        with engine.connect() as conn:
            # 1. Find the invalid records
            result = conn.execute(text("SELECT id, full_name, phone_number FROM owners"))
            invalid_ids = []
            for row in result:
                if row.phone_number == "string":
                    print(f"Found invalid record: ID {row.id}, Name: {row.full_name}")
                    invalid_ids.append(row.id)
            
            # 2. Update them to a valid placeholder
            if invalid_ids:
                print(f"Updating {len(invalid_ids)} records to valid placeholder...")
                for rid in invalid_ids:
                    conn.execute(
                        text("UPDATE owners SET phone_number = '+0000000000' WHERE id = :id"),
                        {"id": rid}
                    )
                conn.commit()
                print("Data fixed successfully!")
            else:
                print("No invalid data found.")
                
    except Exception as e:
        print(f"Failed to fix data: {e}")

if __name__ == "__main__":
    fix_invalid_data()
