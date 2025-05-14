import { Platform } from 'react-native';

interface ChartData {
  label: string;
  value: number;
}

interface ChartOptions {
  type: 'bar' | 'pie' | 'line';
  data: ChartData[];
  width: number;
  height: number;
  colors: string[];
  backgroundColor: string;
  textColor: string;
}

// Funzione per generare un grafico semplice come immagine base64
export const generateSimpleChart = async (options: ChartOptions): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      return generateChartWeb(options);
    } else {
      return generateChartNative(options);
    }
  } catch (error) {
    console.error('Errore nella generazione del grafico:', error);
    return null;
  }
};

// Implementazione per web usando canvas
const generateChartWeb = (options: ChartOptions): string => {
  const { type, data, width, height, colors, backgroundColor, textColor } = options;
  
  // Crea un elemento canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Impossibile ottenere il contesto 2D del canvas');
  }
  
  // Imposta lo sfondo
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);
  
  if (type === 'bar') {
    drawBarChart(ctx, data, width, height, colors, textColor);
  } else if (type === 'pie') {
    drawPieChart(ctx, data, width, height, colors, textColor);
  } else if (type === 'line') {
    drawLineChart(ctx, data, width, height, colors, textColor);
  }
  
  // Converti il canvas in un'immagine base64
  return canvas.toDataURL('image/png');
};

// Implementazione per native usando SVG
const generateChartNative = (options: ChartOptions): string => {
  const { type, data, width, height, colors, backgroundColor, textColor } = options;
  
  // Per ora, restituiamo un'immagine di esempio
  // In un'app reale, dovresti usare una libreria come react-native-svg-charts
  // o generare SVG manualmente
  
  // Placeholder per i grafici nativi
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
};

// Funzione per disegnare un grafico a barre
const drawBarChart = (
  ctx: CanvasRenderingContext2D,
  data: ChartData[],
  width: number,
  height: number,
  colors: string[],
  textColor: string
) => {
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const barWidth = chartWidth / data.length - 10;
  
  // Trova il valore massimo per scalare il grafico
  const maxValue = Math.max(...data.map(item => item.value));
  
  // Disegna l'asse Y
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.strokeStyle = textColor;
  ctx.stroke();
  
  // Disegna l'asse X
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.strokeStyle = textColor;
  ctx.stroke();
  
  // Disegna le barre
  data.forEach((item, index) => {
    const barHeight = (item.value / maxValue) * chartHeight;
    const x = padding + index * (barWidth + 10);
    const y = height - padding - barHeight;
    
    // Disegna la barra
    ctx.fillStyle = colors[0];
    ctx.fillRect(x, y, barWidth, barHeight);
    
    // Disegna l'etichetta
    ctx.fillStyle = textColor;
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(item.label, x + barWidth / 2, height - padding + 15);
    
    // Disegna il valore
    ctx.fillText(item.value.toString(), x + barWidth / 2, y - 5);
  });
};

// Funzione per disegnare un grafico a torta
const drawPieChart = (
  ctx: CanvasRenderingContext2D,
  data: ChartData[],
  width: number,
  height: number,
  colors: string[],
  textColor: string
) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) - 40;
  
  // Calcola il totale per le percentuali
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  let startAngle = 0;
  
  // Disegna le fette
  data.forEach((item, index) => {
    const sliceAngle = (item.value / total) * 2 * Math.PI;
    
    // Disegna la fetta
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
    ctx.closePath();
    
    // Colora la fetta
    ctx.fillStyle = colors[index % colors.length];
    ctx.fill();
    
    // Calcola la posizione per l'etichetta
    const labelAngle = startAngle + sliceAngle / 2;
    const labelRadius = radius * 0.7;
    const labelX = centerX + Math.cos(labelAngle) * labelRadius;
    const labelY = centerY + Math.sin(labelAngle) * labelRadius;
    
    // Disegna l'etichetta
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.label, labelX, labelY);
    
    // Aggiorna l'angolo di partenza per la prossima fetta
    startAngle += sliceAngle;
  });
  
  // Disegna la legenda
  const legendX = width - 120;
  const legendY = 40;
  
  data.forEach((item, index) => {
    const y = legendY + index * 20;
    
    // Disegna il quadrato colorato
    ctx.fillStyle = colors[index % colors.length];
    ctx.fillRect(legendX, y, 15, 15);
    
    // Disegna il testo
    ctx.fillStyle = textColor;
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${item.label} (${Math.round(item.value)}%)`, legendX + 20, y + 7);
  });
};

// Funzione per disegnare un grafico a linee
const drawLineChart = (
  ctx: CanvasRenderingContext2D,
  data: ChartData[],
  width: number,
  height: number,
  colors: string[],
  textColor: string
) => {
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  // Trova il valore massimo per scalare il grafico
  const maxValue = Math.max(...data.map(item => item.value));
  
  // Disegna l'asse Y
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.strokeStyle = textColor;
  ctx.stroke();
  
  // Disegna l'asse X
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.strokeStyle = textColor;
  ctx.stroke();
  
  // Disegna la linea
  ctx.beginPath();
  data.forEach((item, index) => {
    const x = padding + (index * chartWidth) / (data.length - 1);
    const y = height - padding - (item.value / maxValue) * chartHeight;
    
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    
    // Disegna un punto
    ctx.fillStyle = colors[0];
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Disegna l'etichetta
    ctx.fillStyle = textColor;
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(item.label, x, height - padding + 15);
  });
  
  ctx.strokeStyle = colors[0];
  ctx.lineWidth = 2;
  ctx.stroke();
};
