-- India Oil Risk Dashboard — Realistic Seed Data
-- Countries: Russia, Saudi Arabia, Iraq, UAE
-- Run after migrations: psql -U postgres -d india_oil_risk -f scripts/seed_data.sql

BEGIN;

-- Optional: clear existing data (uncomment if re-seeding)
-- TRUNCATE TABLE simulations, risk_scores, news_articles, oil_prices, countries RESTART IDENTITY CASCADE;

-- ---------------------------------------------------------------------------
-- 1. Countries (import shares + geopolitical scores)
-- Reflects India's major crude suppliers; higher geopolitical_score = riskier
-- ---------------------------------------------------------------------------
INSERT INTO countries (id, name, import_share, geopolitical_score) VALUES
  (1, 'Russia',        35.0, 82.0),  -- Largest share; sanctions & conflict exposure
  (2, 'Iraq',          22.0, 74.0),  -- Basra grade; regional instability
  (3, 'Saudi Arabia',  18.0, 42.0),  -- OPEC anchor; relatively stable supplier
  (4, 'UAE',           12.0, 36.0);  -- Fujairah hub; low geopolitical risk

-- ---------------------------------------------------------------------------
-- 2. Risk scores
-- Formula: overall = 0.4*dependency + 0.3*normalized_sentiment + 0.3*geopolitical
-- normalized_sentiment = (raw_sentiment + 1) * 50
-- ---------------------------------------------------------------------------
INSERT INTO risk_scores (id, country_id, dependency_score, sentiment_score, geopolitical_score, overall_risk_score, created_at) VALUES
  (1, 1, 35.0, 29.0, 82.0, 47.30, '2026-05-30 08:00:00+00'),  -- Russia: raw sentiment -0.42
  (2, 2, 22.0, 21.0, 74.0, 37.30, '2026-05-30 08:00:00+00'),  -- Iraq:   raw sentiment -0.58
  (3, 3, 18.0, 41.0, 42.0, 32.10, '2026-05-30 08:00:00+00'),  -- Saudi:  raw sentiment -0.18
  (4, 4, 12.0, 54.0, 36.0, 31.80, '2026-05-30 08:00:00+00');  -- UAE:    raw sentiment +0.08

-- ---------------------------------------------------------------------------
-- 3. Oil price history — 30 days of Brent-style USD/bbl (May 1–30, 2026)
-- ---------------------------------------------------------------------------
INSERT INTO oil_prices (id, price, date) VALUES
  ( 1, 79.42, '2026-05-01'),
  ( 2, 79.85, '2026-05-02'),
  ( 3, 80.10, '2026-05-03'),
  ( 4, 81.25, '2026-05-04'),
  ( 5, 80.90, '2026-05-05'),
  ( 6, 81.55, '2026-05-06'),
  ( 7, 82.30, '2026-05-07'),
  ( 8, 83.15, '2026-05-08'),
  ( 9, 82.70, '2026-05-09'),
  (10, 82.45, '2026-05-10'),
  (11, 83.80, '2026-05-11'),
  (12, 84.20, '2026-05-12'),
  (13, 85.10, '2026-05-13'),
  (14, 84.65, '2026-05-14'),
  (15, 83.90, '2026-05-15'),
  (16, 84.35, '2026-05-16'),
  (17, 85.50, '2026-05-17'),
  (18, 86.10, '2026-05-18'),
  (19, 85.75, '2026-05-19'),
  (20, 84.95, '2026-05-20'),
  (21, 85.60, '2026-05-21'),
  (22, 86.40, '2026-05-22'),
  (23, 87.05, '2026-05-23'),
  (24, 86.55, '2026-05-24'),
  (25, 85.80, '2026-05-25'),
  (26, 86.25, '2026-05-26'),
  (27, 87.30, '2026-05-27'),
  (28, 86.90, '2026-05-28'),
  (29, 85.45, '2026-05-29'),
  (30, 84.70, '2026-05-30');

