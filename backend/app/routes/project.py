from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_admin
from app.models.project import Project
from app.models.user import User
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
)


router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)


@router.get(
    "",
    response_model=list[ProjectResponse]
)
def get_projects(
    db: Session = Depends(get_db)
):
    projects = (
        db.query(Project)
        .filter(Project.is_published == True)
        .order_by(
            Project.display_order.asc(),
            Project.id.asc()
        )
        .all()
    )

    return projects


@router.get(
    "/{project_id}",
    response_model=ProjectResponse
)
def get_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    project = (
        db.query(Project)
        .filter(
            Project.id == project_id,
            Project.is_published == True
        )
        .first()
    )

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    return project


@router.post(
    "",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED
)
def create_project(
    data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    project = Project(
        title=data.title,
        description=data.description,
        image=data.image,
        technologies=data.technologies,
        live_url=data.live_url,
        github_url=data.github_url,
        display_order=data.display_order,
        is_published=data.is_published,
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return project


@router.put(
    "/{project_id}",
    response_model=ProjectResponse
)
def update_project(
    project_id: int,
    data: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    project.title = data.title
    project.description = data.description
    project.image = data.image
    project.technologies = data.technologies
    project.live_url = data.live_url
    project.github_url = data.github_url
    project.display_order = data.display_order
    project.is_published = data.is_published

    db.commit()
    db.refresh(project)

    return project


@router.delete(
    "/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    db.delete(project)
    db.commit()

    return None