"""create seperate example data fields

Revision ID: 1e76b697773d
Revises: adb98933166a
Create Date: 2025-01-07 11:20:02.611545

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1e76b697773d'
down_revision: Union[str, None] = 'adb98933166a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('pathogen', sa.Column('cases_example_path', sa.String(), nullable=True))
    op.add_column('pathogen', sa.Column('sequences_example_path', sa.String(), nullable=True))
    op.add_column('pathogen', sa.Column('contacts_example_path', sa.String(), nullable=True))
    op.drop_column('pathogen', 'example_data_path')


def downgrade() -> None:
    op.drop_column('pathogen', 'cases_example_path')
    op.drop_column('pathogen', 'sequences_example_path')
    op.drop_column('pathogen', 'contacts_example_path')
    #op.add_column('pathogen', sa.Column('example_data_path', sa.String(), nullable=True))
