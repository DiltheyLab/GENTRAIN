from src.domains.sequence_analysis.controllers.sequence_controller import (
    align_sequences_action,
)

### align_sequences_action ###


def test_align_sequences_action_returns_success_status_for_aligned_sequences(app):
    with app.test_request_context(json={"sequence_1": "ACGTN", "sequence_2": "ACGTN"}):
        response = align_sequences_action()
        assert response.status_code == 200


def test_align_sequences_action_returns_success_status_for_unaligned_sequences(app):
    with app.test_request_context(json={"sequence_1": "ACGTN", "sequence_2": "ACGN"}):
        response = align_sequences_action()
        assert response.status_code == 200


def test_align_sequences_action_returns_unprocessable_entity_status_when_first_sequence_is_missing(
    app,
):
    with app.test_request_context(json={"sequence_2": ":sequence:"}):
        response = align_sequences_action()
        assert response.status_code == 422


def test_align_sequences_action_returns_unprocessable_entity_status_when_second_sequence_is_missing(
    app,
):
    with app.test_request_context(json={"sequence_1": ":sequence:"}):
        response = align_sequences_action()
        assert response.status_code == 422


def test_align_sequences_action_returns_unchanged_sequences_for_aligned_sequences(
    app, mocker
):
    with app.test_request_context(json={"sequence_1": "ACGTN", "sequence_2": "ACGTN"}):
        response = align_sequences_action()
        assert response.json == {
            "aligned_sequence_1": "ACGTN",
            "aligned_sequence_2": "ACGTN",
        }


def test_align_sequences_action_returns_aligned_sequences_for_empty_sequences(
    app,
):
    with app.test_request_context(json={"sequence_1": "", "sequence_2": ""}):
        response = align_sequences_action()
        assert response.json == {
            "aligned_sequence_1": "",
            "aligned_sequence_2": "",
        }


def test_align_sequences_action_returns_aligned_sequences_when_first_sequence_is_unaligned(
    app,
):
    with app.test_request_context(json={"sequence_1": "ACGTN", "sequence_2": "ACGN"}):
        response = align_sequences_action()
        assert response.json == {
            "aligned_sequence_1": "ACGTN",
            "aligned_sequence_2": "ACG-N",
        }


def test_align_sequences_action_returns_aligned_sequences_when_second_sequence_is_unaligned(
    app,
):
    with app.test_request_context(json={"sequence_1": "ACGN", "sequence_2": "ACGTN"}):
        response = align_sequences_action()
        assert response.json == {
            "aligned_sequence_1": "ACG-N",
            "aligned_sequence_2": "ACGTN",
        }