-- ---------------------------------------------------------------------------
-- 4. Sample news articles (VADER-style sentiment scores)
-- ---------------------------------------------------------------------------
INSERT INTO news_articles (id, title, description, source, url, keyword, published_at, sentiment, sentiment_score) VALUES
  (
    1,
    'India''s Russian crude imports hold near record levels despite Western pressure',
    'Indian refiners continue lifting discounted Urals cargoes, keeping Russia as the top supplier accounting for over one-third of total imports.',
    'Reuters',
    'https://example.com/news/india-russia-crude-imports-2026',
    'Russia oil',
    '2026-05-30 06:30:00+00',
    'negative',
    -0.4215
  ),
  (
    2,
    'OPEC+ ministers signal extended output cuts through September',
    'Saudi-led producers indicate supply restraint will continue, tightening global balances and supporting Brent prices above $85.',
    'Bloomberg',
    'https://example.com/news/opec-output-cuts-september-2026',
    'OPEC',
    '2026-05-29 14:15:00+00',
    'negative',
    -0.5574
  ),
  (
    3,
    'Iraq resumes full Basra terminal operations after brief maintenance halt',
    'Loadings normalize at southern export terminals, easing near-term supply concerns for Indian term buyers of Basrah Medium grade.',
    'Energy Intelligence',
    'https://example.com/news/iraq-basra-terminal-operations-2026',
    'Crude oil',
    '2026-05-29 09:00:00+00',
    'positive',
    0.3612
  ),
  (
    4,
    'Saudi Aramco offers additional August barrels to Indian refiners',
    'State-run processors receive optional cargoes under long-term contracts, reinforcing Saudi Arabia as a reliable swing supplier.',
    'S&P Global Commodity Insights',
    'https://example.com/news/saudi-aramco-india-august-barrels-2026',
    'Saudi oil',
    '2026-05-28 11:45:00+00',
    'positive',
    0.4404
  ),
  (
    5,
    'Red Sea shipping insurance premiums rise on renewed regional tensions',
    'Higher freight and war-risk costs push landed crude prices higher for Indian importers routing via the Suez corridor.',
    'Financial Times',
    'https://example.com/news/red-sea-shipping-premiums-2026',
    'Energy security',
    '2026-05-28 07:20:00+00',
    'negative',
    -0.6249
  ),
  (
    6,
    'UAE''s Fujairah hub sees record fuel oil and crude transshipment volumes',
    'Emirates pipeline and storage infrastructure support flexible supply routes to west-coast Indian refineries.',
    'Gulf News',
    'https://example.com/news/uae-fujairah-transshipment-record-2026',
    'Crude oil',
    '2026-05-27 16:00:00+00',
    'positive',
    0.2960
  ),
  (
    7,
    'Government reviews strategic petroleum reserve fill rates amid price volatility',
    'India targets 90-day import cover; officials assess accelerated stockpiling if Brent sustains above $85 per barrel.',
    'Mint',
    'https://example.com/news/india-spr-review-2026',
    'Energy security',
    '2026-05-27 04:30:00+00',
    'neutral',
    -0.1027
  ),
  (
    8,
    'Brent crude slips on demand concerns despite Middle East supply risks',
    'Asian refinery margins weaken as China export quotas rise, partially offsetting geopolitical premium in crude markets.',
    'Platts',
    'https://example.com/news/brent-demand-concerns-2026',
    'Crude oil',
    '2026-05-26 13:10:00+00',
    'negative',
    -0.3182
  ),
  (
    9,
    'Indian refiners diversify tender slate with heavier Iraqi and lighter UAE grades',
    'Blend optimization reduces single-origin exposure while maintaining throughput at Jamnagar and Vadinar complexes.',
    'Economic Times',
    'https://example.com/news/india-refiners-diversify-grades-2026',
    'Energy security',
    '2026-05-25 10:00:00+00',
    'positive',
    0.2263
  ),
  (
    10,
    'Sanctions panel debates tighter enforcement on third-country Russian oil trades',
    'Policy uncertainty keeps traders cautious; Indian buyers maintain existing contracts while monitoring compliance guidance.',
    'Wall Street Journal',
    'https://example.com/news/sanctions-russian-oil-trades-2026',
    'Russia oil',
    '2026-05-24 18:45:00+00',
    'negative',
    -0.4939
  );

-- ---------------------------------------------------------------------------
-- 5. Simulation examples
-- supply_gap = import_share × (reduction_percentage / 100)
-- risk_increase = supply_gap × 2
-- Risk level: 0-5 Low | 5-15 Medium | 15+ High
-- ---------------------------------------------------------------------------
INSERT INTO simulations (id, country, reduction_percentage, supply_gap, risk_level, recommendation) VALUES
  (
    1,
    'Russia',
    30.0,
    10.50,
    'High',
    'Increase imports from Saudi Arabia and UAE.'
  ),
  (
    2,
    'Iraq',
    25.0,
    5.50,
    'Medium',
    'Use strategic petroleum reserves.'
  ),
  (
    3,
    'Saudi Arabia',
    20.0,
    3.60,
    'Medium',
    'Use strategic petroleum reserves.'
  ),
  (
    4,
    'UAE',
    15.0,
    1.80,
    'Low',
    'Monitor situation.'
  );

-- Reset sequences after explicit IDs
SELECT setval('countries_id_seq',      (SELECT MAX(id) FROM countries));
SELECT setval('risk_scores_id_seq',    (SELECT MAX(id) FROM risk_scores));
SELECT setval('oil_prices_id_seq',     (SELECT MAX(id) FROM oil_prices));
SELECT setval('news_articles_id_seq',  (SELECT MAX(id) FROM news_articles));
SELECT setval('simulations_id_seq',    (SELECT MAX(id) FROM simulations));

COMMIT;
