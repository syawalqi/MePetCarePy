import pytest

def test_security_headers(client):
    response = client.get("/")
    assert "Strict-Transport-Security" in response.headers
    assert "X-Content-Type-Options" in response.headers
    assert response.headers["X-Frame-Options"] == "DENY"
    assert "Content-Security-Policy" in response.headers

def test_rate_limiting_root(client):
    # We defined 5/minute for root in main.py.
    # Since other tests might have run, we just verify that 429 is reachable.
    codes = []
    for _ in range(10):
        response = client.get("/")
        codes.append(response.status_code)
    
    assert 429 in codes
    print(f"Detected status codes: {codes}")