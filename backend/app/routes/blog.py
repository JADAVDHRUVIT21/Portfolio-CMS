from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_admin
from app.models.blog import Blog
from app.models.user import User
from app.schemas.blog import (
    BlogCreate,
    BlogUpdate,
    BlogResponse,
)


router = APIRouter(
    prefix="/blogs",
    tags=["Blogs"]
)


@router.get(
    "",
    response_model=list[BlogResponse]
)
def get_blogs(
    db: Session = Depends(get_db)
):
    blogs = (
        db.query(Blog)
        .filter(Blog.is_published == True)
        .order_by(
            Blog.published_at.desc(),
            Blog.id.desc()
        )
        .all()
    )

    return blogs


@router.get(
    "/{blog_id}",
    response_model=BlogResponse
)
def get_blog(
    blog_id: int,
    db: Session = Depends(get_db)
):
    blog = (
        db.query(Blog)
        .filter(
            Blog.id == blog_id,
            Blog.is_published == True
        )
        .first()
    )

    if blog is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found"
        )

    return blog


@router.post(
    "",
    response_model=BlogResponse,
    status_code=status.HTTP_201_CREATED
)
def create_blog(
    data: BlogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    existing_blog = (
        db.query(Blog)
        .filter(Blog.slug == data.slug)
        .first()
    )

    if existing_blog:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Blog slug already exists"
        )

    blog = Blog(
        title=data.title,
        slug=data.slug,
        excerpt=data.excerpt,
        content=data.content,
        featured_image=data.featured_image,
        is_published=data.is_published,
        published_at=(
            datetime.now(timezone.utc)
            if data.is_published
            else None
        ),
    )

    db.add(blog)
    db.commit()
    db.refresh(blog)

    return blog


@router.put(
    "/{blog_id}",
    response_model=BlogResponse
)
def update_blog(
    blog_id: int,
    data: BlogUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    blog = (
        db.query(Blog)
        .filter(Blog.id == blog_id)
        .first()
    )

    if blog is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found"
        )

    existing_slug = (
        db.query(Blog)
        .filter(
            Blog.slug == data.slug,
            Blog.id != blog_id
        )
        .first()
    )

    if existing_slug:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Blog slug already exists"
        )

    was_published = blog.is_published

    blog.title = data.title
    blog.slug = data.slug
    blog.excerpt = data.excerpt
    blog.content = data.content
    blog.featured_image = data.featured_image
    blog.is_published = data.is_published

    if data.is_published and not was_published:
        blog.published_at = datetime.now(timezone.utc)
    elif not data.is_published:
        blog.published_at = None

    db.commit()
    db.refresh(blog)

    return blog


@router.delete(
    "/{blog_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_blog(
    blog_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    blog = (
        db.query(Blog)
        .filter(Blog.id == blog_id)
        .first()
    )

    if blog is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found"
        )

    db.delete(blog)
    db.commit()

    return None