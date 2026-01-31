import pytest
from datetime import datetime

def test_invoice_flow(client):
    # 1. Setup: Create Owner and Patient
    owner_resp = client.post("/owners/", json={"full_name": "Bill Owner", "phone_number": "1234567890"})
    owner_id = owner_resp.json()["id"]
    patient_resp = client.post("/patients/", json={"name": "Rex", "species": "Dog", "owner_id": owner_id})
    patient_id = patient_resp.json()["id"]

    # 2. Create Invoice
    invoice_data = {
        "patient_id": patient_id,
        "items": [
            {"description": "Consultation", "unit_price_at_billing": 50.0, "quantity": 1},
            {"description": "Meds", "unit_price_at_billing": 10.0, "quantity": 2}
        ]
    }
    resp = client.post("/invoices/", json=invoice_data)
    assert resp.status_code == 201
    invoice = resp.json()
    assert invoice["total_amount"] == 70.0 # 50 + (10*2)
    assert invoice["status"] == "UNPAID"

    # 3. Mark as Paid
    invoice_id = invoice["id"]
    patch_resp = client.patch(f"/invoices/{invoice_id}/status", json={"status": "PAID"})
    assert patch_resp.status_code == 200
    assert patch_resp.json()["status"] == "PAID"
    assert patch_resp.json()["paid_at"] is not None

    # 4. Check Monthly Report (As Admin)
    # Note: TestClient uses the default 'admin' user setup in conftest.py
    now = datetime.now()
    report_resp = client.get(f"/invoices/reports/monthly?year={now.year}&month={now.month}")
    assert report_resp.status_code == 200
    report = report_resp.json()
    assert report["total_earnings"] >= 70.0
    assert report["total_patients"] >= 1
