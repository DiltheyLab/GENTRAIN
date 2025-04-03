"""add username to users table and remove email from users table

Revision ID: e33b5997fccf
Revises: ded2746452cf
Create Date: 2025-04-03 08:41:17.082217

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.orm import sessionmaker

from backend.app import app
from backend.modules.core.models import User

# revision identifiers, used by Alembic.
revision: str = 'e33b5997fccf'
down_revision: Union[str, None] = 'ded2746452cf'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

Session = sessionmaker()

def upgrade() -> None:
    op.add_column('user', sa.Column('username', sa.String(), nullable=True, unique=True))
    bind = op.get_bind()
    session = Session(bind=bind)

    for user in session.execute(sa.text('SELECT  "user".id,  "user".email FROM "user"')).fetchall():
        username = user.email.split('@')[0].replace(".", "") if user.email else f"user{user.id}"
        session.execute(sa.text('UPDATE "user" SET username = :username WHERE id = :id'),
                        {'username': username, 'id': user.id})
    session.commit()
    op.drop_column('user', 'email')
    op.drop_column('user', 'first_name')
    op.drop_column('user', 'last_name')


def downgrade() -> None:
    op.add_column('user', sa.Column('email', sa.String(), nullable=True, unique=True))
    op.add_column('user', sa.Column('first_name', sa.String(), nullable=True, unique=True))
    op.add_column('user', sa.Column('last_name', sa.String(), nullable=True, unique=True))
    bind = op.get_bind()
    session = Session(bind=bind)
    for user in session.execute(sa.text('SELECT  "user".id,  "user".username FROM "user"')).fetchall():
        email = f"{user.username}@gentrain.com" if user.username else f"user{user.id}@gentrain.com"
        session.execute(sa.text('UPDATE "user" SET email = :email WHERE id = :id'),
                        {'email': email, 'id': user.id})
    session.commit()
    op.drop_column('user', 'username')
