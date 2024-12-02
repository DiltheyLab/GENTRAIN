from Bio import Align

from backend.config import get_project_path

ambiguous_characters = {
    "A": ["A"],
    "C": ["C"],
    "G": ["G"],
    "T": ["T"],
    "U": ["U"],
    "M": ["A", "C"],
    "R": ["A", "G"],
    "S": ["C", "G"],
    "W": ["A", "T"],
    "Y": ["C", "T"],
    "K": ["G", "T"],
    "V": ["A", "C", "G"],
    "H": ["A", "C", "T"],
    "D": ["A", "G", "T"],
    "B": ["C", "G", "T"],
    "N": ["A", "C", "G", "T"],
    "X": ["A", "C", "G", "T"],
}


class ViralDistanceCalculation:
    """Distance calculation for viral sequence pairs."""

    reference_string = ""

    def __init__(self, sample_mutations_1, sample_mutations_2):
        self.positions_1 = self.get_position_dict(sample_mutations_1)
        self.positions_2 = self.get_position_dict(sample_mutations_2)
        self.aligner = Align.PairwiseAligner(match_score=1.0)

    def execute(self):
        with open(
            f"{get_project_path()}/data/reference_string.txt"
        ) as reference_string_file:
            self.reference_string = reference_string_file.read()
        sequence_1, sequence_2 = self.align_samples()
        return self.calculate_distance(sequence_1, sequence_2)

    def add_to_dict(self, dict, pos, type, char):
        if pos not in dict:
            dict[pos] = {type: char}
        else:
            dict[pos][type] = char
        return dict

    def get_position_dict(self, mutations):
        positions = {}
        for insertion in mutations["insertions"]:
            positions = self.add_to_dict(
                positions, insertion["pos"], "ins", insertion["ins"]
            )
        for substitution in mutations["substitutions"]:
            positions = self.add_to_dict(
                positions, substitution["pos"], "snp", substitution["qryNuc"]
            )
        for missing in mutations["missing"]:
            start = missing["range"]["begin"]
            end = missing["range"]["end"]
            character = missing["character"]
            for x in range(start, end):
                positions = self.add_to_dict(positions, x, "snp", character)
        for missing in mutations["nonACGTNs"]:
            start = missing["range"]["begin"]
            end = missing["range"]["end"]
            character = missing["character"]
            for x in range(start, end):
                positions = self.add_to_dict(positions, x, "snp", character)
        for deletion in mutations["deletions"]:
            start = deletion["range"]["begin"]
            end = deletion["range"]["end"]
            for x in range(start, end):
                positions = self.add_to_dict(positions, x, "del", "-")
        alignment_start = mutations["alignmentRange"]["begin"]
        alignment_end = mutations["alignmentRange"]["end"]
        for x in range(0, alignment_start):
            positions = self.add_to_dict(positions, x, "del", "-")

        for x in range(alignment_end, len(self.reference_string)):
            positions = self.add_to_dict(positions, x, "del", "-")

        return dict(sorted(positions.items()))

    def align_samples(self):
        sequence1 = ""
        sequence2 = ""

        for current_base_index in range(0, len(self.reference_string) - 1):
            reference_index_char = self.reference_string[current_base_index]
            additions1 = ""
            additions2 = ""

            # add remaining reference characters if index is not in positions dictionary
            if current_base_index not in self.positions_1:
                additions1 += reference_index_char + additions1
            if current_base_index not in self.positions_2:
                additions2 += reference_index_char + additions2

            # get mutations for current base index or return empty list if no mutations for current index exist
            position_mutations1 = (
                self.positions_1[current_base_index]
                if current_base_index in self.positions_1
                else {}
            )
            position_mutations2 = (
                self.positions_2[current_base_index]
                if current_base_index in self.positions_2
                else {}
            )

            # add snp characters for both sequences
            additions1 += (
                position_mutations1["snp"] if "snp" in position_mutations1 else ""
            )
            additions2 += (
                position_mutations2["snp"] if "snp" in position_mutations2 else ""
            )

            # handle deletions for current base index, respecting the others sequence mutations
            if not (
                "del" in position_mutations1 and "del" in position_mutations2
            ) and not (
                "del" not in position_mutations1 and "del" not in position_mutations2
            ):
                additions1 += "-" if "del" in position_mutations1 else ""
                additions2 += "-" if "del" in position_mutations2 else ""

            # handle insertions
            if "ins" in position_mutations1 and "ins" in position_mutations2:
                if position_mutations1["ins"] != position_mutations2["ins"]:
                    alignments = self.aligner.align(
                        position_mutations1["ins"], position_mutations2["ins"]
                    )
                    additions1 += alignments[0][0]
                    additions2 += alignments[0][1]
                else:
                    additions1 += (
                        position_mutations1["ins"]
                        if len(position_mutations1) > 1
                        else reference_index_char
                        + additions1
                        + position_mutations1["ins"]
                    )
                    additions2 += (
                        position_mutations2["ins"]
                        if len(position_mutations2) > 1
                        else reference_index_char
                        + additions2
                        + position_mutations2["ins"]
                    )
            elif "ins" in position_mutations1:
                additions1 += (
                    position_mutations1["ins"]
                    if len(position_mutations1) > 1
                    else reference_index_char + additions1 + position_mutations1["ins"]
                )
                additions2 += "-" * len(position_mutations1["ins"])
            elif "ins" in position_mutations2:
                additions1 += "-" * len(position_mutations2["ins"])
                additions2 += (
                    position_mutations2["ins"]
                    if len(position_mutations2) > 1
                    else reference_index_char + additions2 + position_mutations2["ins"]
                )

            # add new additions to prior sequences
            sequence1 += additions1
            sequence2 += additions2
        return sequence1, sequence2

    def calculate_distance(self, sequence1, sequence2):
        distance = 0
        proper_threshold = 5
        proper_chars_1 = 0
        proper_chars_2 = 0
        n_count_1 = sequence1.count("N")
        n_count_2 = sequence2.count("N")
        sequence_length_1 = len(sequence1)
        sequence_length_2 = len(sequence2)
        active_gap_1 = False
        active_gap_2 = False
        for current_base_index in range(0, sequence_length_1):
            current_char_1 = sequence1[current_base_index]
            current_char_2 = sequence2[current_base_index]
            if current_char_1 != "-":
                active_gap_1 = False
            if current_char_2 != "-":
                active_gap_2 = False

            # dont increment distance, dont increment proper_chars
            if current_char_1 == "N" or current_char_2 == "N":
                continue

            # increment proper_chars if current char is not "-"
            proper_chars_1 += 1 if current_char_1 != "-" else 0
            proper_chars_2 += 1 if current_char_2 != "-" else 0

            # dont increment distance
            if current_char_1 == current_char_2:
                continue

            # continue if amount of proper chars is not yet reached to increment distances
            if (
                (proper_chars_1 < proper_threshold)
                or ((sequence_length_1 - n_count_1) - proper_chars_1 < proper_threshold)
                or (proper_chars_2 < proper_threshold)
                or ((sequence_length_2 - n_count_2) - proper_chars_2 < proper_threshold)
            ):
                continue

            # increment distance on gap
            if current_char_1 == "-":
                if not active_gap_1:
                    distance += 1
            if current_char_2 == "-":
                if not active_gap_2:
                    distance += 1

            # increment distance if not gap and differing chars
            if (
                current_char_1 != "-"
                and current_char_2 != "-"
                and not (
                    current_char_1 in ambiguous_characters[current_char_2]
                    or current_char_2 in ambiguous_characters[current_char_1]
                )
            ):
                distance += 1

        return distance
