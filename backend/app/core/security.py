import base64
import hashlib
import hmac
import os
from datetime import datetime, timedelta
from jose import jwt
from app.core.config import settings


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 200_000)
    return base64.b64encode(salt + digest).decode("utf-8")


def verify_password(plain_password: str, stored_hash: str) -> bool:
    raw = base64.b64decode(stored_hash.encode("utf-8"))
    salt, expected = raw[:16], raw[16:]
    actual = hashlib.pbkdf2_hmac("sha256", plain_password.encode("utf-8"), salt, 200_000)
    return hmac.compare_digest(actual, expected)


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
