from pydantic import BaseModel


class ErrorResponseModel(BaseModel):
    """Response model for error cases."""

    message: str
    context: list = None
