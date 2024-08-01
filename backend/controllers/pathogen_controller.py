from flask import Blueprint
from flask_pydantic import validate
from pydantic import BaseModel, ValidationError
from backend.exceptions.genomic_error_exception import GenomicErrorException
from backend.exceptions.sequence_analysis_failed_exception import (
    SequenceAnalysisFailedException,
)
from backend.strategies.pathogen_strategy_manager import PathogenStrategyManager
from backend.controllers.requests.models.sequence_variants import (
    SequenceVariantsRequestBodyModel,
)


class ErrorResponseModel(BaseModel):
    """Response model for error cases."""

    message: str
    context: list = None


# user controller blueprint to be registered with api blueprint
pathogens = Blueprint("pathogens", __name__)


@pathogens.route("/<pathogen_id>/sequences/<fasta_id>/variants", methods=["POST"])
@validate()
def get_sequence_variants(
    body: SequenceVariantsRequestBodyModel, pathogen_id: str, fasta_id: str
):
    """Action to analyse sequence variants."""
    try:
        strategy = PathogenStrategyManager.get_sample_analysis_strategy(
            pathogen_id=pathogen_id,
            fasta_id=fasta_id,
            sequence=body.sequence,
        )

        result = strategy.execute()
        # finally return output as pydantic response model in json format
        return strategy.get_response(result=result)

    except GenomicErrorException as exc:
        return (
            ErrorResponseModel(message=exc.message),
            422,
        )
    except ValidationError as exc:
        return (
            ErrorResponseModel(
                message=f"{len(exc.errors())} validation errors for SequenceVariantsResponseModel.",
                context=exc.errors(),
            ),
            422,
        )
    except SequenceAnalysisFailedException as exc:
        return (
            ErrorResponseModel(message=exc.message),
            500,
        )
    except FileNotFoundError as exc:
        return (
            ErrorResponseModel(message="Pathogen does not exist."),
            404,
        )
