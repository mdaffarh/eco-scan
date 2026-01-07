import * as tf from '@tensorflow/tfjs';

let model = null;
let labels = [];

/**
 * Load model TensorFlow.js
 * Mendukung 3 format:
 * 1. Teachable Machine hosted URL
 * 2. TensorFlow.js model.json (dari Teachable Machine export)
 * 3. TensorFlow.js Graph Model
 */
export async function loadModel() {
  try {
    console.log('Loading model...');
    
    // Load labels dari metadata.json (dari Teachable Machine)
    const metadataResponse = await fetch('/metadata.json');
    const metadata = await metadataResponse.json();
    const modelLabels = metadata.labels; // Labels asli dari model
    console.log('Model labels loaded:', modelLabels);
    
    // Model baru dengan 6 labels termasuk B3
    // Model output dari metadata: ["Organik", "Botol Plastik", "Kertas", "Residu", "Non Organik Daur Ulang", "B3"]
    // Mapping ke format yang konsisten
    const labelMapping = {
      'Organik': 'Organik',
      'Botol Plastik': 'Botol Plastik',
      'Botol Plasti': 'Botol Plastik',  // Handle truncated name from metadata
      'Kertas': 'Kertas',
      'Residu': 'Residu',
      'Non Organik Daur Ulang': 'Anorganik',
      'Non Organik ...': 'Anorganik',  // Handle truncated name
      'Anorganik': 'Anorganik',
      'B3': 'B3'
    };
    
    // Map labels dari model ke format yang diinginkan
    labels = modelLabels.map(label => labelMapping[label] || label);
    console.log('Mapped labels:', labels);

    // Try loading model in different formats
    let modelLoaded = false;
    
    // Option 1: Try loading from Teachable Machine hosted URL
    // Uncomment and set your Teachable Machine URL if available
    // const TEACHABLE_MACHINE_URL = 'https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/';
    // try {
    //   model = await tf.loadLayersModel(TEACHABLE_MACHINE_URL + 'model.json');
    //   console.log('Model loaded from Teachable Machine URL');
    //   modelLoaded = true;
    // } catch (e) {
    //   console.log('Teachable Machine URL not available');
    // }

    // Option 2: Try loading LayersModel from public folder
    if (!modelLoaded) {
      try {
        model = await tf.loadLayersModel('/model.json');
        console.log('LayersModel loaded from public/model.json');
        modelLoaded = true;
      } catch (e) {
        console.log('model.json not found in public folder');
      }
    }

    // Option 3: Try loading GraphModel from public folder
    if (!modelLoaded) {
      try {
        model = await tf.loadGraphModel('/model.json');
        console.log('GraphModel loaded from public/model.json');
        modelLoaded = true;
      } catch (e) {
        console.log('GraphModel not found');
      }
    }

    if (!modelLoaded) {
      throw new Error(
        'Model tidak ditemukan. ' +
        'Silakan export model dari Teachable Machine dalam format TensorFlow.js ' +
        'dan letakkan file model.json serta .bin files di folder public/'
      );
    }

    return { success: true };
  } catch (error) {
    console.error('Error loading model:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Preprocess image untuk model
 * Teachable Machine biasanya menggunakan input 224x224
 */
function preprocessImage(imageElement) {
  return tf.tidy(() => {
    // Convert image ke tensor
    let tensor = tf.browser.fromPixels(imageElement);
    
    // Resize ke 224x224 (sesuaikan dengan input model Teachable Machine)
    tensor = tf.image.resizeBilinear(tensor, [224, 224]);
    
    // Normalize ke range [0, 1]
    tensor = tensor.div(255.0);
    
    // Add batch dimension
    tensor = tensor.expandDims(0);
    
    return tensor;
  });
}

/**
 * Run prediction pada gambar
 * @param {HTMLImageElement} imageElement - Element gambar HTML
 * @returns {Promise<Object>} Hasil prediksi dengan label dan confidence
 */
export async function predictImage(imageElement) {
  if (!model) {
    throw new Error('Model belum di-load. Panggil loadModel() terlebih dahulu.');
  }

  try {
    // Preprocess image
    const tensor = preprocessImage(imageElement);
    
    // Run inference menggunakan model yang sebenarnya
    const predictions = await model.predict(tensor);
    
    // Get prediction data
    const predictionData = await predictions.data();
    
    // Clean up tensor
    tensor.dispose();
    predictions.dispose();

    // Find label dengan confidence tertinggi
    let maxIndex = 0;
    let maxValue = predictionData[0];
    
    for (let i = 1; i < predictionData.length; i++) {
      if (predictionData[i] > maxValue) {
        maxValue = predictionData[i];
        maxIndex = i;
      }
    }

    const confidence = parseFloat((maxValue * 100).toFixed(2));
    const label = labels[maxIndex];

    console.log('Prediction result:', { label, confidence });

    // Return dengan confidence sebagai number dan sorted predictions
    return {
      label,
      confidence,
      allPredictions: labels
        .map((label, i) => ({
          label,
          confidence: parseFloat((predictionData[i] * 100).toFixed(2))
        }))
        .sort((a, b) => b.confidence - a.confidence) // Sort descending by confidence
    };
  } catch (error) {
    console.error('Error during prediction:', error);
    throw error;
  }
}

/**
 * Get kategori dan informasi disposal berdasarkan label
 */
export function getWasteInfo(label) {
  const wasteInfoMap = {
    'Organik': {
      category: 'Organik',
      icon: '🌿',
      color: '#4caf50',
      disposal: 'Buang ke tempat sampah organik/hijau. Dapat dikompos untuk pupuk.',
      additionalInfo: 'Sampah organik dapat terurai secara alami dan bisa dijadikan kompos yang berguna untuk tanaman.'
    },
    'Botol Plastik': {
      category: 'Botol Plastik',
      icon: '🍾',
      color: '#ffa726',
      disposal: 'Cuci bersih, lepas tutup dan label, lalu buang ke tempat sampah plastik.',
      additionalInfo: 'Botol plastik dapat didaur ulang menjadi berbagai produk baru. Pastikan bersih dan kering.'
    },
    'Anorganik': {
      category: 'Anorganik',
      icon: '♻️',
      color: '#2196f3',
      disposal: 'Buang ke tempat sampah anorganik/biru. Pisahkan untuk daur ulang.',
      additionalInfo: 'Sampah anorganik termasuk plastik tidak dapat terurai secara alami. Bersihkan terlebih dahulu sebelum dibuang untuk memudahkan proses daur ulang.'
    },
    'Non Organik Daur Ulang': {
      category: 'Anorganik',
      icon: '♻️',
      color: '#2196f3',
      disposal: 'Buang ke tempat sampah anorganik/biru. Pisahkan untuk daur ulang.',
      additionalInfo: 'Sampah anorganik termasuk plastik tidak dapat terurai secara alami. Bersihkan terlebih dahulu sebelum dibuang untuk memudahkan proses daur ulang.'
    },
    'Kertas': {
      category: 'Kertas',
      icon: '📄',
      color: '#8d6e63',
      disposal: 'Buang ke tempat sampah kertas. Pastikan kertas dalam kondisi kering.',
      additionalInfo: 'Kertas basah atau terkontaminasi makanan sebaiknya dibuang ke sampah organik.'
    },
    'Residu': {
      category: 'Residu',
      icon: '🗑️',
      color: '#757575',
      disposal: 'Buang ke tempat sampah residu/hitam. Tidak dapat didaur ulang.',
      additionalInfo: 'Sampah residu adalah sampah yang tidak dapat didaur ulang dan tidak dapat terurai dengan cepat.'
    },
    'B3': {
      category: 'B3',
      icon: '☢️',
      color: '#f44336',
      disposal: 'Buang ke tempat sampah B3 (Bahan Berbahaya dan Beracun). JANGAN dicampur dengan sampah lain.',
      additionalInfo: 'Sampah B3 seperti baterai, lampu, obat-obatan, dan bahan kimia memerlukan penanganan khusus karena berbahaya bagi lingkungan dan kesehatan.'
    }
  };

  // Normalize label: trim dan handle partial matches
  const normalizedLabel = label?.trim();
  
  // Debug log
  console.log('getWasteInfo received label:', label, 'normalized:', normalizedLabel);
  
  // Fallback untuk 'Non Organik Daur Ulang' ke 'Anorganik'
  if (normalizedLabel === 'Non Organik Daur Ulang' || normalizedLabel?.includes('Non Organik')) {
    return wasteInfoMap['Anorganik'];
  }
  
  // Handle truncated or partial matches untuk Botol Plastik
  if (normalizedLabel?.includes('Botol Plasti') || normalizedLabel?.toLowerCase().includes('botol plastik')) {
    return wasteInfoMap['Botol Plastik'];
  }

  return wasteInfoMap[normalizedLabel] || {
    category: 'Unknown',
    icon: '❓',
    color: '#9e9e9e',
    disposal: 'Silakan hubungi petugas untuk informasi lebih lanjut.',
    additionalInfo: 'Label tidak dikenali dalam sistem.'
  };
}

/**
 * Check apakah model sudah di-load
 */
export function isModelLoaded() {
  return model !== null;
}
