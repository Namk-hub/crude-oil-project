"""VADER sentiment analysis for news articles."""

from dataclasses import dataclass

from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

_analyzer = SentimentIntensityAnalyzer()

POSITIVE_THRESHOLD = 0.05
NEGATIVE_THRESHOLD = -0.05


@dataclass(frozen=True)
class SentimentResult:
    sentiment: str
    sentiment_score: float


def analyze_text(text: str) -> SentimentResult:
    """
    Analyze text with VADER and return label + compound score.

    sentiment_score is the VADER compound score in the range -1 to 1.
    """
    cleaned = text.strip()
    if not cleaned:
        return SentimentResult(sentiment="neutral", sentiment_score=0.0)

    scores = _analyzer.polarity_scores(cleaned)
    compound = round(scores["compound"], 4)

    if compound >= POSITIVE_THRESHOLD:
        label = "positive"
    elif compound <= NEGATIVE_THRESHOLD:
        label = "negative"
    else:
        label = "neutral"

    return SentimentResult(sentiment=label, sentiment_score=compound)


def analyze_article(title: str, description: str | None) -> SentimentResult:
    """Analyze an article using title and description combined."""
    parts = [title.strip()]
    if description:
        parts.append(description.strip())
    return analyze_text(" ".join(parts))
