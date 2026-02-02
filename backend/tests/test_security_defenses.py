import pytest

def test_security_headers(client):
    response = client.get("/")
    assert "Strict-Transport-Security" in response.headers
    assert "X-Content-Type-Options" in response.headers
    assert response.headers["X-Frame-Options"] == "DENY"
    assert "Content-Security-Policy" in response.headers

def test_rate_limiting_root(client):
    # We defined 100/minute for authenticated users (default).
    # We loop enough times to trigger 429.
    codes = []
    # Loop 110 times to exceed 100
    for _ in range(110):
        response = client.get("/")
        codes.append(response.status_code)
    
    assert 429 in codes
    print(f"Detected status codes: {codes}")