# backend/test_jwt.py

from jwt_handler import (
    create_access_token,
    verify_token
)

token = create_access_token({
    "username": "ashith"
})

print("TOKEN:")
print(token)

print()

print("DECODED:")
print(
    verify_token(token)
)