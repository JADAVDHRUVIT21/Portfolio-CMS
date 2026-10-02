from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr, Field

from app.core.database import get_db
from app.core.security import (
    SECRET_KEY,
    ALGORITHM,
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
)
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    UserResponse,
    TokenResponse,
    RefreshTokenRequest,
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# =========================================================
# SCHEMAS (for the new endpoints)
# =========================================================

class UpdateProfileRequest(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr


class UpdatePasswordRequest(BaseModel):
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=6, max_length=128)


# =========================================================
# EXISTING ENDPOINTS
# =========================================================

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db)
):
    existing_user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered"
        )

    user = User(
        full_name=data.full_name,
        email=data.email,
        password_hash=hash_password(data.password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if not user or not verify_password(
        data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )

    access_token = create_access_token(
        user_id=user.id,
        email=user.email,
        is_admin=user.is_admin,
    )

    refresh_token = create_refresh_token(
        user_id=user.id,
        email=user.email,
        is_admin=user.is_admin,
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post(
    "/refresh"
)
def refresh_access_token(
    request: RefreshTokenRequest,
    db: Session = Depends(get_db),
):
    try:
        payload = jwt.decode(
            request.refresh_token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        user_id = payload.get("sub")
        token_type = payload.get("type")

        if user_id is None or token_type != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    user = (
        db.query(User)
        .filter(User.id == int(user_id))
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )

    access_token = create_access_token(
        user_id=user.id,
        email=user.email,
        is_admin=user.is_admin,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get(
    "/me",
    response_model=UserResponse
)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user


# =========================================================
# NEW: UPDATE PROFILE (name + email)
# =========================================================

@router.put(
    "/me",
    response_model=UserResponse,
)
def update_me(
    data: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Check if the new email is already taken by another user
    if data.email.lower() != current_user.email.lower():
        existing = (
            db.query(User)
            .filter(User.email == data.email.lower())
            .filter(User.id != current_user.id)
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="That email is already in use",
            )

    # Update fields
    current_user.full_name = data.full_name.strip()
    current_user.email = data.email.lower().strip()

    db.commit()
    db.refresh(current_user)

    return current_user


# =========================================================
# NEW: CHANGE PASSWORD
# =========================================================

@router.put(
    "/me/password",
    status_code=status.HTTP_200_OK,
)
def update_my_password(
    data: UpdatePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Verify current password
    if not verify_password(
        data.current_password,
        current_user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )

    # Prevent reusing the same password
    if verify_password(
        data.new_password,
        current_user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from the current one",
        )

    # Save new password
    current_user.password_hash = hash_password(data.new_password)

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Password updated successfully"
    }