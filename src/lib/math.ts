type MonthForecast = {
  month: string;
  real?: number;
  predicted: number;
};

export function forecastSalesLinear(values: number[]): MonthForecast[] {
  // Nomes dos meses
  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  const n = values.length;

  // Monta vetor X com números dos meses: 1, 2, 3...
  const x = Array.from({ length: n }, (_, i) => i + 1);
  const y = values;

  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;

  // Cálculo da inclinação (a)
  const numerator = x.reduce(
    (sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY),
    0
  );
  const denominator = x.reduce((sum, xi) => sum + Math.pow(xi - meanX, 2), 0);

  const a = numerator / denominator;
  const b = meanY - a * meanX;

  // Gera array completo até 12 meses
  const result: MonthForecast[] = [];

  for (let t = 1; t <= 12; t++) {
    const predicted = a * t + b;

    result.push({
      month: months[t - 1],
      real: t <= values.length ? values[t - 1] : undefined,
      predicted: parseFloat(predicted.toFixed(2)),
    });
  }

  return result;
}

export function movingAverageForecast(
  values: number[],
  windowSize: number = 3
): number[] {
  const result: number[] = [];

  // Copia os valores reais no início
  for (const v of values) result.push(v);

  // Calcula previsões até completar 12 meses
  while (result.length < 12) {
    const start = result.length - windowSize;
    const window = result.slice(start, result.length);

    const avg = window.reduce((a, b) => a + b, 0) / window.length;

    result.push(parseFloat(avg.toFixed(2)));
  }

  return result;
}

export function exponentialSmoothingForecast(
  values: number[],
  alpha: number = 0.3
): number[] {
  if (!values || !values.length) return [];
  const result: number[] = [];

  // Primeira previsão é o primeiro valor real
  let lastForecast = values[0];
  result.push(values[0]);

  // Calcula previsões para os valores reais
  for (let i = 1; i < values.length; i++) {
    const forecast = alpha * values[i - 1] + (1 - alpha) * lastForecast;
    result.push(parseFloat(forecast.toFixed(2)));
    lastForecast = forecast;
  }

  // Previsão após acabar os dados reais (todas iguais ao último forecast)
  while (result.length < 12) {
    const forecast = lastForecast;
    result.push(parseFloat(forecast.toFixed(2)));
  }

  return result;
}

type DataPoint = { month: string; real: number };

interface ForecastResult {
  month: string;
  real?: number;
  forecast: number;
}

export function holtWintersForecast(
  data: DataPoint[],
  seasonLength: number = 12,
  forecastMonths: number = 6,
  alpha: number = 0.3,
  beta: number = 0.1,
  gamma: number = 0.3
): ForecastResult[] {
  const values = data.map((d) => d.real);
  const n = values.length;

  if (n < seasonLength * 2) {
    throw new Error("É necessário pelo menos 24 meses de dados.");
  }

  // Inicialização de sazonalidade
  const seasonals: number[] = Array(n).fill(0);
  const seasonAverage = [];

  for (let i = 0; i < seasonLength; i++) {
    let sum = 0;
    for (let j = i; j < seasonLength * 2; j += seasonLength) {
      sum += values[j];
    }
    seasonAverage.push(sum / 2);
  }

  for (let i = 0; i < seasonLength; i++) {
    seasonals[i] = values[i] / seasonAverage[i];
  }

  // Inicialização de nível e tendência
  let level = values[0];
  let trend = (values[seasonLength] - values[0]) / seasonLength;

  const result: ForecastResult[] = [];

  // Ciclo principal: calcular nível, tendência e sazonalidade
  for (let t = 0; t < n; t++) {
    const lastLevel = level;
    const val = values[t];

    level = alpha * (val / seasonals[t]) + (1 - alpha) * (level + trend);
    trend = beta * (level - lastLevel) + (1 - beta) * trend;
    seasonals[t + seasonLength] =
      gamma * (val / level) + (1 - gamma) * seasonals[t];

    const forecast = (level + trend) * seasonals[t];

    result.push({
      month: data[t].month,
      real: val,
      forecast,
    });
  }

  // Previsão para meses futuros
  for (let i = 1; i <= forecastMonths; i++) {
    const forecast = (level + i * trend) * seasonals[n - seasonLength + i];

    result.push({
      month: `+${i}m`,
      forecast,
    });
  }

  return result;
}
