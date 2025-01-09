"""remove example data path from pathogens table

Revision ID: ded2746452cf
Revises: adb98933166a
Create Date: 2025-01-09 10:10:32.939030

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ded2746452cf'
down_revision: Union[str, None] = 'adb98933166a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column('pathogen', 'example_data_path')
    op.drop_column('pathogen', 'scheme_path')

def downgrade() -> None:
    op.add_column('pathogen', sa.Column('example_data_path', sa.String(), nullable=True))
    op.add_column('pathogen', sa.Column('scheme_path', sa.String(), nullable=True))
