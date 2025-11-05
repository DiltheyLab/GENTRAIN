import pytest
from os import environ
from prisma import Prisma

@pytest.fixture
async def prisma_client() -> Prisma:
    prisma = Prisma()
    yield await prisma.connect()

async def test_get_pathogen_action_return_200(prisma_client):
    print("HI", prisma_client)
    assert True