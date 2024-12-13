"""add example_data_path to pathogens table

Revision ID: adb98933166a
Revises: Add example_data_path column to pathogen table to provide example data to the users.
Create Date: 2024-12-13 10:44:17.327219

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'adb98933166a'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('pathogen', sa.Column('example_data_path', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('pathogen', 'example_data_path')
