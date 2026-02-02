from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request

def get_role_based_rate_limit(request: Request):
    """
    Custom key generator for rate limiting.
    """
    user = getattr(request.state, "user", None)
    if user:
        role = getattr(request.state, "user_role", "AUTHENTICATED")
        return f"{user.id}:{role}"
    return get_remote_address(request)

def get_dynamic_limit(request: Request = None) -> str:
    """
    Returns a dynamic rate limit string. 
    Handles cases where slowapi might not pass the request.
    """
    if request is None:
        return "100/minute" # Reasonable default for all authenticated users
        
    role = getattr(request.state, "user_role", None)
    
    # Handle Enum objects (extract value)
    if hasattr(role, "value"):
        role = role.value
        
    if role == "ADMINISTRATOR":
        return "100/minute"
    if role == "VETERINARIAN":
        return "50/minute"
    if role:
        return "20/minute"
    
    return "10/minute"

limiter = Limiter(key_func=get_role_based_rate_limit)
